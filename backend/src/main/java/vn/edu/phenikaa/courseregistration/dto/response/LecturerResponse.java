package vn.edu.phenikaa.courseregistration.dto.response;

/**
 * DTO trả thông tin giảng viên.
 */
public class LecturerResponse {
    private String lecturerId;
    private String fullName;
    private String faculty;

    public LecturerResponse() {
    }

    public LecturerResponse(String lecturerId, String fullName, String faculty) {
        this.lecturerId = lecturerId;
        this.fullName = fullName;
        this.faculty = faculty;
    }

    public String getLecturerId() {
        return lecturerId;
    }

    public void setLecturerId(String lecturerId) {
        this.lecturerId = lecturerId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getFaculty() {
        return faculty;
    }

    public void setFaculty(String faculty) {
        this.faculty = faculty;
    }
}
