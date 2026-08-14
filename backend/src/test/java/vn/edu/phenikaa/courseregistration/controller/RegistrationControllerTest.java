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
import vn.edu.phenikaa.courseregistration.exception.CourseFullException;
import vn.edu.phenikaa.courseregistration.exception.CourseNotFoundException;
import vn.edu.phenikaa.courseregistration.exception.CreditLimitExceededException;
import vn.edu.phenikaa.courseregistration.exception.DuplicateRegistrationException;
import vn.edu.phenikaa.courseregistration.exception.RegistrationNotFoundException;
import vn.edu.phenikaa.courseregistration.exception.ScheduleConflictException;
import vn.edu.phenikaa.courseregistration.mapper.CourseMapper;
import vn.edu.phenikaa.courseregistration.mapper.RegistrationMapper;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.model.CourseWithLecturer;
import vn.edu.phenikaa.courseregistration.model.Lecturer;
import vn.edu.phenikaa.courseregistration.model.Registration;
import vn.edu.phenikaa.courseregistration.model.RegistrationDetail;
import vn.edu.phenikaa.courseregistration.model.RegistrationSummary;
import vn.edu.phenikaa.courseregistration.model.Schedule;
import vn.edu.phenikaa.courseregistration.model.enums.RegistrationStatus;
import vn.edu.phenikaa.courseregistration.service.RegistrationService;

@WebMvcTest(RegistrationController.class)
@Import({RegistrationMapper.class, CourseMapper.class})
class RegistrationControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RegistrationService registrationService;

    @Test
    void findByStudentIdReturnsRegistrations() throws Exception {
        when(registrationService.findActiveRegistrationSummary("SV001"))
            .thenReturn(summary(registration("REG001", "SV001", "OOP101"), course("OOP101", 3)));

        mockMvc.perform(get("/api/students/SV001/registrations"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.studentId").value("SV001"))
            .andExpect(jsonPath("$.data.details[0].courseId").value("OOP101"))
            .andExpect(jsonPath("$.data.courses[0].courseName").value("Hoc phan OOP101"))
            .andExpect(jsonPath("$.data.courses[0].lecturer.fullName").value("Nguyen Van B"))
            .andExpect(jsonPath("$.data.courses[0].schedules[0].room").value("A101"))
            .andExpect(jsonPath("$.data.totalCredits").value(3));
    }

    @Test
    void findByStudentIdReturnsEmptySummaryWhenNoRegistrationExists() throws Exception {
        when(registrationService.findActiveRegistrationSummary("SV001"))
            .thenReturn(summary(registration("REG001", "SV001"), List.of()));

        mockMvc.perform(get("/api/students/SV001/registrations"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.studentId").value("SV001"))
            .andExpect(jsonPath("$.data.courses").isArray())
            .andExpect(jsonPath("$.data.courses.length()").value(0))
            .andExpect(jsonPath("$.data.totalCredits").value(0));
    }

    @Test
    void registerReturnsRegistration() throws Exception {
        when(registrationService.registerCourseSummary("SV001", "OOP101"))
            .thenReturn(summary(registration("REG001", "SV001", "OOP101"), course("OOP101", 3)));

        mockMvc.perform(post("/api/students/SV001/registrations")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"courseId\":\"OOP101\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.details[0].courseId").value("OOP101"))
            .andExpect(jsonPath("$.data.courses[0].courseId").value("OOP101"))
            .andExpect(jsonPath("$.data.totalCredits").value(3));
    }

    @Test
    void cancelReturnsUpdatedRegistration() throws Exception {
        when(registrationService.cancelCourseSummary("SV001", "OOP101"))
            .thenReturn(summary(registration("REG001", "SV001", "MAT101"), course("MAT101", 4)));

        mockMvc.perform(delete("/api/students/SV001/registrations/OOP101"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.details[0].courseId").value("MAT101"))
            .andExpect(jsonPath("$.data.courses[0].courseId").value("MAT101"))
            .andExpect(jsonPath("$.data.totalCredits").value(4));
    }

    @Test
    void registerReturnsErrorWhenDuplicate() throws Exception {
        when(registrationService.registerCourseSummary("SV001", "OOP101"))
            .thenThrow(new DuplicateRegistrationException("OOP101"));

        mockMvc.perform(post("/api/students/SV001/registrations")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"courseId\":\"OOP101\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errorCode").value("DUPLICATE_REGISTRATION"));
    }

    @Test
    void registerReturnsErrorWhenCourseNotFound() throws Exception {
        when(registrationService.registerCourseSummary("SV001", "MISSING"))
            .thenThrow(new CourseNotFoundException("MISSING"));

        mockMvc.perform(post("/api/students/SV001/registrations")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"courseId\":\"MISSING\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.errorCode").value("COURSE_NOT_FOUND"));
    }

    @Test
    void registerReturnsErrorWhenCourseIsFull() throws Exception {
        when(registrationService.registerCourseSummary("SV001", "AI301"))
            .thenThrow(new CourseFullException("AI301"));

        mockMvc.perform(post("/api/students/SV001/registrations")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"courseId\":\"AI301\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.errorCode").value("COURSE_FULL"));
    }

    @Test
    void registerReturnsErrorWhenCreditLimitExceeded() throws Exception {
        when(registrationService.registerCourseSummary("SV001", "CLOUD301"))
            .thenThrow(new CreditLimitExceededException(11, 10));

        mockMvc.perform(post("/api/students/SV001/registrations")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"courseId\":\"CLOUD301\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.errorCode").value("CREDIT_LIMIT_EXCEEDED"));
    }

    @Test
    void registerReturnsErrorWhenScheduleConflicts() throws Exception {
        when(registrationService.registerCourseSummary("SV001", "NET203"))
            .thenThrow(new ScheduleConflictException("NET203", "OOP101"));

        mockMvc.perform(post("/api/students/SV001/registrations")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"courseId\":\"NET203\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.errorCode").value("SCHEDULE_CONFLICT"));
    }

    @Test
    void registerReturnsValidationErrorWhenCourseIdMissing() throws Exception {
        mockMvc.perform(post("/api/students/SV001/registrations")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.errorCode").value("VALIDATION_ERROR"));
    }

    @Test
    void cancelReturnsErrorWhenRegistrationNotFound() throws Exception {
        when(registrationService.cancelCourseSummary("SV001", "OOP101"))
            .thenThrow(new RegistrationNotFoundException("SV001", "OOP101"));

        mockMvc.perform(delete("/api/students/SV001/registrations/OOP101"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.errorCode").value("REGISTRATION_NOT_FOUND"));
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

    private RegistrationSummary summary(Registration registration, Course course) {
        return summary(registration, List.of(course));
    }

    private RegistrationSummary summary(Registration registration, List<Course> courses) {
        return new RegistrationSummary(
            registration,
            courses.stream()
                .map(course -> new CourseWithLecturer(course, lecturer()))
                .toList()
        );
    }

    private Course course(String courseId, int credits) {
        return new Course(
            courseId,
            "Hoc phan " + courseId,
            credits,
            "GV001",
            60,
            20,
            List.of(new Schedule(java.time.DayOfWeek.MONDAY, java.time.LocalTime.of(7, 0), java.time.LocalTime.of(9, 0), "A101"))
        );
    }

    private Lecturer lecturer() {
        return new Lecturer("GV001", "Nguyen Van B", "CNTT");
    }
}
