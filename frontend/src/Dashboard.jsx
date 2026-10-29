
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Dashboard.css'

const API_URL = 'http://localhost:8000/api'

function Dashboard() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await fetch(`${API_URL}/me/`, {
          credentials: 'include',
        })

        if (response.status === 401 || response.status === 403) {
          navigate('/login', { replace: true })
          return
        }

        if (!response.ok) {
          throw new Error('Could not check your login session.')
        }

        const data = await response.json()
        setUsername(data.username)
      } catch (error) {
        console.error('Dashboard error:', error)
        setError('Unable to connect to the server. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    checkLogin()
  }, [navigate])

  if (loading) {
    return <p className="dashboard-message">Loading your dashboard...</p>
  }

  if (error) {
    return <p className="dashboard-message">{error}</p>
  }

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <h2>StudentTask</h2>

        <nav>
          <Link to="/dashboard" className="active-link">
            Dashboard
          </Link>
          <a href="#assignments">My Assignments</a>
        </nav>

        <button
          className="logout-button"
          onClick={() => navigate('/login')}
        >
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">STUDENT WORKSPACE</p>
            <h1>Welcome back, {username}!</h1>
            <p>Here's your academic workspace.</p>
          </div>

          <div className="profile-circle">
            {username.charAt(0).toUpperCase()}
          </div>
        </header>

        <section className="dashboard-stats">
          <article className="dashboard-stat">
            <p>Total Assignments</p>
            <h2>0</h2>
          </article>

          <article className="dashboard-stat">
            <p>Pending</p>
            <h2>0</h2>
          </article>

          <article className="dashboard-stat">
            <p>In Progress</p>
            <h2>0</h2>
          </article>

          <article className="dashboard-stat">
            <p>Completed</p>
            <h2>0</h2>
          </article>
        </section>

        <section className="dashboard-assignments" id="assignments">
          <div className="section-heading">
            <div>
              <h2>My Assignments</h2>
              <p>Your academic tasks will appear here.</p>
            </div>
          </div>

          <div className="empty-assignments">
            <span>📚</span>
            <h3>No assignments displayed yet</h3>
            <p>We'll connect your assignments to this dashboard next.</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
