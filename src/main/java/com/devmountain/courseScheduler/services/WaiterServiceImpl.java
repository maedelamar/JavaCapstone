package com.devmountain.courseScheduler.services;

import com.devmountain.courseScheduler.dtos.WaiterDto;
import com.devmountain.courseScheduler.entities.Course;
import com.devmountain.courseScheduler.entities.User;
import com.devmountain.courseScheduler.entities.Waiter;
import com.devmountain.courseScheduler.repositories.CourseRepository;
import com.devmountain.courseScheduler.repositories.UserRepository;
import com.devmountain.courseScheduler.repositories.WaiterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WaiterServiceImpl implements WaiterService {
    @Autowired
    private WaiterRepository waiterRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    //Add a user to a course's waiting list
    @Override
    @Transactional
    public List<String> addWaiter(WaiterDto waiterDto, Long userId, Long courseId) {
        List<String> response = new ArrayList<>();

        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Course> courseOptional = courseRepository.findById(courseId);

        Waiter waiter = new Waiter(waiterDto);
        userOptional.ifPresent(waiter::setUser);
        courseOptional.ifPresent(waiter::setCourse);

        waiterRepository.saveAndFlush(waiter);
        response.add("Waiter Added");
        return response;
    }

    //Remove a user from a course's waiting list
    @Override
    @Transactional
    public List<String> deleteWaiterById(Long waiterId) {
        List<String> response = new ArrayList<>();
        Optional<Waiter> waiterOptional = waiterRepository.findById(waiterId);
        waiterOptional.ifPresent(waiter -> waiterRepository.delete(waiter));
        response.add("Waiter Deleted");
        return response;
    }

    //Get the every user in the waiting list
    @Override
    public List<WaiterDto> getAllWaiters() {
        List<Waiter> waiters = waiterRepository.findAll();
        return waiters.stream().map(waiter -> new WaiterDto(waiter)).collect(Collectors.toList());
    }

    //Get all instances of the user in the waiting list
    @Override
    public List<WaiterDto> getWaitersByUser(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            List<Waiter> waiters = waiterRepository.findAllByUser(userOptional.get());
            return waiters.stream().map(waiter -> new WaiterDto(waiter)).collect(Collectors.toList());
        }

        return Collections.emptyList();
    }

    //Get a course's waiting list
    @Override
    public List<WaiterDto> getWaitersByCourse(Long courseId) {
        Optional<Course> courseOptional = courseRepository.findById(courseId);

        if (courseOptional.isPresent()) {
            List<Waiter> waiters = waiterRepository.findAllByCourse(courseOptional.get());
            return waiters.stream().map(waiter -> new WaiterDto(waiter)).collect(Collectors.toList());
        }

        return Collections.emptyList();
    }

    //Get a spot in the waiting list by waiter id
    @Override
    public Optional<WaiterDto> getWaiterById(Long waiterId) {
        Optional<Waiter> waiterOptional = waiterRepository.findById(waiterId);

        if (waiterOptional.isPresent()) {
            return Optional.of(new WaiterDto(waiterOptional.get()));
        }

        return Optional.empty();
    }
}