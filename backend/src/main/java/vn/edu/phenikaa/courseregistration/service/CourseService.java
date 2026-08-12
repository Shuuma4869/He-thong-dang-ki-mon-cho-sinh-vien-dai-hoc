package vn.edu.phenikaa.courseregistration.service;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import vn.edu.phenikaa.courseregistration.exception.CourseNotFoundException;
import vn.edu.phenikaa.courseregistration.exception.LecturerNotFoundException;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.model.CourseWithLecturer;
import vn.edu.phenikaa.courseregistration.model.Lecturer;
import vn.edu.phenikaa.courseregistration.repository.CourseRepository;
import vn.edu.phenikaa.courseregistration.repository.LecturerRepository;

/**
 * Service tra cứu học phần.
 */
@Service
public class CourseService {
    private final CourseRepository courseRepository;
    private final LecturerRepository lecturerRepository;

    public CourseService(CourseRepository courseRepository, LecturerRepository lecturerRepository) {
        this.courseRepository = courseRepository;
        this.lecturerRepository = lecturerRepository;
    }

    public List<CourseWithLecturer> findAll() {
        return attachLecturers(courseRepository.findAll());
    }

    public CourseWithLecturer findById(String courseId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new CourseNotFoundException(courseId));
        return new CourseWithLecturer(course, findLecturerFor(course));
    }

    public List<CourseWithLecturer> search(String keyword) {
        return attachLecturers(courseRepository.search(keyword));
    }

    private List<CourseWithLecturer> attachLecturers(List<Course> courses) {
        Map<String, Lecturer> lecturersById = lecturerRepository.findAll().stream()
            .collect(Collectors.toMap(
                lecturer -> normalizeId(lecturer.getId()),
                Function.identity(),
                (first, ignored) -> first
            ));

        return courses.stream()
            .map(course -> new CourseWithLecturer(course, findLecturerFor(course, lecturersById)))
            .toList();
    }

    private Lecturer findLecturerFor(Course course) {
        return lecturerRepository.findById(course.getLecturerId())
            .orElseThrow(() -> new LecturerNotFoundException(course.getLecturerId(), course.getCourseId()));
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
}
