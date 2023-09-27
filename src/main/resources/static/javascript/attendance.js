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

let studentUsers = []

const attendanceForm = document.getElementById('attendance-form')
const studentAttendanceContainer = document.getElementById('student-attendance-container')

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

function openEmails(emails) {
    let emailsAsString = ''
    for (let i = 0; i < emails.length; i++) {
        if (i > 0) {
            emailsAsString += ','
        }

        emailsAsString += emails[i]
    }

    document.getElementById('email-text').textContent = emailsAsString

    document.getElementById('email-overlay').style.height = '100vh'
}

function closeEmails() {
    document.getElementById('email-overlay').style.height = '0'
}

async function getStudentsFromCourse() {
    await fetch(`${baseURL}/students/course/${courseId}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => getUsersFromStudents(data))
    .catch(err => console.log(err))
}

async function getUsersFromStudents(students) {
    for (let student of students) {
        await fetch(`${baseURL}/users/student/${student.id}`, {
            method: "GET",
            headers
        })
        .then(res => res.json())
        .then(data => {
            studentUsers.push(data)
            renderStudent(data, student.id)
        })
        .catch(err => console.log(err))
    }

    if (studentUsers.length > 0) {
        const emailsBtn = document.createElement('a')
        emailsBtn.classList.add('btn', 'btn-secondary')
        emailsBtn.id = 'get-emails-btn'
        emailsBtn.type = 'button'
        emailsBtn.textContent = 'Show Emails'
    
        const emailList = studentUsers.map(user => user.email)
        emailsBtn.addEventListener('click', () => openEmails(emailList))
    
        const submitBtn = document.createElement('button')
        submitBtn.classList.add('btn', 'btn-primary')
        submitBtn.type = 'submit'
        submitBtn.textContent = 'Submit'
    
        attendanceForm.appendChild(emailsBtn)
        attendanceForm.appendChild(submitBtn)
    } else {
        document.querySelector('main').innerHTML = `
            <h2 id="no-students-text">This Course Has No Students</h2>
        `
    }
}

async function deleteStudent(studentId, index) {
    const response = await fetch(`${baseURL}/students/${studentId}`, {
        method: "DELETE",
        headers
    })
    .catch(err => console.log(err))

    if (response.status === 200) {
        studentAttendanceContainer.innerHTML = ''
        studentUsers.splice(index, 1)

        getStudentsFromCourse()
    }
}

function renderStudent(user, studentId) {
    const studentContainer = document.createElement('div')
    studentContainer.className = 'student-container'

    const studentInfo = document.createElement('p')
    studentInfo.textContent = `${user.firstName} ${user.lastName}, ${user.email}`
    studentContainer.appendChild(studentInfo)

    const studentBtnContainer = document.createElement('div')

    const studentPresentSelect = document.createElement('select')
    studentPresentSelect.classList.add('student-present-selector')

    const studentNoChoiceOption = document.createElement('option')
    studentNoChoiceOption.textContent = ''
    studentNoChoiceOption.value = studentId + " " + 0

    const studentPresentOption = document.createElement('option')
    studentPresentOption.textContent = 'Present'
    studentPresentOption.value = studentId + " " + 1

    const studentAbsentOption = document.createElement('option')
    studentAbsentOption.textContent = 'Absent'
    studentAbsentOption.value = studentId + " " + 0

    studentPresentSelect.appendChild(studentNoChoiceOption)
    studentPresentSelect.appendChild(studentPresentOption)
    studentPresentSelect.appendChild(studentAbsentOption)

    const deleteStudentBtn = document.createElement('button')
    deleteStudentBtn.classList.add('btn', 'btn-danger')
    deleteStudentBtn.type = 'button'
    deleteStudentBtn.addEventListener('click', () => {
        let willDelete = confirm(`Are you sure that you want to remove ${user.firstName} ${user.lastName} from your class?`)
        if (willDelete) {
            deleteStudent(studentId)
        }
    })

    const trashIcon = document.createElement('i')
    trashIcon.className = 'fa fa-trash'

    deleteStudentBtn.appendChild(trashIcon)

    studentBtnContainer.appendChild(studentPresentSelect)
    studentBtnContainer.appendChild(deleteStudentBtn)

    studentContainer.appendChild(studentBtnContainer)

    studentAttendanceContainer.appendChild(studentContainer)
}

async function handleSubmit(e) {
    e.preventDefault()

    const studentPresentSelectors = document.querySelectorAll('.student-present-selector')
    for (let studentPresentSelector of studentPresentSelectors) {
        hasStudents = true

        const selectorValue = studentPresentSelector.value
        const studentId = +selectorValue.split(' ')[0]
        const attended = +selectorValue.split(' ')[1]

        const bodyObj = {
            id: studentId,
            attended: Boolean(attended)
        }

        const response = await fetch(`${baseURL}/students`, {
            method: "PUT",
            body: JSON.stringify(bodyObj),
            headers
        })
        .catch(err => console.log(err))

        if (response.status === 200) {
            alert("Attendance Submitted")
            location.replace(`./finalizeCourseStats.html?course=${courseId}`)
        }
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

getStudentsFromCourse()

attendanceForm.addEventListener('submit', handleSubmit)