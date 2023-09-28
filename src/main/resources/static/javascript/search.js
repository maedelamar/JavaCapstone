const baseURL = 'http://3.139.73.71:8080/api/v1'
const headers = {"Content-Type":"application/json"}

const query = document.URL.split('?')[1]
const searchValue = query.split('=')[1]

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
let ratings = []

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

async function getAvgRating(courseNumber) {
    await fetch(`${baseURL}/courses/number/${courseNumber}/rating`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => ratings.push(data))
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
        getLikeCourses()
    }
}

async function getLikeCourses() {
    await fetch(`${baseURL}/courses/filtered/search?${query}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => displayLikeCourses(data))
    .catch(err => console.log(err))
}

async function displayLikeCourses(courses) {
    if (courses.length === 0) {
        document.getElementById('search-course-section').innerHTML = `
            <h4>There are no results for this search.</h4>
        `

        return
    }

    document.getElementById('search-course-section').innerHTML = ''
    userInCourse = []
    instructorNames = []
    studentCounts = []
    ratings = []

    for (let i = 0; i < courses.length; i++) {
        const card = document.createElement('div')
        card.classList.add('container')
        card.classList.add('course-container')

        await getStudentCount(courses[i].id)
        await getInstructorName(courses[i].instructorId)
        await checkIfUserInCourse(courses[i].id)
        await getAvgRating(courses[i].number)

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
            <p>Rating: ${ratings[i] ? `${ratings[i]}/5` : "None"}</p>
            <button class="btn btn-primary" onclick=${giveBtnOnclick(courses[i].id, courses[i].size, isInstructor, i)}>
                ${isInstructor ? 'Stats' : (userInCourse[i] ? 'Unenroll' : 'Enroll')}
            </button>
            ${(isInstructor || permission >= 2) ? `<button class="btn btn-danger" onclick="deleteCourse(${courses[i].id})">Delete</button>` : ''}
        `

        document.getElementById('search-course-section').appendChild(card)
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
        getLikeCourses()
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
            getLikeCourses()
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

document.querySelector('main h5').textContent = `Showing Results For: ${searchValue}`
getLikeCourses()