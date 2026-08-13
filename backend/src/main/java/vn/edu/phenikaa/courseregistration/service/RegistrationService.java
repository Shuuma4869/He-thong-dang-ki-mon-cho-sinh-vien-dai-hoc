package vn.edu.phenikaa.courseregistration.repository.file;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import vn.edu.phenikaa.courseregistration.model.Registration;
import vn.edu.phenikaa.courseregistration.model.RegistrationDetail;
import vn.edu.phenikaa.courseregistration.model.enums.RegistrationStatus;
import vn.edu.phenikaa.courseregistration.repository.RegistrationRepository;
import vn.edu.phenikaa.courseregistration.utils.JsonFileUtils;
import vn.edu.phenikaa.courseregistration.validator.context.RegistrationValidationContext;

/**
 * JSON repository cho đăng ký học phần.
 */
@Repository
public class JsonRegistrationRepository implements RegistrationRepository {
    private static final String REGISTRATIONS_FILE = "registrations.json";

    private final JsonFileUtils jsonFileUtils;

    public JsonRegistrationRepository(JsonFileUtils jsonFileUtils) {
        this.jsonFileUtils = jsonFileUtils;
    }

    @Override
    public List<Registration> findByStudentId(String studentId) {
        return findAll().stream()
            .filter(registration -> registration.getStudentId().equals(studentId))
            .toList();
    }

    @Override
    public Optional<Registration> findByStudentAndCourse(String studentId, String courseId) {
        return findByStudentId(studentId).stream()
            .filter(registration -> hasCourse(registration, courseId))
            .findFirst();
    }

    @Override
    public void save(Registration registration) {
        List<Registration> registrations = new ArrayList<>(findAll());
        for (int index = 0; index < registrations.size(); index++) {
            if (registrations.get(index).getRegistrationId().equals(registration.getRegistrationId())) {
                registrations.set(index, registration);
                jsonFileUtils.writeList(REGISTRATIONS_FILE, registrations);
                return;
            }
        }

        registrations.add(registration);
        jsonFileUtils.writeList(REGISTRATIONS_FILE, registrations);
    }

    @Override
    public void delete(String studentId, String courseId) {
        List<Registration> registrations = new ArrayList<>(findAll());
        for (Registration registration : registrations) {
            if (registration.getStudentId().equals(studentId)) {
                registration.getDetails().removeIf(detail -> detail.getCourseId().equals(courseId));
                if (registration.getDetails().isEmpty()) {
                    registration.setStatus(RegistrationStatus.CANCELLED);
                }
            }
        }

        jsonFileUtils.writeList(REGISTRATIONS_FILE, registrations);
    }

    private List<Registration> findAll() {
        return jsonFileUtils.readList(REGISTRATIONS_FILE, Registration.class);
    }

    private boolean hasCourse(Registration registration, String courseId) {
        return registration.getDetails().stream()
            .map(RegistrationDetail::getCourseId)
            .anyMatch(courseId::equals);
    }
}
package vn.edu.phenikaa.courseregistration.service;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.phenikaa.courseregistration.exception.CourseNotFoundException;
import vn.edu.phenikaa.courseregistration.exception.LecturerNotFoundException;
import vn.edu.phenikaa.courseregistration.exception.RegistrationNotFoundException;
import vn.edu.phenikaa.courseregistration.exception.StudentNotFoundException;
import vn.edu.phenikaa.courseregistration.interfaces.CourseValidator;
import vn.edu.phenikaa.courseregistration.interfaces.Registrable;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.model.CourseWithLecturer;
import vn.edu.phenikaa.courseregistration.model.Lecturer;
import vn.edu.phenikaa.courseregistration.model.Registration;
import vn.edu.phenikaa.courseregistration.model.RegistrationDetail;
import vn.edu.phenikaa.courseregistration.model.RegistrationSummary;
import vn.edu.phenikaa.courseregistration.model.Student;
import vn.edu.phenikaa.courseregistration.model.enums.RegistrationStatus;
import vn.edu.phenikaa.courseregistration.repository.CourseRepository;
import vn.edu.phenikaa.courseregistration.repository.LecturerRepository;
import vn.edu.phenikaa.courseregistration.repository.RegistrationRepository;
import vn.edu.phenikaa.courseregistration.repository.StudentRepository;
import RegistrationValidationContext;

