package com.devmountain.courseScheduler.repositories;

import com.devmountain.courseScheduler.entities.Course;
import com.devmountain.courseScheduler.entities.Student;
import com.devmountain.courseScheduler.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findAllByUser(User user);

    List<Student> findAllByCourse(Course course);

    Long countByCourse(Course course);

    Long countByCourseAndAttended(Course course, boolean attended);

    Optional<Student> findByUserAndCourse(User user, Course course);
}