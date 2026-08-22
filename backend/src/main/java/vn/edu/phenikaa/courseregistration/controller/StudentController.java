package vn.edu.phenikaa.courseregistration.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.phenikaa.courseregistration.dto.response.ApiResponse;
import vn.edu.phenikaa.courseregistration.dto.response.StudentResponse;
import vn.edu.phenikaa.courseregistration.mapper.StudentMapper;
import vn.edu.phenikaa.courseregistration.service.StudentService;

/**
 * REST API đọc thông tin sinh viên.
 */
@RestController
@RequestMapping("/api/students")
public class StudentController {
    private final StudentService studentService;
    private final StudentMapper studentMapper;

    public StudentController(StudentService studentService, StudentMapper studentMapper) {
        this.studentService = studentService;
        this.studentMapper = studentMapper;
    }

    @GetMapping("/{studentId}")
    public ApiResponse<StudentResponse> findById(@PathVariable String studentId) {
        StudentResponse response = studentMapper.toResponse(studentService.findById(studentId));
        return ApiResponse.success("Lấy thông tin sinh viên thành công.", response);
    }
}
