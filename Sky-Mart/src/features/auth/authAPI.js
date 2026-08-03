const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const loginRequest = async ({ email, password }) => {
    await delay(600)

    const storedUser = JSON.parse(localStorage.getItem('skymart_demo_user') || 'null')
    const isValid = storedUser && storedUser.email === email && storedUser.password === password

    if (!isValid) {
        throw new Error('Invalid email or password.')
    }

    return {
        user: storedUser,
        token: 'demo-token-' + storedUser.email,
    }
}

export const registerRequest = async ({ name, email, password }) => {
    await delay(700)

    const existing = JSON.parse(localStorage.getItem('skymart_demo_user') || 'null')
    if (existing && existing.email === email) {
        throw new Error('An account with this email already exists.')
    }

    const user = {
        id: crypto.randomUUID(),
        name,
        email,
        password,
    }

    localStorage.setItem('skymart_demo_user', JSON.stringify(user))

    return {
        user,
        token: 'demo-token-' + email,
    }
}
