package vn.edu.phenikaa.courseregistration.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import vn.edu.phenikaa.courseregistration.exception.DuplicateRegistrationException;
import vn.edu.phenikaa.courseregistration.mapper.RegistrationMapper;
import vn.edu.phenikaa.courseregistration.model.Registration;
import vn.edu.phenikaa.courseregistration.model.RegistrationDetail;
import vn.edu.phenikaa.courseregistration.model.enums.RegistrationStatus;
import vn.edu.phenikaa.courseregistration.service.RegistrationService;

@WebMvcTest(RegistrationController.class)
@Import(RegistrationMapper.class)
class RegistrationControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RegistrationService registrationService;

    @Test
    void findByStudentIdReturnsRegistrations() throws Exception {
        when(registrationService.findActiveRegistrationsByStudent("SV001"))
                .thenReturn(List.of(registration("REG001", "SV001", "OOP101")));

        mockMvc.perform(get("/api/students/SV001/registrations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].studentId").value("SV001"))
                .andExpect(jsonPath("$.data[0].details[0].courseId").value("OOP101"));
    }

    @Test
    void registerReturnsRegistration() throws Exception {
        when(registrationService.registerCourse("SV001", "OOP101"))
                .thenReturn(registration("REG001", "SV001", "OOP101"));

        mockMvc.perform(post("/api/students/SV001/registrations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"courseId\":\"OOP101\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.details[0].courseId").value("OOP101"));
    }

    @Test
    void cancelReturnsUpdatedRegistration() throws Exception {
        when(registrationService.cancelCourse("SV001", "OOP101"))
                .thenReturn(registration("REG001", "SV001", "MAT101"));

        mockMvc.perform(delete("/api/students/SV001/registrations/OOP101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.details[0].courseId").value("MAT101"));
    }

    @Test
    void registerReturnsErrorWhenDuplicate() throws Exception {
        when(registrationService.registerCourse("SV001", "OOP101"))
                .thenThrow(new DuplicateRegistrationException("OOP101"));

        mockMvc.perform(post("/api/students/SV001/registrations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"courseId\":\"OOP101\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value("DUPLICATE_REGISTRATION"));
    }

    private Registration registration(String registrationId, String studentId, String... courseIds) {
        List<RegistrationDetail> details = List.of(courseIds).stream()
                .map(RegistrationDetail::new)
                .toList();
        return new Registration(
                registrationId,
                studentId,
                RegistrationStatus.ACTIVE,
                LocalDateTime.of(2026, 8, 8, 20, 40),
                details
        );
    }
}
