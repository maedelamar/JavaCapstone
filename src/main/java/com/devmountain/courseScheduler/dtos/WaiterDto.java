package com.devmountain.courseScheduler.dtos;

import com.devmountain.courseScheduler.entities.Waiter;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WaiterDto {
    private Long id;
    private LocalDateTime timeApplied;

    public WaiterDto(Waiter waiter) {
        if (waiter.getId() != null) {
            this.id = waiter.getId();
        }
        if (waiter.getTimeApplied() != null) {
            this.timeApplied = waiter.getTimeApplied();
        }
    }
}
