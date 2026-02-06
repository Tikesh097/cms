import { useState, useEffect } from 'react'
import {
  getAllCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate
} from './services/api'
import CandidateForm from './components/CandidateForm'
import CandidateTable from './components/CandidateTable'
import './App.css'

function App() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [editingCandidate, setEditingCandidate] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAllCandidates()
      setCandidates(response.data || [])
    } catch (err) {
      setError('Failed to fetch candidates. Please check if the backend server is running.')
      console.error('Error fetching candidates:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCandidate = async (candidateData) => {
    try {
      setError(null)
      const response = await createCandidate(candidateData)
      setCandidates([response.data, ...candidates])
      setSuccess('Candidate added successfully!')
      setShowForm(false)
      setTimeout(() => setSuccess(null), 3000)
      return true
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to create candidate'
      setError(errorMessage)
      return false
    }
  }

  const handleUpdateCandidate = async (id, candidateData) => {
    try {
      setError(null)
      const response = await updateCandidate(id, candidateData)
      setCandidates(candidates.map(c => c.id === id ? response.data : c))
      setSuccess('Candidate updated successfully!')
      setEditingCandidate(null)
      setShowForm(false)
      setTimeout(() => setSuccess(null), 3000)
      return true
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to update candidate'
      setError(errorMessage)
      return false
    }
  }

  const handleDeleteCandidate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) {
      return
    }

    try {
      setError(null)
      await deleteCandidate(id)
      setCandidates(candidates.filter(c => c.id !== id))
      setSuccess('Candidate deleted successfully!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to delete candidate'
      setError(errorMessage)
    }
  }

  const handleEdit = (candidate) => {
    setEditingCandidate(candidate)
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setEditingCandidate(null)
    setShowForm(false)
  }

  const handleAddNew = () => {
    setEditingCandidate(null)
    setShowForm(true)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Candidate Management System</h1>
        <p>Streamline your recruitment process</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <span>{success}</span>
            <button onClick={() => setSuccess(null)}>×</button>
          </div>
        )}

        <div className="actions-bar">
          <button
            className="btn btn-primary"
            onClick={handleAddNew}
            disabled={showForm}
          >
            + Add New Candidate
          </button>

          <button
            className="btn btn-secondary"
            onClick={fetchCandidates}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : '↻ Refresh'}
          </button>
        </div>

        {showForm && (
          <CandidateForm
            candidate={editingCandidate}
            onSubmit={editingCandidate ? handleUpdateCandidate : handleCreateCandidate}
            onCancel={handleCancelForm}
          />
        )}

        <CandidateTable
          candidates={candidates}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDeleteCandidate}
        />
      </main>
    </div>
  )
}

export default App
