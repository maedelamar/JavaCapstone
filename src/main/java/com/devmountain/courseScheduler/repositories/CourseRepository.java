package com.devmountain.courseScheduler.repositories;

import com.devmountain.courseScheduler.entities.Course;
import com.devmountain.courseScheduler.entities.Student;
import com.devmountain.courseScheduler.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findAllByInstructor(User instructor); //get all courses where user is the instructor

    List<Course> findAllByNameContainsIgnoreCaseOrderByStartTime(String search); //get search results

    List<Course> findAllByNumber(Long number); //find all courses with a given number

    Optional<Course> findTopByOrderByNumberDesc(); //find highest number

    List<Course> findAllByStartTimeGreaterThanOrderByStartTime(LocalDateTime time); //find upcoming courses

    Optional<Course> findTopByNumberOrderByStartTimeDesc(Long number); //find latest course by number
}
