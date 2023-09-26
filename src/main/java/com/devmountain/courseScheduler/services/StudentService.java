package com.devmountain.courseScheduler.services;

import com.devmountain.courseScheduler.dtos.StudentDto;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface StudentService {
    @Transactional
    List<String> addStudent(StudentDto studentDto, Long userId, Long courseId);

    @Transactional
    void addFromWaitingList();

    @Transactional
    List<String> updateStudent(StudentDto studentDto);

    @Transactional
    List<String> deleteStudentById(Long studentId);

    List<StudentDto> getAllStudents();

    List<StudentDto> getStudentsByUserId(Long userId);

    List<StudentDto> getStudentsByCourseId(Long courseId);

    Optional<StudentDto> getStudentById(Long studentId);

    Long getCountCourse(Long courseId);

    Long getCountAttended(Long courseId);

    Optional<StudentDto> getStudentFromUserAndCourse(Long userId, Long courseId);
}
