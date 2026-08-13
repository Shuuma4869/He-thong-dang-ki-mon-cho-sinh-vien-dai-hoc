package vn.edu.phenikaa.courseregistration.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import vn.edu.phenikaa.courseregistration.model.enums.RegistrationStatus;

/** Phiếu đăng ký học phần của sinh viên. */
public class Registration {
    private String registrationId;
    private String studentId;
    private RegistrationStatus status = RegistrationStatus.ACTIVE;
    private LocalDateTime registeredAt;
    private List<RegistrationDetail> details = new ArrayList<>();

    public Registration() {
    }

    public Registration(
        String registrationId,
        String studentId,
        RegistrationStatus status,
        LocalDateTime registeredAt,
        List<RegistrationDetail> details
    ) {
        this.registrationId = registrationId;
        this.studentId = studentId;
        this.status = status;
        this.registeredAt = registeredAt;
        this.details = details == null ? new ArrayList<>() : details;
    }

    public String getRegistrationId() {
        return registrationId;
    }

    public void setRegistrationId(String registrationId) {
        this.registrationId = registrationId;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public RegistrationStatus getStatus() {
        return status;
    }

    public void setStatus(RegistrationStatus status) {
        this.status = status;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }

    public List<RegistrationDetail> getDetails() {
        return details;
    }

    public void setDetails(List<RegistrationDetail> details) {
        this.details = details;
    }
}
