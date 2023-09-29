const baseURL = 'http://18.223.122.66:8080/api/v1/courses'
const headers = {"Content-Type":"application/json"}

const cookies = document.cookie.split(";")
const userId = +cookies[0].split("=")[1]

const createCourseForm = document.getElementById('create-course-form')
const repeatingWeeklyCheck = document.getElementById('course-repeating-weekly-check')
const weeklyFormGroup = document.getElementById('weekly-form-group')

document.getElementById('course-error-text').innerHTML = ''

let highestCourseNumber = 0;
let weekly = false
let course

const query = document.URL.split("?")[1]
const courseId = +query.split('&')[0].split('=')[1]
const courseNumber = +query.split("&")[1].split('=')[1]

checkIfUserIsInstructor()

async function checkIfUserIsInstructor() {
    await fetch(`${baseURL}/${courseId}`, {
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

async function getLatestCourseFromNumber() {
    await fetch(`${baseURL}/byNumber/${courseNumber}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => renderOldValues(data))
    .catch(err => console.log(err))
}

function renderOldValues(course) {
    document.getElementById('course-name-input').value = course.name
    document.getElementById('course-description-input').value = course.description
    document.getElementById('course-location-input').value = course.location
    document.getElementById('course-size-input').value = course.size
}

function calculateEndTime(startTime, duration) {
    const time = startTime.split("T")

    const endDateArr = time[0].split('-')
    let endYear = +endDateArr[0]
    let endMonth = +endDateArr[1]
    let endDate = +endDateArr[2]

    const endTimeArr = time[1].split(":")
    let endTimeHour = +endTimeArr[0]
    let endTimeMinute = +endTimeArr[1]

    while (duration >= 60) {
        endTimeHour++
        duration -= 60

        if (endTimeHour >= 24) {
            endTimeHour -= 24
            
            endDate++
            if (endDate > new Date(endYear, endMonth, 0)) {
                endDate -= new Date(endYear, endMonth, 0)

                endMonth++
                if (endMonth > 12) {
                    endMonth -= 12
                    endYear++
                }
            }
        }
    }

    while (duration > 0) {
        endTimeMinute++
        duration--

        if (endTimeMinute === 60) {
            endTimeHour++
            endTimeMinute = 0

            if (endTimeHour >= 24) {
                endTimeHour -= 24
                
                endDate++
                if (endDate > new Date(endYear, endMonth, 0)) {
                    endDate -= new Date(endYear, endMonth, 0)
    
                    endMonth++
                    if (endMonth > 12) {
                        endMonth -= 12
                        endYear++
                    }
                }
            }
        }
    }

    if (endTimeHour < 10) {
        endTimeHour = String(endTimeHour).padStart(2, '0')
    }

    if (endTimeMinute < 10) {
        endTimeMinute = String(endTimeMinute).padStart(2, '0')
    }

    return `${endYear}-${String(endMonth).padStart(2, '0')}-${String(endDate).padStart(2, '0')}T${endTimeHour}:${endTimeMinute}`
}

function addDay(datetime, numberOfDays, spacing) {
    let newDate = new Date(datetime)
    let year = newDate.getFullYear()
    let month = newDate.getMonth() + 1
    let date = newDate.getDate()

    date += numberOfDays + spacing
    while (date > new Date(year, month, 0).getDate()) {
        date -= new Date(year, month, 0).getDate()
        month++
        if (month > 12) {
            month -= 12
            year++
        }
    }

    return `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}T${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}`
}

function addWeek(datetime, numberOfWeeks) {
    let newDate = new Date(datetime)
    let year = newDate.getFullYear()
    let month = newDate.getMonth() + 1
    let date = newDate.getDate()

    date += numberOfWeeks * 7
    while (date > new Date(year, month, 0).getDate()) {
        date -= new Date(year, month, 0).getDate()
        month++
        if (month > 12) {
            month -= 12
            year++
        }
    }

    return `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}T${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}`
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

function handleDailyOption(willShow) {
    daily = willShow

    if (willShow) {
        dailyFormGroup.innerHTML = `
            <label for="number-of-days-input">For how many days? </label>
            <input type="number" id="number-of-days-input">
        `

        dailySpacingGroup.innerHTML = `
            <label for="spacing-input">Spacing Between Days: </label>
            <input type="number" id="spacing-input">
        `
    } else {
        dailyFormGroup.innerHTML = ''
        dailySpacingGroup.innerHTML = ''
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
    if (imageInput.value) {
        imageURL = imageInput.value
    } else {
        imageURL = 'https://images.pond5.com/male-tutor-teaching-university-students-footage-040447646_iconl.jpeg'
    }

    const bodyObj = {
        name: nameInput.value,
        description: descriptionInput.value,
        number: courseNumber,
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

        if (daily) {
            console.log("Making daily course")
            const numberOfDays = document.getElementById('number-of-days-input').value

            for (let i = 1; i < numberOfDays; i++) {
                console.log(i)
                const newStartTime = addDay(bodyObj.startTime, i, +document.getElementById('spacing-input').value)

                const newBody = {
                    name: bodyObj.name,
                    description: bodyObj.description,
                    number: bodyObj.number,
                    imageURL: bodyObj.imageURL,
                    size: bodyObj.size,
                    startTime: newStartTime,
                    endTime: calculateEndTime(newStartTime, durationInput.value),
                    location: bodyObj.location
                }

                const dayRes = await fetch(`${baseURL}/${userId}`, {
                    method: "POST",
                    body: JSON.stringify(newBody),
                    headers
                })
                .catch(err => console.log(err))

                if (weekly && dayRes.status === 200) {
                    console.log("Making course for next week")
                    const numberOfWeeks = document.getElementById('number-of-weeks-input').value

                    for (let j = 1; j < numberOfWeeks; j++) {
                        const newWeekStartTime = addWeek(newBody.startTime, j)

                        const newWeekBody = {
                            name: newBody.name,
                            description: newBody.description,
                            number: bodyObj.number,
                            imageURL: newBody.imageURL,
                            size: newBody.size,
                            startTime: newWeekStartTime,
                            endTime: calculateEndTime(newWeekStartTime, durationInput.value),
                            location: newBody.location
                        }

                        await fetch(`${baseURL}/${userId}`, {
                            method: "POST",
                            body: JSON.stringify(newWeekBody),
                            headers
                        })
                        .catch(err => console.log(err))
                    }
                }
            }
        } else if (weekly) {
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
                    endTime: calculateEndTime(newStartTime, durationInput.value),
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

        location.replace("/")
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

getLatestCourseFromNumber()

repeatingWeeklyCheck.addEventListener('click', () => handleWeeklyOption(repeatingWeeklyCheck.checked))

createCourseForm.addEventListener('submit', handleCourseCreation)