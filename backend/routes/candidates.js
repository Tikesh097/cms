import express from 'express'
import pool from '../models/db.js'
import {
  validateCreateCandidate,
  validateUpdateCandidate,
  validateDeleteCandidate,
  validateGetCandidate
} from '../middleware/validator.js'

const router = express.Router()

// GET /api/candidates - Get all candidates
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM candidates ORDER BY created_at DESC'
    )

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    })
  } catch (error) {
    console.error('Error fetching candidates:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch candidates',
      message: error.message
    })
  }
})

// GET /api/candidates/:id - Get single candidate
router.get('/:id', validateGetCandidate, async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'SELECT * FROM candidates WHERE id = $1',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found'
      })
    }

    res.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error fetching candidate:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch candidate',
      message: error.message
    })
  }
})

// POST /api/candidates - Create new candidate
router.post('/', validateCreateCandidate, async (req, res) => {
  try {
    const {
      name,
      age,
      email,
      phone,
      skills,
      experience,
      applied_position,
      status
    } = req.body

    const result = await pool.query(
      `INSERT INTO candidates
       (name, age, email, phone, skills, experience, applied_position, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        name,
        age,
        email,
        phone || null,
        skills || null,
        experience || null,
        applied_position || null,
        status || 'Applied'
      ]
    )

    res.status(201).json({
      success: true,
      message: 'Candidate created successfully',
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error creating candidate:', error)

    // Handle unique constraint violation (duplicate email)
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        error: 'Email already exists',
        message: 'A candidate with this email already exists'
      })
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create candidate',
      message: error.message
    })
  }
})

// PUT /api/candidates/:id - Update candidate
router.put('/:id', validateUpdateCandidate, async (req, res) => {
  try {
    const { id } = req.params
    const {
      name,
      age,
      email,
      phone,
      skills,
      experience,
      applied_position,
      status
    } = req.body

    // Check if candidate exists
    const checkResult = await pool.query(
      'SELECT * FROM candidates WHERE id = $1',
      [id]
    )

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found'
      })
    }

    // Build dynamic update query
    const updates = []
    const values = []
    let paramCount = 1

    if (name !== undefined) {
      updates.push(`name = $${paramCount}`)
      values.push(name)
      paramCount++
    }
    if (age !== undefined) {
      updates.push(`age = $${paramCount}`)
      values.push(age)
      paramCount++
    }
    if (email !== undefined) {
      updates.push(`email = $${paramCount}`)
      values.push(email)
      paramCount++
    }
    if (phone !== undefined) {
      updates.push(`phone = $${paramCount}`)
      values.push(phone)
      paramCount++
    }
    if (skills !== undefined) {
      updates.push(`skills = $${paramCount}`)
      values.push(skills)
      paramCount++
    }
    if (experience !== undefined) {
      updates.push(`experience = $${paramCount}`)
      values.push(experience)
      paramCount++
    }
    if (applied_position !== undefined) {
      updates.push(`applied_position = $${paramCount}`)
      values.push(applied_position)
      paramCount++
    }
    if (status !== undefined) {
      updates.push(`status = $${paramCount}`)
      values.push(status)
      paramCount++
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(id)

    const query = `
      UPDATE candidates
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `

    const result = await pool.query(query, values)

    res.json({
      success: true,
      message: 'Candidate updated successfully',
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error updating candidate:', error)

    // Handle unique constraint violation
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        error: 'Email already exists',
        message: 'Another candidate with this email already exists'
      })
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update candidate',
      message: error.message
    })
  }
})

// DELETE /api/candidates/:id - Delete candidate
router.delete('/:id', validateDeleteCandidate, async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'DELETE FROM candidates WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found'
      })
    }

    res.json({
      success: true,
      message: 'Candidate deleted successfully',
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error deleting candidate:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete candidate',
      message: error.message
    })
  }
})

export default router
