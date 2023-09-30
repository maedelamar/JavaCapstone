const baseURL = 'http://3.15.210.40:8080/api/v1'
const headers = {"Content-Type":"application/json"}

let userId = 0
let permission = -1

if (document.cookie) {
    const cookieArr = document.cookie.split(";")
    userId = +cookieArr[0].split("=")[1]
    permission = +cookieArr[1].split("=")[1]
}

let studentCounts = []
let instructorNames = []
let userInCourse = []

function handleLogout() {
    let c = document.cookie.split(";")
    for (let i in c) {
        document.cookie = /^[^=]+/.exec(c[i])[0]+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
    location.reload();
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
    } else if (hour === 12) {
        meridiem = 'pm'
    }

    return hour + ':' + String(dateSringAsDate.getMinutes()).padStart(2, '0') + meridiem
}

async function checkIfUserInCourse(courseId) {
    await fetch(`${baseURL}/students/user/${userId}/course/${courseId}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => userInCourse.push(Boolean(data)))
    .catch(err => console.log(err))
}

async function getStudentCount(courseId) {
    await fetch(`${baseURL}/students/course/${courseId}/count`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => studentCounts.push(data))
    .catch(err => console.log(err))
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

function giveBtnOnclick(id, size, isInstructor, index) {
    if (isInstructor) {
        return `location.replace('/stats?course=${id}')`
    } else if (userInCourse[index]) {
        return `unenroll(${id})`
    } else if (studentCounts[index] < size) {
        return `enroll(${id})`
    } else if (studentCounts[index] >= size) {
        return `enterWaitingList(${id})`
    } else {
        return ''
    }
}

async function deleteCourse(id) {
    const willDelete = confirm('Do you want to delete this course?')
    if (!willDelete) {
        return
    }

    const response = await fetch(`${baseURL}/courses/${id}`, {
        method: "DELETE",
        headers
    })
    .catch(err => console.log(err))

    if (response.status === 200) {
        alert('Course Deleted')
        getInstructorCourses()
        getUserAsStudents()
    }
}

async function getInstructorCourses() {
    await fetch(`${baseURL}/courses/instructor/${userId}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => displayYourCourses(data))
    .catch(err => console.log(err))
}

async function getUserAsStudents() {
    await fetch(`${baseURL}/students/user/${userId}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => getCoursesWhereUserIsStudent(data))
    .catch(err => console.log(err))
}

function getCoursesWhereUserIsStudent(students) {
    const courses = []
    for (let student of students) {
        courses.push(student.course)
    }
    displayYourCourses(courses)
}

async function displayYourCourses(courses) {
    courses.reverse()

    if (courses.length === 0) {
        document.getElementById('your-course-section').innerHTML = `
            <h4>You have no upcoming courses.</h4>
        `

        return
    }

    document.getElementById('your-course-section').innerHTML = ''
    userInCourse = []
    instructorNames = []
    studentCounts = []

    for (let i = 0; i < courses.length; i++) {
        const card = document.createElement('div')
        card.classList.add('container')
        card.classList.add('course-container')

        await getStudentCount(courses[i].id)
        await getInstructorName(courses[i].instructorId)

        let isInstructor = (userId === courses[i].instructorId)

        card.innerHTML = `
            <img class="course-card-img" src="${courses[i].imageURL}">
            <p>Name: ${courses[i].name}</p>
            <p>Openings: ${courses[i].size - studentCounts[i]}</p>
            <p>Location: ${courses[i].location}</p>
            <p>Instructor: ${instructorNames[i]}</p>
            <p>${courses[i].description}</p>
            <p>
            ${convertDateStringToDay(courses[i].startTime)} 
            ${convertDateStringToTime(courses[i].startTime)} - ${convertDateStringToTime(courses[i].endTime)}
            </p>
            <button class="btn btn-primary" onclick=${giveBtnOnclick(courses[i].id, courses[i].size, isInstructor, i)}>
                ${isInstructor ? 'Stats' : (userInCourse[i] ? 'Unenroll' : 'Enroll')}
            </button>
            ${(isInstructor || permission >= 2) ? `<button class="btn btn-danger" onclick="deleteCourse(${courses[i].id})">Delete</button>` : ''}
        `

        document.getElementById('your-course-section').appendChild(card)
    }
}

async function enroll(courseId) {
    let willEnroll = confirm("Do you want to enroll in this course?")
    if (!willEnroll) {
        return
    }

    const response = await fetch(`${baseURL}/students/${courseId}/${userId}`, {
        method: "POST",
        body: JSON.stringify({attended: false}),
        headers
    })
    .catch(err => console.log(err))

    if (response.status === 200) {
        alert("You are now enrolled in this course.")
    }
}

async function enterWaitingList(courseId) {
    let willWait = confirm("This course is full. Would you like to enter its waiting list?")
    if (!willWait) {
        return
    }

    const response = await fetch(`${baseURL}/waitingList/${courseId}/${userId}`, {
        method: "POST",
        body: JSON.stringify({}),
        headers
    })
    .catch(err => console.log(err))

    if (response.status === 200) {
        alert("You are on the waiting list for this course.")
    }
}

async function enroll(courseId) {
    if (!userId) {
        location.replace('/login')
        return
    }

    let willEnroll = confirm("Do you want to enroll in this course")
    if (!willEnroll) {
        return
    }

    const response = await fetch(`${baseURL}/students/${courseId}/${userId}`, {
        method: "POST",
        body: JSON.stringify({attended: false}),
        headers
    })
    .catch(err => console.log(err))

    if (response.status === 200) {
        getInstructorCourses()
        getUserAsStudents()
    }
}

async function unenroll(courseId) {
    if (!userId) {
        location.replace('/login')
        return
    }

    let willUnenroll = confirm("Are you sure you want to unenroll from this course?")
    if (!willUnenroll) {
        return
    }

    await fetch(`${baseURL}/students/user/${userId}/course/${courseId}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(async function(data) {
        const response = await fetch(`${baseURL}/students/${data.id}`, {
            method: "DELETE",
            headers
        })
        .catch(err => console.log(err))

        if (response.status === 200) {
            alert("You are now enrolled in this course.")
            getInstructorCourses()
            getUserAsStudents()
        }
    })
    .catch(err => console.log(err))
}

async function enterWaitingList(courseId) {
    if (!userId) {
        location.replace('/login')
        return
    }

    let willWait = confirm("This course is full. Would you like to enter its waiting list?")
    if (!willWait) {
        return
    }

    const response = await fetch(`${baseURL}/waitingList/${courseId}/${userId}`, {
        method: "POST",
        body: JSON.stringify({}),
        headers
    })
    .catch(err => console.log(err))

    if (response.status === 200) {
        alert("You are on the waiting list for this course.")
    }
}

if (userId) {
    if (permission > 0) {
        document.querySelector('#nav-menu .overlay-content').innerHTML = `
            <a href="/create">Create Course</a>
        `
    }

    document.querySelector('#nav-menu .overlay-content').innerHTML += `
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

getInstructorCourses()
getUserAsStudents()