import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const API_URL = 'http://localhost:8000/api'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setIsLoading(true)

    try {
      // Get a CSRF token from Django
      const csrfResponse = await fetch(`${API_URL}/csrf/`, {
        credentials: 'include',
      })

      if (!csrfResponse.ok) {
        throw new Error('Could not obtain a security token.')
      }

      const csrfData = await csrfResponse.json()

      // Send login details to Django
      const response = await fetch(`${API_URL}/login/`, {
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

      if (response.ok) {
       navigate('/dashboard')

      } else {
        setMessage(data.error || 'Login failed. Check your credentials.')
      }
    } catch (error) {
      console.error('Login error:', error)
      setMessage('Unable to connect to Django. Check your backend server.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome Back</h1>

        <p className="login-description">
          Log in to manage your assignments and track your deadlines.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="loginUsername">Username</label>

          <input
            id="loginUsername"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label htmlFor="loginPassword">Password</label>

          <input
            id="loginPassword"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button
            type="submit"
            className="login-submit"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {message && (
          <p role="status" aria-live="polite">
            {message}
          </p>
        )}

        <p className="register-prompt">
          Don't have an account? <Link to="/register">Create Account</Link>
        </p>
      </div>
    </div>
  )
}

export default Login