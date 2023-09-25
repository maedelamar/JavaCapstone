package com.devmountain.courseScheduler.services;

import com.devmountain.courseScheduler.dtos.CourseDto;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CourseService {
    @Transactional
    List<String> addCourse(CourseDto courseDto, Long instructorId);

    @Transactional
    List<String> deleteCourseById(Long courseId);

    @Transactional
    List<String> updateCourse(CourseDto courseDto);

    List<CourseDto> getAllCourses();

    List<CourseDto> getCoursesByInstructor(Long instructorId);

    Optional<CourseDto> getCourseById(Long courseId);

    Long getHighestCourseNumber();

    List<CourseDto> getUpcomingCourses();

    List<CourseDto> getSearchedCourses(String search);

    List<CourseDto> getCoursesByDateAndUser(String dateAsString, Long userId);

    List<CourseDto> getPastCourses(Long userId);
}
