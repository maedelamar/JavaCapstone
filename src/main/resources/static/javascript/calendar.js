const baseURL = 'http://18.223.122.66:8080/api/v1'
const headers = {"Content-Type":"application/json"}

let userId = 0
let permission = -1

if (document.cookie) {
    const cookieArr = document.cookie.split(";")
    userId = +cookieArr[0].split("=")[1]
    permission = +cookieArr[1].split("=")[1]
}

const today = new Date()
currentYear = today.getFullYear()
currentMonth = today.getMonth()

const months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July',
 'August', 'September', 'October', 'November', 'December']

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

async function getUserCoursesByDate(date, row, column) {
    await fetch(`${baseURL}/courses/date/user/${userId}?date=${date}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => data.length ? renderCourseToDate(data, row, column) : data)
    .catch(err => console.log(err))
}

function openCourseOverlay(courses) {
    document.getElementById('calendar-course-overlay').style.height = '100vh'

    document.querySelector('#calendar-course-overlay .overlay-content').innerHTML = ''

    for (let course of courses) {
        let startMeridiem = 'am'
        let startTime = new Date(course.startTime)
        let startHour = startTime.getHours()
        let startMinute = String(startTime.getMinutes()).padStart(2, '0')
        if (startHour > 12) {
            startHour -= 12
            startMeridiem = 'pm'
        } else if (startHour === 12) {
            startMeridiem = 'pm'
        }

        let endMeridiem = 'am'
        let endTime = new Date(course.endTime)
        let endHour = endTime.getHours()
        let endMinute = String(endTime.getMinutes()).padStart(2, '0')
        if (endHour > 12) {
            endHour -= 12
            endMeridiem = 'pm'
        } else if (endHour === 12) {
            endMeridiem = 'pm'
        }

        document.querySelector('#calendar-course-overlay .overlay-content').innerHTML += `
            <h3>
            ${course.name}   ${startHour}:${startMinute}${startMeridiem} - ${endHour}:${endMinute}${endMeridiem}
            </h3>
            ${(course.instructorId === userId) ? '<p>You are the instructor of this course.</p>' : ''}
            <br><br>
        `
    }
}

function closeCourseOverlay() {
    document.getElementById('calendar-course-overlay').style.height = '0'
}

function renderCalendar() {
    document.getElementById('month-text').textContent = `${months[currentMonth]}, ${currentYear}`

    let firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
    let lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    let lastDateOfLastMonth = new Date(currentYear, currentMonth, 0).getDate()

    for (let i = firstDayOfMonth; i > 0; i--) {
        document.getElementById(`r1-c${firstDayOfMonth - i + 1}`).textContent = lastDateOfLastMonth - i + 1
        document.getElementById(`r1-c${firstDayOfMonth - i + 1}`).style.color = 'gray'
    }

    let currentRow = 1
    let dayCounter = firstDayOfMonth
    for (let i = 1; i <= lastDateOfMonth; i++) {
        document.getElementById(`r${currentRow}-c${dayCounter + 1}`).textContent = i
        document.getElementById(`r${currentRow}-c${dayCounter + 1}`).style.color = 'black'
        if (currentYear === today.getFullYear() && currentMonth === today.getMonth() && i === today.getDate()) {
            document.getElementById(`r${currentRow}-c${dayCounter + 1}`).style.backgroundColor = '#ce9e5b'
        } else {
            document.getElementById(`r${currentRow}-c${dayCounter + 1}`).style.backgroundColor = '#b5dcdd'
        }

        const thisDate = new Date(currentYear, currentMonth, i)
        const dateAsString = `${thisDate.getFullYear()}-${String(thisDate.getMonth() + 1).padStart(2, '0')}-${String(thisDate.getDate()).padStart(2, '0')}T00:00:00`
        getUserCoursesByDate(dateAsString, currentRow, dayCounter + 1)

        dayCounter++

        if (dayCounter >= 7) {
            dayCounter -= 7
            currentRow++
        }
    }

    let nextMonthCounter = 1
    while (currentRow < 7) {
        document.getElementById(`r${currentRow}-c${dayCounter + 1}`).textContent = nextMonthCounter
        document.getElementById(`r${currentRow}-c${dayCounter + 1}`).style.color = 'gray'

        dayCounter++
        nextMonthCounter++

        if (dayCounter >= 7) {
            dayCounter -= 7
            currentRow++
        }
    }
}

function decreaseMonth() {
    currentMonth--

    if (currentMonth < 0) {
        currentMonth += 12
        currentYear--
    }

    renderCalendar()
}

function increaseMonth() {
    currentMonth++

    if (currentMonth > 11) {
        currentMonth -= 12
        currentYear++
    }

    renderCalendar()
}

function renderCourseToDate(courses, row, column) {
    const courseDayBtn = document.createElement('button')
    courseDayBtn.classList.add('btn')
    courseDayBtn.classList.add('btn-primary')
    courseDayBtn.classList.add('calendar-course-btn')
    courseDayBtn.style.width = '1vw'
    courseDayBtn.style.height = '1vw'
    courseDayBtn.style.position = 'relative'
    courseDayBtn.style.left = '1vw'
    courseDayBtn.addEventListener('click', () => openCourseOverlay(courses))

    document.getElementById(`r${row}-c${column}`).appendChild(courseDayBtn)
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
        <a href="#" onclick="handleLogout()">Log Out</a>
    `
} else {
    document.querySelector('#nav-menu .overlay-content').innerHTML = `
        <a href="/login">Login</a>
        <a href="/register">Register</a>
    `
}

renderCalendar()

document.getElementById('left-month-btn').addEventListener('click', decreaseMonth)
document.getElementById('right-month-btn').addEventListener('click', increaseMonth)