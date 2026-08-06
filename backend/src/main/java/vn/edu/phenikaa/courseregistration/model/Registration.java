package vn.edu.phenikaa.courseregistration.model;

import java.util.ArrayList;
import java.util.List;
import vn.edu.phenikaa.courseregistration.model.enums.RegistrationStatus;

/** Phiếu đăng ký học phần của sinh viên. */
public class Registration {
    private String id;
    private String studentId;
    private RegistrationStatus status = RegistrationStatus.DRAFT;
    private List<RegistrationDetail> details = new ArrayList<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public List<RegistrationDetail> getDetails() {
        return details;
    }

    public void setDetails(List<RegistrationDetail> details) {
        this.details = details;
    }
}
