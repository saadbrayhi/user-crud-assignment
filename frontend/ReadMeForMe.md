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


*** app.config.ts is the global configuration file for a standalone Angular application.

It tells Angular which application-wide services and features should be available when the app starts.

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
  ],
};

provideRouter(routes)

Connects Angular Router to the routes defined inside:
app.routes.ts



***provideHttpClient()

Makes Angular’s HTTP functionality available.

You need it because your Angular service will communicate with your NestJS backend:

Angular frontend
      ↓ HTTP request
NestJS backend
      ↓
PostgreSQL

Without provideHttpClient(), your service cannot inject HttpClient



*** providePrimeNG(...)

Globally configures PrimeNG.

Your configuration:

providePrimeNG({
  theme: {
    preset: Aura,
  },
})

means:

Use the PrimeNG Aura theme for all PrimeNG components.


*** main.ts

This is the entry point of the Angular application.

It starts Angular:

bootstrapApplication(App, appConfig)
  .catch(error => console.error(error));

Meaning:

main.ts
   ↓
starts the App component
   ↓
uses appConfig


*** app.ts

This is the root component class.

It controls the main application component:

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}

Its selector:

selector: 'app-root'

connects it to this element in index.html:

<app-root></app-root>


*** app.routes.ts

Contains the routing configuration.
Its job is to connect URLs to components:

URL path          Angular component
/users            Users



*** app.config.ts      Global Angular configuration
app.routes.ts      URL routing
app.ts             Root component logic
app.html           Root component template
app.css            Root component styles

models/            TypeScript data shapes
services/          Backend API communication
feature/users/     Users page and its interface


*** @Injectable({
  providedIn: 'root',
})

@Injectable() is an Angular decorator.

It tells Angular:

This class can participate in Angular’s dependency-injection system.

The option:

providedIn: 'root'

means Angular creates one shared UsersService instance for the entire application.

So you do not need to manually register the service in another providers array.


***private readonly http = inject(HttpClient);

This line asks Angular’s dependency-injection system for an existing HttpClient instance



*** inject(HttpClient)

Angular finds the HttpClient provider that you configured earlier using:

provideHttpClient()

and gives the service its instance.

private readonly apiUrl = 'http://localhost:3000/users';

This stores the backend endpoint in one property.

Your NestJS backend has:

http://localhost:3000/users

Instead of repeating that string in every method, you store it once.

Later:

getUsers()
createUser()
updateUser()
deleteUser()

can all reuse this.apiUrl.

For example:

`${this.apiUrl}/5`

becomes:

http://localhost:3000/users/5

Again:

private means only this service uses it.
readonly means the URL reference should not be reassigned.



