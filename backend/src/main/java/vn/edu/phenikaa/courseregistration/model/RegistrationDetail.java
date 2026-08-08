package vn.edu.phenikaa.courseregistration.model;

/** Dòng chi tiết trong phiếu đăng ký. */
public class RegistrationDetail {
    private String courseId;

    public RegistrationDetail() {
    }

    public RegistrationDetail(String courseId) {
        this.courseId = courseId;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }
}
