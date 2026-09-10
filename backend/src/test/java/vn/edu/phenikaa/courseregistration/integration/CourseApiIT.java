package vn.edu.phenikaa.courseregistration.integration;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.file.Path;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CourseApiIT {
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
    void listCoursesReturnsDataFromJsonRepositories() throws Exception {
        mockMvc.perform(get("/api/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.length()").value(6))
                .andExpect(jsonPath("$.data[0].courseId").value("CORE101"))
                .andExpect(jsonPath("$.data[0].lecturer.fullName").value("Giang vien Test"))
                .andExpect(jsonPath("$.data[0].schedules[0].room").value("A101"));
    }

    @Test
    void courseDetailReturnsRequestedDomainData() throws Exception {
        mockMvc.perform(get("/api/courses/WEB202"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.courseName").value("Lap trinh Web"))
                .andExpect(jsonPath("$.data.credits").value(2))
                .andExpect(jsonPath("$.data.currentCapacity").value(5))
                .andExpect(jsonPath("$.data.lecturer.lecturerId").value("GV-TEST"));
    }

    @Test
    void searchCoursesMatchesNameCaseInsensitively() throws Exception {
        mockMvc.perform(get("/api/courses/search").param("keyword", "du LIEU"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].courseId").value("DATA606"));
    }

    @Test
    void courseDetailReturnsBusinessErrorWhenCourseDoesNotExist() throws Exception {
        mockMvc.perform(get("/api/courses/UNKNOWN"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errorCode").value("COURSE_NOT_FOUND"));
    }
}
