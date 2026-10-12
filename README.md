# Support Ticket Management System

## Overview

The Support Ticket Management System is a full-stack web application designed to help support teams manage customer issues in one centralized platform.

The application allows users to create, view, search, filter, sort, and manage support tickets. It helps support teams track ticket details, priorities, categories, statuses, assigned agents, and creation dates.

The project uses Next.js and TypeScript for the frontend, Node.js and Express.js for the backend, and MySQL for database management.

## Features

* Create new support tickets.
* View all support tickets.
* View individual ticket details.
* Search tickets by customer, email, or subject.
* Filter tickets by status.
* Filter tickets by priority.
* Filter tickets by category.
* Sort tickets.
* Paginate ticket listings.
* Assign agents to tickets.
* Update ticket statuses.
* Store ticket information in MySQL.
* Integrate the frontend with REST APIs.
* Use environment variables for configuration.
* Provide a responsive user interface.
* Manage source code using Git and GitHub.

*Ensure each feature listed above is implemented and working in the submitted version.*

## Architecture

The application follows a three-layer architecture.

```text
+--------------------------------+
|            Frontend            |
|       Next.js + React          |
|          TypeScript            |
+---------------+----------------+
                |
                | HTTP / REST API
                v
+--------------------------------+
|             Backend            |
|        Node.js + Express        |
|          API Routes             |
+---------------+----------------+
                |
                | SQL Queries
                v
+--------------------------------+
|            Database            |
|              MySQL              |
+--------------------------------+
```

### Request Flow

1. The user interacts with the frontend.
2. The frontend sends an HTTP request to the backend API.
3. The Express backend receives and processes the request.
4. The backend communicates with the MySQL database when required.
5. The backend returns a response to the frontend.
6. The frontend displays the updated information.

## Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* HTML
* CSS

### Backend

* Node.js
* Express.js
* TypeScript or JavaScript, according to the implemented source files
* REST APIs

### Database

* MySQL

### Development Tools

* Visual Studio Code
* Git
* GitHub
* npm
* PowerShell
* MySQL Workbench

## Project Structure

```text
support-ticket-system/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── server.ts
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── app/
│   ├── lib/
│   ├── types/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

The structure above illustrates the main folders. The exact files may differ depending on the implementation.

## Prerequisites

Install the following software before running the application:

* Node.js
* npm
* MySQL Server
* MySQL Workbench (optional)
* Git
* Visual Studio Code

Verify the installations by running:

```bash
node --version
npm --version
git --version
```

Make sure the MySQL server is running before starting the backend.

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/shajahanm8220-star/support-ticket-system.git
cd support-ticket-system
```

### 2. Install Backend Dependencies

Open a terminal in the project root and run:

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

Open a second terminal in the project root and run:

```bash
cd frontend
npm install
```

## Environment Variables

Configure the backend environment variables according to the existing database connection code.

Example MySQL configuration:

```env
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=support_ticket_system
DB_PORT=3306
```

Replace the example values with your actual local MySQL configuration.

The variable names must match those read by your backend code.

If the frontend requires an environment variable for the backend API URL, configure it using the variable name expected by the frontend implementation.

### Security

* Do not commit database passwords.
* Do not commit API keys or access tokens.
* Keep local environment files out of version control.
* Use `.gitignore` to exclude sensitive configuration files.
* Do not publish real credentials in the README.

## Database Setup

### 1. Start MySQL

Start your local MySQL server and connect to it using MySQL Workbench or another MySQL client.

### 2. Create the Database

Execute the following SQL statement if the database does not already exist:

```sql
CREATE DATABASE support_ticket_system;
```

Select the database:

```sql
USE support_ticket_system;
```

### 3. Create the Required Tables

Create the tables according to the schema implemented by the application.

The main data entities include:

* Customers
* Agents
* Tickets

The tickets table may reference customer and agent records through foreign keys, depending on the implemented schema.

**Important:** Creating the database alone does not create the required tables. Execute your project's actual table-creation SQL statements or import its database setup file if one is included.

### 4. Configure the Backend

Set the correct database credentials in the backend environment file.

Confirm that the database and required tables exist before starting the backend.

## Running the Application

Run the backend and frontend in separate terminals.

### Start the Backend

Open a terminal and run:

```bash
cd backend
npm install
npm run dev
```

The backend should start on the port configured in the server code.

For example:

```text
http://localhost:5000
```

### Start the Frontend

Open another terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend should start at:

```text
http://localhost:3000
```

### Open the Application

Visit the following addresses in your browser:

* Application: `http://localhost:3000`
* Tickets page: `http://localhost:3000/tickets`

These addresses assume the frontend is configured to use port 3000.

## API Documentation

The backend exposes REST API endpoints for ticket management.

The ticket routes below assume that the ticket router is mounted at `/api/tickets`.

### Ticket APIs

| HTTP Method | Endpoint                  | Description                 |
| ----------- | ------------------------- | --------------------------- |
| GET         | `/api/tickets`            | Retrieve the ticket list    |
| POST        | `/api/tickets`            | Create a new ticket         |
| GET         | `/api/tickets/:id`        | Retrieve a specific ticket  |
| PATCH       | `/api/tickets/:id/status` | Update a ticket's status    |
| PATCH       | `/api/tickets/:id/agent`  | Assign an agent to a ticket |

