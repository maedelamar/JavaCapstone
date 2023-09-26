package com.devmountain.courseScheduler;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CourseSchedulerApplication {
	public static void main(String[] args) {
		SpringApplication.run(CourseSchedulerApplication.class, args);
	}
}