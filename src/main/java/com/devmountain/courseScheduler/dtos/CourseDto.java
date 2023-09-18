package com.devmountain.courseScheduler.dtos;

import com.devmountain.courseScheduler.entities.Course;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseDto {
    private Long id;
    private String name;
    private String description;
    private Long number;
    private String category;
    private Integer size;
    private LocalDateTime time;
    private String location;

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
        if (course.getCategory() != null) {
            this.category = course.getCategory();
        }
        if (course.getSize() != null) {
            this.size = course.getSize();
        }
        if (course.getTime() != null) {
            this.time = course.getTime();
        }
        if (course.getLocation() != null) {
            this.location = course.getLocation();
        }
    }
}
