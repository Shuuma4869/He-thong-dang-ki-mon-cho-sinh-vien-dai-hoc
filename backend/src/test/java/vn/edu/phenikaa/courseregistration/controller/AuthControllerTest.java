package vn.edu.phenikaa.courseregistration.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import vn.edu.phenikaa.courseregistration.exception.StudentNotFoundException;
import vn.edu.phenikaa.courseregistration.mapper.StudentMapper;
import vn.edu.phenikaa.courseregistration.model.Student;
import vn.edu.phenikaa.courseregistration.service.AuthService;

@WebMvcTest(AuthController.class)
@Import(StudentMapper.class)
class AuthControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Test
    void loginReturnsStudentResponse() throws Exception {
        when(authService.login(org.mockito.ArgumentMatchers.any()))
            .thenReturn(new Student("SV001", "Nguyen Van A", "CNTT1", "Cong nghe thong tin", 18));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"studentId\":\"SV001\",\"password\":\"anything\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").exists())
            .andExpect(jsonPath("$.data.studentId").value("SV001"))
            .andExpect(jsonPath("$.data.fullName").value("Nguyen Van A"))
            .andExpect(jsonPath("$.data.accessToken").doesNotExist())
            .andExpect(jsonPath("$.data.refreshToken").doesNotExist())
            .andExpect(jsonPath("$.data.jwt").doesNotExist())
            .andExpect(jsonPath("$.accessToken").doesNotExist());
    }

    @Test
    void loginReturnsErrorWhenStudentNotFound() throws Exception {
        when(authService.login(org.mockito.ArgumentMatchers.any()))
            .thenThrow(new StudentNotFoundException("SV404"));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"studentId\":\"SV404\",\"password\":\"anything\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.errorCode").value("STUDENT_NOT_FOUND"));
    }

    @Test
    void loginReturnsValidationErrorWhenStudentIdMissing() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"password\":\"anything\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.errorCode").value("VALIDATION_ERROR"));
    }
}
