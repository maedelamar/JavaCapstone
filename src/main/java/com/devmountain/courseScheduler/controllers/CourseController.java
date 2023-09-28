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

    //Add a new course
    @PostMapping("/{instructorId}")
    public List<String> addCourse(@RequestBody CourseDto courseDto, @PathVariable Long instructorId) {
        return courseService.addCourse(courseDto, instructorId);
    }

    //Update a course
    @PutMapping
    public List<String> updateCourse(@RequestBody CourseDto courseDto) {
        return courseService.updateCourse(courseDto);
    }

    //Delete a course
    @DeleteMapping("/{courseId}")
    public List<String> deleteCourseById(@PathVariable Long courseId) {
        return courseService.deleteCourseById(courseId);
    }

    //Get all courses
    @GetMapping
    public List<CourseDto> getAllCourses() {
        return courseService.getAllCourses();
    }

    //Get all courses where the user is the instructor
    @GetMapping("/instructor/{instructorId}")
    public List<CourseDto> getCoursesByInstructor(@PathVariable Long instructorId) {
        return courseService.getCoursesByInstructor(instructorId);
    }

    //Get a course by its id
    @GetMapping("/{courseId}")
    public Optional<CourseDto> getCourseById(@PathVariable Long courseId) {
        return courseService.getCourseById(courseId);
    }

    //Get the highest course number
    @GetMapping("/number/highest")
    public Long getHighestCourseNumber() {
        return courseService.getHighestCourseNumber();
    }

    //Get upcoming courses
    @GetMapping("/sorted/upcoming")
    public List<CourseDto> getUpcomingCourses() {
        return courseService.getUpcomingCourses();
    }

    //Get search results
    @GetMapping("/filtered/search")
    public List<CourseDto> getSearchedCourses(@RequestParam String search) {
        return courseService.getSearchedCourses(search);
    }

    //Get user's courses on a certain date
    @GetMapping("/date/user/{userId}")
    public List<CourseDto> getCoursesByDateAndUser(@RequestParam String date, @PathVariable Long userId) {
        return courseService.getCoursesByDateAndUser(date, userId);
    }

    //Get user's past courses
    @GetMapping("/user/{userId}/past")
    public List<CourseDto> getPastCourses(@PathVariable Long userId) {
        return courseService.getPastCourses(userId);
    }

    //Get latest course with a given number
    @GetMapping("/byNumber/{number}")
    public Optional<CourseDto> getLatestCourseSharingNumber(@PathVariable Long number) {
        return courseService.getLatestCourseSharingNumber(number);
    }

    //Get average rating for a course of a given number
    @GetMapping("/number/{number}/rating")
    public Double getAvgRatingByNumber(@PathVariable Long number) {
         return courseService.getAvgRatingByNumber(number);
    }
}
