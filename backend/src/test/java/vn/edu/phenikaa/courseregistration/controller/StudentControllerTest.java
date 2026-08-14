package vn.edu.phenikaa.courseregistration.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import vn.edu.phenikaa.courseregistration.exception.StudentNotFoundException;
import vn.edu.phenikaa.courseregistration.mapper.StudentMapper;
import vn.edu.phenikaa.courseregistration.model.Student;
import vn.edu.phenikaa.courseregistration.service.StudentService;

@WebMvcTest(StudentController.class)
@Import(StudentMapper.class)
class StudentControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudentService studentService;

    @Test
    void findByIdReturnsStudent() throws Exception {
        Student student = new Student("SV001", "Nguyen Van A", "CNTT1", "Cong nghe thong tin", 18);
        when(studentService.findById("SV001")).thenReturn(student);

        mockMvc.perform(get("/api/students/SV001"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.studentId").value("SV001"))
            .andExpect(jsonPath("$.data.fullName").value("Nguyen Van A"))
            .andExpect(jsonPath("$.data.className").value("CNTT1"))
            .andExpect(jsonPath("$.data.major").value("Cong nghe thong tin"))
            .andExpect(jsonPath("$.data.maxCredits").value(18));
    }

    @Test
    void findByIdReturnsErrorWhenStudentNotFound() throws Exception {
        when(studentService.findById("SV999")).thenThrow(new StudentNotFoundException("SV999"));

        mockMvc.perform(get("/api/students/SV999"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.errorCode").value("STUDENT_NOT_FOUND"));
    }
}
