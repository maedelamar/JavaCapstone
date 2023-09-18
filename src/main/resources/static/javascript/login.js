const loginForm = document.getElementById('login-form')
const toRegisterBtn = document.getElementById('to-register-btn')

const headers = {"Content-Type":"application/json"}
const baseURL = 'http://localhost:8080/api/v1/users'

document.getElementById('login-error-text').textContent = ''

async function handleLogin(e) {
    e.preventDefault();

    document.getElementById('login-email-input').style.borderColor = "black"
    document.getElementById('login-password-input').style.borderColor = "black"

    document.getElementById('login-error-text').textContent = ''

    const email = document.getElementById('login-email-input').value
    const password = document.getElementById('login-password-input').value

    let confirmed = true

    if (!email) {
        confirmed = false
        document.getElementById('login-email-input').style.borderColor = 'red'
    }
    if (!password) {
        confirmed = false
        document.getElementById('login-password-input').style.borderColor = 'red'
    }

    if (!confirmed) {
        document.getElementById('login-error-text').textContent = 'All fields must be filled.'
        return
    }

    const bodyObj = {
        email,
        password
    }

    const response = await fetch(`${baseURL}/login`, {
        method: "POST",
        body: JSON.stringify(bodyObj),
        headers
    })
    .catch(err => {
        document.getElementById('login-error-text').textContent = 'Bad email or password.'
        console.log(err)
    })

    const responseArr = await response.json()

    if (response.status === 200) {
        if (document.cookie) {
            let c = document.cookie.split(";")
            for (let i in c) {
                document.cookie = /^[^=]+/.exec(c[i])[0]+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
            }
        }

        if (responseArr[1]) {
            document.cookie = `userId=${responseArr[1]}`
            location.replace('./home.html')
        } else {
            document.getElementById('login-email-input').style.borderColor = 'red'
            document.getElementById('login-password-input').style.borderColor = 'red'
            document.getElementById('login-error-text').textContent = 'Bad username or password.'
        }
    } else {
        alert(`Error in login: ${response.status}`)
    }
}

loginForm.addEventListener('submit', handleLogin)
toRegisterBtn.addEventListener('click', () => location.replace('./register.html'))