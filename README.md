# Candidate Management System

A full-stack web application for managing candidate information during recruitment processes. Built with React (JSX) + Vite for the frontend and Node.js + Express + PostgreSQL (NeonDB) for the backend.

## Features

### deployed url -> https://cmsassignment.netlify.app/

### Data Management (CRUD Operations)
- ✅ **Create**: Add new candidate records with essential information
- ✅ **Read**: View all candidates in a structured table format
- ✅ **Update**: Edit existing candidate information seamlessly
- ✅ **Delete**: Remove candidate records with confirmation dialog

### User Interface
- Clean, intuitive web-based interface
- Responsive table displaying all candidate information
- Easy-to-use forms with real-time validation
- Status badges with color coding
- Confirmation dialogs for destructive operations

### Backend Features
- PostgreSQL database for reliable data storage
- RESTful API with proper error handling
- Input validation and sanitization
- Protection against SQL injection
- Comprehensive logging

## Tech Stack

### Frontend
- React 18 (JSX only, no TypeScript)
- Vite (Fast build tool)
- Axios (HTTP client with separate API configuration)
- CSS3 (Modern styling)

### Backend
- Node.js
- Express (Web framework)
- PostgreSQL via NeonDB (Cloud database)
- pg (PostgreSQL client)
- express-validator (Input validation)
- dotenv (Environment variables)
- cors (Cross-origin resource sharing)

## Project Structure

```
candidate-management-system/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CandidateForm.jsx
│   │   │   └── CandidateTable.jsx
│   │   ├── services/
│   │   │   └── api.js              # Backend API connection
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── models/
│   │   └── db.js
│   ├── routes/
│   │   └── candidates.js
│   ├── middleware/
│   │   └── validator.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── README.md
```

## Database Schema

```sql
CREATE TABLE candidates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0 AND age < 150),
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  skills TEXT,
  experience VARCHAR(50),
  applied_position VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Applied',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Status Values
- Applied
- Interviewing
- Hired
- Rejected
- On Hold

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- NeonDB account (free tier available at https://neon.tech)

## Setup Instructions

### 1. Get NeonDB Connection String

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project
4. Copy your connection string from the dashboard
5. Format: `postgresql://username:password@host/database?sslmode=require`

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create .env file from example
cp .env.example .env

# Edit .env and add your NeonDB connection string
# DATABASE_URL=your_neondb_connection_string_here
# PORT=5000
# FRONTEND_URL=http://localhost:5173

# Install dependencies
npm install

# Start backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Edit src/services/api.js if your backend runs on a different port
# Default: http://localhost:5000/api

# Install dependencies
npm install

# Start frontend dev server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Access Application

Open your browser and go to: `http://localhost:5173`

## API Endpoints

### Candidates

- `GET /api/health` - Health check
- `GET /api/candidates` - Get all candidates
- `GET /api/candidates/:id` - Get single candidate
- `POST /api/candidates` - Create new candidate
- `PUT /api/candidates/:id` - Update candidate
- `DELETE /api/candidates/:id` - Delete candidate

### Request Examples

**Create Candidate:**
```json
POST /api/candidates
{
  "name": "John Doe",
  "age": 28,
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "skills": "JavaScript, React, Node.js",
  "experience": "3 years",
  "applied_position": "Frontend Developer",
  "status": "Applied"
}
```

**Update Candidate:**
```json
PUT /api/candidates/1
{
  "status": "Interviewing"
}
```

## Frontend API Configuration

The frontend uses a centralized API configuration file at `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api'
```

### Benefits of Separate API File:
- ✅ **No Vite proxy** - Direct backend connection
- ✅ **Centralized configuration** - Single place to change API URL
- ✅ **Request/Response interceptors** - Built-in logging and error handling
- ✅ **Type-safe methods** - Dedicated functions for each API call
- ✅ **Easy to modify** - Change backend URL for production deployment

### Changing Backend URL:

For production, simply update the `API_BASE_URL` in `api.js`:

```javascript
const API_BASE_URL = 'https://your-production-api.com/api'
```

## Security Features

### Input Validation
- Frontend validation with real-time feedback
- Backend validation using express-validator
- Email format validation
- Age range validation (1-150)
- Phone number format validation

### SQL Injection Prevention
- All queries use parameterized statements
- Input sanitization on backend
- No direct SQL string concatenation

### Error Handling
- Comprehensive error messages
- Try-catch blocks for all async operations
- Proper HTTP status codes
- User-friendly error display

## Development Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start with auto-reload (recommended)
- `npm start` - Start production server

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Features in Detail

### Candidate Form
- Required fields: Name, Age, Email
- Optional fields: Phone, Skills, Experience, Position, Status
- Real-time validation with error messages
- Support for both create and edit modes
- Cancel functionality

### Candidate Table
- Sortable columns
- Color-coded status badges
- Inline edit and delete actions
- Responsive design for mobile devices
- Empty state message
- Loading spinner during data fetch

### Status Management
- Visual indicators for each status
- Easy status updates via edit form
- Color-coded badges:
  - Applied: Blue
  - Interviewing: Yellow
  - Hired: Green
  - Rejected: Red
  - On Hold: Gray

## Troubleshooting

### Backend won't start
- Check if NeonDB connection string is correct in `.env`
- Ensure PostgreSQL database is accessible
- Verify port 5000 is not in use

### Frontend can't connect to backend
- Check `API_BASE_URL` in `frontend/src/services/api.js`
- Ensure backend server is running on port 5000
- Check browser console for CORS errors
- Verify `FRONTEND_URL` in backend `.env` matches your frontend URL

### Database errors
- Ensure database schema is created (auto-created on server start)
- Check NeonDB dashboard for connection limits
- Verify database credentials

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in environment
2. Use a process manager like PM2
3. Set up proper logging
4. Enable SSL/HTTPS
5. Use environment variables for sensitive data

### Frontend
1. Update `API_BASE_URL` in `api.js` to production backend URL
2. Run `npm run build`
3. Deploy `dist/` folder to hosting service (Vercel, Netlify, etc.)
4. Configure environment variables on hosting platform

### Database
1. Use NeonDB production tier for better performance
2. Set up regular backups
3. Monitor connection limits
4. Enable connection pooling

## License

MIT

## Author

Built with React JSX + Vite + Node.js + Express + NeonDB PostgreSQL

## Support

For issues or questions:
- Check the troubleshooting section
- Review NeonDB documentation
- Check browser console for frontend errors
- Review backend server logs
