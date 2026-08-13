package vn.edu.phenikaa.courseregistration.validator;

import java.util.List;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import vn.edu.phenikaa.courseregistration.exception.ScheduleConflictException;
import vn.edu.phenikaa.courseregistration.interfaces.CourseValidator;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.model.Schedule;
import vn.edu.phenikaa.courseregistration.validator.context.RegistrationValidationContext;

@Component
@Order(50)
public class ScheduleConflictValidator implements CourseValidator {
    @Override
    public void validate(RegistrationValidationContext context) {
        Course requestedCourse = context.requireRequestedCourse();

        for (Schedule newSchedule : schedulesOf(requestedCourse)) {
            for (Course registeredCourse : context.getRegisteredCourses()) {
                for (Schedule existingSchedule : schedulesOf(registeredCourse)) {
                    if (isOverlapping(newSchedule, existingSchedule)) {
                        throw new ScheduleConflictException(
                            requestedCourse.getCourseId(),
                            registeredCourse.getCourseId()
                        );
                    }
                }
            }
        }
    }

    private boolean isOverlapping(Schedule newSchedule, Schedule existingSchedule) {
        return newSchedule.getDayOfWeek() == existingSchedule.getDayOfWeek()
            && newSchedule.getStartTime().isBefore(existingSchedule.getEndTime())
            && newSchedule.getEndTime().isAfter(existingSchedule.getStartTime());
    }

    private List<Schedule> schedulesOf(Course course) {
        if (course.getSchedules() == null) {
            return List.of();
        }
        return course.getSchedules();
    }
}
