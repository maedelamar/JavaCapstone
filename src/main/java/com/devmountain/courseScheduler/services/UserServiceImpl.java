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

import java.util.ArrayList;
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
    private StudentService studentService;

    @Autowired
    private WaiterRepository waiterRepository;

    @Autowired
    private WaiterService waiterService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public List<String> addUser(UserDto userDto) {
        List<String> response = new ArrayList<>();
        User user = new User(userDto);
        userRepository.saveAndFlush(user);
        response.add("User added successfully.");
        return response;
    }

    @Override
    public List<String> login(UserDto userDto) {
        List<String> response = new ArrayList<>();
        Optional<User> userOptional = userRepository.findByEmail(userDto.getEmail());

        if (userOptional.isPresent()) {
            if (passwordEncoder.matches(userDto.getPassword(), userOptional.get().getPassword())) {
                response.add("User Login Successful");
                response.add(String.valueOf(userOptional.get().getId()));
            } else {
                response.add("Email or Password Incorrect");
            }
        } else {
            response.add("Email or Password Incorrect");
        }

        return response;
    }

    @Override
    @Transactional
    public List<String> updateUser(UserDto userDto) {
        List<String> response = new ArrayList<>();
        Optional<User> userOptional = userRepository.findById(userDto.getId());
        userOptional.ifPresent(user -> {
            user.setEmail(user.getEmail());
            user.setPassword(user.getPassword());
            user.setFirstName(user.getFirstName());
            user.setLastName(user.getLastName());
            user.setPermission(user.getPermission());
            userRepository.saveAndFlush(user);
        });
        response.add("User Updated");
        return response;
    }

    @Override
    @Transactional
    public List<String> deleteUserById(Long userId) {
        List<String> response = new ArrayList<>();
        Optional<User> userOptional = userRepository.findById(userId);
        userOptional.ifPresent(user -> {
            userRepository.delete(user);
        });
        response.add("User Deleted");
        return response;
    }

    @Override
    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(user -> new UserDto(user)).collect(Collectors.toList());
    }

    @Override
    public Optional<UserDto> getUserById(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            return Optional.of(new UserDto(userOptional.get()));
        }

        return Optional.empty();
    }
}
