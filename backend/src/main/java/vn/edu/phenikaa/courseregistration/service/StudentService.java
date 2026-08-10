package vn.edu.phenikaa.courseregistration.service;

import java.util.List;
import org.springframework.stereotype.Service;
import vn.edu.phenikaa.courseregistration.exception.StudentNotFoundException;
import vn.edu.phenikaa.courseregistration.model.Student;
import vn.edu.phenikaa.courseregistration.repository.StudentRepository;

/**
 * Service đọc thông tin sinh viên.
 */
@Service
public class StudentService {
    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student findById(String studentId) {
        return studentRepository.findById(studentId)
            .orElseThrow(() -> new StudentNotFoundException(studentId));
    }

    public List<Student> findAll() {
        return studentRepository.findAll();
    }
}
