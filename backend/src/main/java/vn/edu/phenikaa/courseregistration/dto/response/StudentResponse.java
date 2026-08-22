package vn.edu.phenikaa.courseregistration.dto.response;

/**
 * DTO trả thông tin sinh viên ra REST API.
 */
public class StudentResponse {
    private String studentId;
    private String fullName;
    private String className;
    private String major;
    private int maxCredits;

    public StudentResponse() {
    }

    public StudentResponse(String studentId, String fullName, String className, String major, int maxCredits) {
        this.studentId = studentId;
        this.fullName = fullName;
        this.className = className;
        this.major = major;
        this.maxCredits = maxCredits;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public int getMaxCredits() {
        return maxCredits;
    }

    public void setMaxCredits(int maxCredits) {
        this.maxCredits = maxCredits;
    }
}
