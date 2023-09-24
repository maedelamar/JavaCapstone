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
    private String imageURL;

    @Column
    private Integer size;

    @Column
    private LocalDateTime startTime;

    @Column
    private LocalDateTime endTime;

    @Column
    private String location;

    @Column(columnDefinition = "text")
    private String notes;

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
        if (courseDto.getImageURL() != null) {
            this.imageURL = courseDto.getImageURL();
        }
        if (courseDto.getSize() != null) {
            this.size = courseDto.getSize();
        }
        if (courseDto.getStartTime() != null) {
            this.startTime = courseDto.getStartTime();
        }
        if (courseDto.getEndTime() != null) {
            this.endTime = courseDto.getEndTime();
        }
        if (courseDto.getLocation() != null) {
            this.location = courseDto.getLocation();
        }
        if (courseDto.getNotes() != null) {
            this.notes = courseDto.getNotes();
        }
    }
}