const baseURL = 'http://localhost:8080/api/v1'
const headers = {"Content-Type":"application/json"}

let userId = 0
let permission = -1

if (document.cookie) {
    const cookieArr = document.cookie.split(";")
    userId = +cookieArr[0].split("=")[1]
    permission = +cookieArr[1].split("=")[1]
}

function handleLogout() {
    let c = document.cookie.split(";")
    for (let i in c) {
        document.cookie = /^[^=]+/.exec(c[i])[0]+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
    location.reload();
}

async function getUserById() {
    await fetch(`${baseURL}/users/${userId}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => updateWelcomeText(data))
    .catch(err => console.log(err))
}

function updateWelcomeText(user) {
    document.querySelector('#home-sidebar > h4').textContent = `Welcome, ${user.firstName}.`
}

function openNav() {
    document.getElementById('nav-menu').style.width = '40vw'
}

function closeNav() {
    document.getElementById('nav-menu').style.width = '0%'
}

function openInfo() {
    document.getElementById('course-info-background').style.width = '100vw'
}

function closeInfo() {
    document.getElementById('course-info-background').style.width = '0'
}

async function getCoursesByInstructor() {
    await fetch(`${baseURL}/courses/instructor/${userId}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => displayCourseCards(data, true))
    .catch(err => console.log(err))
}

async function getStudentsByUser() {
    await fetch(`${baseURL}/students/user/${userId}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => {
        const courses = []
        for (let datum of data) {
            courses.push(datum.course)
        }

        displayCourseCards(courses, false)
    })
    .catch(err => console.log(err))
}

function displayCourseCards(courses, isInstructor) {
    for (let course of courses) {
        const card = document.createElement('div')
        card.classList.add('btn')
        
        if (isInstructor) {
            card.classList.add('btn-primary')
            card.classList.add('instructor-course-card')
        } else {
            card.classList.add('btn-secondary')
            card.classList.add('student-course-card')
        }

        card.style.zIndex = '1'

        const day = new Date(course.startTime).getDay()
        const startHour = new Date(course.startTime).getHours()
        const endHour = new Date(course.endTime).getHours()

        card.style.position = 'absolute'
        card.style.top = 21 + ((startHour - 7) * 10.9) + 'vh'
        card.style.left = 12 + ((day - 1) * 12 + (day - 1)) + 'vw'

        card.style.height = (10.9 * (endHour - startHour)) + 'vh'
        
        const p = document.createElement('p')
        p.textContent = course.name
        card.appendChild(p)

        card.addEventListener('click', () => getCourseInfo(course.id, isInstructor))

        document.getElementById('scheduler-container').appendChild(card)
    }
}

async function getCourseInfo(courseId, isInstructor) {
    await fetch(`${baseURL}/courses/${courseId}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => displayCourseInfo(data, isInstructor))
    .catch(err => console.log(err))
}

function displayCourseInfo(course, isInstructor) {
    document.getElementById('course-info-name').textContent = course.name
    document.getElementById('course-info-description').textContent = course.description
    document.getElementById('course-info-location').textContent = `Location: ${course.location}`
    document.getElementById('course-info-size').textContent = `Size: ${course.size}`

    const courseDate = course.startTime.split('T')[0]
    document.getElementById('course-info-date').textContent = courseDate

    const courseStartTime = course.startTime.split('T')[1]
    const courseEndTime = course.endTime.split('T')[1]
    document.getElementById('course-info-time').textContent = `${courseStartTime}-${courseEndTime}`

    if (isInstructor) {
        document.getElementById('to-attendance-sheet-btn').href = `./attendance.html?course=${course.id}`
    }

    openInfo()
}

function giveInstructorPriviledges() {
    document.getElementById('home-top-bar').innerHTML += `
        <button class="btn btn-primary" id="create-course-btn" onclick="">+</button>
    `
}

if (userId) {
    document.querySelector('header').innerHTML += `
        <div class="container header-btn-container">
            <a class="btn btn-primary" id="login-btn" onclick="handleLogout()">Log Out</a>
        </div>
    `
    
    updateWelcomeText(getUserById())

    document.getElementById('home-top-bar').innerHTML += `
        <button class="btn btn-primary" id="settings-btn" onclick="openNav()">&#9776;</button>
    `

    getCoursesByInstructor()
    getStudentsByUser()

    if (permission === 1) {
        document.getElementById('home-top-bar').innerHTML += `
            <a class="btn btn-primary" id="create-course-btn" href="./createCourse.html">+</button>
        `
    }
} else {
    document.querySelector('header').innerHTML += `
        <div class="header-btn-container">
            <a class="btn btn-primary" id="login-btn" onclick="location.replace('./login.html')">Login</a>
            <a class="btn btn-primary" id="register-btn" onclick="location.replace('./register.html')">Register</a>
        </div>
    `

    document.querySelector('#home-sidebar > h4').textContent = 'Welcome, Guest.'

    document.getElementById('home-sidebar').innerHTML += `
        <div class="container" id="home-sidebar-tab-container">
            <a class="btn btn-primary" id="login-btn" onclick="location.replace('./login.html')">Login</a>
            <a class="btn btn-primary" id="register-btn" onclick="location.replace('./register.html')">Register</a>
        </div>
    `

    document.getElementById('home-top-bar').innerHTML = ''
}