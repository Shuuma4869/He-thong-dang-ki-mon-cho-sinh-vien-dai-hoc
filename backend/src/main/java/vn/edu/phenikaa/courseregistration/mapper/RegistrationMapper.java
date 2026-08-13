package vn.edu.phenikaa.courseregistration.mapper;

public class RegistrationMapper package vn.edu.phenikaa.courseregistration.mapper;

import java.util.List;
import org.springframework.stereotype.Component;
import vn.edu.phenikaa.courseregistration.dto.response.RegisteredCourseResponse;
import vn.edu.phenikaa.courseregistration.dto.response.RegistrationDetailResponse;
import vn.edu.phenikaa.courseregistration.dto.response.RegistrationResponse;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.model.CourseWithLecturer;
import vn.edu.phenikaa.courseregistration.model.Registration;
import vn.edu.phenikaa.courseregistration.model.RegistrationDetail;
import vn.edu.phenikaa.courseregistration.model.RegistrationSummary;

/**
 * Mapper chuyển Registration model sang DTO.
 */
@Component
public class RegistrationMapper {
    private final CourseMapper courseMapper;

    public RegistrationMapper(CourseMapper courseMapper) {
        this.courseMapper = courseMapper;
    }

    public RegistrationResponse toResponse(RegistrationSummary summary) {
        Registration registration = summary.registration();
        List<RegisteredCourseResponse> courses = toRegisteredCourseResponses(summary.courses());

        return new RegistrationResponse(
            registration.getRegistrationId(),
            registration.getStudentId(),
            registration.getStatus().name(),
            registration.getRegisteredAt(),
            toDetailResponses(registration.getDetails()),
            courses,
            courses.stream().mapToInt(RegisteredCourseResponse::getCredits).sum()
        );
    }

    public RegistrationResponse toResponse(Registration registration) {
        return new RegistrationResponse(
            registration.getRegistrationId(),
            registration.getStudentId(),
            registration.getStatus().name(),
            registration.getRegisteredAt(),
            toDetailResponses(registration.getDetails()),
            List.of(),
            0
        );
    }

    public List<RegistrationResponse> toResponses(List<Registration> registrations) {
        return registrations.stream()
            .map(this::toResponse)
            .toList();
    }

    public RegistrationDetailResponse toDetailResponse(RegistrationDetail detail) {
        return new RegistrationDetailResponse(detail.getCourseId());
    }

    public List<RegistrationDetailResponse> toDetailResponses(List<RegistrationDetail> details) {
        if (details == null) {
            return List.of();
        }

        return details.stream()
            .map(this::toDetailResponse)
            .toList();
    }

    public RegisteredCourseResponse toRegisteredCourseResponse(CourseWithLecturer courseWithLecturer) {
        Course course = courseWithLecturer.course();
        return new RegisteredCourseResponse(
            course.getCourseId(),
            course.getCourseName(),
            course.getCredits(),
            course.getLecturerId(),
            courseMapper.toLecturerResponse(courseWithLecturer.lecturer()),
            course.getMaxCapacity(),
            course.getCurrentCapacity(),
            courseMapper.toScheduleResponses(course.getSchedules())
        );
    }

    public List<RegisteredCourseResponse> toRegisteredCourseResponses(List<CourseWithLecturer> courses) {
        return courses.stream()
            .map(this::toRegisteredCourseResponse)
            .toList();
    }
}
{
}
