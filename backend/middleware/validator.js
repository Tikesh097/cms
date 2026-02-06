import { body, param, validationResult } from 'express-validator'

// Validation middleware to check for errors
export const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    })
  }
  next()
}

// Validation rules for creating a candidate
export const validateCreateCandidate = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('age')
    .isInt({ min: 1, max: 150 }).withMessage('Age must be between 1 and 150'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('phone')
    .optional({ nullable: true })
    .trim()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
    .withMessage('Must be a valid phone number'),

  body('skills')
    .optional({ nullable: true })
    .trim(),

  body('experience')
    .optional({ nullable: true })
    .trim(),

  body('applied_position')
    .optional({ nullable: true })
    .trim(),

  body('status')
    .optional({ nullable: true })
    .trim()
    .isIn(['Applied', 'Interviewing', 'Hired', 'Rejected', 'On Hold'])
    .withMessage('Status must be one of: Applied, Interviewing, Hired, Rejected, On Hold'),

  validate
]

// Validation rules for updating a candidate
export const validateUpdateCandidate = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid candidate ID'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('age')
    .optional()
    .isInt({ min: 1, max: 150 }).withMessage('Age must be between 1 and 150'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('phone')
    .optional({ nullable: true })
    .trim()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
    .withMessage('Must be a valid phone number'),

  body('skills')
    .optional({ nullable: true })
    .trim(),

  body('experience')
    .optional({ nullable: true })
    .trim(),

  body('applied_position')
    .optional({ nullable: true })
    .trim(),

  body('status')
    .optional({ nullable: true })
    .trim()
    .isIn(['Applied', 'Interviewing', 'Hired', 'Rejected', 'On Hold'])
    .withMessage('Status must be one of: Applied, Interviewing, Hired, Rejected, On Hold'),

  validate
]

// Validation rules for deleting a candidate
export const validateDeleteCandidate = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid candidate ID'),

  validate
]

// Validation rules for getting a single candidate
export const validateGetCandidate = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid candidate ID'),

  validate
]
