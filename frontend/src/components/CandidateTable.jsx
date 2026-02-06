function CandidateTable({ candidates, loading, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusClass = (status) => {
    const statusClasses = {
      'Applied': 'status-applied',
      'Interviewing': 'status-interviewing',
      'Hired': 'status-hired',
      'Rejected': 'status-rejected',
      'On Hold': 'status-onhold'
    }
    return statusClasses[status] || 'status-default'
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading candidates...</p>
      </div>
    )
  }

  if (candidates.length === 0) {
    return (
      <div className="empty-state">
        <h3>No Candidates Found</h3>
        <p>Start by adding your first candidate using the "Add New Candidate" button above.</p>
      </div>
    )
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Candidates ({candidates.length})</h2>
      </div>

      <div className="table-responsive">
        <table className="candidate-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Position</th>
              <th>Experience</th>
              <th>Skills</th>
              <th>Status</th>
              <th>Applied Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id}>
                <td>{candidate.id}</td>
                <td className="name-cell">{candidate.name}</td>
                <td>{candidate.age}</td>
                <td className="email-cell">{candidate.email}</td>
                <td>{candidate.phone || '-'}</td>
                <td>{candidate.applied_position || '-'}</td>
                <td>{candidate.experience || '-'}</td>
                <td className="skills-cell" title={candidate.skills}>
                  {candidate.skills || '-'}
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(candidate.status)}`}>
                    {candidate.status}
                  </span>
                </td>
                <td>{formatDate(candidate.created_at)}</td>
                <td className="actions-cell">
                  <button
                    className="btn-icon btn-edit"
                    onClick={() => onEdit(candidate)}
                    title="Edit candidate"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => onDelete(candidate.id)}
                    title="Delete candidate"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CandidateTable
