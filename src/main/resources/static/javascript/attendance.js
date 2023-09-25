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
        .then(data => renderStudent(data, student.id))
        .catch(err => console.log(err))
    }
}

async function deleteStudent(studentId) {
    const response = await fetch(`${baseURL}/students/${studentId}`, {
        method: "DELETE",
        headers
    })
    .catch(err => console.log(err))

    if (response.status === 200) {
        studentAttendanceContainer.innerHTML = ''

        getStudentsFromCourse()
    }
}

function renderStudent(user, studentId) {
    const studentContainer = document.createElement('div')

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
        const selectorValue = studentPresentSelector.value
        const studentId = selectorValue.split(' ')[0]
        const attended = selectorValue.split(' ')[1]

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
        }
    }
}

if (userId) {
    if (userId === 1 || userId === 3) {
        document.querySelector('#nav-menu .overlay-content').innerHTML = `
            <a href = "./createCourse.html>Create Course</a>
        `
    }

    document.querySelector('#nav-menu .overlay-content').innerHTML += `
        <a href="./yourCourses.html">Your Courses</p>
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