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

    //Create a waiter
    @PostMapping("/{courseId}/{userId}")
    public List<String> addWaiter(@RequestBody WaiterDto waiterDto, @PathVariable Long userId, @PathVariable Long courseId) {
        return waiterService.addWaiter(waiterDto, userId, courseId);
    }

    //Delete a waiter
    @DeleteMapping("/{waiterId}")
    public List<String> deleteWaiterById(@PathVariable Long waiterId) {
        return waiterService.deleteWaiterById(waiterId);
    }

    //Get all waiters
    @GetMapping
    public List<WaiterDto> getAllWaiters() {
        return waiterService.getAllWaiters();
    }

    //Get waiters by a given user
    @GetMapping("/user/{userId}")
    public List<WaiterDto> getWaitersByUser(@PathVariable Long userId) {
        return waiterService.getWaitersByUser(userId);
    }

    //Get the waiting list for a course
    @GetMapping("/course/{courseId}")
    public List<WaiterDto> getWaitersByCourse(@PathVariable Long courseId) {
        return waiterService.getWaitersByCourse(courseId);
    }

    //Get a waiter by id
    @GetMapping("/{waiterId}")
    public Optional<WaiterDto> getWaiterById(@PathVariable Long waiterId) {
        return waiterService.getWaiterById(waiterId);
    }
}