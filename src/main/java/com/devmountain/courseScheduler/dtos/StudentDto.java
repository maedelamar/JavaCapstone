package com.devmountain.courseScheduler.dtos;

import com.devmountain.courseScheduler.entities.Course;
import com.devmountain.courseScheduler.entities.Student;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentDto implements Serializable {
    private Long id;
    private Boolean attended;
    private Integer rating;
    private Course course; //We need the course

    public StudentDto(Student student) {
        if (student.getId() != null) {
            this.id = student.getId();
        }
        if (student.getAttended() != null) {
            this.attended = student.getAttended();
        }
        if (student.getRating() != null) {
            this.rating = student.getRating();
        }
        if (student.getCourse() != null) {
            this.course = student.getCourse();
        }
    }
}
