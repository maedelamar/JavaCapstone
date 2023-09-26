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

    @PostMapping("/register")
    public List<String> addUser(@RequestBody UserDto userDto) {
        String passHash = passwordEncoder.encode(userDto.getPassword());
        userDto.setPassword(passHash);
        return userService.addUser(userDto);
    }

    @PostMapping("/login")
    public List<String> login(@RequestBody UserDto userDto) {
        return userService.login(userDto);
    }

    @PutMapping
    public List<String> updateUser(@RequestBody UserDto userDto) {
        return userService.updateUser(userDto);
    }

    @DeleteMapping("/{userId}")
    public List<String> deleteUserById(@PathVariable Long userId) {
        return userService.deleteUserById(userId);
    }

    @GetMapping
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{userId}")
    public Optional<UserDto> getUserById(@PathVariable Long userId) {
        return userService.getUserById(userId);
    }

    @GetMapping("/student/{studentId}")
    public Optional<UserDto> getUserByStudentId(@PathVariable Long studentId) {
        return userService.getUserByStudentId(studentId);
    }

    @GetMapping("/permission/admins")
    public List<UserDto> getAdmins() {
        return userService.getAdmins();
    }

    @GetMapping("/email/{email}")
    public Optional<UserDto> getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }
}