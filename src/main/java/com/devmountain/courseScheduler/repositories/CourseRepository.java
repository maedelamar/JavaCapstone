package com.devmountain.courseScheduler.repositories;

import com.devmountain.courseScheduler.entities.Course;
import com.devmountain.courseScheduler.entities.Student;
import com.devmountain.courseScheduler.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findAllByInstructor(User instructor);

    List<Course> findAllByNameContainsIgnoreCaseOrderByStartTimeDesc(String search);

    Optional<Course> findTopByOrderByNumberDesc();

    List<Course> findAllByStartTimeGreaterThanOrderByStartTimeDesc(LocalDateTime time);
}
