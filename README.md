# Incident Tracker Mini App

A full-stack web application for tracking and managing production incidents built with React and Node.js.

## Features

- **Create Incidents**: Add new incidents with validation
- **View Incidents**: Browse incidents in a paginated table
- **Search & Filter**: Search by various fields and filter by service, severity, status, and assignee
- **Sorting**: Sort incidents by any column
- **Edit Incidents**: Update incident details and status
- **View Details**: See complete incident information
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 18
- React Router for routing
- Tailwind CSS for styling
- Axios for API calls
- Debounced search for better performance

### Backend
- Node.js with Express
- SQLite3 for database
- Joi for validation
- CORS support

## Installation

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm run seed  # Seed database with 200 test incidents
npm run dev    # Start development server
```

### Frontend Setup
```bash
cd frontend
npm install
npm start      # Start development server
```

### Frontend Build (optional)
```bash
cd frontend
npm run build  # Generates production build in frontend/build
```

## API Documentation

### Base URL
`http://localhost:3001/api`

### Endpoints

#### Incidents
- **GET /incidents**: Get paginated incidents with filters
  - Query parameters: page, limit, search, service, severity, status, owner, sortBy, sortOrder
  - Returns: { incidents: [...], pagination: { page, limit, total, totalPages } }

- **GET /incidents/:id**: Get incident by ID
- **POST /incidents**: Create a new incident
- **PATCH /incidents/:id**: Update an incident
- **GET /services**: Get all distinct services
- **GET /owners**: Get all distinct assignees (owners)

## Database Schema

The `incidents` table has the following columns:
- id (TEXT, primary key)
- title (TEXT, required)
- service (TEXT, required)
- severity (TEXT, required, enum: SEV1-SEV4)
- status (TEXT, required, enum: OPEN/MITIGATED/RESOLVED)
- owner (TEXT, optional)
- summary (TEXT, optional)
- createdAt (DATETIME)
- updatedAt (DATETIME)

## Usage

### Creating an Incident
1. Click "Create Incident" button
2. Fill out the form
3. Click "Create Incident" to save

### Viewing Incidents
- Use the table to browse incidents
- Click on incident title to view details
- Use search and filters to narrow results (service, severity, status, assignee)
- Click column headers to sort

### Editing an Incident
1. Navigate to incident details
2. Click "Edit" button
3. Make changes
4. Click "Save Changes"

## Design Decisions & Tradeoffs

### Frontend
- **Tailwind CSS**: For rapid development and consistent styling
- **React Router**: Simple routing for single-page application
- **Debounced Search**: Improves performance by reducing API calls
- **Component Architecture**: Modular components for reusability

### Backend
- **SQLite**: Lightweight database for simplicity and portability
- **Express**: Minimal, flexible web framework
- **Joi Validation**: Robust validation for API requests
- **Server-side Pagination**: Efficient handling of large datasets

### Database
- **SQLite**: Choosing SQLite for simplicity and ease of setup (no separate database server required)
- **Seed Data**: Pre-populated database with 200 test incidents for demonstration
- **Indexes**: Could add indexes on frequently queried fields (service, severity, status) for better performance

## Improvements with More Time

1. **Authentication/Authorization**: Add user authentication
2. **Real-time Updates**: WebSocket support for live updates
3. **File Uploads**: Attach files to incidents
4. **Analytics/Dashboard**: Visualize incident trends
5. **Email Notifications**: Alert stakeholders on incident updates
6. **Testing**: Unit and integration tests
7. **Dockerization**: Containerize the application
8. **Production Deployment**: Set up CI/CD pipeline

