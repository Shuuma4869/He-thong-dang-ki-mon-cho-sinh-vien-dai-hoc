package vn.edu.phenikaa.courseregistration.mapper;

import org.springframework.stereotype.Component;
import vn.edu.phenikaa.courseregistration.dto.response.StudentResponse;
import vn.edu.phenikaa.courseregistration.model.Student;

/**
 * Mapper chuyển Student model sang DTO.
 */
@Component
public class StudentMapper {
    public StudentResponse toResponse(Student student) {
        return new StudentResponse(
            student.getId(),
            student.getFullName(),
            student.getClassName(),
            student.getMajor(),
            student.getMaxCredits()
        );
    }
}
