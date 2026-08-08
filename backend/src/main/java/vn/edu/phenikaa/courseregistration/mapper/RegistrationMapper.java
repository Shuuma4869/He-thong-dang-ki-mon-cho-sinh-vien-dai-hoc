package vn.edu.phenikaa.courseregistration.mapper;

import java.util.List;
import org.springframework.stereotype.Component;
import vn.edu.phenikaa.courseregistration.dto.response.RegistrationDetailResponse;
import vn.edu.phenikaa.courseregistration.dto.response.RegistrationResponse;
import vn.edu.phenikaa.courseregistration.model.Registration;
import vn.edu.phenikaa.courseregistration.model.RegistrationDetail;

/**
 * Mapper chuyển Registration model sang DTO.
 */
@Component
public class RegistrationMapper {
    public RegistrationResponse toResponse(Registration registration) {
        return new RegistrationResponse(
                registration.getRegistrationId(),
                registration.getStudentId(),
                registration.getStatus().name(),
                registration.getRegisteredAt(),
                toDetailResponses(registration.getDetails())
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
        return details.stream()
                .map(this::toDetailResponse)
                .toList();
    }
}
