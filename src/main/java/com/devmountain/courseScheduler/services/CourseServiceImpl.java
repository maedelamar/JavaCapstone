package com.devmountain.courseScheduler.services;

import com.devmountain.courseScheduler.dtos.CourseDto;
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
public class CourseServiceImpl implements CourseService {
    @Autowired
    private CourseRepository courseRepository;

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

    @Override
    @Transactional
    public List<String> addCourse(CourseDto courseDto, Long instructorId) {
        List<String> response = new ArrayList<>();
        Optional<User> instructorOptional = userRepository.findById(instructorId);
        Course course = new Course(courseDto);
        instructorOptional.ifPresent(course::setInstructor);
        courseRepository.saveAndFlush(course);
        response.add("Course Added Successfully");
        return response;
    }

    @Override
    @Transactional
    public List<String> deleteCourseById(Long courseId) {
        List<String> response = new ArrayList<>();
        Optional<Course> courseOptional = courseRepository.findById(courseId);
        courseOptional.ifPresent(course -> {
            courseRepository.delete(course);
        });
        response.add("Course Deleted");
        return response;
    }

    @Override
    @Transactional
    public List<String> updateCourse(CourseDto courseDto) {
        List<String> response = new ArrayList<>();
        Optional<Course> courseOptional = courseRepository.findById(courseDto.getId());
        courseOptional.ifPresent(course -> {
            course.setName(course.getName());
            course.setDescription(course.getDescription());
            course.setNumber(course.getNumber());
            course.setCategory(course.getCategory());
            course.setSize(course.getSize());
            course.setTime(course.getTime());
            course.setLocation(course.getLocation());
            courseRepository.saveAndFlush(course);
        });
        response.add("Course Updated");
        return response;
    }

    @Override
    public List<CourseDto> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        return courses.stream().map(course -> new CourseDto(course)).collect(Collectors.toList());
    }

    @Override
    public List<CourseDto> getCoursesByInstructor(Long instructorId) {
        Optional<User> instructorOptional = userRepository.findById(instructorId);

        if (instructorOptional.isPresent()) {
            List<Course> courseList = courseRepository.findAllByInstructor(instructorOptional.get());
            return courseList.stream().map(course -> new CourseDto(course)).collect(Collectors.toList());
        }

        return Collections.emptyList();
    }

    @Override
    public Optional<CourseDto> getCourseById(Long courseId) {
        Optional<Course> courseOptional = courseRepository.findById(courseId);

        if (courseOptional.isPresent()) {
            return Optional.of(new CourseDto(courseOptional.get()));
        }

        return Optional.empty();
    }
}
