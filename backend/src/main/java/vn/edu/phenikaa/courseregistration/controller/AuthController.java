package vn.edu.phenikaa.courseregistration.controller;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.phenikaa.courseregistration.dto.request.LoginRequest;
import vn.edu.phenikaa.courseregistration.dto.response.ApiResponse;
import vn.edu.phenikaa.courseregistration.dto.response.StudentResponse;
import vn.edu.phenikaa.courseregistration.mapper.StudentMapper;
import vn.edu.phenikaa.courseregistration.service.AuthService;

/** REST API dang nhap demo cho sinh vien. */
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final StudentMapper studentMapper;

    public AuthController(AuthService authService, StudentMapper studentMapper) {
        this.authService = authService;
        this.studentMapper = studentMapper;
    }

    @PostMapping("/login")
    public ApiResponse<StudentResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success(
            "Dang nhap thanh cong.",
            studentMapper.toResponse(authService.login(request))
        );
    }
}
