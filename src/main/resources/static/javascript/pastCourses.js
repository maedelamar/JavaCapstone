const baseURL = 'http://3.15.210.40:8080/api/v1'
const headers = {"Content-Type":"application/json"}

let userId = 0
let permission = -1

if (document.cookie) {
    const cookieArr = document.cookie.split(";")
    userId = +cookieArr[0].split("=")[1]
    permission = +cookieArr[1].split("=")[1]
}

let instructorNames = []
let studentIds = []

function handleLogout() {
    let c = document.cookie.split(";")
    for (let i in c) {
        document.cookie = /^[^=]+/.exec(c[i])[0]+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
    location.replace('/');
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
    .then(data => instructorNames.push(`${data.firstName} ${data.lastName}`))
    .catch(err => console.log(err))
}

async function getUsersStudentId(courseId) {
    await fetch(`${baseURL}/students/user/${userId}/course/${courseId}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => studentIds.push(data.id))
    .catch(err => console.log(err))
}

async function rateCourse(studentId, rating) {
    const bodyObj = {
        id: studentId,
        rating
    }

    const response = await fetch(`${baseURL}/students`, {
        method: "PUT",
        body: JSON.stringify(bodyObj),
        headers
    })
    .catch(err => console.log(err))

    if (response.status === 200) {
        alert(`You rated this course ${rating}/5.`)
    }
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

async function displayPastCourses(courses) {
    if (courses.length === 0) {
        document.getElementById('past-course-section').innerHTML = `
            <h4>You have not taken or instructed any courses.</h4>
        `

        return
    }

    instructorNames = []
    studentIds = []
    
    for (let i = 0; i < courses.length; i++) {
        const card = document.createElement('div')
        card.classList.add('container')
        card.classList.add('course-container')

        let isInstructor = (userId === courses[i].instructorId)

        await getInstructorName(courses[i].instructorId)
        await getUsersStudentId(courses[i].id)

        card.innerHTML = `
            <img class="course-card-img" src="${courses[i].imageURL}">
            <p>Name: ${courses[i].name}</p>
            <p>Size: ${courses[i].size}</p>
            <p>Location: ${courses[i].location}</p>
            <p>Instructor: ${instructorNames[i]}</p>
            <p>${courses[i].description}</p>
            <p>
            ${convertDateStringToDay(courses[i].startTime)} 
            ${convertDateStringToTime(courses[i].startTime)} - ${convertDateStringToTime(courses[i].endTime)}
            </p>
            ${!isInstructor ? `<select id="rate-select-${studentIds[i]}"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select><button class="btn btn-primary" onclick="rateCourse(${studentIds[i]}, document.getElementById('rate-select-${studentIds[i]}').value)">Rate</button></p>`: `<button class="btn btn-primary" onclick="location.replace('/stats?course=${courses[i].id}')">Stats</button>`}
        `

        document.getElementById('past-course-section').appendChild(card)
    }
}

if (userId) {
    if (permission > 0) {
        document.querySelector('#nav-menu .overlay-content').innerHTML = `
            <a href="/create">Create Course</a>
        `
    }

    document.querySelector('#nav-menu .overlay-content').innerHTML += `
        <a href="/your">Your Courses</a>
        <a href="/calendar">Calendar</a>
        <a href="#" onclick="handleLogout()">Log Out</a>
    `
} else {
    document.querySelector('#nav-menu .overlay-content').innerHTML = `
        <a href="/login">Login</a>
        <a href="/register">Register</a>
    `
}

getPastCourses()