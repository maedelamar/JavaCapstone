const baseURL = 'http://localhost:8080/api/v1/courses'
const headers = {"Content-Type":"application/json"}

const cookies = document.cookie.split(";")
const userId = +cookies[0].split("=")[1]

const createCourseForm = document.getElementById('create-course-form')

document.getElementById('course-error-text').innerHTML = ''

let highestCourseNumber = 0;

async function getHighestCourseNumber() {
    await fetch(`${baseURL}/number/highest`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(highest => highestCourseNumber = highest)
    .catch(err => console.log(err))
}

function calculateEndTime(startTime, duration) {
    const time = startTime.split("T")
    const endTimeArr = time[1].split(":")
    let endTimeHour = +endTimeArr[0]
    let endTimeMinute = +endTimeArr[1]

    while (duration >= 60) {
        endTimeHour++
        duration -= 60
    }

    while (duration > 0) {
        endTimeMinute++
        duration--

        if (endTimeMinute === 60) {
            endTimeHour++
            endTimeMinute = 0
        }
    }

    if (endTimeHour < 10) {
        endTimeHour = String(endTimeHour).padStart(2, '0')
    }

    if (endTimeMinute < 10) {
        endTimeMinute = String(endTimeMinute).padStart(2, '0')
    }

    return time[0] + 'T' + endTimeHour + ':' + endTimeMinute
}

async function handleCourseCreation(e) {
    e.preventDefault()

    const imageInput = document.getElementById('course-image-input')
    const nameInput = document.getElementById('course-name-input')
    const descriptionInput = document.getElementById('course-description-input')
    const categoryInput = document.getElementById('course-category-input')
    const locationInput = document.getElementById('course-location-input')
    const sizeInput = document.getElementById('course-size-input')
    const startTimeInput = document.getElementById('course-start-time-input')
    const durationInput = document.getElementById('course-length-input')

    imageInput.style.borderColor = 'gray'
    nameInput.style.borderColor = 'gray'
    descriptionInput.style.borderColor = 'gray'
    categoryInput.style.borderColor = 'gray'
    locationInput.style.borderColor = 'gray'
    sizeInput.style.borderColor = 'gray'
    startTimeInput.style.borderColor = 'gray'
    durationInput.style.borderColor = 'gray'

    document.getElementById('course-error-text').innerHTML = ''

    let confirmed = true
    if (!nameInput.value) {
        confirmed = false
        nameInput.style.borderColor = 'red'
    }
    if (!descriptionInput.value) {
        confirmed = false
        descriptionInput.style.borderColor = 'red'
    }
    if (!categoryInput.value) {
        confirmed = false
        categoryInput.style.borderColor = 'red'
    }
    if (!locationInput.value) {
        confirmed = false
        locationInput.style.borderColor = 'red'
    }
    if (!sizeInput.value) {
        confirmed = false
        locationInput.style.borderColor = 'red'
    }
    if (!startTimeInput.value) {
        confirmed = false
        startTimeInput.style.borderColor = 'red'
    }
    if (!durationInput.value) {
        confirmed = false
        durationInput.style.borderColor = 'red'
    }

    let imageURL;
    if (imageInput.src) {
        imageURL = imageInput.src
    } else {
        imageURL = 'https://images.pond5.com/male-tutor-teaching-university-students-footage-040447646_iconl.jpeg'
    }

    if (!confirmed) {
        document.getElementById('course-error-text').innerHTML = 'Fields must not be empty.'
        return
    }

    getHighestCourseNumber()

    const bodyObj = {
        name: nameInput.value,
        description: descriptionInput.value,
        number: highestCourseNumber + 1,
        imageURL,
        category: categoryInput.value,
        size: sizeInput.value,
        startTime: startTimeInput.value,
        endTime: calculateEndTime(startTimeInput.value, durationInput.value),
        location: locationInput.value
    }

    const response = await fetch(`${baseURL}/${userId}`, {
        method: "POST",
        body: JSON.stringify(bodyObj),
        headers
    })

    if (response.status === 200) {
        alert("Course Created!")
        location.replace("./home.html")
    } else {
        alert(`Error in creating course: ${response.status}`)

        nameInput.value = ''
        descriptionInput.value = ''
        categoryInput.value = ''
        locationInput.value = ''
        sizeInput.value = ''
        startTimeInput.value = ''
        durationInput.value = ''
    }
}

createCourseForm.addEventListener('submit', handleCourseCreation)