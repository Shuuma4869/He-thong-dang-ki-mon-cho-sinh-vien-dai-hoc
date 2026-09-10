package vn.edu.phenikaa.courseregistration.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class RegistrationApiIT {
    @TempDir
    static Path dataDirectory;

    @Autowired
    private MockMvc mockMvc;

    @DynamicPropertySource
    static void configureDataDirectory(DynamicPropertyRegistry registry) {
        registry.add("app.data-dir", () -> dataDirectory.toString());
    }

    @BeforeEach
    void resetTestData() throws Exception {
        IntegrationTestData.reset(dataDirectory);
    }

    @Test
    void registerCoursePersistsRegistrationAndUpdatesCapacity() throws Exception {
        mockMvc.perform(post("/api/students/SV-TEST/registrations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"courseId\":\"WEB202\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.studentId").value("SV-TEST"))
                .andExpect(jsonPath("$.data.details.length()").value(2))
                .andExpect(jsonPath("$.data.courses[1].courseId").value("WEB202"))
                .andExpect(jsonPath("$.data.totalCredits").value(5));

        mockMvc.perform(get("/api/students/SV-TEST/registrations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.details[1].courseId").value("WEB202"));

        mockMvc.perform(get("/api/courses/WEB202"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.currentCapacity").value(6));
    }

    @Test
    void duplicateRegistrationReturnsErrorWithoutChangingJsonData() throws Exception {
        String registrationsBefore = Files.readString(dataDirectory.resolve("registrations.json"));
        String coursesBefore = Files.readString(dataDirectory.resolve("courses.json"));

        mockMvc.perform(post("/api/students/SV-TEST/registrations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"courseId\":\"CORE101\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errorCode").value("DUPLICATE_REGISTRATION"));

        assertThat(Files.readString(dataDirectory.resolve("registrations.json")))
                .isEqualTo(registrationsBefore);
        assertThat(Files.readString(dataDirectory.resolve("courses.json")))
                .isEqualTo(coursesBefore);
    }

    @Test
    void fullCourseReturnsCourseFullError() throws Exception {
        mockMvc.perform(post("/api/students/SV-TEST/registrations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"courseId\":\"FULL303\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value("COURSE_FULL"));
    }

    @Test
    void courseOverCreditLimitReturnsCreditLimitError() throws Exception {
        mockMvc.perform(post("/api/students/SV-TEST/registrations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"courseId\":\"LIMIT404\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value("CREDIT_LIMIT_EXCEEDED"));
    }

    @Test
    void overlappingCourseReturnsScheduleConflictError() throws Exception {
        mockMvc.perform(post("/api/students/SV-TEST/registrations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"courseId\":\"CLASH505\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value("SCHEDULE_CONFLICT"));
    }

    @Test
    void cancelCoursePersistsEmptyRegistrationAndDecreasesCapacity() throws Exception {
        mockMvc.perform(delete("/api/students/SV-TEST/registrations/CORE101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("CANCELLED"))
                .andExpect(jsonPath("$.data.details.length()").value(0))
                .andExpect(jsonPath("$.data.totalCredits").value(0));

        mockMvc.perform(get("/api/students/SV-TEST/registrations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.details.length()").value(0));

        mockMvc.perform(get("/api/courses/CORE101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.currentCapacity").value(9));
    }
}
