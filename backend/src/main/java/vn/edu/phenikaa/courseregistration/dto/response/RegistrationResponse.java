package vn.edu.phenikaa.courseregistration.dto.response;

/** DTO response skeleton cho kết quả đăng ký môn học. */
public class RegistrationResponse {
    private String registrationId;
    private String status;

    public String getRegistrationId() {
        return registrationId;
    }

    public void setRegistrationId(String registrationId) {
        this.registrationId = registrationId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
