package com.devmountain.courseScheduler.entities;

import com.devmountain.courseScheduler.dtos.CourseDto;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "courses")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column(columnDefinition = "text")
    private String description;

    @Column
    private Long number;

    @Column
    private String category;

    @Column
    private Integer size;

    @Column
    private LocalDateTime time;

    @Column
    private String location;

    @ManyToOne
    @JsonBackReference
    private User instructor;

    @OneToMany(mappedBy = "course", fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JsonManagedReference
    private Set<Student> students = new HashSet<>();

    @OneToMany(mappedBy = "course", fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JsonManagedReference
    private Set<Waiter> waitingSet = new HashSet<>();

    public Course(CourseDto courseDto) {
        if (courseDto.getId() != null) {
            this.id = courseDto.getId();
        }
        if (courseDto.getName() != null) {
            this.name = courseDto.getName();
        }
        if (courseDto.getDescription() != null) {
            this.description = courseDto.getDescription();
        }
        if (courseDto.getNumber() != null) {
            this.number = courseDto.getNumber();
        }
        if (courseDto.getCategory() != null) {
            this.category = courseDto.getCategory();
        }
        if (courseDto.getSize() != null) {
            this.size = courseDto.getSize();
        }
        if (courseDto.getTime() != null) {
            this.time = courseDto.getTime();
        }
        if (courseDto.getLocation() != null) {
            this.location = courseDto.getLocation();
        }
    }
}