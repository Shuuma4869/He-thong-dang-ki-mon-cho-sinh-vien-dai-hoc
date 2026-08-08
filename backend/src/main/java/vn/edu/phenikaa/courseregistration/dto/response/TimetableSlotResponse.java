package vn.edu.phenikaa.courseregistration.dto.response;

import java.time.DayOfWeek;
import java.time.LocalTime;

/** DTO response cho mot slot thoi khoa bieu. */
public class TimetableSlotResponse {
    private String courseId;
    private String courseName;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private String room;

    public TimetableSlotResponse() {
    }

    public TimetableSlotResponse(
            String courseId,
            String courseName,
            DayOfWeek dayOfWeek,
            LocalTime startTime,
            LocalTime endTime,
            String room
    ) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.room = room;
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

    public DayOfWeek getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(DayOfWeek dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }
}
