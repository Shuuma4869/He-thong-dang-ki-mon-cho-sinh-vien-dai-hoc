package vn.edu.phenikaa.courseregistration.model;

/**
 * Composition cho mot dong thoi khoa bieu duoc suy ra tu registration, course,
 * lecturer va schedule.
 */
public record TimetableEntry(Course course, Lecturer lecturer, Schedule schedule) {
}
