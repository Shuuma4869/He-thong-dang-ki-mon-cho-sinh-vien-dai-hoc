package vn.edu.phenikaa.courseregistration.dto.request;

import jakarta.validation.constraints.NotBlank;

/** DTO request cho thao tác đăng ký môn học. */
public class RegistrationRequest {
    private String studentId;
    @NotBlank(message = "Ma hoc phan khong duoc de trong")
    private String courseId;

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }
}
