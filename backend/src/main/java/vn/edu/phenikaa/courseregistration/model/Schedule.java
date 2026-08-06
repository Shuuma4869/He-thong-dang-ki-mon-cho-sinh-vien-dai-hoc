package vn.edu.phenikaa.courseregistration.model;

import java.util.ArrayList;
import java.util.List;

/** Model lịch học của một lớp học phần. */
public class Schedule {
    private int dayOfWeek;
    private List<Integer> periods = new ArrayList<>();
    private String room;

    public int getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(int dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public List<Integer> getPeriods() {
        return periods;
    }

    public void setPeriods(List<Integer> periods) {
        this.periods = periods;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }
}
