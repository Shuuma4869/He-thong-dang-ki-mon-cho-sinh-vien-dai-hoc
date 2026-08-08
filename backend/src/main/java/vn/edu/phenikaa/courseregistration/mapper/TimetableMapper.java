package vn.edu.phenikaa.courseregistration.mapper;

import java.util.List;
import org.springframework.stereotype.Component;
import vn.edu.phenikaa.courseregistration.dto.response.TimetableSlotResponse;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.model.Schedule;

/** Mapper chuyen hoc phan da dang ky thanh slot thoi khoa bieu. */
@Component
public class TimetableMapper {
    public List<TimetableSlotResponse> toResponses(List<Course> courses) {
        return courses.stream()
                .flatMap(course -> schedulesOf(course).stream()
                        .map(schedule -> toResponse(course, schedule)))
                .toList();
    }

    private TimetableSlotResponse toResponse(Course course, Schedule schedule) {
        return new TimetableSlotResponse(
                course.getCourseId(),
                course.getCourseName(),
                schedule.getDayOfWeek(),
                schedule.getStartTime(),
                schedule.getEndTime(),
                schedule.getRoom()
        );
    }

    private List<Schedule> schedulesOf(Course course) {
        if (course.getSchedules() == null) {
            return List.of();
        }
        return course.getSchedules();
    }
}
