package com.devmountain.courseScheduler.repositories;

import com.devmountain.courseScheduler.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    List<User> findAllByPermissionGreaterThanEqual(Integer permission);
}
