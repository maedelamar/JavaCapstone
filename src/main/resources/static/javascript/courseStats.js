const baseURL = 'http://localhost:8080/api/v1'
const headers = {"Content-Type":"application/json"}

let userId = 0
let permission = -1

if (document.cookie) {
    const cookieArr = document.cookie.split(";")
    userId = +cookieArr[0].split("=")[1]
    permission = +cookieArr[1].split("=")[1]
}

const urlQuery = document.URL.split("?")[1]
const courseId = +urlQuery.split("=")[1]

checkIfUserIsInstructor()

async function checkIfUserIsInstructor() {
    await fetch(`${baseURL}/courses/${courseId}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => {
        if (userId !== data.instructorId) {
            location.replace('./home.html')
        }
    })
    .catch(err => console.log(err))
}

let instructor = {}
let studentCount = 0
let attendedCount = 0

function handleLogout() {
    let c = document.cookie.split(";")
    for (let i in c) {
        document.cookie = /^[^=]+/.exec(c[i])[0]+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
    location.replace("./home.html");
}

function openNav() {
    document.getElementById('nav-menu').style.width = '40vw'
}

function closeNav() {
    document.getElementById('nav-menu').style.width = '0'
}

async function getInstructorFromId(instructorId) {
    await fetch(`${baseURL}/users/${instructorId}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => instructor = data)
    .catch(err => console.log(err))
}

function getFormattedTime(time) {
    let meridiem = 'am'

    let hour = time.getHours()
    if (hour > 12) {
        hour -= 12
        meridiem = 'pm'
    }

    let minute = time.getMinutes()

    return hour + ':' + String(minute).padStart(2, '0') + meridiem
}

async function countStudents() {
    await fetch(`${baseURL}/students/course/${courseId}/count`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => studentCount = data)
    .catch(err => console.log(err))
}

async function countAttended() {
    await fetch(`${baseURL}/students/course/${courseId}/count/attended`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => attendedCount = data)
    .catch(err => console.log(err))
}

async function getCourseFromId() {
    await fetch(`${baseURL}/courses/${courseId}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => renderStats(data))
    .catch(err => console.log(err))
}

function renderStats(course) {
    getInstructorFromId(course.instructorId)
    countStudents(courseId)
    countAttended(courseId)

    document.getElementById('stats-course-name').textContent = course.name
    document.getElementById('stats-course-instructor').textContent = `${instructor.firstName} ${instructor.lastName}`
    document.getElementById('stats-place-and-time').textContent = `Location: ${course.location}     ${getFormattedTime(new Date(course.startTime))} - ${getFormattedTime(new Date(course.endTime))}`
    document.getElementById('stats-description').textContent = course.description
    
    document.getElementById('max-size').textContent += course.size
    document.getElementById('number-of-students').textContent += studentCount
    document.getElementById('number-attended').textContent += attendedCount

    if (userId === course.instructorId) {
        const toAttendanceBtn = document.createElement('button')
        toAttendanceBtn.classList.add('btn', 'btn-primary')
        toAttendanceBtn.textContent = 'Edit Attendance'
        toAttendanceBtn.addEventListener('click', () => location.replace(`./attendance.html?course=${courseId}`))

        document.getElementById('stats-container').appendChild(toAttendanceBtn)
    }

    document.getElementById('copy-course-btn').addEventListener('click', () => location.replace(`./copyCourse.html?course=${course.id}&number=${course.number}`))

    if (course.notes) {
        document.getElementById('stats-notes-content-container').innerHTML = `
            <p>Notes:</p>
            <p>${course.notes}</p>
        `
    } else {
        document.getElementById('stats-notes-content-container').innerHTML = '<p>The instructor for this course has not left any notes.</p>'
    }
}

if (userId) {
    if (permission > 0) {
        document.querySelector('#nav-menu .overlay-content').innerHTML = `
            <a href="./createCourse.html>Create Course</a>
        `
    }

    document.querySelector('#nav-menu .overlay-content').innerHTML += `
        <a href="./yourCourses.html">Your Courses</a>
        <a href="./pastCourses.html">Past Courses</a>
        <a href="./calendar.html">Calendar</a>
        <a href="#" onclick="handleLogout()">Log Out</a>
    `
} else {
    document.querySelector('#nav-menu .overlay-content').innerHTML = `
        <a href="./login.html">Login</a>
        <a href="./register.html">Register</a>
    `
}

getCourseFromId()

document.getElementById('edit-notes-btn').addEventListener('click', () => location.replace(`./finalizeCourseStats.html?course=${courseId}`))