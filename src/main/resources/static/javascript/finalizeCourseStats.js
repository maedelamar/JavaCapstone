const baseURL = 'http://18.223.122.66:8080/api/v1'
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

let instructorName

checkIfUserIsInstructor()
getInstructorName()

async function checkIfUserIsInstructor() {
    await fetch(`${baseURL}/courses/${courseId}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => {
        if (userId !== data.instructorId) {
            location.replace('/')
        }
    })
    .catch(err => console.log(err))
}

async function getInstructorName() {
    await fetch(`${baseURL}/users/${userId}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => instructorName = `${data.firstName} ${data.lastName}`)
    .catch(err => console.log(err))
}

function handleLogout() {
    let c = document.cookie.split(";")
    for (let i in c) {
        document.cookie = /^[^=]+/.exec(c[i])[0]+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
    location.replace("/");
}

function openNav() {
    document.getElementById('nav-menu').style.width = '40vw'
}

function closeNav() {
    document.getElementById('nav-menu').style.width = '0'
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

async function renderStats(course) {
    await countStudents(courseId)
    await countAttended(courseId)

    document.getElementById('stats-course-name').textContent = course.name
    document.getElementById('stats-course-instructor').textContent = `${instructorName}`
    document.getElementById('stats-place-and-time').textContent = `Location: ${course.location}     ${getFormattedTime(new Date(course.startTime))} - ${getFormattedTime(new Date(course.endTime))}`
    document.getElementById('stats-description').textContent = course.description
    
    document.getElementById('max-size').textContent += course.size
    document.getElementById('number-of-students').textContent += studentCount
    document.getElementById('number-attended').textContent += attendedCount

    if (course.notes) {
        document.getElementById('notes-input').value = course.notes
    }
}

async function handleSubmit(e) {
    e.preventDefault()

    const bodyObj = {
        id: courseId,
        notes: document.getElementById('notes-input').value
    }

    const response = await fetch(`${baseURL}/courses`, {
        method: "PUT",
        body: JSON.stringify(bodyObj),
        headers
    })
    .catch(err => console.log(err))

    if (response.status === 200) {
        location.replace(`/stats?course=${courseId}`)
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
        <a href="/past">Past Courses</a>
        <a href="/calendar">Calendar</a>
        <a href="#" onclick="handleLogout()">Log Out</a>
    `
} else {
    document.querySelector('#nav-menu .overlay-content').innerHTML = `
        <a href="/login">Login</a>
        <a href="/register">Register</a>
    `
}

getCourseFromId()

document.getElementById('cancel-btn').addEventListener('click', () => location.replace(`/stats?course=${courseId}`))
document.getElementById('notes-form').addEventListener('submit', handleSubmit)