The exact request bodies, validation rules, and response formats depend on the backend controller implementations.

### 1. Retrieve Tickets

**Endpoint:** `GET /api/tickets`

Retrieves the ticket list.

Example:

```text
GET http://localhost:5000/api/tickets
```

### 2. Create a Ticket

**Endpoint:** `POST /api/tickets`

Creates a new support ticket.

The request body must contain the fields required by the ticket creation controller.

### 3. Retrieve Ticket Details

**Endpoint:** `GET /api/tickets/:id`

Retrieves details for a specific ticket.

Example:

```text
GET http://localhost:5000/api/tickets/5
```

### 4. Update Ticket Status

**Endpoint:** `PATCH /api/tickets/:id/status`

Updates the status of a specific ticket.

Example:

```text
PATCH http://localhost:5000/api/tickets/5/status
```

Example request body, if supported by the controller:

```json
{
  "status": "IN_PROGRESS"
}
```

The backend processes the request and updates the ticket status if the ticket exists and the requested status is valid.

Use Postman or another API client to test this endpoint with the PATCH method. Opening the URL directly in a browser sends a GET request instead.

### 5. Assign an Agent

**Endpoint:** `PATCH /api/tickets/:id/agent`

Assigns an agent to a specific ticket.

Example:

```text
PATCH http://localhost:5000/api/tickets/5/agent
```

The request body must follow the format expected by the `assignTicketAgent` controller.

### Additional APIs

If implemented and mounted in the backend, additional endpoints may include:

| HTTP Method | Endpoint         | Description                   |
| ----------- | ---------------- | ----------------------------- |
| GET         | `/api/agents`    | Retrieve agents               |
| GET         | `/api/dashboard` | Retrieve dashboard statistics |

Check the backend route configuration before relying on these endpoints.

## Screenshots

Screenshots can be added to demonstrate the application's interface and functionality.

Recommended screenshots:

1. Ticket listing page.
2. Create ticket form.
3. Ticket details page.
4. Dashboard, if implemented.
5. Responsive mobile view.

Organize screenshots as follows:

```text
screenshots/
├── tickets-list.png
├── create-ticket.png
├── ticket-details.png
├── dashboard.png
└── responsive-mobile.png
```

After adding the actual image files, display them in this README using Markdown:

```markdown
![Tickets List](screenshots/tickets-list.png)

![Create Ticket](screenshots/create-ticket.png)

![Ticket Details](screenshots/ticket-details.png)

![Responsive Mobile View](screenshots/responsive-mobile.png)
```

Only include image references for screenshots that actually exist in the repository.

## Validation and Testing

The following checks can be used to verify the application.

### Backend

* Backend server starts successfully.
* Database connection works.
* Ticket list endpoint returns the expected result.
* Ticket creation works.
* Individual ticket details can be retrieved.
* Ticket status updates work.
* Agent assignment works.

### Frontend

* Application opens successfully.
* Tickets are displayed correctly.
* Ticket creation form works.
* Ticket details page loads.
* Search and filtering work.
* Sorting works.
* Pagination works.
* Status updates and agent assignment work when implemented in the UI.

### Responsive Design

Test the application at the following viewport widths:

* 1920px — large desktop
* 1366px — desktop
* 768px — tablet
* 390px — mobile

Check that the layout remains usable and that unnecessary whole-page horizontal scrolling does not occur on smaller screens.

Record only the tests that have actually been completed successfully.

## Pagination

Pagination allows users to navigate through ticket listings in manageable sections.

Example:

```text
Previous    Page 1 of 5    Next
```

The frontend requests the relevant page of tickets and displays the results.

The exact pagination parameters and response structure depend on the backend implementation.

## Error Handling

The application should handle common errors such as:

* Database connection failures.
* Invalid ticket IDs.
* Invalid request data.
* Missing tickets.
* Failed API requests.

The frontend should display appropriate error messages when requests fail, rather than silently displaying incorrect data.

## Known Limitations

The limitations depend on the current implementation. Potential limitations include:

* Authentication and authorization may not be implemented.
* Real-time ticket updates may not be available.
* Advanced reporting and analytics may not be included.
* The application requires a correctly configured MySQL database.
* The backend must be running for API-dependent features to work.

Remove any limitation that does not apply to your project, and document any other known issues that remain.

## Future Improvements

Possible future enhancements include:

* User authentication and role-based access control.
* Advanced dashboard analytics.
* Email notifications for ticket updates.
* Real-time ticket updates.
* Improved audit logging.
* Automated backend and frontend tests.

## Version Control

The project is maintained using Git and GitHub.

Repository:

https://github.com/shajahanm8220-star/support-ticket-system

## Conclusion

The Support Ticket Management System demonstrates a full-stack application workflow by connecting a Next.js frontend, an Express backend, and a MySQL database.

The project provides practical experience in frontend development, REST API integration, database operations, ticket management, responsive design, and version control.
