const registerForm = document.getElementById("register-form")
const toLoginBtn = document.getElementById('to-login-btn')

const headers = {"Content-Type":"application/json"}
const baseURL = 'http://3.15.210.40:8080/api/v1/users'

document.getElementById('register-error-text').textContent = ''

async function handleRegister(e) {
    e.preventDefault();

    document.getElementById('register-first-name-input').style.borderColor = "gray"
    document.getElementById('register-last-name-input').style.borderColor = "gray"
    document.getElementById('register-email-input').style.borderColor = "gray"
    document.getElementById('register-password-input').style.borderColor = "gray"
    document.getElementById('register-password-confirm').style.borderColor = "gray"

    document.getElementById('register-error-text').textContent = ''

    let confirmed = 1

    const firstName = document.getElementById("register-first-name-input").value
    const lastName = document.getElementById("register-last-name-input").value
    const email = document.getElementById("register-email-input").value
    const password = document.getElementById('register-password-input').value
    const passwordConfirm = document.getElementById('register-password-confirm').value

    if (password != passwordConfirm) {
        confirmed = 2
        document.getElementById('register-password-input').style.borderColor = "red"
        document.getElementById('register-password-confirm').style.borderColor = "red"
    }

    if (!firstName) {
        confirmed = 0
        document.getElementById('register-first-name-input').style.borderColor = "red"
    }
    if (!lastName) {
        confirmed = 0
        document.getElementById('register-last-name-input').style.borderColor = "red"
    }
    if (!email) {
        confirmed = 0
        document.getElementById('register-email-input').style.borderColor = "red"
    }
    if (!password) {
        confirmed = 0
        document.getElementById('register-password-input').style.borderColor = "red"
        document.getElementById('register-password-confirm').style.borderColor = "red"
    }

    if (confirmed === 0) {
        document.getElementById('register-error-text').textContent = 'All fields must be filled.'
        return
    } else if (confirmed === 2) {
        document.getElementById('register-error-text').textContent = 'Passwords must match.'
        return
    }

    const bodyObj = {
        firstName,
        lastName,
        email,
        password,
        permission: 0
    }

    const response = await fetch(`${baseURL}/register`, {
        method: "POST",
        body: JSON.stringify(bodyObj),
        headers
    })
    .catch(err => console.log(err))

    if (response.status === 200) {
        if (document.cookie) {
            let c = document.cookie.split(';')
            for (let i in c) {
                document.cookie = /^[^=]+/.exec(c[i])[0]+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
            }
        }

        location.replace('/login')
    } else {
        document.getElementById('register-email-input').style.borderColor = "red"
        document.getElementById('register-error-text').textContent = 'Email is already in use.'
    }
}

registerForm.addEventListener('submit', handleRegister)
toLoginBtn.addEventListener('click', () => location.replace('/login'))