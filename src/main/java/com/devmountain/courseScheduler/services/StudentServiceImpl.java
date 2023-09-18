package com.devmountain.courseScheduler.services;

import com.devmountain.courseScheduler.dtos.StudentDto;
import com.devmountain.courseScheduler.entities.Course;
import com.devmountain.courseScheduler.entities.Student;
import com.devmountain.courseScheduler.entities.User;
import com.devmountain.courseScheduler.repositories.CourseRepository;
import com.devmountain.courseScheduler.repositories.StudentRepository;
import com.devmountain.courseScheduler.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Override
    @Transactional
    public List<String> addStudent(StudentDto studentDto, Long userId, Long courseId) {
        List<String> response = new ArrayList<>();

        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Course> courseOptional = courseRepository.findById(courseId);

        Student student = new Student(studentDto);
        userOptional.ifPresent(student::setUser);
        courseOptional.ifPresent(student::setCourse);

        studentRepository.saveAndFlush(student);
        response.add("Student Added");
        return response;
    }

    @Override
    @Transactional
    public List<String> updateStudent(StudentDto studentDto) {
        List<String> response = new ArrayList<>();
        Optional<Student> studentOptional = studentRepository.findById(studentDto.getId());
        studentOptional.ifPresent(student -> {
            student.setAttended(student.getAttended());
            student.setRating(student.getRating());
            studentRepository.saveAndFlush(student);
        });
        response.add("Student Updated");
        return response;
    }

    @Override
    @Transactional
    public List<String> deleteStudentById(Long studentId) {
        List<String> response = new ArrayList<>();
        Optional<Student> studentOptional = studentRepository.findById(studentId);
        studentOptional.ifPresent(student -> studentRepository.delete(student));
        response.add("Student Deleted");
        return response;
    }

    @Override
    @Transactional
    public List<String> deleteAllStudentsByUserId(Long userId) {
        List<String> response = new ArrayList<>();
        Optional<User> userOptional = userRepository.findById(userId);

        List<Student> students = Collections.emptyList();
        if (userOptional.isPresent()) {
            students = studentRepository.findAllByUser(userOptional.get());
        }

        for (Student student : students) {
            studentRepository.delete(student);
        }

        response.add("Students Deleted");
        return response;
    }

    @Override
    @Transactional
    public List<String> deleteAllStudentsByCourseId(Long courseId) {
        List<String> response = new ArrayList<>();
        Optional<Course> courseOptional = courseRepository.findById(courseId);

        List<Student> students = Collections.emptyList();
        if (courseOptional.isPresent()) {
            students = studentRepository.findAllByCourse(courseOptional.get());
        }

        for (Student student : students) {
            studentRepository.delete(student);
        }

        response.add("Students Deleted");
        return response;
    }

    @Override
    public List<StudentDto> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        return students.stream().map(student -> new StudentDto(student)).collect(Collectors.toList());
    }

    @Override
    public List<StudentDto> getStudentsByUserId(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            List<Student> students = studentRepository.findAllByUser(userOptional.get());
            return students.stream().map(student -> new StudentDto(student)).collect(Collectors.toList());
        }

        return Collections.emptyList();
    }

    @Override
    public List<StudentDto> getStudentsByCourseId(Long courseId) {
        Optional<Course> courseOptional = courseRepository.findById(courseId);

        if (courseOptional.isPresent()) {
            List<Student> students = studentRepository.findAllByCourse(courseOptional.get());
            return students.stream().map(student -> new StudentDto(student)).collect(Collectors.toList());
        }

        return Collections.emptyList();
    }

    @Override
    public Optional<StudentDto> getStudentById(Long studentId) {
        Optional<Student> studentOptional = studentRepository.findById(studentId);

        if (studentOptional.isPresent()) {
            return Optional.of(new StudentDto(studentOptional.get()));
        }

        return Optional.empty();
    }
}