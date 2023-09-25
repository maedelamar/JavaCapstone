package com.devmountain.courseScheduler.entities;

import com.devmountain.courseScheduler.dtos.UserDto;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    @Column
    private String password;

    @Column
    private String firstName;

    @Column
    private String lastName;

    @Column
    private Integer permission;

    @OneToMany(mappedBy = "instructor", fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JsonManagedReference
    private Set<Course> coursesInstructed = new HashSet<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JsonManagedReference(value = "user_student")
    private Set<Student> userAsStudentSet = new HashSet<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JsonManagedReference(value = "user_waiter")
    private Set<Waiter> userAsWaiterSet = new HashSet<>();

    public User(UserDto userDto) {
        if (userDto.getId() != null) {
            this.id = userDto.getId();
        }
        if (userDto.getEmail() != null) {
            this.email = userDto.getEmail();
        }
        if (userDto.getPassword() != null) {
            this.password = userDto.getPassword();
        }
        if (userDto.getFirstName() != null) {
            this.firstName = userDto.getFirstName();
        }
        if (userDto.getLastName() != null) {
            this.lastName = userDto.getLastName();
        }
        if (userDto.getPermission() != null) {
            this.permission = userDto.getPermission();
        }
    }
}
