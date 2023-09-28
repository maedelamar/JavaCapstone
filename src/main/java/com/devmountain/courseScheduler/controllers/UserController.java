package com.devmountain.courseScheduler.controllers;

import com.devmountain.courseScheduler.dtos.UserDto;
import com.devmountain.courseScheduler.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    //Register
    @PostMapping("/register")
    public List<String> addUser(@RequestBody UserDto userDto) {
        String passHash = passwordEncoder.encode(userDto.getPassword());
        userDto.setPassword(passHash);
        return userService.addUser(userDto);
    }

    //Login
    @PostMapping("/login")
    public List<String> login(@RequestBody UserDto userDto) {
        return userService.login(userDto);
    }

    //Update a user
    @PutMapping
    public List<String> updateUser(@RequestBody UserDto userDto) {
        return userService.updateUser(userDto);
    }

    //Delete a user
    @DeleteMapping("/{userId}")
    public List<String> deleteUserById(@PathVariable Long userId) {
        return userService.deleteUserById(userId);
    }

    //Get all users
    @GetMapping
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers();
    }

    //Get a user by id
    @GetMapping("/{userId}")
    public Optional<UserDto> getUserById(@PathVariable Long userId) {
        return userService.getUserById(userId);
    }

    //Get a user by a student id
    @GetMapping("/student/{studentId}")
    public Optional<UserDto> getUserByStudentId(@PathVariable Long studentId) {
        return userService.getUserByStudentId(studentId);
    }

    //Get all users with permission >= 2
    @GetMapping("/permission/admins")
    public List<UserDto> getAdmins() {
        return userService.getAdmins();
    }

    //Get user by email
    @GetMapping("/email/{email}")
    public Optional<UserDto> getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }
}