package com.devmountain.courseScheduler.services;

import com.devmountain.courseScheduler.dtos.UserDto;
import com.devmountain.courseScheduler.entities.Student;
import com.devmountain.courseScheduler.entities.User;
import com.devmountain.courseScheduler.entities.Waiter;
import com.devmountain.courseScheduler.repositories.StudentRepository;
import com.devmountain.courseScheduler.repositories.UserRepository;
import com.devmountain.courseScheduler.repositories.WaiterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private WaiterRepository waiterRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    //Add a new user
    @Override
    @Transactional
    public List<String> addUser(UserDto userDto) {
        List<String> response = new ArrayList<>();
        User user = new User(userDto);
        userRepository.saveAndFlush(user);
        response.add("User added successfully.");
        return response;
    }

    //Log in to the application
    @Override
    public List<String> login(UserDto userDto) {
        List<String> response = new ArrayList<>();
        Optional<User> userOptional = userRepository.findByEmail(userDto.getEmail());

        if (userOptional.isPresent()) {
            if (passwordEncoder.matches(userDto.getPassword(), userOptional.get().getPassword())) { //make sure info matches
                response.add("User Login Successful");
                response.add(String.valueOf(userOptional.get().getId()));
                response.add(String.valueOf(userOptional.get().getPermission()));
            } else {
                response.add("Email or Password Incorrect");
            }
        } else {
            response.add("Email or Password Incorrect");
        }

        return response;
    }

    //Update a user
    @Override
    @Transactional
    public List<String> updateUser(UserDto userDto) {
        List<String> response = new ArrayList<>();
        Optional<User> userOptional = userRepository.findById(userDto.getId());
        userOptional.ifPresent(user -> {
            if (userDto.getEmail() != null) {
                user.setEmail(userDto.getEmail());
            }
            if (userDto.getPassword() != null) {
                user.setPassword(userDto.getPassword());
            }
            if (userDto.getFirstName() != null) {
                user.setFirstName(userDto.getFirstName());
            }
            if (userDto.getLastName() != null) {
                user.setLastName(userDto.getLastName());
            }
            if (userDto.getPermission() != null) {
                user.setPermission(userDto.getPermission());
            }

            userRepository.saveAndFlush(user);
        });
        response.add("User Updated");
        return response;
    }

    //Delete a user
    @Override
    @Transactional
    public List<String> deleteUserById(Long userId) {
        List<String> response = new ArrayList<>();
        Optional<User> userOptional = userRepository.findById(userId);
        userOptional.ifPresent(user -> {
            List<Student> userAsStudentList = studentRepository.findAllByUser(user);
            List<Waiter> userAsWaiterList = waiterRepository.findAllByUser(user);

            studentRepository.deleteAll(userAsStudentList);
            waiterRepository.deleteAll(userAsWaiterList);

            userRepository.delete(user);
        });
        response.add("User Deleted");
        return response;
    }

    //Get all users
    @Override
    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(user -> new UserDto(user)).collect(Collectors.toList());
    }

    //Get a user by their id
    @Override
    public Optional<UserDto> getUserById(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            return Optional.of(new UserDto(userOptional.get()));
        }

        return Optional.empty();
    }

    //Get a student's user id
    @Override
    public Optional<UserDto> getUserByStudentId(Long studentId) {
        Optional<Student> studentOptional = studentRepository.findById(studentId);

        if (studentOptional.isPresent()) {
            Optional<User> userOptional = userRepository.findById(studentOptional.get().getUser().getId());

            if (userOptional.isPresent()) {
                return Optional.of(new UserDto(userOptional.get()));
            }
        }

        return Optional.empty();
    }

    //Get all users with permission >= 2
    @Override
    public List<UserDto> getAdmins() {
        List<User> users = userRepository.findAllByPermissionGreaterThanEqual(2);
        return users.stream().map(user -> new UserDto(user)).toList();
    }

    //Get a user by their unique email
    @Override
    public Optional<UserDto> getUserByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            return Optional.of(new UserDto(userOptional.get()));
        }
        return Optional.empty();
    }
}