import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Register.css'

const API_URL = 'http://localhost:8000/api'

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    setIsLoading(true)

    try {
      // Step 1: Get a CSRF token from Django
      const csrfResponse = await fetch(`${API_URL}/csrf/`, {
        credentials: 'include',
      })

      if (!csrfResponse.ok) {
        throw new Error('Could not connect to the server.')
      }

      const csrfData = await csrfResponse.json()

      // Step 2: Send registration details to Django
      const response = await fetch(`${API_URL}/register/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfData.csrfToken,
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      })

      const data = await response.json()

      // Step 3: Display the result
      if (response.ok) {
        setMessage('Account created successfully! You can now log in.')

        setUsername('')
        setPassword('')
        setConfirmPassword('')
      } else {
        setMessage(
          data.error || 'Registration failed. Please try again.'
        )
      }
    } catch (error) {
      console.error('Registration error:', error)

      setMessage(
        'Unable to connect to Django. Check that your backend server is running.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>Create Account</h1>

        <p className="register-description">
          Create your StudentTask account and organize your assignments.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>

          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
          />

          <label htmlFor="confirmPassword">Confirm Password</label>

          <input
            id="confirmPassword"
            type="password"
            placeholder="Enter your password again"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            minLength={8}
          />

          <button
            type="submit"
            className="register-submit"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {message && (
          <p role="status" aria-live="polite">
            {message}
          </p>
        )}

       <p className="login-prompt">
         Already have an account? <Link to="/login">Login</Link>
       </p>
      </div>
    </div>
  )
}

export default Register