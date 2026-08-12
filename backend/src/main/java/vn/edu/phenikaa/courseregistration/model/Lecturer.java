package vn.edu.phenikaa.courseregistration.model;

/** Giảng viên kế thừa từ User. */
public class Lecturer extends User {
    private String faculty;

    public Lecturer() {
    }

    public Lecturer(String id, String fullName, String faculty) {
        super(id, fullName);
        this.faculty = faculty;
    }

    public String getFaculty() {
        return faculty;
    }

    public void setFaculty(String faculty) {
        this.faculty = faculty;
    }
}
