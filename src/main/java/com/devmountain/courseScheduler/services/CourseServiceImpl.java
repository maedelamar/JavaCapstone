package com.devmountain.courseScheduler.services;

import com.devmountain.courseScheduler.dtos.CourseDto;
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

import java.time.LocalDateTime;
import java.util.*;
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
            List<Student> studentsInCourse = studentRepository.findAllByCourse(course);
            List<Waiter> courseWaitingList = waiterRepository.findAllByCourse(course);

            studentRepository.deleteAll(studentsInCourse);
            waiterRepository.deleteAll(courseWaitingList);

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
            if (courseDto.getName() != null) {
                course.setName(courseDto.getName());
            }
            if (courseDto.getDescription() != null) {
                course.setDescription(courseDto.getDescription());
            }
            if (courseDto.getNumber() != null) {
                course.setNumber(courseDto.getNumber());
            }
            if (courseDto.getImageURL() != null) {
                course.setImageURL(courseDto.getImageURL());
            }
            if (courseDto.getSize() != null) {
                course.setSize(courseDto.getSize());
            }
            if (courseDto.getStartTime() != null) {
                course.setSize((courseDto.getSize()));
            }
            if (courseDto.getEndTime() != null) {
                course.setEndTime(courseDto.getEndTime());
            }
            if (courseDto.getLocation() != null) {
                course.setLocation(courseDto.getLocation());
            }
            if (courseDto.getNotes() != null) {
                course.setNotes(courseDto.getNotes());
            }

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
            courseList.sort((o1, o2) -> o2.getStartTime().compareTo(o1.getStartTime()));
            return courseList.stream().map(course -> new CourseDto(course)).toList();
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

    @Override
    public Long getHighestCourseNumber() {
        Optional<Course> courseOptional = courseRepository.findTopByOrderByNumberDesc();

        if (courseOptional.isPresent()) {
            return courseOptional.get().getNumber();
        } else {
            return 0L;
        }
    }

    @Override
    public List<CourseDto> getUpcomingCourses() {
        List<Course> courses = courseRepository
                                .findAllByStartTimeGreaterThanOrderByStartTimeDesc(LocalDateTime.now());
        return courses.stream().map(course -> new CourseDto(course)).toList();
    }

    @Override
    public List<CourseDto> getSearchedCourses(String search) {
        List<Course> courses = courseRepository.findAllByNameContainsIgnoreCaseOrderByStartTimeDesc(search);
        return courses.stream().map(course -> new CourseDto(course)).toList();
    }

    @Override
    public List<CourseDto> getCoursesByDateAndUser(String dateAsString, Long userId) {
        List<CourseDto> courses = new ArrayList<>();

        List<CourseDto> instructorCourses = getCoursesByInstructor(userId);
        if (!instructorCourses.isEmpty()) {
            courses.addAll(instructorCourses);
        }

        Optional<User> userOptional = userRepository.findById(userId);
        List<Student> students = new ArrayList<>();
        if (userOptional.isPresent()) {
            students = studentRepository.findAllByUser(userOptional.get());
        }

        List<CourseDto> studentCourses = new ArrayList<>();
        for (Student student : students) {
            studentCourses.add(new CourseDto(student.getCourse()));
        }

        if (!studentCourses.isEmpty()) {
            courses.addAll(studentCourses);
        }

        LocalDateTime date = LocalDateTime.parse(dateAsString);

        List<CourseDto> filteredCourses =
                new ArrayList<>(courses
                        .stream()
                        .filter(courseDto -> {
                            return
                                    courseDto.getStartTime().getYear() == date.getYear()
                                    && courseDto.getStartTime().getMonth() == date.getMonth()
                                    && courseDto.getStartTime().getDayOfMonth() == date.getDayOfMonth();
                        })
                        .toList());
        filteredCourses.sort((o1, o2) -> o2.getStartTime().compareTo(o1.getStartTime()));
        return filteredCourses;
    }

    @Override
    public List<CourseDto> getPastCourses(Long userId) {
        List<CourseDto> courses = new ArrayList<>();

        List<CourseDto> instructorCourses = getCoursesByInstructor(userId);
        if (!instructorCourses.isEmpty()) {
            courses.addAll(instructorCourses);
        }

        Optional<User> userOptional = userRepository.findById(userId);
        List<Student> students = new ArrayList<>();
        if (userOptional.isPresent()) {
            students = studentRepository.findAllByUser(userOptional.get());
        }

        List<CourseDto> studentCourses = new ArrayList<>();
        for (Student student : students) {
            studentCourses.add(new CourseDto(student.getCourse()));
        }

        if (!studentCourses.isEmpty()) {
            courses.addAll(studentCourses);
        }

        List<CourseDto> filteredCourses =
                new ArrayList<>(courses
                        .stream()
                        .filter(courseDto -> courseDto.getStartTime().isBefore(LocalDateTime.now()))
                        .toList());
        filteredCourses.sort((o1, o2) -> o2.getStartTime().compareTo(o1.getStartTime()));
        return filteredCourses;
    }
}