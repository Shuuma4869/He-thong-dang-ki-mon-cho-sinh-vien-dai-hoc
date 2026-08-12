package vn.edu.phenikaa.courseregistration.dto.response;

import java.util.ArrayList;
import java.util.List;

/**
 * DTO trả thông tin học phần.
 */
public class CourseResponse {
    private String courseId;
    private String courseName;
    private int credits;
    private String lecturerId;
    private LecturerResponse lecturer;
    private int maxCapacity;
    private int currentCapacity;
    private List<ScheduleResponse> schedules = new ArrayList<>();

    public CourseResponse() {
    }

    public CourseResponse(
        String courseId,
        String courseName,
        int credits,
        String lecturerId,
        LecturerResponse lecturer,
        int maxCapacity,
        int currentCapacity,
        List<ScheduleResponse> schedules
    ) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.credits = credits;
        this.lecturerId = lecturerId;
        this.lecturer = lecturer;
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

    public LecturerResponse getLecturer() {
        return lecturer;
    }

    public void setLecturer(LecturerResponse lecturer) {
        this.lecturer = lecturer;
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

    public List<ScheduleResponse> getSchedules() {
        return schedules;
    }

    public void setSchedules(List<ScheduleResponse> schedules) {
        this.schedules = schedules;
    }
}
