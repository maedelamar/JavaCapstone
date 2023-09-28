package com.devmountain.courseScheduler.repositories;

import com.devmountain.courseScheduler.entities.Course;
import com.devmountain.courseScheduler.entities.Student;
import com.devmountain.courseScheduler.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findAllByUser(User user); //find student list of a user

    List<Student> findAllByCourse(Course course); //find all students in a course

    Long countByCourse(Course course); //count the number of students in a course

    Long countByCourseAndAttended(Course course, boolean attended); // count the number of students who attended a course

    Optional<Student> findByUserAndCourse(User user, Course course); //find student by user and course
}