/** Service xu ly nghiep vu dang ky va huy dang ky hoc phan. */
@Service
public class RegistrationService implements Registrable {
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final LecturerRepository lecturerRepository;
    private final RegistrationRepository registrationRepository;
    private final List<CourseValidator> validators;
    private final Clock clock;

    @Autowired
    public RegistrationService(
        StudentRepository studentRepository,
        CourseRepository courseRepository,
        LecturerRepository lecturerRepository,
        RegistrationRepository registrationRepository,
        List<CourseValidator> validators
    ) {
        this(
            studentRepository,
            courseRepository,
            lecturerRepository,
            registrationRepository,
            validators,
            Clock.systemDefaultZone()
        );
    }

    RegistrationService(
        StudentRepository studentRepository,
        CourseRepository courseRepository,
        LecturerRepository lecturerRepository,
        RegistrationRepository registrationRepository,
        List<CourseValidator> validators,
        Clock clock
    ) {
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.lecturerRepository = lecturerRepository;
        this.registrationRepository = registrationRepository;
        this.validators = List.copyOf(validators);
        this.clock = clock;
    }

    @Override
    public void register(String studentId, String courseId) {
        registerCourse(studentId, courseId);
    }

    public Registration registerCourse(String studentId, String courseId) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new StudentNotFoundException(studentId));
        Optional<Course> requestedCourse = courseRepository.findById(courseId);
        Optional<Registration> activeRegistration = findActiveRegistration(studentId);
        List<Course> registeredCourses = activeRegistration
            .map(this::resolveRegisteredCourses)
            .orElseGet(List::of);

        RegistrationValidationContext context = new RegistrationValidationContext(
            student,
            courseId,
            requestedCourse,
            registeredCourses
        );
        validators.forEach(validator -> validator.validate(context));

        Registration registration = activeRegistration.orElseGet(() -> createRegistration(studentId));
        List<RegistrationDetail> details = new ArrayList<>(safeDetails(registration));
        details.add(new RegistrationDetail(courseId));
        registration.setDetails(details);
        registration.setStatus(RegistrationStatus.ACTIVE);
        registrationRepository.save(registration);

        Course course = context.requireRequestedCourse();
        course.setCurrentCapacity(course.getCurrentCapacity() + 1);
        courseRepository.save(course);

        return registration;
    }

    public RegistrationSummary registerCourseSummary(String studentId, String courseId) {
        return toSummary(registerCourse(studentId, courseId));
    }

    public Registration cancelCourse(String studentId, String courseId) {
        studentRepository.findById(studentId)
            .orElseThrow(() -> new StudentNotFoundException(studentId));
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new CourseNotFoundException(courseId));
        Registration registration = findActiveRegistration(studentId)
            .orElseThrow(() -> new RegistrationNotFoundException(studentId, courseId));

        boolean registered = safeDetails(registration).stream()
            .anyMatch(detail -> courseId.equals(detail.getCourseId()));
        if (!registered) {
            throw new RegistrationNotFoundException(studentId, courseId);
        }

        List<RegistrationDetail> remainingDetails = safeDetails(registration).stream()
            .filter(detail -> !courseId.equals(detail.getCourseId()))
            .toList();
        registration.setDetails(new ArrayList<>(remainingDetails));
        if (remainingDetails.isEmpty()) {
            registration.setStatus(RegistrationStatus.CANCELLED);
        }
        registrationRepository.save(registration);

        course.setCurrentCapacity(Math.max(0, course.getCurrentCapacity() - 1));
        courseRepository.save(course);

        return registration;
    }

    public RegistrationSummary cancelCourseSummary(String studentId, String courseId) {
        return toSummary(cancelCourse(studentId, courseId));
    }

    public List<Registration> findActiveRegistrationsByStudent(String studentId) {
        studentRepository.findById(studentId)
            .orElseThrow(() -> new StudentNotFoundException(studentId));

        return registrationRepository.findByStudentId(studentId).stream()
            .filter(registration -> RegistrationStatus.ACTIVE == registration.getStatus())
            .toList();
    }

    public RegistrationSummary findActiveRegistrationSummary(String studentId) {
        studentRepository.findById(studentId)
            .orElseThrow(() -> new StudentNotFoundException(studentId));

        return findActiveRegistration(studentId)
            .map(this::toSummary)
            .orElseGet(() -> emptySummary(studentId));
    }

    public int calculateTotalCredits(String studentId) {
        studentRepository.findById(studentId)
            .orElseThrow(() -> new StudentNotFoundException(studentId));

        return findActiveRegistration(studentId)
            .map(this::resolveRegisteredCourses)
            .orElseGet(List::of)
            .stream()
            .mapToInt(Course::getCredits)
            .sum();
    }

    private Optional<Registration> findActiveRegistration(String studentId) {
        return registrationRepository.findByStudentId(studentId).stream()
            .filter(registration -> RegistrationStatus.ACTIVE == registration.getStatus())
            .findFirst();
    }

    private Registration createRegistration(String studentId) {
        return new Registration(
            "REG-" + studentId + "-" + clock.millis(),
            studentId,
            RegistrationStatus.ACTIVE,
            LocalDateTime.now(clock),
            new ArrayList<>()
        );
    }

    private RegistrationSummary emptySummary(String studentId) {
        Registration registration = new Registration(
            null,
            studentId,
            RegistrationStatus.ACTIVE,
            null,
            new ArrayList<>()
        );
        return new RegistrationSummary(registration, List.of());
    }

    private RegistrationSummary toSummary(Registration registration) {
        return new RegistrationSummary(registration, resolveRegisteredCoursesWithLecturers(registration));
    }

    private List<Course> resolveRegisteredCourses(Registration registration) {
        return safeDetails(registration).stream()
            .map(RegistrationDetail::getCourseId)
            .map(courseRepository::findById)
            .flatMap(Optional::stream)
            .toList();
    }

    private List<CourseWithLecturer> resolveRegisteredCoursesWithLecturers(Registration registration) {
        Map<String, Course> coursesById = courseRepository.findAll().stream()
            .collect(Collectors.toMap(
                course -> normalizeId(course.getCourseId()),
                Function.identity(),
                (first, ignored) -> first
            ));

        Map<String, Lecturer> lecturersById = lecturerRepository.findAll().stream()
            .collect(Collectors.toMap(
                lecturer -> normalizeId(lecturer.getId()),
                Function.identity(),
                (first, ignored) -> first
            ));

        return safeDetails(registration).stream()
            .map(RegistrationDetail::getCourseId)
            .map(courseId -> findCourseForRegistration(courseId, coursesById))
            .map(course -> new CourseWithLecturer(course, findLecturerFor(course, lecturersById)))
            .toList();
    }

    private Course findCourseForRegistration(String courseId, Map<String, Course> coursesById) {
        Course course = coursesById.get(normalizeId(courseId));
        if (course == null) {
            throw new CourseNotFoundException(courseId);
        }
        return course;
    }

    private Lecturer findLecturerFor(Course course, Map<String, Lecturer> lecturersById) {
        Lecturer lecturer = lecturersById.get(normalizeId(course.getLecturerId()));
        if (lecturer == null) {
            throw new LecturerNotFoundException(course.getLecturerId(), course.getCourseId());
        }
        return lecturer;
    }

    private String normalizeId(String id) {
        return id == null ? "" : id.trim().toLowerCase(Locale.ROOT);
    }

    private List<RegistrationDetail> safeDetails(Registration registration) {
        if (registration.getDetails() == null) {
            return List.of();
        }
        return registration.getDetails();
    }
}
