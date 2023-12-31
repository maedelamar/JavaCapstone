package com.devmountain.courseScheduler.dtos;

import com.devmountain.courseScheduler.entities.Waiter;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WaiterDto implements Serializable {
    private Long id;

    public WaiterDto(Waiter waiter) {
        if (waiter.getId() != null) {
            this.id = waiter.getId();
        }
    }
}
