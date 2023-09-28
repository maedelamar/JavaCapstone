const baseURL = 'http://3.139.73.71:8080/api/v1'
const headers = {"Content-Type":"application/json"}

//Make sure user is in Chrome
if (!navigator.userAgent.includes('Chrome')) {
    document.querySelector('header').innerHTML = `
        <h1>TrainUp</h1>
    `

    document.querySelector('main').innerHTML = `
        <h3>This application is designed for Google Chrome. Using other browsers may cause errors.</h3>
    `

    throw Error("This application is designed for Google Chrome.")
}

let userId = 0
let permission = -1
let adminEmail

//Get user's id and permission
if (document.cookie) {
    const cookieArr = document.cookie.split(";")
    userId = +cookieArr[0].split("=")[1]
    permission = +cookieArr[1].split("=")[1]
}

//Initialize card info
let studentCounts = []
let instructorNames = []
let userInCourse = []
let ratings = []

//Log out, detroy cookies, and return to home
function handleLogout() {
    let c = document.cookie.split(";")
    for (let i in c) {
        document.cookie = /^[^=]+/.exec(c[i])[0]+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
    location.replace("/");
}

//Open menu
function openNav() {
    document.getElementById('nav-menu').style.width = '40vw'
}

//Close menu
function closeNav() {
    document.getElementById('nav-menu').style.width = '0'
}

//Administrator tools
function openAddInstructor() {
    if (permission < 2) {
        return
    }

    document.getElementById('add-instructor-form').addEventListener('submit', handleAddInstructor)

    document.getElementById('add-instructor-overlay').style.height = '100vh'
}

function closeAddInstructor() {
    document.getElementById('add-instructor-overlay').style.height = '0'
}

function openRemoveInstructor() {
    if (permission < 2) {
        return
    }

    document.getElementById('remove-instructor-form').addEventListener('submit', handleRemovePrivilege)

    document.getElementById('remove-instructor-overlay').style.height = '100vh'
}

function closeRemoveInstructor() {
    document.getElementById('remove-instructor-overlay').style.height = '0'
}

function openRemoveUser() {
    if (permission < 2) {
        return
    }

    document.getElementById('remove-user-form').addEventListener('submit', handleRemoveUser)

    document.getElementById('remove-user-overlay').style.height = '100vh'
}

function closeRemoveUser() {
    document.getElementById('remove-user-overlay').style.height = '0'
}

function openAddAdmin() {
    if (permission < 3) {
        return
    }

    document.getElementById('add-admin-form').addEventListener('submit', handleAddAdmin)

    document.getElementById('add-admin-overlay').style.height = '100vh'
}

function closeAddAdmin() {
    document.getElementById('add-admin-overlay').style.height = '0'
}
//End admin tools

//Convert Datetime to formatted date
function convertDateStringToDay(dateString) {
    let dateSringAsDate = new Date(dateString)
    return (dateSringAsDate.getMonth() + 1) + '/' + dateSringAsDate.getDate() + '/' + dateSringAsDate.getFullYear()
}

//Get time from datetime
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

//Check if user is the the course
async function checkIfUserInCourse(courseId) {
    await fetch(`${baseURL}/students/user/${userId}/course/${courseId}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => userInCourse.push(Boolean(data)))
    .catch(err => console.log(err))
}

//Get the number of students in a course
async function getStudentCount(courseId) {
    await fetch(`${baseURL}/students/course/${courseId}/count`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => studentCounts.push(data))
    .catch(err => console.log(err))
}

//Get the name of the instructor of a course
async function getInstructorName(instructorId) {
    await fetch(`${baseURL}/users/${instructorId}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => instructorNames.push(`${data.firstName} ${data.lastName}`))
    .catch(err => console.log(err))
}

//Get a course's rating
async function getAvgRating(courseNumber) {
    await fetch(`${baseURL}/courses/number/${courseNumber}/rating`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => ratings.push(data))
    .catch(err => console.log(err))
}

//Change button's functionality
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

//Delete a course
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
        getUpcomingCourses()
    }
}

//Get all upcoming courses
async function getUpcomingCourses() {
    await fetch(`${baseURL}/courses/sorted/upcoming`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => displayUpcomingCourses(data))
    .catch(err => console.log(err))
}

