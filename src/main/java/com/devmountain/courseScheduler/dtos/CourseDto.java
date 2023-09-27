package com.devmountain.courseScheduler.dtos;

import com.devmountain.courseScheduler.entities.Course;
import com.devmountain.courseScheduler.entities.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseDto implements Serializable {
    private Long id;
    private String name;
    private String description;
    private Long number;
    private String imageURL;
    private Integer size;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String location;
    private String notes;
    private Long instructorId;

    public CourseDto(Course course) {
        if (course.getId() != null) {
            this.id = course.getId();
        }
        if (course.getName() != null) {
            this.name = course.getName();
        }
        if (course.getDescription() != null) {
            this.description = course.getDescription();
        }
        if (course.getNumber() != null) {
            this.number = course.getNumber();
        }
        if (course.getImageURL() != null) {
            this.imageURL = course.getImageURL();
        }
        if (course.getSize() != null) {
            this.size = course.getSize();
        }
        if (course.getStartTime() != null) {
            this.startTime = course.getStartTime();
        }
        if (course.getEndTime() != null) {
            this.endTime = course.getEndTime();
        }
        if (course.getLocation() != null) {
            this.location = course.getLocation();
        }
        if (course.getNotes() != null) {
            this.notes = course.getNotes();
        }
        if (course.getInstructor() != null) {
            this.instructorId = course.getInstructor().getId();
        }
    }
}
