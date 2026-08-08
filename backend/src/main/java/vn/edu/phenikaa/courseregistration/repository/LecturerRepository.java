package vn.edu.phenikaa.courseregistration.repository;

import java.util.List;
import java.util.Optional;
import vn.edu.phenikaa.courseregistration.model.Lecturer;

/**
 * Repository contract cho giảng viên.
 */
public interface LecturerRepository {
    Optional<Lecturer> findById(String lecturerId);

    List<Lecturer> findAll();

    void save(Lecturer lecturer);
}
