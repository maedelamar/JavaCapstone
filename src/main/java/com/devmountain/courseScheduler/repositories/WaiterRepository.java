package com.devmountain.courseScheduler.repositories;

import com.devmountain.courseScheduler.entities.Course;
import com.devmountain.courseScheduler.entities.User;
import com.devmountain.courseScheduler.entities.Waiter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WaiterRepository extends JpaRepository<Waiter, Long> {
    List<Waiter> findAllByUser(User user);

    List<Waiter> findAllByCourse(Course course);
}
