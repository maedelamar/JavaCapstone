package com.devmountain.courseScheduler.services;

import com.devmountain.courseScheduler.dtos.WaiterDto;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface WaiterService {
    @Transactional
    List<String> addWaiter(WaiterDto waiterDto, Long userId, Long courseId);

    @Transactional
    List<String> deleteWaiterById(Long waiterId);

    @Transactional
    List<String> deleteAllWaitersByUserId(Long userId);

    @Transactional
    List<String> deleteAllWaitersByCourseId(Long courseId);

    List<WaiterDto> getAllWaiters();

    List<WaiterDto> getWaitersByUser(Long userId);

    List<WaiterDto> getWaitersByCourse(Long courseId);

    Optional<WaiterDto> getWaiterById(Long waiterId);
}
