package com.devmountain.courseScheduler.controllers;

import com.devmountain.courseScheduler.dtos.WaiterDto;
import com.devmountain.courseScheduler.services.WaiterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/waitingList")
public class WaiterController {
    @Autowired
    private WaiterService waiterService;

    @PostMapping("/{courseId}/{userId}")
    public List<String> addWaiter(@RequestBody WaiterDto waiterDto, @PathVariable Long userId, @PathVariable Long courseId) {
        return waiterService.addWaiter(waiterDto, userId, courseId);
    }

    @DeleteMapping("/{waiterId}")
    public List<String> deleteWaiterById(@PathVariable Long waiterId) {
        return waiterService.deleteWaiterById(waiterId);
    }

    @GetMapping
    public List<WaiterDto> getAllWaiters() {
        return waiterService.getAllWaiters();
    }

    @GetMapping("/user/{userId}")
    public List<WaiterDto> getWaitersByUser(@PathVariable Long userId) {
        return waiterService.getWaitersByUser(userId);
    }

    @GetMapping("/course/{courseId}")
    public List<WaiterDto> getWaitersByCourse(@PathVariable Long courseId) {
        return waiterService.getWaitersByCourse(courseId);
    }

    @GetMapping("/{waiterId}")
    public Optional<WaiterDto> getWaiterById(@PathVariable Long waiterId) {
        return waiterService.getWaiterById(waiterId);
    }
}