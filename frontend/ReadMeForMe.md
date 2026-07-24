. Generate the users page

From the frontend folder:

ng generate component features/users

This creates the component that will contain the PrimeNG table and CRUD dialogs.

2. Generate the API service
ng generate service core/services/users

This service will be responsible for communicating with NestJS:

GET    http://localhost:3000/users
POST   http://localhost:3000/users
PATCH  http://localhost:3000/users/:id
DELETE http://localhost:3000/users/:id