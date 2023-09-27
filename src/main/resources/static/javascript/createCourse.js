const baseURL = 'http://localhost:8080/api/v1/courses'
const headers = {"Content-Type":"application/json"}

const cookies = document.cookie.split(";")
const userId = +cookies[0].split("=")[1]

if (userId < 1) {
    location.replace('./home.html')
}

const createCourseForm = document.getElementById('create-course-form')
const repeatingWeeklyCheck = document.getElementById('course-repeating-weekly-check')
const weeklyFormGroup = document.getElementById('weekly-form-group')

document.getElementById('course-error-text').innerHTML = ''

let highestCourseNumber = 0;
let weekly = false

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

function addWeek(datetime, numberOfWeeks) {
    let newDate = new Date(datetime)
    newDate.setDate(newDate.getDate() + (numberOfWeeks * 7))

    return `${newDate.getFullYear()}-${String(newDate.getMonth()).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}T${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}`
}

function handleWeeklyOption(willShow) {
    weekly = willShow

    if (willShow) {
        weeklyFormGroup.innerHTML = `
            <label for="number-of-weeks-input">For how many weeks? </label>
            <input type="number" id="number-of-weeks-input">
        `
    } else {
        weeklyFormGroup.innerHTML = ''
    }
}

async function handleCourseCreation(e) {
    e.preventDefault()

    const imageInput = document.getElementById('course-image-input')
    const nameInput = document.getElementById('course-name-input')
    const descriptionInput = document.getElementById('course-description-input')
    const locationInput = document.getElementById('course-location-input')
    const sizeInput = document.getElementById('course-size-input')
    const startTimeInput = document.getElementById('course-start-time-input')
    const durationInput = document.getElementById('course-length-input')

    imageInput.style.borderColor = 'gray'
    nameInput.style.borderColor = 'gray'
    descriptionInput.style.borderColor = 'gray'
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

    if (!confirmed) {
        document.getElementById('course-error-text').innerHTML = 'Fields must not be empty.'
        return
    }

    let imageURL;
    if (imageInput.files[0]) {
        imageURL = imageInput.files[0].name
    } else {
        imageURL = 'https://images.pond5.com/male-tutor-teaching-university-students-footage-040447646_iconl.jpeg'
    }

    getHighestCourseNumber()

    const bodyObj = {
        name: nameInput.value,
        description: descriptionInput.value,
        number: highestCourseNumber + 1,
        imageURL,
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

        if (weekly) {
            const numberOfWeeks = document.getElementById('number-of-weeks-input').value

            for (let i = 1; i < numberOfWeeks; i++) {
                const newStartTime = addWeek(bodyObj.startTime, i)

                const newBody = {
                    name: bodyObj.name,
                    description: bodyObj.description,
                    number: bodyObj.number,
                    imageURL: bodyObj.imageURL,
                    size: bodyObj.size,
                    startTime: newStartTime,
                    endTime: calculateEndTime(newStartTime, bodyObj.duration),
                    location: bodyObj.location
                }

                await fetch(`${baseURL}/${userId}`, {
                    method: "POST",
                    body: JSON.stringify(newBody),
                    headers
                })
                .catch(err => console.log(err))
            }
        }

        location.replace("./home.html")
    }
}

repeatingWeeklyCheck.addEventListener('click', () => handleWeeklyOption(repeatingWeeklyCheck.checked))

createCourseForm.addEventListener('submit', handleCourseCreation)