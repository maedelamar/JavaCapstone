package com.devmountain.courseScheduler.entities;

import com.devmountain.courseScheduler.dtos.WaiterDto;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "waiting_list")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Waiter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private LocalDateTime timeApplied;

    @ManyToOne
    @JsonBackReference
    private User user;

    @ManyToOne
    @JsonBackReference
    private Course course;

    public Waiter(WaiterDto waiterDto) {
        if (waiterDto.getId() != null) {
            this.id = waiterDto.getId();
        }
        if (waiterDto.getTimeApplied() != null) {
            this.timeApplied = waiterDto.getTimeApplied();
        }
    }
}
