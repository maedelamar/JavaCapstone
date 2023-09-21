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
            course.setImageURL(course.getImageURL());
            course.setSize(course.getSize());
            course.setStartTime(course.getStartTime());
            course.setEndTime(course.getEndTime());
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
            courseList.sort((o1, o2) -> o2.getStartTime().compareTo(o1.getStartTime()));
            return courseList.stream().limit(20).map(course -> new CourseDto(course)).toList();
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
        List<CourseDto> courseDtos = getAllCourses();

        if (courseDtos.isEmpty()) {
            return 0L;
        }

        Long maxNum = courseDtos.get(0).getNumber();
        for (CourseDto courseDto : courseDtos) {
            if (courseDto.getNumber() > maxNum) {
                maxNum = courseDto.getNumber();
            }
        }

        return maxNum;
    }

    @Override
    public List<CourseDto> getUpcomingCourses() {
        List<CourseDto> courseDtos = getAllCourses();
        LocalDateTime tomorrow = LocalDateTime.now().plusDays(1);

        List<CourseDto> upcomingCourses =
                new ArrayList<>(courseDtos
                        .stream()
                        .filter(courseDto -> tomorrow.isBefore(courseDto.getStartTime()))
                        .toList());

        upcomingCourses.sort((o1, o2) -> o2.getStartTime().compareTo(o1.getStartTime()));
        return upcomingCourses.stream().limit(20).toList();
    }

    @Override
    public List<CourseDto> getSearchedCourses(String search) {
        List<CourseDto> courseDtos = getAllCourses();
        LocalDateTime now = LocalDateTime.now();

        List<CourseDto> exactList = new ArrayList<>();
        for (CourseDto courseDto : courseDtos) {
            if (courseDto.getName().equalsIgnoreCase(search) && now.isBefore(courseDto.getStartTime())) {
                exactList.add(courseDto);
            }
        }
        exactList.sort((o1, o2) -> o2.getStartTime().compareTo(o1.getStartTime()));

        List<CourseDto> startsWithList = new ArrayList<>();
        for (CourseDto courseDto : courseDtos) {
            if (courseDto.getName().toLowerCase().startsWith(search.toLowerCase()) && now.isBefore(courseDto.getStartTime())) {
                startsWithList.add(courseDto);
            }
        }
        startsWithList.sort((o1, o2) -> o2.getStartTime().compareTo((o1.getStartTime())));

        List<CourseDto> sortedList = new ArrayList<>(exactList);
        sortedList.addAll(startsWithList);
        return sortedList.stream().limit(20).toList();
    }
}