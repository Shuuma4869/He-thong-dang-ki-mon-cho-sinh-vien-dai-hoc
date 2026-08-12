package vn.edu.phenikaa.courseregistration.repository;

import java.util.List;
import java.util.Optional;
import vn.edu.phenikaa.courseregistration.model.Course;

/**
 * Repository contract cho học phần.
 */
public interface CourseRepository {
    Optional<Course> findById(String courseId);

    List<Course> findAll();

    List<Course> search(String keyword);

    void save(Course course);
}
