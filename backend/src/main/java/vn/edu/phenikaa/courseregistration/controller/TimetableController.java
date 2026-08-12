package vn.edu.phenikaa.courseregistration.controller;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.phenikaa.courseregistration.dto.response.ApiResponse;
import vn.edu.phenikaa.courseregistration.dto.response.TimetableSlotResponse;
import vn.edu.phenikaa.courseregistration.mapper.TimetableMapper;
import vn.edu.phenikaa.courseregistration.service.TimetableService;

/** REST API doc thoi khoa bieu cua sinh vien. */
@RestController
@RequestMapping("/api/students/{studentId}/timetable")
public class TimetableController {
    private final TimetableService timetableService;
    private final TimetableMapper timetableMapper;

    public TimetableController(TimetableService timetableService, TimetableMapper timetableMapper) {
        this.timetableService = timetableService;
        this.timetableMapper = timetableMapper;
    }

    @GetMapping
    public ApiResponse<List<TimetableSlotResponse>> findByStudentId(@PathVariable String studentId) {
        return ApiResponse.success(
            "Lay thoi khoa bieu thanh cong.",
            timetableMapper.toEntryResponses(timetableService.findTimetableEntries(studentId))
        );
    }
}
