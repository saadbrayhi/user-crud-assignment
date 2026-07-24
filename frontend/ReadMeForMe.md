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