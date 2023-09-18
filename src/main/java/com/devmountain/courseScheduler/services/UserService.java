package com.devmountain.courseScheduler.services;

import com.devmountain.courseScheduler.dtos.UserDto;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<String> addUser(UserDto userDto);

    List<String> login(UserDto userDto);

    List<String> updateUser(UserDto userDto);

    List<String> deleteUserById(Long userId);

    List<UserDto> getAllUsers();

    Optional<UserDto> getUserById(Long userId);
}
