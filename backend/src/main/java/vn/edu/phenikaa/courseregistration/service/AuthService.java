package vn.edu.phenikaa.courseregistration.service;

import org.springframework.stereotype.Service;
import vn.edu.phenikaa.courseregistration.dto.request.LoginRequest;
import vn.edu.phenikaa.courseregistration.exception.BusinessException;
import vn.edu.phenikaa.courseregistration.exception.StudentNotFoundException;
import vn.edu.phenikaa.courseregistration.model.Student;
import vn.edu.phenikaa.courseregistration.repository.StudentRepository;

/** Service dang nhap demo bang ma sinh vien, khong quan ly password/token. */
@Service
public class AuthService {
    private static final String VALIDATION_ERROR_CODE = "VALIDATION_ERROR";

    private final StudentRepository studentRepository;

    public AuthService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student login(LoginRequest request) {
        String studentId = request.getStudentId();
        if (studentId == null || studentId.isBlank()) {
            throw new BusinessException(VALIDATION_ERROR_CODE, "Ma sinh vien khong duoc de trong");
        }

        String normalizedStudentId = studentId.trim();
        return studentRepository.findById(normalizedStudentId)
            .orElseThrow(() -> new StudentNotFoundException(normalizedStudentId));
    }
}
