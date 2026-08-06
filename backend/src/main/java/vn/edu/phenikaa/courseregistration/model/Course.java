package vn.edu.phenikaa.courseregistration.model;

import java.util.ArrayList;
import java.util.List;

/** Model học phần; rule nghiệp vụ sẽ được bổ sung ở service/validator. */
public class Course {
    private String id;
    private String code;
    private String name;
    private int credits;
    private int capacity;
    private List<Schedule> schedules = new ArrayList<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCredits() {
        return credits;
    }

    public void setCredits(int credits) {
        this.credits = credits;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public List<Schedule> getSchedules() {
        return schedules;
    }

    public void setSchedules(List<Schedule> schedules) {
        this.schedules = schedules;
    }
}
