package vn.edu.phenikaa.courseregistration.model;

/** Giảng viên kế thừa từ User. */
public class Lecturer extends User {
    private String faculty;

    public String getFaculty() {
        return faculty;
    }

    public void setFaculty(String faculty) {
        this.faculty = faculty;
    }
}
