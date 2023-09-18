const baseURL = 'http://localhost:8080/api/v1'
const headers = {"Content-Type":"application/json"}

const cookieArr = document.cookie.split("=")
const userId = +cookieArr[1]

function handleLogout() {
    let c = document.cookie.split(";")
    for (let i in c) {
        document.cookie = /^[^=]+/.exec(c[i])[0]+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
    location.reload();
}

async function getUserById() {
    const user = await fetch(`${baseURL}/users/${userId}`, {
        method: "GET",
        headers
    })
    .then(res => res.json())
    .then(data => updateWelcomeText(data))
    .catch(err => console.log(err))
}

function updateWelcomeText(user) {
    document.querySelector('#home-sidebar > h4').textContent = `Welcome, ${user.firstName}.`
}

if (userId) {
    document.querySelector('header').innerHTML += `
        <div class="header-btn-container">
            <a class="btn btn-primary" id="login-btn" onclick="handleLogout()">Log Out</a>
        </div>
    `
    
    updateWelcomeText(getUserById())
} else {
    document.querySelector('header').innerHTML += `
        <div class="header-btn-container">
            <a class="btn btn-primary" id="login-btn" onclick="location.replace('./login.html')">Login</a>
            <a class="btn btn-primary" id="register-btn" onclick="location.replace('./register.html')">Register</a>
        </div>
    `

    document.querySelector('#home-sidebar > h4').textContent = 'Welcome, Guest.'
}