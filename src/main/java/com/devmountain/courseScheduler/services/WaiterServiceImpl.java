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

    @Override
    @Transactional
    public List<String> updateWaiter(WaiterDto waiterDto) {
        List<String> response = new ArrayList<>();
        Optional<Waiter> waiterOptional = waiterRepository.findById(waiterDto.getId());
        waiterOptional.ifPresent(waiter -> {
            waiter.setTimeApplied(waiterDto.getTimeApplied());
            waiterRepository.saveAndFlush(waiter);
        });
        response.add("Waiter Updated");
        return response;
    }

    @Override
    @Transactional
    public List<String> deleteWaiterById(Long waiterId) {
        List<String> response = new ArrayList<>();
        Optional<Waiter> waiterOptional = waiterRepository.findById(waiterId);
        waiterOptional.ifPresent(waiter -> waiterRepository.delete(waiter));
        response.add("Waiter Deleted");
        return response;
    }

    @Override
    @Transactional
    public List<String> deleteAllWaitersByUserId(Long userId) {
        List<String> response = new ArrayList<>();
        Optional<User> userOptional = userRepository.findById(userId);

        List<Waiter> waiters = Collections.emptyList();
        if (userOptional.isPresent()) {
            waiters = waiterRepository.findAllByUser(userOptional.get());
        }

        for (Waiter waiter : waiters) {
            waiterRepository.delete(waiter);
        }

        response.add("Waiters Deleted");
        return response;
    }

    @Override
    @Transactional
    public List<String> deleteAllWaitersByCourseId(Long courseId) {
        List<String> response = new ArrayList<>();
        Optional<Course> courseOptional = courseRepository.findById(courseId);

        List<Waiter> waiters = Collections.emptyList();
        if (courseOptional.isPresent()) {
            waiters = waiterRepository.findAllByCourse(courseOptional.get());
        }

        for (Waiter waiter : waiters) {
            waiterRepository.delete(waiter);
        }

        response.add("Waiters Deleted");
        return response;
    }

    @Override
    public List<WaiterDto> getAllWaiters() {
        List<Waiter> waiters = waiterRepository.findAll();
        return waiters.stream().map(waiter -> new WaiterDto(waiter)).collect(Collectors.toList());
    }

    @Override
    public List<WaiterDto> getWaitersByUser(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            List<Waiter> waiters = waiterRepository.findAllByUser(userOptional.get());
            return waiters.stream().map(waiter -> new WaiterDto(waiter)).collect(Collectors.toList());
        }

        return Collections.emptyList();
    }

    @Override
    public List<WaiterDto> getWaitersByCourse(Long courseId) {
        Optional<Course> courseOptional = courseRepository.findById(courseId);

        if (courseOptional.isPresent()) {
            List<Waiter> waiters = waiterRepository.findAllByCourse(courseOptional.get());
            return waiters.stream().map(waiter -> new WaiterDto(waiter)).collect(Collectors.toList());
        }

        return Collections.emptyList();
    }

    @Override
    public Optional<WaiterDto> getWaiterById(Long waiterId) {
        Optional<Waiter> waiterOptional = waiterRepository.findById(waiterId);

        if (waiterOptional.isPresent()) {
            return Optional.of(new WaiterDto(waiterOptional.get()));
        }

        return Optional.empty();
    }
}