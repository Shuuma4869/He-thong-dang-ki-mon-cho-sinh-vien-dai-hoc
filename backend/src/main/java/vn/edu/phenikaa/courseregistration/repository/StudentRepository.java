package vn.edu.phenikaa.courseregistration.repository;

import java.util.List;
import java.util.Optional;
import vn.edu.phenikaa.courseregistration.model.Student;

/**
 * Repository contract cho dữ liệu sinh viên.
 */
public interface StudentRepository {
    Optional<Student> findById(String studentId);

    List<Student> findAll();

    void save(Student student);
}
