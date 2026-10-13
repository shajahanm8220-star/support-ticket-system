# Support Ticket Management System

A full-stack web application for managing customer support tickets, built with Next.js, TypeScript, Express.js, and MySQL.

## Overview

The Support Ticket Management System helps support teams manage customer issues from a centralized application.

Users can create tickets, view ticket details, search and filter tickets, manage ticket status, and assign support agents. The backend provides REST APIs, while MySQL stores the application data.

## Features

- Create support tickets
- View all tickets
- View individual ticket details
- Search tickets by customer name, customer email, or subject
- Filter tickets by status
- Filter tickets by priority
- Filter tickets by category
- Filter tickets by assigned agent
- Sort ticket listings
- Paginate ticket results
- Assign support agents to tickets
- Update ticket status
- Update and delete tickets
- Manage customer and agent information
- Store application data in MySQL
- Responsive user interface
- REST API integration
- Environment-based database configuration

> Only retain features that are implemented and working in the submitted version.

## Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- HTML and CSS

### Backend
- Node.js
- Express.js
- TypeScript
- REST APIs

### Database
- MySQL
- MySQL Workbench

### Development Tools
- Visual Studio Code
- Git
- GitHub
- npm
- PowerShell

## Architecture

The application uses a frontend-backend-database architecture.

```text
User
 |
 v
Next.js Frontend
 |
 | HTTP Requests
 v
Express.js Backend
 |
 | SQL Queries
 v
MySQL Database
```

### Request Flow

1. The user interacts with the Next.js frontend.
2. The frontend sends an HTTP request to the Express backend.
3. The backend validates and processes the request.
4. The backend reads or updates data in MySQL.
5. The backend returns a response.
6. The frontend displays the result.

## Project Structure

```text
support-ticket-system/
|
|-- backend/
|   |-- src/
|   |   |-- controllers/
|   |   |-- repositories/
|   |   |-- routes/
|   |   |-- db.ts
|   |   |-- server.ts
|   |-- package.json
|   |-- tsconfig.json
|   |-- .env
|
|-- frontend/
|   |-- app/
|   |   |-- agents/
|   |   |-- tickets/
|   |   |   |-- new/
|   |   |   |-- [id]/
|   |   |-- page.tsx
|   |   |-- layout.tsx
|   |   |-- globals.css
|   |-- package.json
|
|-- screenshots/
|
|-- database.sql
|-- README.md
|-- .gitignore
```

The structure above shows the main project files. Additional files may exist in the frontend and backend folders.

## Prerequisites

Install the following:

- Node.js and npm
- MySQL Server
- MySQL Workbench (recommended)
- Git
- Visual Studio Code

Verify Node.js, npm, and Git:

```bash
node --version
npm --version
git --version
```

Make sure MySQL Server is running before starting the backend.

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/shajahanm8220-star/support-ticket-system.git
cd support-ticket-system
```

### 2. Install Backend Dependencies

Open a terminal in the project root:

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

Open another terminal in the project root:

```bash
cd frontend
npm install
```

## Environment Variables

Create or update the backend environment file at:

`backend/.env`

Example configuration:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=support_ticket_db
```

Replace the example database credentials with your local MySQL settings.

The database name used by this project is:

`support_ticket_db`

**Security notes:**

- Never commit real database passwords.
- Do not publish API keys or tokens.
- Keep `.env` files out of GitHub.
- Share only example configuration in documentation.

## Database Setup

The project includes a database setup file named `database.sql`.

### 1. Start MySQL

Start MySQL Server and open MySQL Workbench.

### 2. Create the Database and Tables

Open `database.sql` in MySQL Workbench and execute its SQL statements on a fresh development database.

The setup file creates the database and the main tables:

- `agents`
- `customers`
- `tickets`

The `tickets` table connects tickets with customers and optionally assigned agents.

### 3. Verify the Tables

Run:

```sql
USE support_ticket_db;

SHOW TABLES;
```

The expected table names are:

```text
agents
customers
tickets
```

### 4. Verify the Agents

Run:

```sql
SELECT id, name, email, department, status
FROM agents;
```

The development database should contain the required five sample support agents for a fresh setup.

If you already have a working database, back it up before making schema changes. Do not delete an existing database to run the setup file.

### 5. Configure the Backend

Confirm that `backend/.env` contains the correct database name and credentials.

```env
DB_NAME=support_ticket_db
```

## Running the Application

Run the backend and frontend in separate terminals.

### Start the Backend

Open a terminal:

```bash
cd backend
npm run dev
```

The backend runs at:

`http://localhost:5000`

### Test the Backend Health Check

Open this address in your browser:

`http://localhost:5000/api/health`

Expected response:

```json
{
  "success": true,
  "message": "Support Ticket API is running"
}
```

### Start the Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The frontend normally runs at:

`http://localhost:3000`

### Open the Application

