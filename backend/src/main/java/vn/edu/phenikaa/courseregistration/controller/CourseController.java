package vn.edu.phenikaa.courseregistration.controller;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.phenikaa.courseregistration.dto.response.ApiResponse;
import vn.edu.phenikaa.courseregistration.dto.response.CourseResponse;
import vn.edu.phenikaa.courseregistration.mapper.CourseMapper;
import vn.edu.phenikaa.courseregistration.service.CourseService;

/**
 * REST API tra cứu học phần.
 */
@RestController
@RequestMapping("/api/courses")
public class CourseController {
    private final CourseService courseService;
    private final CourseMapper courseMapper;

    public CourseController(CourseService courseService, CourseMapper courseMapper) {
        this.courseService = courseService;
        this.courseMapper = courseMapper;
    }

    @GetMapping
    public ApiResponse<List<CourseResponse>> findAll() {
        return ApiResponse.success("Lấy danh sách học phần thành công.", courseMapper.toResponses(courseService.findAll()));
    }

    @GetMapping("/{courseId}")
    public ApiResponse<CourseResponse> findById(@PathVariable String courseId) {
        return ApiResponse.success("Lấy thông tin học phần thành công.", courseMapper.toResponse(courseService.findById(courseId)));
    }

    @GetMapping("/search")
    public ApiResponse<List<CourseResponse>> search(@RequestParam String keyword) {
        return ApiResponse.success("Tìm kiếm học phần thành công.", courseMapper.toResponses(courseService.search(keyword)));
    }
}
