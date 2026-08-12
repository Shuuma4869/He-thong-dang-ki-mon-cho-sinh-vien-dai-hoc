package vn.edu.phenikaa.courseregistration.repository.file;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.repository.CourseRepository;
import vn.edu.phenikaa.courseregistration.utils.JsonFileUtils;

/**
 * JSON repository cho học phần.
 */
@Repository
public class JsonCourseRepository implements CourseRepository {
    private static final String COURSES_FILE = "courses.json";

    private final JsonFileUtils jsonFileUtils;

    public JsonCourseRepository(JsonFileUtils jsonFileUtils) {
        this.jsonFileUtils = jsonFileUtils;
    }

    @Override
    public Optional<Course> findById(String courseId) {
        return findAll().stream()
            .filter(course -> course.getCourseId().equalsIgnoreCase(courseId))
            .findFirst();
    }

    @Override
    public List<Course> findAll() {
        return jsonFileUtils.readList(COURSES_FILE, Course.class);
    }

    @Override
    public List<Course> search(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return findAll();
        }

        String normalizedKeyword = keyword.toLowerCase(Locale.ROOT).trim();
        return findAll().stream()
            .filter(course -> containsIgnoreCase(course.getCourseId(), normalizedKeyword)
                || containsIgnoreCase(course.getCourseName(), normalizedKeyword))
            .toList();
    }

    @Override
    public void save(Course course) {
        List<Course> courses = new ArrayList<>(findAll());
        for (int index = 0; index < courses.size(); index++) {
            if (courses.get(index).getCourseId().equalsIgnoreCase(course.getCourseId())) {
                courses.set(index, course);
                jsonFileUtils.writeList(COURSES_FILE, courses);
                return;
            }
        }

        courses.add(course);
        jsonFileUtils.writeList(COURSES_FILE, courses);
    }

    private boolean containsIgnoreCase(String value, String normalizedKeyword) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(normalizedKeyword);
    }
}
