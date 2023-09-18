package com.devmountain.courseScheduler.controllers;

import com.devmountain.courseScheduler.dtos.CourseDto;
import com.devmountain.courseScheduler.services.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/courses")
public class CourseController {
    @Autowired
    private CourseService courseService;

    @PostMapping("/{instructorId}")
    public List<String> addCourse(@RequestBody CourseDto courseDto, @PathVariable Long instructorId) {
        return courseService.addCourse(courseDto, instructorId);
    }

    @PutMapping
    public List<String> updateCourse(@RequestBody CourseDto courseDto) {
        return courseService.updateCourse(courseDto);
    }

    @DeleteMapping("/{courseId}")
    public List<String> deleteCourseById(@PathVariable Long courseId) {
        return courseService.deleteCourseById(courseId);
    }

    @GetMapping
    public List<CourseDto> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/instructor/{instructorId}")
    public List<CourseDto> getCoursesByInstructor(@PathVariable Long instructorId) {
        return courseService.getCoursesByInstructor(instructorId);
    }

    @GetMapping("/{courseId}")
    public Optional<CourseDto> getCourseById(@PathVariable Long courseId) {
        return courseService.getCourseById(courseId);
    }
}
