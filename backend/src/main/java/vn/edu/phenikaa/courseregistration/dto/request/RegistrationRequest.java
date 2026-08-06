package vn.edu.phenikaa.courseregistration.dto.request;

/** DTO request skeleton cho thao tác đăng ký môn học. */
public class RegistrationRequest {
    private String studentId;
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
