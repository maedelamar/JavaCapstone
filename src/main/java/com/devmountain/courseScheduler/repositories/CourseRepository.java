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
    List<Course> findAllByInstructor(User instructor);

    List<Course> findAllByNameContainsIgnoreCaseOrderByStartTime(String search);

    List<Course> findAllByNumber(Long number);

    Optional<Course> findTopByOrderByNumberDesc();

    List<Course> findAllByStartTimeGreaterThanOrderByStartTime(LocalDateTime time);

    Optional<Course> findTopByNumberOrderByStartTimeDesc(Long number);
}
