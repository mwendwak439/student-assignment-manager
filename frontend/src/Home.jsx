import { Link } from 'react-router-dom'
import './App.css'

function Home() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <h2 className="logo">StudentTask</h2>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>

        <Link to="/login" className="login-button">
          Login
        </Link>
      </nav>

      <main className="hero" id="home">
        <div className="hero-content">
          <p className="subtitle">YOUR STUDIES, ORGANIZED</p>

          <h1>
            Stay on top of
            <br />
            every assignment.
          </h1>

          <p className="description">
            Organize your academic tasks, track deadlines,
            and manage your assignments in one simple place.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-button">
              Get Started
            </Link>

            <a href="#features" className="secondary-button">
              Learn More
            </a>
          </div>

          <div className="hero-note">
            Simple. Organized. Productive.
          </div>
        </div>

        <div className="hero-card">
          <div className="card-header">
            <div>
              <p className="card-label">YOUR OVERVIEW</p>
              <h3>Assignment Summary</h3>
            </div>

            <span className="card-icon">✓</span>
          </div>

          <div className="stats">
            <div className="stat-box">
              <span>Total Tasks</span>
              <h2>12</h2>
            </div>

            <div className="stat-box">
              <span>Completed</span>
              <h2>8</h2>
            </div>

            <div className="stat-box">
              <span>Pending</span>
              <h2>4</h2>
            </div>
          </div>

          <h4 className="upcoming-title">Upcoming Assignments</h4>

          <div className="assignment-item">
            <div>
              <strong>Database Systems</strong>
              <p>BIT216</p>
            </div>
            <span className="priority high">High</span>
          </div>

          <div className="assignment-item">
            <div>
              <strong>Web Development</strong>
              <p>COM213</p>
            </div>
            <span className="priority medium">Medium</span>
          </div>

          <div className="assignment-item">
            <div>
              <strong>Statistics Exercise</strong>
              <p>STA205</p>
            </div>
            <span className="priority low">Low</span>
          </div>
        </div>
      </main>

      <section className="features" id="features">
        <h2>Everything you need to stay organized.</h2>

        <div className="feature-grid">
          <div className="feature-box">
            <span>📚</span>
            <h3>Manage Assignments</h3>
            <p>Keep your academic tasks organized in one place.</p>
          </div>

          <div className="feature-box">
            <span>📅</span>
            <h3>Track Deadlines</h3>
            <p>Keep track of upcoming submission dates.</p>
          </div>

          <div className="feature-box">
            <span>🎯</span>
            <h3>Track Progress</h3>
            <p>See which assignments are pending or completed.</p>
          </div>
        </div>
      </section>

      <footer id="about">
        <p>StudentTask — Built to make student life easier.</p>
      </footer>
    </div>
  )
}

export default Home