package vn.edu.phenikaa.courseregistration.model;

import java.util.ArrayList;
import java.util.List;

/** Model học phần; rule nghiệp vụ sẽ được bổ sung ở service/validator. */
public class Course {
    private String courseId;
    private String courseName;
    private int credits;
    private String lecturerId;
    private int maxCapacity;
    private int currentCapacity;
    private List<Schedule> schedules = new ArrayList<>();

    public Course() {
    }

    public Course(
            String courseId,
            String courseName,
            int credits,
            String lecturerId,
            int maxCapacity,
            int currentCapacity,
            List<Schedule> schedules
    ) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.credits = credits;
        this.lecturerId = lecturerId;
        this.maxCapacity = maxCapacity;
        this.currentCapacity = currentCapacity;
        this.schedules = schedules == null ? new ArrayList<>() : schedules;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public int getCredits() {
        return credits;
    }

    public void setCredits(int credits) {
        this.credits = credits;
    }

    public String getLecturerId() {
        return lecturerId;
    }

    public void setLecturerId(String lecturerId) {
        this.lecturerId = lecturerId;
    }

    public int getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(int maxCapacity) {
        this.maxCapacity = maxCapacity;
    }

    public int getCurrentCapacity() {
        return currentCapacity;
    }

    public void setCurrentCapacity(int currentCapacity) {
        this.currentCapacity = currentCapacity;
    }

    public List<Schedule> getSchedules() {
        return schedules;
    }

    public void setSchedules(List<Schedule> schedules) {
        this.schedules = schedules;
    }
}
