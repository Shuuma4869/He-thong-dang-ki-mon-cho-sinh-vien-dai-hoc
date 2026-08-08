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
import vn.edu.phenikaa.courseregistration.exception.CourseNotFoundException;
import vn.edu.phenikaa.courseregistration.mapper.CourseMapper;
import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.model.Schedule;
import vn.edu.phenikaa.courseregistration.service.CourseService;

@WebMvcTest(CourseController.class)
@Import(CourseMapper.class)
class CourseControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CourseService courseService;

    @Test
    void findAllReturnsCourses() throws Exception {
        when(courseService.findAll()).thenReturn(List.of(oopCourse()));

        mockMvc.perform(get("/api/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].courseId").value("OOP101"))
                .andExpect(jsonPath("$.data[0].schedules[0].dayOfWeek").value("MONDAY"));
    }

    @Test
    void findByIdReturnsCourse() throws Exception {
        when(courseService.findById("OOP101")).thenReturn(oopCourse());

        mockMvc.perform(get("/api/courses/OOP101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.courseName").value("Lap trinh huong doi tuong"));
    }

    @Test
    void searchReturnsMatchedCourses() throws Exception {
        when(courseService.search("oop")).thenReturn(List.of(oopCourse()));

        mockMvc.perform(get("/api/courses/search").param("keyword", "oop"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].courseId").value("OOP101"));
    }

    @Test
    void findByIdReturnsErrorWhenCourseNotFound() throws Exception {
        when(courseService.findById("MISSING")).thenThrow(new CourseNotFoundException("MISSING"));

        mockMvc.perform(get("/api/courses/MISSING"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value("COURSE_NOT_FOUND"));
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
