const baseURL = 'http://localhost:8080/api/v1'
const headers = {"Content-Type":"application/json"}

let userId = 0
let permission = -1

if (document.cookie) {
    const cookieArr = document.cookie.split(";")
    userId = +cookieArr[0].split("=")[1]
    permission = +cookieArr[1].split("=")[1]
}

let instructorName = ''

function handleLogout() {
    let c = document.cookie.split(";")
    for (let i in c) {
        document.cookie = /^[^=]+/.exec(c[i])[0]+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
    location.replace('./home.html');
}

function openNav() {
    document.getElementById('nav-menu').style.width = '40vw'
}

function closeNav() {
    document.getElementById('nav-menu').style.width = '0'
}

function convertDateStringToDay(dateString) {
    let dateSringAsDate = new Date(dateString)
    return (dateSringAsDate.getMonth() + 1) + '/' + dateSringAsDate.getDate() + '/' + dateSringAsDate.getFullYear()
}

function convertDateStringToTime(dateString) {
    const dateSringAsDate = new Date(dateString)
    let hour = dateSringAsDate.getHours()
    let meridiem = 'am'
    if (hour > 12) {
        hour -= 12
        meridiem = 'pm'
    }

    return hour + ':' + String(dateSringAsDate.getMinutes()).padStart(2, '0') + meridiem
}

async function getInstructorName(instructorId) {
    await fetch(`${baseURL}/users/${instructorId}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => instructorName = `${data.firstName} ${data.lastName}`)
}

async function getPastCourses() {
    await fetch(`${baseURL}/courses/user/${userId}/past`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => displayPastCourses(data))
    .catch(err => console.log(err))
}

function displayPastCourses(courses) {
    for (const course of courses) {
        const card = document.createElement('div')
        card.classList.add('container')
        card.classList.add('course-container')

        let isInstructor = (userId === course.instructorId)

        getInstructorName(course.instructorId)

        card.innerHTML = `
            <img class="course-card-img" src="${course.imageURL}">
            <p>Name: ${course.name}</p>
            <p>Size: ${course.size}</p>
            <p>Location: ${course.location}</p>
            <p>Instructor: ${instructorName}</p>
            <p>${course.description}</p>
            <p>
            ${convertDateStringToDay(course.startTime)} 
            ${convertDateStringToTime(course.startTime)} - ${convertDateStringToTime(course.endTime)}
            </p>
            <button class="btn btn-primary" onclick="${isInstructor ? "location.replace('./courseStats.html?course=" + course.id + "')" : ''}">
                ${isInstructor ? 'Stats' : 'Rate'}
            </button>
        `

        document.getElementById('your-course-section').appendChild(card)
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
        <a href="./calendar.html">Calendar</a>
        <a href="#" onclick="handleLogout()">Log Out</a>
    `
} else {
    document.querySelector('#nav-menu .overlay-content').innerHTML = `
        <a href="./login.html">Login</a>
        <a href="./register.html">Register</a>
    `
}

getPastCourses()