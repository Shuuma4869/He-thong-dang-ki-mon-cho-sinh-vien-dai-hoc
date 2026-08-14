package vn.edu.phenikaa.courseregistration.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import vn.edu.phenikaa.courseregistration.dto.request.LoginRequest;
import vn.edu.phenikaa.courseregistration.exception.BusinessException;
import vn.edu.phenikaa.courseregistration.exception.StudentNotFoundException;
import vn.edu.phenikaa.courseregistration.model.Student;
import vn.edu.phenikaa.courseregistration.repository.StudentRepository;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock
    private StudentRepository studentRepository;

    @Test
    void loginReturnsStudentWhenStudentIdExists() {
        Student student = student();
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student));

        Student loggedInStudent = service().login(request("SV001", "anything"));

        assertThat(loggedInStudent).isSameAs(student);
        verify(studentRepository).findById("SV001");
        verify(studentRepository, never()).save(any());
    }

    @Test
    void loginThrowsWhenStudentIdDoesNotExist() {
        when(studentRepository.findById("SV404")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service().login(request("SV404", "anything")))
            .isInstanceOf(StudentNotFoundException.class)
            .hasMessageContaining("SV404");
        verify(studentRepository).findById("SV404");
        verify(studentRepository, never()).save(any());
    }

    @Test
    void loginTrimsStudentIdBeforeLookup() {
        Student student = student();
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student));

        assertThat(service().login(request(" SV001 ", "anything"))).isSameAs(student);

        verify(studentRepository).findById("SV001");
    }

    @Test
    void loginThrowsValidationErrorWhenStudentIdIsBlank() {
        assertThatThrownBy(() -> service().login(request("   ", "anything")))
            .isInstanceOf(BusinessException.class)
            .hasFieldOrPropertyWithValue("errorCode", "VALIDATION_ERROR");
        verifyNoInteractions(studentRepository);
    }

    @Test
    void loginDoesNotMutateStudent() {
        Student student = student();
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student));

        service().login(request("SV001", "new-password-value"));

        assertThat(student.getId()).isEqualTo("SV001");
        assertThat(student.getFullName()).isEqualTo("Nguyen Van A");
        assertThat(student.getMaxCredits()).isEqualTo(18);
        verify(studentRepository, never()).save(any());
    }

    private AuthService service() {
        return new AuthService(studentRepository);
    }

    private LoginRequest request(String studentId, String password) {
        LoginRequest request = new LoginRequest();
        request.setStudentId(studentId);
        request.setPassword(password);
        return request;
    }

    private Student student() {
        return new Student("SV001", "Nguyen Van A", "CNTT1", "Cong nghe thong tin", 18);
    }
}