- Application: `http://localhost:3000`
- Tickets: `http://localhost:3000/tickets`
- Create Ticket: `http://localhost:3000/tickets/new`

The frontend and backend must both be running for API-dependent features to work.

## API Documentation

The backend API base URL is:

`http://localhost:5000`

### Ticket APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tickets` | Retrieve tickets |
| POST | `/api/tickets` | Create a ticket |
| GET | `/api/tickets/:id` | Retrieve a ticket by ID |
| PUT | `/api/tickets/:id` | Update ticket information |
| DELETE | `/api/tickets/:id` | Delete a ticket |
| PATCH | `/api/tickets/:id/status` | Update ticket status |
| PATCH | `/api/tickets/:id/assign` | Assign an agent to a ticket |

### Agent API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/agents` | Retrieve support agents |

### Dashboard API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Retrieve dashboard statistics |

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check backend availability |

### Ticket List Query Parameters

The ticket list API supports query parameters implemented by the backend, including:

- `page` — page number
- `limit` — number of results per page
- `search` — search term
- `status` — ticket status
- `priority` — ticket priority
- `category` — ticket category
- `agentId` — assigned agent
- `sort` — sorting option

Example:

```text
GET /api/tickets?page=1&limit=10
```

The available values and exact response format depend on the implementation.

### Example Ticket Creation Request

The following is an illustrative example. Use the exact field names and accepted values implemented by the controller.

```json
{
  "customer_name": "Example Customer",
  "customer_email": "customer@example.com",
  "subject": "Unable to access account",
  "description": "I cannot access my account and need assistance.",
  "priority": "HIGH",
  "category": "TECHNICAL"
}
```

### Example Status Update

Endpoint:

```text
PATCH /api/tickets/1/status
```

Example request body:

```json
{
  "status": "IN_PROGRESS"
}
```

### Example Agent Assignment

Endpoint:

```text
PATCH /api/tickets/1/assign
```

Example request body:

```json
{
  "agentId": 1
}
```

Use Postman or another API client to test POST, PUT, PATCH, and DELETE requests.

Confirm the request fields and allowed values against the actual controller code before relying on these examples.

## Screenshots

Store actual screenshots in the `screenshots/` folder.

Recommended screenshots:

```text
screenshots/
|-- tickets-list.png
|-- create-ticket.png
|-- ticket-details.png
|-- dashboard.png
|-- responsive-mobile.png
```

Include only files that actually exist in the repository.

For example, to display the ticket listing screenshot:

```markdown
![Tickets List](screenshots/tickets-list.png)
```

Screenshots should demonstrate the actual interface, ticket management functionality, and responsive behavior.

## Validation and Testing

### Backend Checks

- Backend starts successfully.
- Health-check endpoint responds.
- Database connection works.
- Ticket list endpoint responds.
- Ticket creation is validated.
- Ticket details can be retrieved.
- Ticket updates work.
- Ticket status updates work.
- Agent assignment works.
- Invalid input is handled appropriately.

### Frontend Checks

- Application opens successfully.
- Tickets are displayed.
- Ticket creation form works.
- Ticket details page loads.
- Search and filters work.
- Sorting works.
- Pagination works.
- Status updates work.
- Agent assignment works if exposed in the interface.
- Loading and error states are handled.

### Responsive Design

Test the application at these viewport widths:

| Width | Device Type |
|---|---|
| 1920px | Large desktop |
| 1366px | Desktop |
| 768px | Tablet |
| 390px | Mobile |

Check that forms, tables, navigation, and buttons remain usable at smaller widths.

Only report tests that have actually been performed.

## Pagination

The ticket listing API supports pagination through query parameters.

Example:

```text
GET /api/tickets?page=1&limit=10
```

The frontend can use the returned pagination information to display the appropriate page of results.

## Error Handling

The application should handle errors such as:

- Invalid ticket IDs
- Invalid request data
- Missing tickets
- Database connection failures
- Failed API requests

The frontend should provide useful feedback when an operation fails.

## Known Limitations

Document any limitations that remain in the current implementation.

Potential examples include:

- Authentication and authorization may not be implemented.
- Real-time ticket updates may not be available.
- Advanced analytics may not be included.
- A working MySQL database is required.
- The backend must be running for API-dependent features.

Remove limitations that do not apply and add any other known issues.

## Future Improvements

Potential enhancements include:

- User authentication and role-based access control
- Advanced dashboard analytics
- Email notifications
- Real-time ticket updates
- Audit logging
- Automated frontend and backend tests

## Version Control

GitHub Repository:

https://github.com/shajahanm8220-star/support-ticket-system

## Conclusion

The Support Ticket Management System demonstrates a full-stack application connecting a Next.js frontend, an Express.js backend, and a MySQL database.

The project provides practical experience with React, TypeScript, REST APIs, database operations, ticket management, validation, responsive design, and version control.