package vn.edu.phenikaa.courseregistration.model;

/** Sinh viên kế thừa từ User. */
public class Student extends User {
    private String className;
    private String major;

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
}
