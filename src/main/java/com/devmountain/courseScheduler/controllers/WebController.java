package com.devmountain.courseScheduler.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

//Controller for Navigation
@Controller
public class WebController {
    //Navigate to Home Page
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String home() {
        return "home.html";
    }

    //Navigate to Attendance Page
    @RequestMapping(value = "/attendance", method = RequestMethod.GET)
    public String attendance() {
        return "attendance.html";
    }

    //Navigate to Calendar Page
    @RequestMapping(value = "/calendar", method = RequestMethod.GET)
    public String calendar() {
        return "calendar.html";
    }

    //Navigate to Copy Course Page
    @RequestMapping(value = "/copy", method = RequestMethod.GET)
    public String copyCourse() {
        return "copyCourse.html";
    }

    //Navigate to Stats Page
    @RequestMapping(value = "/stats", method = RequestMethod.GET)
    public String courseStats() {
        return "courseStats.html";
    }

    //Navigate to Create Course Page
    @RequestMapping(value = "/create", method = RequestMethod.GET)
    public String createCourse() {
        return "createCourse.html";
    }

    //Navigate to Add Notes Page
    @RequestMapping(value = "/notes", method = RequestMethod.GET)
    public String finalizeCourseStats() {
        return "finalizeCourseStats.html";
    }

    //Navigate to Login Page
    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String login() {
        return "login.html";
    }

    //Navigate to Past Courses Page
    @RequestMapping(value = "/past", method = RequestMethod.GET)
    public String pastCourses() {
        return "pastCourses.html";
    }

    //Navigate to Register Page
    @RequestMapping(value = "/register", method = RequestMethod.GET)
    public String register() {
        return "register.html";
    }

    //Navigate to Search Page
    @RequestMapping(value = "/search", method = RequestMethod.GET)
    public String search() {
        return "search.html";
    }

    //Navigate to Your Courses Page
    @RequestMapping(value = "/your", method = RequestMethod.GET)
    public String yourCourses() {
        return "yourCourses.html";
    }
}
