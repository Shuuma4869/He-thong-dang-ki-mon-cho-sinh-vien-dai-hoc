ework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
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
import vn.edu.phenikaa.courseregistration.model.Lecturer;
import vn.edu.phenikaa.courseregistration.model.Schedule;
import vn.edu.phenikaa.courseregistration.model.TimetableEntry;
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
        Course course = oopCourse();
        when(timetableService.findTimetableEntries("SV001"))
            .thenReturn(List.of(entry(course, lecturer(), course.getSchedules().getFirst())));

        mockMvc.perform(get("/api/students/SV001/timetable"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data[0].courseId").value("OOP101"))
            .andExpect(jsonPath("$.data[0].courseName").value("Lap trinh huong doi tuong"))
            .andExpect(jsonPath("$.data[0].credits").value(3))
            .andExpect(jsonPath("$.data[0].lecturerName").value("Tran Thi B"))
            .andExpect(jsonPath("$.data[0].dayOfWeek").value("MONDAY"))
            .andExpect(jsonPath("$.data[0].startTime").value("07:30:00"))
            .andExpect(jsonPath("$.data[0].endTime").value("09:30:00"))
            .andExpect(jsonPath("$.data[0].room").value("A101"));
    }

    @Test
    void findByStudentIdReturnsOneSlotPerSchedule() throws Exception {
        Course course = courseWithTwoSchedules();
        when(timetableService.findTimetableEntries("SV001"))
            .thenReturn(List.of(
                entry(course, lecturer(), course.getSchedules().get(0)),
                entry(course, lecturer(), course.getSchedules().get(1))
            ));

        mockMvc.perform(get("/api/students/SV001/timetable"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.length()").value(2))
            .andExpect(jsonPath("$.data[0].room").value("A101"))
            .andExpect(jsonPath("$.data[1].room").value("A102"));
    }

    @Test
    void findByStudentIdReturnsEmptyTimetable() throws Exception {
        when(timetableService.findTimetableEntries("SV001")).thenReturn(List.of());

        mockMvc.perform(get("/api/students/SV001/timetable"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data").isArray())
            .andExpect(jsonPath("$.data.length()").value(0));
    }

    private TimetableEntry entry(Course course, Lecturer lecturer, Schedule schedule) {
        return new TimetableEntry(course, lecturer, schedule);
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

    private Course courseWithTwoSchedules() {
        return new Course(
            "OOP101",
            "Lap trinh huong doi tuong",
            3,
            "GV001",
            60,
            20,
            List.of(
                new Schedule(DayOfWeek.MONDAY, LocalTime.of(7, 30), LocalTime.of(9, 30), "A101"),
                new Schedule(DayOfWeek.WEDNESDAY, LocalTime.of(7, 30), LocalTime.of(9, 30), "A102")
            )
        );
    }

    private Lecturer lecturer() {
        return new Lecturer("GV001", "Tran Thi B", "Khoa Cong nghe thong tin");
    }
}
