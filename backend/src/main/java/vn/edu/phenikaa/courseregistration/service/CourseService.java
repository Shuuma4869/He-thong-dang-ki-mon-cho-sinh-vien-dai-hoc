package vn.edu.phenikaa.courseregistration.service;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.regex.Pattern;
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
    private static final Pattern DIACRITICS = Pattern.compile("\\p{M}+");

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
        if (keyword == null || keyword.isBlank()) {
            return findAll();
        }

        String normalizedKeyword = normalizeSearchText(keyword);
        return findAll().stream()
                .filter(result -> matchesSearch(result, normalizedKeyword))
                .toList();
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

    private boolean matchesSearch(CourseWithLecturer result, String normalizedKeyword) {
        Course course = result.course();
        Lecturer lecturer = result.lecturer();

        return containsNormalized(course.getCourseId(), normalizedKeyword)
                || containsNormalized(course.getCourseName(), normalizedKeyword)
                || containsNormalized(course.getLecturerId(), normalizedKeyword)
                || containsNormalized(lecturer.getId(), normalizedKeyword)
                || containsNormalized(lecturer.getFullName(), normalizedKeyword)
                || containsNormalized(lecturer.getFaculty(), normalizedKeyword);
    }

    private boolean containsNormalized(String value, String normalizedKeyword) {
        return normalizeSearchText(value).contains(normalizedKeyword);
    }

    private String normalizeSearchText(String value) {
        if (value == null) {
            return "";
        }

        String decomposed = Normalizer.normalize(value, Normalizer.Form.NFD);
        return DIACRITICS.matcher(decomposed)
                .replaceAll("")
                .toLowerCase(Locale.ROOT)
                .replace('đ', 'd')
                .trim();
    }
}
