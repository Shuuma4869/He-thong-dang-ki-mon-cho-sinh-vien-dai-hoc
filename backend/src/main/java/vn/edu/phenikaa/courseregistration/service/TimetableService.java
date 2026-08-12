package vn.edu.phenikaa.courseregistration.service;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import vn.edu.phenikaa.courseregistration.exception.CourseNotFoundException;
import vn.edu.phenikaa.courseregistration.exception.LecturerNotFoundException;
import vn.edu.phenikaa.courseregistration.exception.StudentNotFoundException;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.model.Lecturer;
import vn.edu.phenikaa.courseregistration.model.Registration;
import vn.edu.phenikaa.courseregistration.model.RegistrationDetail;
import vn.edu.phenikaa.courseregistration.model.Schedule;
import vn.edu.phenikaa.courseregistration.model.TimetableEntry;
import vn.edu.phenikaa.courseregistration.model.enums.RegistrationStatus;
import vn.edu.phenikaa.courseregistration.repository.CourseRepository;
import vn.edu.phenikaa.courseregistration.repository.LecturerRepository;
import vn.edu.phenikaa.courseregistration.repository.RegistrationRepository;
import vn.edu.phenikaa.courseregistration.repository.StudentRepository;

/** Service doc thoi khoa bieu tu dang ky active cua sinh vien. */
@Service
public class TimetableService {
    private final StudentRepository studentRepository;
    private final RegistrationRepository registrationRepository;
    private final CourseRepository courseRepository;
    private final LecturerRepository lecturerRepository;

    public TimetableService(
        StudentRepository studentRepository,
        RegistrationRepository registrationRepository,
        CourseRepository courseRepository,
        LecturerRepository lecturerRepository
    ) {
        this.studentRepository = studentRepository;
        this.registrationRepository = registrationRepository;
        this.courseRepository = courseRepository;
        this.lecturerRepository = lecturerRepository;
    }

    public List<Course> findRegisteredCourses(String studentId) {
        studentRepository.findById(studentId)
            .orElseThrow(() -> new StudentNotFoundException(studentId));

        return registrationRepository.findByStudentId(studentId).stream()
            .filter(registration -> RegistrationStatus.ACTIVE == registration.getStatus())
            .flatMap(registration -> safeDetails(registration).stream())
            .map(RegistrationDetail::getCourseId)
            .map(courseRepository::findById)
            .flatMap(Optional::stream)
            .toList();
    }

    public List<TimetableEntry> findTimetableEntries(String studentId) {
        studentRepository.findById(studentId)
            .orElseThrow(() -> new StudentNotFoundException(studentId));

        List<String> registeredCourseIds = registrationRepository.findByStudentId(studentId).stream()
            .filter(registration -> RegistrationStatus.ACTIVE == registration.getStatus())
            .flatMap(registration -> safeDetails(registration).stream())
            .map(RegistrationDetail::getCourseId)
            .toList();

        if (registeredCourseIds.isEmpty()) {
            return List.of();
        }

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

        return registeredCourseIds.stream()
            .map(courseId -> findCourse(courseId, coursesById))
            .flatMap(course -> schedulesOf(course).stream()
                .map(schedule -> new TimetableEntry(course, findLecturer(course, lecturersById), schedule)))
            .sorted((first, second) -> compareEntries(first, second))
            .toList();
    }

    private List<RegistrationDetail> safeDetails(Registration registration) {
        if (registration.getDetails() == null) {
            return List.of();
        }
        return registration.getDetails();
    }

    private List<Schedule> schedulesOf(Course course) {
        if (course.getSchedules() == null) {
            return List.of();
        }
        return course.getSchedules();
    }

    private Course findCourse(String courseId, Map<String, Course> coursesById) {
        Course course = coursesById.get(normalizeId(courseId));
        if (course == null) {
            throw new CourseNotFoundException(courseId);
        }
        return course;
    }

    private Lecturer findLecturer(Course course, Map<String, Lecturer> lecturersById) {
        Lecturer lecturer = lecturersById.get(normalizeId(course.getLecturerId()));
        if (lecturer == null) {
            throw new LecturerNotFoundException(course.getLecturerId(), course.getCourseId());
        }
        return lecturer;
    }

    private int compareEntries(TimetableEntry first, TimetableEntry second) {
        int dayComparison = first.schedule().getDayOfWeek().compareTo(second.schedule().getDayOfWeek());
        if (dayComparison != 0) {
            return dayComparison;
        }

        int timeComparison = first.schedule().getStartTime().compareTo(second.schedule().getStartTime());
        if (timeComparison != 0) {
            return timeComparison;
        }

        return first.course().getCourseId().compareTo(second.course().getCourseId());
    }

    private String normalizeId(String id) {
        return id == null ? "" : id.trim().toLowerCase(Locale.ROOT);
    }
}
