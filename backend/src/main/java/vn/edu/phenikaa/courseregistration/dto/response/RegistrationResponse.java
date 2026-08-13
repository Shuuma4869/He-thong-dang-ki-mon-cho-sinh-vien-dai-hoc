package vn.edu.phenikaa.courseregistration.dto.response;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/** DTO response cho kết quả đăng ký môn học. */
public class RegistrationResponse {
    private String registrationId;
    private String studentId;
    private String status;
    private LocalDateTime registeredAt;
    private List<RegistrationDetailResponse> details = new ArrayList<>();
    private List<RegisteredCourseResponse> courses = new ArrayList<>();
    private int totalCredits;

    public RegistrationResponse() {
    }

    public RegistrationResponse(
        String registrationId,
        String studentId,
        String status,
        LocalDateTime registeredAt,
        List<RegistrationDetailResponse> details,
        List<RegisteredCourseResponse> courses,
        int totalCredits
    ) {
        this.registrationId = registrationId;
        this.studentId = studentId;
        this.status = status;
        this.registeredAt = registeredAt;
        this.details = details == null ? new ArrayList<>() : details;
        this.courses = courses == null ? new ArrayList<>() : courses;
        this.totalCredits = totalCredits;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }

    public List<RegistrationDetailResponse> getDetails() {
        return details;
    }

    public void setDetails(List<RegistrationDetailResponse> details) {
        this.details = details;
    }

    public List<RegisteredCourseResponse> getCourses() {
        return courses;
    }

    public void setCourses(List<RegisteredCourseResponse> courses) {
        this.courses = courses;
    }

    public int getTotalCredits() {
        return totalCredits;
    }

    public void setTotalCredits(int totalCredits) {
        this.totalCredits = totalCredits;
    }
}
