package vn.edu.phenikaa.courseregistration.dto.response;

/**
 * DTO trả một dòng chi tiết đăng ký.
 */
public class RegistrationDetailResponse {
    private String courseId;

    public RegistrationDetailResponse() {
    }

    public RegistrationDetailResponse(String courseId) {
        this.courseId = courseId;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }
}
