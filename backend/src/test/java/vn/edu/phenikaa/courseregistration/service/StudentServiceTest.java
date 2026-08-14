package vn.edu.phenikaa.courseregistration.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import vn.edu.phenikaa.courseregistration.exception.StudentNotFoundException;
import vn.edu.phenikaa.courseregistration.model.Student;
import vn.edu.phenikaa.courseregistration.repository.StudentRepository;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {
    @Mock
    private StudentRepository studentRepository;

    @Test
    void findByIdReturnsStudent() {
        Student student = new Student("SV001", "Nguyen Van A", "CNTT1", "Cong nghe thong tin", 18);
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student));
        StudentService service = new StudentService(studentRepository);

        assertThat(service.findById("SV001")).isSameAs(student);
    }

    @Test
    void findByIdThrowsWhenStudentNotFound() {
        when(studentRepository.findById("SV999")).thenReturn(Optional.empty());
        StudentService service = new StudentService(studentRepository);

        assertThatThrownBy(() -> service.findById("SV999"))
            .isInstanceOf(StudentNotFoundException.class)
            .hasMessageContaining("SV999");
    }
}
