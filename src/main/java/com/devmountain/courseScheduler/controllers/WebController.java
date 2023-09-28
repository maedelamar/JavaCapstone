package com.devmountain.courseScheduler.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class WebController {
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String home() {
        return "home.html";
    }

    @RequestMapping(value = "/attendance", method = RequestMethod.GET)
    public String attendance() {
        return "attendance.html";
    }

    @RequestMapping(value = "/calendar", method = RequestMethod.GET)
    public String calendar() {
        return "calendar.html";
    }

    @RequestMapping(value = "/copy", method = RequestMethod.GET)
    public String copyCourse() {
        return "copyCourse.html";
    }

    @RequestMapping(value = "/stats", method = RequestMethod.GET)
    public String courseStats() {
        return "courseStats.html";
    }

    @RequestMapping(value = "/create", method = RequestMethod.GET)
    public String createCourse() {
        return "createCourse.html";
    }

    @RequestMapping(value = "/notes", method = RequestMethod.GET)
    public String finalizeCourseStats() {
        return "finalizeCourseStats.html";
    }

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String login() {
        return "login.html";
    }

    @RequestMapping(value = "/past", method = RequestMethod.GET)
    public String pastCourses() {
        return "pastCourses.html";
    }

    @RequestMapping(value = "/register", method = RequestMethod.GET)
    public String register() {
        return "register.html";
    }

    @RequestMapping(value = "/search", method = RequestMethod.GET)
    public String search() {
        return "search.html";
    }

    @RequestMapping(value = "/your", method = RequestMethod.GET)
    public String yourCourses() {
        return "yourCourses.html";
    }
}
