package com.devmountain.courseScheduler.repositories;

import com.devmountain.courseScheduler.entities.Course;
import com.devmountain.courseScheduler.entities.User;
import com.devmountain.courseScheduler.entities.Waiter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WaiterRepository extends JpaRepository<Waiter, Long> {
    List<Waiter> findAllByUser(User user); //find all waiters by user

    List<Waiter> findAllByCourse(Course course); //get the waiting list for a course

    Optional<Waiter> findTopByCourse(Course course); //find first waiter in a course's waiting list
}
