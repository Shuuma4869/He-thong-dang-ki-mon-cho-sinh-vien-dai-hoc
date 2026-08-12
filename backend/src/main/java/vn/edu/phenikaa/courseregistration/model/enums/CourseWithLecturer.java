package vn.edu.phenikaa.courseregistration.model.enums;

import vn.edu.phenikaa.courseregistration.model.Course;
import vn.edu.phenikaa.courseregistration.model.Lecturer;

public class CourseWithLecturer {

    private final Course course;
    private final Lecturer lecturer;

    public CourseWithLecturer(Course course, Lecturer lecturer) {
        this.course = course;
        this.lecturer = lecturer;
    }

    public Course getCourse() {
        return course;
    }

    public Lecturer getLecturer() {
        return lecturer;
    }
}
