package vn.edu.phenikaa.courseregistration.controller;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.phenikaa.courseregistration.dto.request.RegistrationRequest;
import vn.edu.phenikaa.courseregistration.dto.response.ApiResponse;
import vn.edu.phenikaa.courseregistration.dto.response.RegistrationResponse;
import vn.edu.phenikaa.courseregistration.mapper.RegistrationMapper;
import vn.edu.phenikaa.courseregistration.service.RegistrationService;

/** REST API dang ky va huy dang ky hoc phan theo sinh vien. */
@RestController
@RequestMapping("/api/students/{studentId}/registrations")
public class RegistrationController {
    private final RegistrationService registrationService;
    private final RegistrationMapper registrationMapper;

    public RegistrationController(RegistrationService registrationService, RegistrationMapper registrationMapper) {
        this.registrationService = registrationService;
        this.registrationMapper = registrationMapper;
    }

    @GetMapping
    public ApiResponse<RegistrationResponse> findByStudentId(@PathVariable String studentId) {
        return ApiResponse.success(
            "Lay danh sach dang ky hoc phan thanh cong.",
            registrationMapper.toResponse(registrationService.findActiveRegistrationSummary(studentId))
        );
    }

    @PostMapping
    public ApiResponse<RegistrationResponse> register(
        @PathVariable String studentId,
        @Valid @RequestBody RegistrationRequest request
    ) {
        return ApiResponse.success(
            "Dang ky hoc phan thanh cong.",
            registrationMapper.toResponse(registrationService.registerCourseSummary(studentId, request.getCourseId()))
        );
    }

    @DeleteMapping("/{courseId}")
    public ApiResponse<RegistrationResponse> cancel(
        @PathVariable String studentId,
        @PathVariable String courseId
    ) {
        return ApiResponse.success(
            "Huy dang ky hoc phan thanh cong.",
            registrationMapper.toResponse(registrationService.cancelCourseSummary(studentId, courseId))
        );
    }
}
