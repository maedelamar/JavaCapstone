package com.devmountain.courseScheduler.repositories;

import com.devmountain.courseScheduler.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email); //find user by unique email

    List<User> findAllByPermissionGreaterThanEqual(Integer permission); //find all users with permission higher than a given number
}