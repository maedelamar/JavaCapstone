package com.devmountain.courseScheduler.entities;

import com.devmountain.courseScheduler.dtos.StudentDto;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "students")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Boolean attended;

    @Column
    private Integer rating;

    @ManyToOne
    @JsonBackReference(value = "user_student")
    private User user;

    @ManyToOne
    @JsonBackReference(value = "course_student")
    private Course course;

    public Student(StudentDto studentDto) {
        if (studentDto.getId() != null) {
            this.id = studentDto.getId();
        }
        if (studentDto.getAttended() != null) {
            this.attended = studentDto.getAttended();
        }
        if (studentDto.getRating() != null) {
            this.rating = studentDto.getRating();
        }
        if (studentDto.getCourse() != null) {
            this.course = studentDto.getCourse();
        }
    }
}