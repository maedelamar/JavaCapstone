package com.devmountain.courseScheduler.repositories;

import com.devmountain.courseScheduler.entities.Course;
import com.devmountain.courseScheduler.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findAllByInstructor(User instructor);
}