//Display upcoming courses
async function displayUpcomingCourses(courses) {
    if (courses.length === 0) {
        document.getElementById('upcoming-course-section').innerHTML = `
            <h4>There are no upcoming courses.</h4>
        `

        return
    }

    document.getElementById('upcoming-course-section').innerHTML = ''
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
            <button class="btn btn-primary" onclick="${giveBtnOnclick(courses[i].id, courses[i].size, isInstructor, i)}">
                ${isInstructor ? 'Stats' : (userInCourse[i] ? 'Unenroll' : 'Enroll')}
            </button>
            ${(isInstructor || permission >= 2) ? `<button class="btn btn-danger" onclick="deleteCourse(${courses[i].id})">Delete</button>` : ''}
        `

        document.getElementById('upcoming-course-section').appendChild(card)
    }
}

//Enroll in a course
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
        alert("You are now enrolled in this course.")
        getUpcomingCourses()
    }
}

//Unenroll from a given course
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
            getUpcomingCourses()
        }
    })
    .catch(err => console.log(err))
}

//Enter a course's waiting list if it is full
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

//Getthe email of a random admin
async function getRandomAdminEmail() {
    await fetch(`${baseURL}/users/permission/admins`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => {
        const randomAdmin = Math.floor(Math.random() * data.length)
        adminEmail = data[randomAdmin].email
    })
    .catch(err => console.log(err))
}

//Add an instructor
async function handleAddInstructor(e) {
    e.preventDefault()

    if (permission < 2) {
        return
    }

    const emailValue = document.getElementById('instructor-email-input').value

    await fetch(`${baseURL}/users/email/${emailValue}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(async function(data) {
        if (data.permission >= 1) {
            alert("This user already has instructor privileges.")
            return
        }

        const bodyObj = {
            id: data.id,
            permission: 1
        }

        const response = await fetch(`${baseURL}/users`, {
            method: "PUT",
            body: JSON.stringify(bodyObj),
            headers
        })
        .catch(err => console.log(err))

        if (response.status === 200) {
            alert(`${data.firstName} ${data.lastName} is now an instructor.`)
            location.reload()
        }
    })
    .catch(err => console.log(err))
}

//Remove a user's privileges
async function handleRemovePrivilege(e) {
    e.preventDefault()

    if (permission < 2) {
        return
    }

    const emailValue = document.getElementById('remove-instructor-email-input').value

    await fetch(`${baseURL}/users/email/${emailValue}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(async function(data) {
        if (permission <= data.permission) {
            alert("You do not have permission to revoke permissions form this user.")
            return
        }

        const bodyObj = {
            id: data.id,
            permission: 0
        }

        const response = await fetch(`${baseURL}/users`, {
            method: "PUT",
            body: JSON.stringify(bodyObj),
            headers
        })
        .catch(err => console.log(err))

        if (response.status === 200) {
            alert(`${data.firstName} ${data.lastName}'s privileges have been revoked.`)
            location.reload()
        }
    })
    .catch(err => console.log(err))
}

//Add a new admin
async function handleAddAdmin(e) {
    e.preventDefault()

    if (permission < 3) {
        return
    }

    const emailValue = document.getElementById('admin-email-input').value

    await fetch(`${baseURL}/users/email/${emailValue}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(async function(data) {
        const bodyObj = {
            id: data.id,
            permission: 2
        }

        const response = await fetch(`${baseURL}/users`, {
            method: "PUT",
            body: JSON.stringify(bodyObj),
            headers
        })
        .catch(err => console.log(err))

        if (response.status === 200) {
            alert(`${data.firstName} ${data.lastName} is now an administrator.`)
            location.reload()
        }
    })
    .catch(err => console.log(err))
}

//Delete a user
async function handleRemoveUser(e) {
    e.preventDefault()

    if (permission < 2) {
        return
    }

    const emailValue = document.getElementById('remove-user-email-input').value

    await fetch(`${baseURL}/users/email/${emailValue}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(async function(data) {
        const response = await fetch(`${baseURL}/users/${data.id}`, {
            method: "DELETE",
            headers
        })
        .catch(err => console.log(err))

        if (response.status === 200) {
            alert(`${data.firstName} ${data.lastName} has been deleted.`)
            location.reload()
        }
    })
    .catch(err => console.log(err))
}

//Set menu options
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

    if (permission >= 2) {
        document.querySelector('#nav-menu .overlay-content').innerHTML += `
            <a href="#" onclick="openAddInstructor()">Add Instructor</a>
            <a href="#" onclick="openRemoveInstructor()">Revoke User Privilege</a>
            <a href="#" onclick="openRemoveUser()">Delete User</a>
        `
    }

    if (permission >= 3) {
        document.querySelector('#nav-menu .overlay-content').innerHTML += `
            <a href="#" onclick="openAddAdmin()">Add Administrator</a>
        `
    }

    //set footer
    getRandomAdminEmail()

    document.querySelector('footer').innerHTML = `
        <a href="mailto:${adminEmail}" class="btn btn-link footer-link" id="become-instructor-link">Become an Instructor</a>
        <a href="mailto:${adminEmail}" class="btn btn-link footer-link" id="become-admin-link">Become an Administrator</a>
    `
} else {
    document.querySelector('#nav-menu .overlay-content').innerHTML = `
        <a href="/login">Login</a>
        <a href="/register">Register</a>
    `

    document.querySelector('footer').innerHTML = ''
}

getUpcomingCourses()

document.getElementById('home-search-form').addEventListener('submit', e => {
    e.preventDefault()
    location.replace(`/search?search=${document.getElementById('home-search-input').value}`)
})