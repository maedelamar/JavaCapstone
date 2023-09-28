package com.devmountain.courseScheduler.services;

import com.devmountain.courseScheduler.dtos.StudentDto;
import com.devmountain.courseScheduler.entities.Course;
import com.devmountain.courseScheduler.entities.Student;
import com.devmountain.courseScheduler.entities.User;
import com.devmountain.courseScheduler.entities.Waiter;
import com.devmountain.courseScheduler.repositories.CourseRepository;
import com.devmountain.courseScheduler.repositories.StudentRepository;
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
public class StudentServiceImpl implements StudentService {
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private WaiterRepository waiterRepository;

    //Add a student to a course
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

    //Add a student to a course from the waiting list
    @Override
    @Transactional
    public void addFromWaitingList() {
        List<String> response = new ArrayList<>();

        List<Course> courses = courseRepository.findAll();
        if (!courses.isEmpty()) {
            for (Course course : courses) {
                if (studentRepository.countByCourse(course) >= course.getSize()) {
                    continue;
                }

                Optional<Waiter> waiterOptional = waiterRepository.findTopByCourse(course);
                if (waiterOptional.isPresent()) {
                    Optional<User> userOptional = userRepository.findById(waiterOptional.get().getUser().getId());

                    Student student = new Student();
                    student.setAttended(false);
                    student.setCourse(course);
                    userOptional.ifPresent(student::setUser);

                    waiterOptional.ifPresent(waiter -> waiterRepository.delete(waiter));

                    studentRepository.saveAndFlush(student);
                }
            }
        }
    }

    //Update a student's attendance or rating
    @Override
    @Transactional
    public List<String> updateStudent(StudentDto studentDto) {
        List<String> response = new ArrayList<>();
        Optional<Student> studentOptional = studentRepository.findById(studentDto.getId());
        studentOptional.ifPresent(student -> {
            if (studentDto.getAttended() != null) {
                student.setAttended(studentDto.getAttended());
            }
            if (studentDto.getRating() != null) {
                student.setRating(studentDto.getRating());
            }

            studentRepository.saveAndFlush(student);
        });
        response.add("Student Updated");
        return response;
    }

    //Delete a student from a course
    @Override
    @Transactional
    public List<String> deleteStudentById(Long studentId) {
        List<String> response = new ArrayList<>();
        Optional<Student> studentOptional = studentRepository.findById(studentId);
        studentOptional.ifPresent(student -> studentRepository.delete(student));
        response.add("Student Deleted");
        return response;
    }

    //Get a list of all students
    @Override
    public List<StudentDto> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        return students.stream().map(student -> new StudentDto(student)).collect(Collectors.toList());
    }

    //Get a list of students by their user id
    @Override
    public List<StudentDto> getStudentsByUserId(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            List<Student> students = studentRepository.findAllByUser(userOptional.get());
            return students.stream().map(student -> new StudentDto(student)).collect(Collectors.toList());
        }

        return Collections.emptyList();
    }

    //Get all students in a given course
    @Override
    public List<StudentDto> getStudentsByCourseId(Long courseId) {
        Optional<Course> courseOptional = courseRepository.findById(courseId);

        if (courseOptional.isPresent()) {
            List<Student> students = studentRepository.findAllByCourse(courseOptional.get());
            students.sort((o1, o2) -> o2.getUser().getLastName().compareTo(o1.getUser().getLastName()));
            return students.stream().map(student -> new StudentDto(student)).collect(Collectors.toList());
        }

        return Collections.emptyList();
    }

    //Get a student by their student id
    @Override
    public Optional<StudentDto> getStudentById(Long studentId) {
        Optional<Student> studentOptional = studentRepository.findById(studentId);

        if (studentOptional.isPresent()) {
            return Optional.of(new StudentDto(studentOptional.get()));
        }

        return Optional.empty();
    }

    //Get the number of students in a course
    @Override
    public Long getCountCourse(Long courseId) {
        Optional<Course> courseOptional = courseRepository.findById(courseId);

        if (courseOptional.isPresent()) {
            return studentRepository.countByCourse(courseOptional.get());
        } else {
            return 0L;
        }
    }

    //Get the number of students who attended a course
    @Override
    public Long getCountAttended(Long courseId) {
        Optional<Course> courseOptional = courseRepository.findById(courseId);

        if (courseOptional.isPresent()) {
            return studentRepository.countByCourseAndAttended(courseOptional.get(), true);
        } else {
            return 0L;
        }
    }

    //Get a student from their unique combination of user and course
    @Override
    public Optional<StudentDto> getStudentFromUserAndCourse(Long userId, Long courseId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Course> courseOptional = courseRepository.findById(courseId);

        if (userOptional.isPresent() && courseOptional.isPresent()) {
            Optional<Student> studentOptional =
                    studentRepository.findByUserAndCourse(userOptional.get(), courseOptional.get());

            if (studentOptional.isPresent()) {
                return Optional.of(new StudentDto(studentOptional.get()));
            }
        }

        return Optional.empty();
    }
}