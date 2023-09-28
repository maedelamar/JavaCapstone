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

    //Add a course
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

    //Delete a course
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

    //Update a course
    @Override
    @Transactional
    public List<String> updateCourse(CourseDto courseDto) {
        List<String> response = new ArrayList<>();
        Optional<Course> courseOptional = courseRepository.findById(courseDto.getId());
        courseOptional.ifPresent(course -> { //Only edit what exists
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

    //Get all courses
    @Override
    public List<CourseDto> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        return courses.stream().map(course -> new CourseDto(course)).collect(Collectors.toList());
    }

    //Get courses where a user is the instructor
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

    //Get a course by its id
    @Override
    public Optional<CourseDto> getCourseById(Long courseId) {
        Optional<Course> courseOptional = courseRepository.findById(courseId);

        if (courseOptional.isPresent()) {
            return Optional.of(new CourseDto(courseOptional.get()));
        }

        return Optional.empty();
    }

    //Get the highest course number
    @Override
    public Long getHighestCourseNumber() {
        Optional<Course> courseOptional = courseRepository.findTopByOrderByNumberDesc();

        if (courseOptional.isPresent()) {
            return courseOptional.get().getNumber();
        } else {
            return 0L;
        }
    }

    //Get upcoming courses ordered from sooner to later
    @Override
    public List<CourseDto> getUpcomingCourses() {
        List<Course> courses = courseRepository
                                .findAllByStartTimeGreaterThanOrderByStartTime(LocalDateTime.now());
        return courses.stream().map(course -> new CourseDto(course)).toList();
    }

    //Get search results ordered by sooner to later
    @Override
    public List<CourseDto> getSearchedCourses(String search) {
        List<Course> courses = courseRepository.findAllByNameContainsIgnoreCaseOrderByStartTime(search);
        return courses.stream().map(course -> new CourseDto(course)).toList();
    }

    //Get a user's courses on a given date
    @Override
    public List<CourseDto> getCoursesByDateAndUser(String dateAsString, Long userId) {
        List<CourseDto> courses = new ArrayList<>();

        List<CourseDto> instructorCourses = getCoursesByInstructor(userId); // get courses where user is instructor
        if (!instructorCourses.isEmpty()) {
            courses.addAll(instructorCourses);
        }

        Optional<User> userOptional = userRepository.findById(userId);
        List<Student> students = new ArrayList<>();
        if (userOptional.isPresent()) {
            students = studentRepository.findAllByUser(userOptional.get()); //get students by user
        }

        List<CourseDto> studentCourses = new ArrayList<>();
        for (Student student : students) {
            studentCourses.add(new CourseDto(student.getCourse())); //get courses where user is a student
        }

        if (!studentCourses.isEmpty()) {
            courses.addAll(studentCourses);
        }

        LocalDateTime date = LocalDateTime.parse(dateAsString);

        //get courses on a given date
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
        filteredCourses.sort((o1, o2) -> o1.getStartTime().compareTo(o2.getStartTime()));
        return filteredCourses;
    }

    //Get courses that have already passed
    @Override
    public List<CourseDto> getPastCourses(Long userId) {
        List<CourseDto> courses = new ArrayList<>();

        List<CourseDto> instructorCourses = getCoursesByInstructor(userId); //get courses where user is the instructor
        if (!instructorCourses.isEmpty()) {
            courses.addAll(instructorCourses);
        }

        Optional<User> userOptional = userRepository.findById(userId);
        List<Student> students = new ArrayList<>();
        if (userOptional.isPresent()) {
            students = studentRepository.findAllByUser(userOptional.get()); //get students by user
        }

        List<CourseDto> studentCourses = new ArrayList<>();
        for (Student student : students) {
            studentCourses.add(new CourseDto(student.getCourse())); //get courses by students
        }

        if (!studentCourses.isEmpty()) {
            courses.addAll(studentCourses);
        }

        //filter and sort past courses
        List<CourseDto> filteredCourses =
                new ArrayList<>(courses
                        .stream()
                        .filter(courseDto -> courseDto.getStartTime().isBefore(LocalDateTime.now()))
                        .toList());
        filteredCourses.sort((o1, o2) -> o2.getStartTime().compareTo(o1.getStartTime()));
        return filteredCourses;
    }

    //Get the latest course of a given number
    @Override
    public Optional<CourseDto> getLatestCourseSharingNumber(Long number) {
        Optional<Course> courseOptional = courseRepository.findTopByNumberOrderByStartTimeDesc(number);

        if (courseOptional.isPresent()) {
            return Optional.of(new CourseDto(courseOptional.get()));
        }

        return Optional.empty();
    }

    //Get the average rating of a set of courses by number
    @Override
    public Double getAvgRatingByNumber(Long number) {
        List<Integer> ratings = new ArrayList<>();

        List<Course> courses = courseRepository.findAllByNumber(number); //get all courses by nmuber
        for (Course course : courses) {
            List<Student> studentsInCourse = studentRepository.findAllByCourse(course); //get all students in a course
            for (Student student : studentsInCourse) {
                if (student.getRating() != null) {
                    ratings.add(student.getRating()); //add student rating to rating list
                }
            }
        }

        //get average of ratings
        Integer totalRating = ratings.stream().reduce(0, Integer::sum);
        if (totalRating > 0) {
            return totalRating.doubleValue() / ratings.size();
        } else {
            return 0.0;
        }
    }
}