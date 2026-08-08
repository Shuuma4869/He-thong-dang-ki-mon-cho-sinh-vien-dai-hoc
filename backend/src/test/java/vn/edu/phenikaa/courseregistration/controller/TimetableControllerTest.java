package vn.edu.phenikaa.courseregistration.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import vn.edu.phenikaa.courseregistration.mapper.TimetableMapper;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.model.Schedule;
import vn.edu.phenikaa.courseregistration.service.TimetableService;

@WebMvcTest(TimetableController.class)
@Import(TimetableMapper.class)
class TimetableControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TimetableService timetableService;

    @Test
    void findByStudentIdReturnsTimetableSlots() throws Exception {
        when(timetableService.findRegisteredCourses("SV001")).thenReturn(List.of(oopCourse()));

        mockMvc.perform(get("/api/students/SV001/timetable"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].courseId").value("OOP101"))
                .andExpect(jsonPath("$.data[0].dayOfWeek").value("MONDAY"))
                .andExpect(jsonPath("$.data[0].startTime").value("07:30:00"));
    }

    private Course oopCourse() {
        return new Course(
                "OOP101",
                "Lap trinh huong doi tuong",
                3,
                "GV001",
                60,
                20,
                List.of(new Schedule(DayOfWeek.MONDAY, LocalTime.of(7, 30), LocalTime.of(9, 30), "A101"))
        );
    }
}
