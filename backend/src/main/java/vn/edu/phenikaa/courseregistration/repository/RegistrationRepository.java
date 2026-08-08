package vn.edu.phenikaa.courseregistration.repository;

import java.util.List;
import java.util.Optional;
import vn.edu.phenikaa.courseregistration.model.Registration;

/**
 * Repository contract cho dữ liệu đăng ký học phần.
 */
public interface RegistrationRepository {
    List<Registration> findByStudentId(String studentId);

    Optional<Registration> findByStudentAndCourse(String studentId, String courseId);

    void save(Registration registration);

    void delete(String studentId, String courseId);
}
