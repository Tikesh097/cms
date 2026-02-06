import { useState, useEffect } from 'react'

function CandidateForm({ candidate, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    skills: '',
    experience: '',
    applied_position: '',
    status: 'Applied'
  })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (candidate) {
      setFormData({
        name: candidate.name || '',
        age: candidate.age || '',
        email: candidate.email || '',
        phone: candidate.phone || '',
        skills: candidate.skills || '',
        experience: candidate.experience || '',
        applied_position: candidate.applied_position || '',
        status: candidate.status || 'Applied'
      })
    }
  }, [candidate])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.age) {
      newErrors.age = 'Age is required'
    } else if (formData.age < 1 || formData.age > 150) {
      newErrors.age = 'Age must be between 1 and 150'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    const dataToSubmit = {
      ...formData,
      age: parseInt(formData.age)
    }

    const success = candidate
      ? await onSubmit(candidate.id, dataToSubmit)
      : await onSubmit(dataToSubmit)

    setSubmitting(false)

    if (success) {
      // Reset form if creating new
      if (!candidate) {
        setFormData({
          name: '',
          age: '',
          email: '',
          phone: '',
          skills: '',
          experience: '',
          applied_position: '',
          status: 'Applied'
        })
      }
    }
  }

  return (
    <div className="candidate-form-container">
      <h2>{candidate ? 'Edit Candidate' : 'Add New Candidate'}</h2>

      <form onSubmit={handleSubmit} className="candidate-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">
              Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Enter full name"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="age">
              Age <span className="required">*</span>
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={errors.age ? 'error' : ''}
              placeholder="Enter age"
              min="1"
              max="150"
            />
            {errors.age && <span className="error-text">{errors.age}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="email@example.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1234567890"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="applied_position">Applied Position</label>
            <input
              type="text"
              id="applied_position"
              name="applied_position"
              value={formData.applied_position}
              onChange={handleChange}
              placeholder="e.g., Software Engineer"
            />
          </div>

          <div className="form-group">
            <label htmlFor="experience">Experience</label>
            <input
              type="text"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g., 3 years"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="skills">Skills</label>
          <textarea
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g., JavaScript, React, Node.js, PostgreSQL"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Hired">Hired</option>
            <option value="Rejected">Rejected</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : candidate ? 'Update Candidate' : 'Add Candidate'}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default CandidateForm
