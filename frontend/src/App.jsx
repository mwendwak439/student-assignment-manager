import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Register from './Register'
import Login from './Login'
import Dashboard from './Dashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App