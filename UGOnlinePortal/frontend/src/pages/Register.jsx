import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Register() {
  const [activeTab, setActiveTab] = useState('student')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rollNumber: '',
    branch: '',
    section: '',
    branches: '',
    sections: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const dataToSend = { ...formData }
      if (activeTab === 'professor') {
        dataToSend.branches = dataToSend.branches.split(',').map(branch => branch.trim())
        dataToSend.sections = dataToSend.sections.split(',').map(section => section.trim())
      }
      await axios.post(`${process.env.BACKEND_URL}/api/${activeTab}/register`, dataToSend)
      navigate(`/login`)
    } catch (error) {
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const tabStyle = (tab) => ({
    padding: '10px',
    marginRight: '10px',
    backgroundColor: activeTab === tab ? '#f0f0f0' : 'transparent',
    border: 'none',
    borderBottom: activeTab === tab ? '2px solid #007bff' : 'none',
    cursor: 'pointer'
  })

  const inputStyle = {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #ccc' }}>
        <button onClick={() => setActiveTab('student')} style={tabStyle('student')}>
          Student
        </button>
        <button onClick={() => setActiveTab('professor')} style={tabStyle('professor')}>
          Professor
        </button>
        <button onClick={() => setActiveTab('admin')} style={tabStyle('admin')}>
          Admin
        </button>
      </div>

      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Registration
      </h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        {activeTab === 'student' && (
          <>
            <input
              type="text"
              name="rollNumber"
              placeholder="Enter your roll number"
              value={formData.rollNumber}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="text"
              name="branch"
              placeholder="Enter your branch"
              value={formData.branch}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="text"
              name="section"
              placeholder="Enter your section"
              value={formData.section}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </>
        )}
        {activeTab === 'professor' && (
          <>
            <input
              type="text"
              name="branches"
              placeholder="Enter branches (comma-separated)"
              value={formData.branches}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="text"
              name="sections"
              placeholder="Enter sections (comma-separated)"
              value={formData.sections}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </>
        )}
        {error && (
          <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Already have an account?{' '}
        <a href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
          Login here
        </a>
      </p>
    </div>
  )
}