package vn.edu.phenikaa.courseregistration.service;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.phenikaa.courseregistration.exception.CourseNotFoundException;
import vn.edu.phenikaa.courseregistration.exception.RegistrationNotFoundException;
import vn.edu.phenikaa.courseregistration.exception.StudentNotFoundException;
import vn.edu.phenikaa.courseregistration.interfaces.CourseValidator;
import vn.edu.phenikaa.courseregistration.interfaces.Registrable;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.model.Registration;
import vn.edu.phenikaa.courseregistration.model.RegistrationDetail;
import vn.edu.phenikaa.courseregistration.model.Student;
import vn.edu.phenikaa.courseregistration.model.enums.RegistrationStatus;
import vn.edu.phenikaa.courseregistration.repository.CourseRepository;
import vn.edu.phenikaa.courseregistration.repository.RegistrationRepository;
import vn.edu.phenikaa.courseregistration.repository.StudentRepository;
import vn.edu.phenikaa.courseregistration.validator.context.RegistrationValidationContext;

/** Service xu ly nghiep vu dang ky va huy dang ky hoc phan. */
@Service
public class RegistrationService implements Registrable {
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final RegistrationRepository registrationRepository;
    private final List<CourseValidator> validators;
    private final Clock clock;

    @Autowired
    public RegistrationService(
            StudentRepository studentRepository,
            CourseRepository courseRepository,
            RegistrationRepository registrationRepository,
            List<CourseValidator> validators
    ) {
        this(studentRepository, courseRepository, registrationRepository, validators, Clock.systemDefaultZone());
    }

    RegistrationService(
            StudentRepository studentRepository,
            CourseRepository courseRepository,
            RegistrationRepository registrationRepository,
            List<CourseValidator> validators,
            Clock clock
    ) {
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
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

    public List<Registration> findActiveRegistrationsByStudent(String studentId) {
        studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException(studentId));

        return registrationRepository.findByStudentId(studentId).stream()
                .filter(registration -> RegistrationStatus.ACTIVE == registration.getStatus())
                .toList();
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

    private List<Course> resolveRegisteredCourses(Registration registration) {
        return safeDetails(registration).stream()
                .map(RegistrationDetail::getCourseId)
                .map(courseRepository::findById)
                .flatMap(Optional::stream)
                .toList();
    }

    private List<RegistrationDetail> safeDetails(Registration registration) {
        if (registration.getDetails() == null) {
            return List.of();
        }
        return registration.getDetails();
    }
}
