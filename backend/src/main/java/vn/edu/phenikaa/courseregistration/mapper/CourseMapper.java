package vn.edu.phenikaa.courseregistration.mapper;

import java.util.List;
import org.springframework.stereotype.Component;
import vn.edu.phenikaa.courseregistration.dto.response.CourseResponse;
import vn.edu.phenikaa.courseregistration.dto.response.ScheduleResponse;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.model.Schedule;

/**
 * Mapper chuyển Course model sang DTO.
 */
@Component
public class CourseMapper {
    public CourseResponse toResponse(Course course) {
        return new CourseResponse(
                course.getCourseId(),
                course.getCourseName(),
                course.getCredits(),
                course.getLecturerId(),
                course.getMaxCapacity(),
                course.getCurrentCapacity(),
                toScheduleResponses(course.getSchedules())
        );
    }

    public List<CourseResponse> toResponses(List<Course> courses) {
        return courses.stream()
                .map(this::toResponse)
                .toList();
    }

    public ScheduleResponse toScheduleResponse(Schedule schedule) {
        return new ScheduleResponse(
                schedule.getDayOfWeek(),
                schedule.getStartTime(),
                schedule.getEndTime(),
                schedule.getRoom()
        );
    }

    public List<ScheduleResponse> toScheduleResponses(List<Schedule> schedules) {
        return schedules.stream()
                .map(this::toScheduleResponse)
                .toList();
    }
}
