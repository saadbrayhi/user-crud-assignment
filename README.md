# User CRUD Assignment

A full-stack user management application built with Angular, PrimeNG, NestJS, PostgreSQL, TypeORM, and `nestjs-paginate`.

The application supports complete CRUD operations, server-side pagination, sorting, and filtering.

## Features

- View users in a PrimeNG table
- Create users
- Update users
- Delete users with confirmation
- Server-side pagination
- Server-side sorting
- Server-side search
- PostgreSQL database
- TypeORM integration
- Angular frontend connected to NestJS API
- PrimeNG components used throughout the frontend

## Technologies

### Frontend

- Angular
- TypeScript
- PrimeNG
- Angular Reactive Forms
- Angular HttpClient

### Backend

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- `nestjs-paginate`
- Class Validator
- Class Transformer

## Project Structure

```text
user-crud-assignment/
├── backend/
│   ├── src/
│   │   ├── users/
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── core/
│   │       │   └── services/
│   │       └── feature/
│   │           └── users/
│   └── package.json
│
└── README.md
Requirements

Install the following before running the project:

Node.js
npm
PostgreSQL
Angular CLI
Installation

Clone the repository:

git clone https://github.com/saadbrayhi/user-crud-assignment.git

Move into the project:

cd user-crud-assignment
Backend Setup

Move into the backend directory:

cd backend

Install dependencies:

npm install

Create a PostgreSQL database for the project.

Example database name:

users-crud

Create a .env file inside the backend directory:

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgresql_password
DB_DATABASE=users-crud
PORT=3000

Do not commit the .env file to GitHub.

Start the backend:

npm run start:dev

The backend should run on:

http://localhost:3000
Frontend Setup

Open another terminal and move into the frontend directory:

cd frontend

Install dependencies:

npm install

Start Angular:

npm start

The frontend should run on:

http://localhost:4200
API Endpoints
Method	Endpoint	Description
POST	/users	Create a user
GET	/users	Get paginated users
GET	/users/:id	Get one user
PATCH	/users/:id	Update a user
DELETE	/users/:id	Delete a user
Pagination

Example:

GET /users?page=1&limit=5
Sorting

Ascending:

GET /users?page=1&limit=5&sortBy=firstName:ASC

Descending:

GET /users?page=1&limit=5&sortBy=firstName:DESC
Search

Example:

GET /users?page=1&limit=5&search=saad

Sorting and search can be combined:

GET /users?page=1&limit=5&sortBy=firstName:ASC&search=saad
User Model

A user contains:

{
  "id": 1,
  "firstName": "Saad",
  "lastName": "Brayhi",
  "email": "saad@example.com",
  "createdAt": "2026-07-25T10:00:00.000Z",
  "updatedAt": "2026-07-25T10:00:00.000Z"
}
Create User Example
{
  "firstName": "Saad",
  "lastName": "Brayhi",
  "email": "saad@example.com"
}
Validation

The backend validates:

First name is required
Last name is required
Email is required
Email must have a valid format
Email must be unique

The Angular form also validates required fields and email format before submission.

Git Workflow

The project was developed using separate milestone commits, including:

Angular frontend initialization
Frontend and backend API connection
PrimeNG user table
Server-side pagination
Server-side sorting
Server-side search
Create user dialog
Update user dialog
Delete user confirmation
Repository Access

The assignment reviewer was invited as a GitHub repository collaborator using the username:

khousheish
Author

Saad Brayhi`