*** getUsers(): Observable<PaginatedUsersResponse> {

This declares a method named getUsers.

It does not need parameters yet because it currently requests the default first page.

The return type is:

Observable<PaginatedUsersResponse>

This means:

The method returns an Observable that will eventually emit a paginated users response.

It does not immediately return the actual users



*** return this.http.get<PaginatedUsersResponse>(this.apiUrl);

This sends the HTTP request.

this.http

This is the injected Angular HttpClient.

.get(...)

This tells Angular to send a GET request.

Equivalent request:

GET http://localhost:3000/users



***this.usersService.getUsers()

the flow is:

Users component
      ↓
getUsers()
      ↓
HttpClient.get()
      ↓
GET http://localhost:3000/users
      ↓
NestJS receives request
      ↓
PostgreSQL returns users
      ↓
Angular receives PaginatedUsersResponse



*** getUsers(): Observable<PaginatedUsersResponse> {
  return this.http.get<PaginatedUsersResponse>(this.apiUrl);
}
First line
getUsers(): Observable<PaginatedUsersResponse>
PaginatedUsersResponse:is like the entire object reponse or the Api response
This means:

Method name: getUsers
Parameters: none
Returns: Observable<PaginatedUsersResponse>

The method does not directly return:

PaginatedUsersResponse

It returns:

Observable<PaginatedUsersResponse>

because getting data from the backend takes time.

Angular sends the request now, but the response arrives later



*** Second line
return this.http.get<PaginatedUsersResponse>(this.apiUrl);

Break it into pieces.

this.http

This is Angular’s HttpClient.

It is responsible for sending requests to the backend.

.get(...)

This says:

Send an HTTP GET request.

this.apiUrl

This is the destination:

http://localhost:3000/users

So Angular sends:

GET http://localhost:3000/users
<PaginatedUsersResponse>

This tells TypeScript what response structure you expect.



***getUsers(): PaginatedUsersResponse {
  return this.http.get(this.apiUrl);
}

because the HTTP response is not available immediately.

JavaScript does not stop the whole application while waiting for the backend. It continues running, and the result arrives asynchronously.

Therefore Angular returns an Observable



*** private readonly usersService = inject(UsersService);
gives the component access to your API service

ngOnInit()
runs when Angular initializes the component

component starts
→ ngOnInit runs
→ getUsers returns an Observable
→ subscribe starts the HTTP request
→ response is printed in the browser console

.subscribe(...)

starts the request and receives the response. Angular supports injecting services into components this way.



*** OnInit and ngOnInit() are used because you want to load users when Angular creates the component.

export class Users implements OnInit

means:

This component promises to implement Angular’s OnInit lifecycle interface.

That interface requires this method:

ngOnInit(): void
Why not put the request directly in the class?

The class is created first:

const component = new Users();

Then Angular initializes its inputs, dependencies, and template.

After that, Angular calls:

ngOnInit()

So this is a good place for startup logic such as:

loading users
fetching API data
setting initial values
preparing the page

Your flow is:

Angular creates Users component
→ injects UsersService
→ calls ngOnInit()
→ getUsers() sends the API request
→ response is stored in this.users



*** ngOnInit(): void {
  this.usersService.getUsers().subscribe(...);
}

means:

As soon as this users page is initialized, fetch the users from the backend



*** [value]="users"

passes your component array into the table.

[loading]="loading"

shows PrimeNG’s loading state while the HTTP request is waiting.

<ng-template #body let-user>

PrimeNG repeats this row for every object inside users.

So if your array contains five users, this template creates five rows.




*** <p-table [value]="users">

p-table is the PrimeNG table component.

It is not a native HTML <table>. PrimeNG controls it and adds features such as:

loading state
pagination
sorting
filtering
reusable templates
styling
[value]="users"

passes your component’s users array into PrimeNG.

Conceptually:

users array from TypeScript
        ↓
      p-table
        ↓
one table row for every user

PrimeNG supports custom template sections for areas such as the header and body



*** By calling this.cd.detectChanges(), you are explicitly telling Angular: "Hey, I just updated the users array and set loading to false. Please re-read these variables and update the HTML template immediately." This satisfies Angular's safety checks and gets rid of that red error in your console



*** [paginator]="true"
[rows]="5"
[totalRecords]="totalRecords"
[rowsPerPageOptions]="[5, 10, 20]"
[lazy]="true"
(onLazyLoad)="loadUsers($event)"

Meaning:

paginator: displays pagination controls.
rows: number of users per page.
totalRecords: total users in PostgreSQL, not only the current page.
rowsPerPageOptions: lets the user change page size.
lazy: data comes from the backend page by page.
onLazyLoad: executes whenever PrimeNG needs data



*** loadUsers() is the function PrimeNG calls whenever the table needs data.

loadUsers(event: TableLazyLoadEvent): void {
  const rows = event.rows ?? 5;
  const first = event.first ?? 0;
  const page = first / rows + 1;
}
1. The function parameter
event: TableLazyLoadEvent

event is an object sent automatically by PrimeNG.

It contains information about the table’s current state, such as:

event.first
event.rows
event.sortField
event.sortOrder
event.filters

For pagination, the important values are:

first: index of the first row PrimeNG wants
rows: number of rows per page



*** const rows = event.rows ?? 5;

The nullish coalescing operator ?? means:

Use the value on the left, unless it is null or undefined.

So this means:

If event.rows exists → use it
Otherwise → use 5


*** Meaning:

userDialogVisible: controls whether the dialog is open.
saving: disables the submit button while the API request is running


*** Validators.email

checks that the email has a valid email structure. Angular Reactive Forms supports grouped controls and validators in the component model



*** userForm defines the form and validation.

1. userForm
userForm = this.formBuilder.nonNullable.group({
  firstName: ['', [Validators.required]],
  lastName: ['', [Validators.required]],
  email: ['', [Validators.required, Validators.email]],
});

This creates a FormGroup with three controls.

nonNullable
this.formBuilder.nonNullable

This means the form values are strings, not string | null.



*** this.userForm.reset()

Clears old form values and restores them to their defaults:

firstName = ""
lastName = ""
email = ""

This matters because otherwise reopening the dialog could show the previous user’s values



*** this.userDialogVisible = true

Your dialog likely uses:

[(visible)]="userDialogVisible"

Changing the property to true opens the PrimeNG dialog.

Flow:

Click Add user
→ openCreateDialog()
→ clear form
→ show dialog



*** Validation check
if (this.userForm.invalid) {
  this.userForm.markAllAsTouched();
  return;
}
this.userForm.invalid

Checks whether any control violates its validators.

Examples:

empty first name,
empty last name,
invalid email.



markAllAsTouched()

Marks every form field as touched.

This is useful when you later display messages such as:

First name is required
Invalid email

Without touching the fields, validation messages may not appear



*** Reload the table
if (this.lastTableEvent) 

lastTableEvent stores the most recent PrimeNG table state, including:

rows per page,
sorting field,
sorting order.

The condition protects against calling loadUsers() before the table has emitted an event

...this.lastTableEvent
Copies all properties from the last event


*** Full flow
Click Save
→ submitUser()
→ validate form
→ extract payload
→ saving = true
→ POST /users

On success:

saving = false
→ close dialog
→ reset form
→ reload first page

On failure:

saving = false
→ keep dialog open
→ log/show error


*** What setValue() does

It fills the form with the selected user:

Click Edit on Saad
→ selectedUser = Saad
→ form receives Saad’s information
→ dialog opens



*** <p-confirmDialog />
PrimeNG’s ConfirmDialog is controlled through ConfirmationService; the accept callback runs only after the user confirms.