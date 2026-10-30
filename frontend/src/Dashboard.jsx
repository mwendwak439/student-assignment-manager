
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Dashboard.css'

const API_URL = 'http://localhost:8000/api'

const emptyFormData = {
  title: '',
  description: '',
  unit_name: '',
  due_date: '',
  priority: 'Medium',
  status: 'Pending',
}

function getCookie(name) {
  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${name}=`))

  return cookie
    ? decodeURIComponent(cookie.split('=').slice(1).join('='))
    : ''
}

function Dashboard() {
  const [username, setUsername] = useState('')
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [statusError, setStatusError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(emptyFormData)
  const [updatingStatusId, setUpdatingStatusId] = useState(null)

  const navigate = useNavigate()

  // Load the logged-in user and their assignments.
  useEffect(() => {
    async function loadDashboard() {
      try {
        const userResponse = await fetch(`${API_URL}/me/`, {
          credentials: 'include',
        })

        if (
          userResponse.status === 401 ||
          userResponse.status === 403
        ) {
          navigate('/login', { replace: true })
          return
        }

        if (!userResponse.ok) {
          throw new Error('Could not check your login session.')
        }

        const userData = await userResponse.json()
        setUsername(userData.username)

        const assignmentsResponse = await fetch(
          `${API_URL}/assignments/`,
          { credentials: 'include' },
        )

        if (
          assignmentsResponse.status === 401 ||
          assignmentsResponse.status === 403
        ) {
          navigate('/login', { replace: true })
          return
        }

        if (!assignmentsResponse.ok) {
          throw new Error('Could not load your assignments.')
        }

        const assignmentsData = await assignmentsResponse.json()

        const assignmentList = Array.isArray(assignmentsData)
          ? assignmentsData
          : assignmentsData.results

        if (!Array.isArray(assignmentList)) {
          throw new Error('Unexpected assignments response.')
        }

        setAssignments(assignmentList)
      } catch (error) {
        console.error('Dashboard error:', error)
        setError(error.message || 'Unable to connect to the server.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [navigate])

  // Properly log out the user from Django.
  async function handleLogout() {
    try {
      const csrfResponse = await fetch(`${API_URL}/csrf/`, {
        credentials: 'include',
      })

      if (!csrfResponse.ok) {
        throw new Error('Could not prepare the security token.')
      }

      const csrfData = await csrfResponse.json()

      const csrfToken =
        getCookie('csrftoken') ||
        csrfData.csrfToken ||
        csrfData.csrf_token

      if (!csrfToken) {
        throw new Error('CSRF token not found. Please refresh the page.')
      }

      const response = await fetch(`${API_URL}/logout/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-CSRFToken': csrfToken,
        },
      })

      if (!response.ok) {
        throw new Error('Logout failed. Please try again.')
      }

      // Clear dashboard data and redirect after successful logout.
      setUsername('')
      setAssignments([])
      navigate('/login', { replace: true })

    } catch (error) {
      console.error('Logout error:', error)
      alert(error.message || 'Something went wrong during logout.')
    }
  }

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
  }

  // Open the form for creating a new assignment.
  function openCreateForm() {
    setEditingId(null)
    setFormData({ ...emptyFormData })
    setFormError('')
    setStatusError('')
    setSuccessMessage('')
    setShowForm(true)
  }

  // Load an existing assignment into the form for editing.
  function handleEdit(assignment) {
    setEditingId(assignment.id)

    setFormData({
      title: assignment.title || '',
      description: assignment.description || '',
      unit_name: assignment.unit_name || '',
      due_date: assignment.due_date || '',
      priority: assignment.priority || 'Medium',
      status: assignment.status || 'Pending',
    })

    setFormError('')
    setStatusError('')
    setSuccessMessage('')
    setShowForm(true)

    document.getElementById('assignments')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  // Delete an assignment.
  async function handleDelete(assignmentId) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this assignment?',
    )

    if (!confirmDelete) return

    setSuccessMessage('')
    setStatusError('')

    try {
      const csrfResponse = await fetch(`${API_URL}/csrf/`, {
        credentials: 'include',
      })

      if (!csrfResponse.ok) {
        throw new Error('Could not prepare the security token.')
      }

      const csrfData = await csrfResponse.json()

      const csrfToken =
        getCookie('csrftoken') ||
        csrfData.csrfToken ||
        csrfData.csrf_token

      if (!csrfToken) {
        throw new Error('CSRF token not found. Please refresh the page.')
      }

      const response = await fetch(
        `${API_URL}/assignments/${assignmentId}/`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'X-CSRFToken': csrfToken,
          },
        },
      )

      if (!response.ok) {
        throw new Error('Could not delete the assignment.')
      }

      setAssignments((previousAssignments) =>
        previousAssignments.filter(
          (assignment) => assignment.id !== assignmentId,
        ),
      )

      setSuccessMessage('Assignment deleted successfully!')
    } catch (error) {
      console.error('Delete error:', error)
      setStatusError(error.message || 'Something went wrong.')
    }
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setFormData({ ...emptyFormData })
    setFormError('')
  }

  // Create or edit an assignment.
  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    setSuccessMessage('')

    try {
      const csrfResponse = await fetch(`${API_URL}/csrf/`, {
        credentials: 'include',
      })

      if (!csrfResponse.ok) {
        throw new Error('Could not prepare the security token.')
      }

      const csrfData = await csrfResponse.json()

      const csrfToken =
        getCookie('csrftoken') ||
        csrfData.csrfToken ||
        csrfData.csrf_token

      if (!csrfToken) {
        throw new Error(
          'CSRF token not found. Please refresh the page and try again.',
        )
      }

      const isEditing = editingId !== null

      const url = isEditing
        ? `${API_URL}/assignments/${editingId}/`
        : `${API_URL}/assignments/`

      const response = await fetch(url, {
        method: isEditing ? 'PATCH' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error(
            'Your session may have expired. Please log in again.',
          )
        }

        const errorMessage =
          data.detail ||
          Object.entries(data)
            .map(([field, messages]) => {
              const message = Array.isArray(messages)
                ? messages.join(', ')
                : String(messages)

              return `${field}: ${message}`
            })
            .join(' | ') ||
          'Could not save the assignment.'

        throw new Error(errorMessage)
      }

      if (isEditing) {
        setAssignments((previousAssignments) =>
          previousAssignments.map((assignment) =>
            assignment.id === editingId
              ? { ...assignment, ...data }
              : assignment,
          ),
        )

        setSuccessMessage('Assignment updated successfully!')
      } else {
        setAssignments((previousAssignments) => [
          data,
          ...previousAssignments,
        ])

        setSuccessMessage('Assignment created successfully!')
      }

      closeForm()
    } catch (error) {
      console.error('Save assignment error:', error)
      setFormError(error.message || 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  // Update assignment status.
  async function handleStatusChange(assignmentId, newStatus) {
    setUpdatingStatusId(assignmentId)
    setStatusError('')
    setSuccessMessage('')

    try {
      const csrfResponse = await fetch(`${API_URL}/csrf/`, {
        credentials: 'include',
      })

      if (!csrfResponse.ok) {
        throw new Error('Could not prepare the security token.')
      }

      const csrfData = await csrfResponse.json()

      const csrfToken =
        getCookie('csrftoken') ||
        csrfData.csrfToken ||
        csrfData.csrf_token

      if (!csrfToken) {
        throw new Error('CSRF token not found. Please refresh the page.')
      }

      const response = await fetch(
        `${API_URL}/assignments/${assignmentId}/`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error(
            'Your session may have expired. Please log in again.',
          )
        }

        const message =
          data.detail ||
          Object.entries(data)
            .map(([field, messages]) => {
              const messageText = Array.isArray(messages)
                ? messages.join(', ')
                : String(messages)

              return `${field}: ${messageText}`
            })
            .join(' | ') ||
          'Could not update the assignment status.'

        throw new Error(message)
      }

      setAssignments((previousAssignments) =>
        previousAssignments.map((assignment) =>
          assignment.id === assignmentId
            ? { ...assignment, ...data }
            : assignment,
        ),
      )

      setSuccessMessage('Assignment status updated successfully!')
    } catch (error) {
      console.error('Status update error:', error)
      setStatusError(error.message || 'Something went wrong.')
    } finally {
      setUpdatingStatusId(null)
    }
  }

  // Calculate dashboard statistics.
  const totalAssignments = assignments.length

  const pendingAssignments = assignments.filter(
    (assignment) => assignment.status === 'Pending',
  ).length

  const inProgressAssignments = assignments.filter(
    (assignment) => assignment.status === 'In Progress',
  ).length

  const completedAssignments = assignments.filter(
    (assignment) => assignment.status === 'Completed',
  ).length

  if (loading) {
    return (
      <p className="dashboard-message">
        Loading your dashboard...
      </p>
    )
  }

  if (error) {
    return (
      <div className="dashboard-message">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    )
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
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">
              STUDENT WORKSPACE
            </p>

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
            <h2>{totalAssignments}</h2>
          </article>

          <article className="dashboard-stat">
            <p>Pending</p>
            <h2>{pendingAssignments}</h2>
          </article>

          <article className="dashboard-stat">
            <p>In Progress</p>
            <h2>{inProgressAssignments}</h2>
          </article>

          <article className="dashboard-stat">
            <p>Completed</p>
            <h2>{completedAssignments}</h2>
          </article>
        </section>

        <section
          className="dashboard-assignments"
          id="assignments"
        >
          <div className="section-heading">
            <div>
              <h2>My Assignments</h2>
              <p>Keep track of your academic tasks.</p>
            </div>

            <button
              className="add-assignment-button"
              onClick={() => {
                if (showForm) {
                  closeForm()
                } else {
                  openCreateForm()
                }
              }}
            >
              {showForm ? 'Cancel' : '+ Add Assignment'}
            </button>
          </div>

          {statusError && (
            <p className="form-error" role="alert">
              {statusError}
            </p>
          )}

          {successMessage && (
            <p className="success-message" role="status">
              {successMessage}
            </p>
          )}

          {showForm && (
            <form
              className="assignment-form"
              onSubmit={handleSubmit}
            >
              <h3>
                {editingId !== null
                  ? 'Edit Assignment'
                  : 'Create a New Assignment'}
              </h3>

              <label htmlFor="title">Assignment Title</label>

              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Python Assignment 1"
                value={formData.title}
                onChange={handleChange}
                maxLength={200}
                required
              />

              <label htmlFor="description">Description</label>

              <textarea
                id="description"
                name="description"
                placeholder="Describe your assignment..."
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />

              <label htmlFor="unit_name">Unit Name</label>

              <input
                id="unit_name"
                name="unit_name"
                type="text"
                placeholder="e.g. BIT216"
                value={formData.unit_name}
                onChange={handleChange}
                maxLength={100}
                required
              />

              <label htmlFor="due_date">Due Date</label>

              <input
                id="due_date"
                name="due_date"
                type="date"
                value={formData.due_date}
                onChange={handleChange}
                required
              />

              <label htmlFor="priority">Priority</label>

              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <label htmlFor="status">Status</label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              {formError && (
                <p className="form-error" role="alert">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                className="submit-assignment-button"
                disabled={saving}
              >
                {saving
                  ? 'Saving...'
                  : editingId !== null
                    ? 'Save Changes'
                    : 'Save Assignment'}
              </button>
            </form>
          )}

          {assignments.length === 0 ? (
            <div className="empty-assignments">
              <span>📚</span>
              <h3>No assignments yet</h3>
              <p>
                Click "Add Assignment" to create your first task.
              </p>
            </div>
          ) : (
            <div className="assignment-list">
              {assignments.map((assignment) => (
                <article
                  className="assignment-card"
                  key={assignment.id}
                >
                  <div className="assignment-card-header">
                    <h3>{assignment.title}</h3>

                    <select
                      className={`assignment-status-select status-${assignment.status
                        .toLowerCase()
                        .replace(/\s+/g, '-')}`}
                      value={assignment.status}
                      disabled={updatingStatusId === assignment.id}
                      onChange={(event) =>
                        handleStatusChange(
                          assignment.id,
                          event.target.value,
                        )
                      }
                      aria-label={`Update status for ${assignment.title}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <p className="assignment-unit">
                    Unit: {assignment.unit_name}
                  </p>

                  {assignment.description && (
                    <p className="assignment-description">
                      {assignment.description}
                    </p>
                  )}

                  <div className="assignment-details">
                    <p>
                      <strong>Due date:</strong>{' '}
                      {assignment.due_date
                        ? new Date(
                            `${assignment.due_date}T00:00:00`,
                          ).toLocaleDateString()
                        : 'Not set'}
                    </p>

                    <p>
                      <strong>Priority:</strong>{' '}
                      {assignment.priority}
                    </p>
                  </div>

                  <div className="assignment-actions">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(assignment)}
                    >
                      Edit Assignment
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => handleDelete(assignment.id)}
                    >
                      Delete Assignment
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Dashboard
