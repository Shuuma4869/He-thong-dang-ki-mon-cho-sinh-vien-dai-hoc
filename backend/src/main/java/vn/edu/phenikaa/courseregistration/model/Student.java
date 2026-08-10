package vn.edu.phenikaa.courseregistration.model;

/** Sinh viên kế thừa từ User. */
public class Student extends User {
    private String className;
    private String major;
    private int maxCredits;

    public Student() {
    }

    public Student(String id, String fullName, String className, String major, int maxCredits) {
        super(id, fullName);
        this.className = className;
        this.major = major;
        this.maxCredits = maxCredits;
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
