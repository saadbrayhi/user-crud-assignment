src/
├── app.controller.ts
├── app.controller.spec.ts
├── app.module.ts
├── app.service.ts
└── main.ts

Their roles are:

1.main.ts: starts the application.
2.app.module.ts: root module connecting the application parts.
3.app.controller.ts: receives HTTP requests.

4.app.service.ts: contains business logic used by the controller


***
@Controller('users')
each routes in this controllers start with /user

Controller = HTTP layer
Service = logic layer


*** file create-user.dto.ts
validation and check the data from frontend , req.body

DTO :
Data Transfer Object


*** A decorator is not a class by itself. It is a special function applied to a class, method, property, or parameter to attach metadata or change how Nest treats it.


*** @Controller('users')
export class UsersController {}
UsersController is a class.
@Controller('users') is a class decorator.
It tells Nest: “This class handles requests beginning with /users.


***Nest is heavily based on classes plus decorators. Decorators give Nest enough metadata to build routes, inject dependencies, validate data, and organize modules.



***class decorator like:

@Controller('users')
export class UsersController {}

@Injectable()
export class UsersService {}

@Module({})
export class UsersModule {}

Their meanings:

@Controller() makes a class an HTTP controller.
@Injectable() allows Nest to manage and inject that class.
@Module() describes how a feature is organized.



*** Method decorators

Applied above a method:

@Get()
findAll() {}

@Post()
create() {}

They tell Nest which HTTP method and route should execute that function




***  Parameter decorators

Applied to function parameters:
create(@Body() body: CreateUserDto) {}
Common parameter decorators include:

@Body()
@Param()
@Query()
@Headers()
@Req()

They extract information from the HTTP request. For example, @Body() corresponds to req.body, while @Param() corresponds to req.params


***Property decorators

You will see these mainly with TypeORM and validation:

@Column()
email: string;

@IsEmail()
email: string;

They attach configuration to a class property


*** main.ts is the starting point of the application.

Conceptually:

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

This does three important things:

Creates the Nest application.
Starts from AppModule.
Opens the HTTP server on port 3000

Nest uses NestFactory.create() to build the application and dependency graph before starting the HTTP listener


*** 3. Modules

A module groups related application functionality.

For example:

UsersModule
├── UsersController
├── UsersService
├── User repository
└── TypeORM entity registration

A module looks conceptually like this:

@Module({
  imports: [],
  controllers: [],
  providers: [],
  exports: [],
})
export class UsersModule {}
imports

Other modules or external features required by this module



*** controllers
Classes that handle HTTP requests:
controllers: [UsersController]

providers
Injectable classes managed by Nest:
providers: [UsersService]

exports
Providers that another module is allowed to use.

exports: [UsersService]

Every Nest application has at least one root module, normally AppModule. Nest uses modules to construct an internal application graph and resolve dependencies.



*** 4. Controllers

Controllers are the HTTP layer.

Their responsibilities are:

Receive request
Extract request data
Call service
Return response

Controllers should remain thin. They should not contain large database queries or complicated business rules. Nest describes controllers as responsible for receiving incoming requests and sending responses.



*** 5. Services and providers

A service is usually where application logic lives.

@Injectable()
export class UsersService {}

A service is one kind of provider.

A provider is any class or value that Nest can create, manage, and inject. Common providers include:

Services
Repositories
Factories
Helpers
Guards
Strategies

Your controller receives the service through its constructor:

constructor(private readonly usersService: UsersService) {}

You do not write:

const usersService = new UsersService();

Nest creates it for you.

Providers are registered in the module:

providers: [UsersService]

Nest’s provider system is based on dependency injection: Nest creates objects and connects their dependencies instead of requiring you to instantiate everything manually



*** 6. Dependency injection

Consider:

constructor(private readonly usersService: UsersService) {}

This line means:
UsersController requires UsersService.

When Nest creates UsersController, it checks the constructor, finds UsersService, locates that provider in the module, creates or retrieves its instance, and passes it into the controller.

The flow is:

UsersModule registers UsersService
            ↓
Nest creates UsersService
            ↓
Nest creates UsersController
            ↓
Nest injects UsersService into UsersController

The keyword combination:

private readonly usersService: UsersService

does several things:

private: only this class can directly use it.
readonly: the reference cannot later be replaced.
usersService: property name.
UsersService: TypeScript type and Nest injection token.

Nest’s IoC container handles this wiring automatically.



*** 11. Pipes

Pipes process input before it reaches a controller method.

They are mainly used for:

Validation
Transformation
Parsing

Example concept:

Incoming body
    ↓
ValidationPipe
    ↓
Valid DTO
    ↓
Controller

For an ID:

@Param('id', ParseIntPipe) id: number

ParseIntPipe converts the route value from a string to a number. If conversion fails, Nest sends a bad-request response.

A global ValidationPipe is commonly configured in main.ts so every DTO can be validated automatically



*** 13. Guards

A guard decides whether a request may continue.

The main question a guard answers is:

Is this request allowed?

Common uses:

Authentication
Authorization
Roles
Permissions

Example future flow:

Request
  ↓
AuthGuard
  ↓
Allowed? Continue
Rejected? Return 401/403


***
14. Interceptors

Interceptors wrap around controller execution.

They can run:

Before controller method
After controller method

Common uses:

Logging execution time
Transforming responses
Caching
Adding common response structure

Conceptually:

Request
  ↓
Interceptor before
  ↓
Controller
  ↓
Interceptor after
  ↓
Response


*** 15. Exception filters

Exception filters control how errors are turned into HTTP responses.

For example, the service may determine that a user does not exist and throw:

NotFoundException

Nest converts that into an HTTP response similar to:

{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}

Built-in exceptions include:

BadRequestException
NotFoundException
ConflictException
UnauthorizedException
ForbiddenException
InternalServerErrorException

A conflict may occur when trying to create two users with the same email



***
18. Return values and responses

In Express you write:

res.status(200).json(users);

In standard Nest code, you usually return the data:

return users;

Nest serializes it to JSON and sends the response.

This is preferred because it preserves Nest features such as interceptors and response decorators. The official controller documentation warns that using the raw platform-specific response object can bypass parts of Nest’s standard response handling.

You can still control status codes using decorators such as:

@HttpCode()
@Header()

But most defaults are already appropriate:

GET → 200
POST → 201
DELETE → 200


*** 19. The most important architecture

For your assignment, memorize this:

Module
  organizes the feature

Controller
  handles HTTP requests

DTO
  describes and validates incoming data

Service
  contains application logic

Repository
  communicates with TypeORM

Entity
  describes the database table


The complete CRUD flow will be:

Angular sends request
        ↓
Nest controller receives it
        ↓
Pipe validates DTO/query values
        ↓
Controller calls service
        ↓
Service uses TypeORM repository
        ↓
Repository communicates with PostgreSQL
        ↓
Result returns through service and controller
        ↓
Nest sends JSON to Angular


The most important mental model

Do not think:

The controller creates the service

Think:

The controller declares a dependency
The module registers the dependency
Nest creates and injects it

In one sentence:

Dependency injection means a class receives the objects it needs instead of creating them itself


*** Step 4: Understand forRoot() versus forFeature()

This is directly connected to dependency injection.

TypeOrmModule.forRoot(...)

Used once in the root module.

It creates the database connection for the application.

AppModule
   ↓
TypeORM PostgreSQL connection

TypeOrmModule.forFeature([User])

Used inside UsersModule.

It registers the repository for the User entity inside that module.

UsersModule
   ↓
User repository available for injection

Later, the service will receive it through DI:

UsersService needs User repository
Nest injects User repository


*** Important:

synchronize: true

automatically updates database tables based on your entities. It is convenient for this short assignment, but it is not recommended for production systems because schema changes can be risky



*** whitelist: true
forbidNonWhitelisted: true
transform: true

Their purposes:

whitelist: true removes properties that are not defined in the DTO.
forbidNonWhitelisted: true rejects requests containing unexpected fields.
transform: true allows Nest to transform input values when appropriate


*** useGlobalPipes() tells Nest:

Apply this pipe to every request in the whole application


*** app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);

Create a ValidationPipe with these options, then register it globally in the Nest application


*** Meaning:
@InjectRepository(User)

tells Nest:

Inject the TypeORM repository connected to the User entity



*** Repository<User>

means this repository works specifically with User records



*** @Paginate() reads query parameters such as:

?page=1
&limit=10
&sortBy=firstName:ASC
&search=saad



*** return paginate(query, this.userRepository, {
  // configuration
});

It has three arguments:

query
repository
configuration
query

This comes from the controller:

@Paginate() query: PaginateQuery

It contains values from the URL, such as:

?page=1
&limit=10
&sortBy=firstName:ASC
&search=saad



*** Configuration object

This controls which columns may be sorted, searched, or filtered.

sortableColumns
sortableColumns: [
  'id',
  'firstName',
  'lastName',
  'email',
  'createdAt',
],

This means the client may sort using only these columns.

Examples:

GET /users?sortBy=firstName:ASC



*** filterableColumns
filterableColumns: {
  firstName: [FilterOperator.EQ],
  lastName: [FilterOperator.EQ],
  email: [FilterOperator.EQ],
},

Filtering is more precise than searching.

You configure each column and specify which operators are allowed.

Here:

FilterOperator.EQ

means exact equality.

Example:

GET /users?filter.email=$eq:saad@example.com

This means:

email exactly equals saad@example.com



*** Complete request example

Suppose Angular sends:

GET /users?page=2&limit=5&sortBy=firstName:ASC&search=saad

The library will:

Search firstName, lastName and email for "saad"
Sort matching users by firstName ascending
Return page 2
Return 5 users per page
Include pagination metadata



*** .env file
   ↓
ConfigModule
   ↓
ConfigService
   ↓
useFactory()
   ↓
TypeORM configuration
   ↓
PostgreSQL connection



*** That is synchronous configuration: the values are written directly inside the object.

Now you want TypeORM values to come from ConfigService, which Nest must inject first. Therefore you use:

TypeOrmModule.forRootAsync(...)

It means:

Build the TypeORM configuration using injected dependencies.

It is called “async” configuration because Nest prepares the dependencies and executes a factory function before creating the database connection. The factory does not necessarily need to contain await.

inject: [ConfigService]



*** inject: [ConfigService]
inject: [ConfigService],

This tells Nest:

The factory function needs an instance of ConfigService.

Nest finds ConfigService through dependency injection and passes it into useFactory.

It is conceptually similar to constructor injection:

constructor(private readonly configService: ConfigService) {}

But here the injection happens inside configuration code, not inside a class constructor



*** useFactory
useFactory: (configService: ConfigService) => ({
  // TypeORM configuration
}),

A factory is simply a function that creates and returns something.

Here it creates and returns the TypeORM configuration object



***TypeOrmModule.forRootAsync({
  inject: [ConfigService],

  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: Number(configService.get<string>('DB_PORT')),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    autoLoadEntities: true,
    synchronize: true,
  }),
}),
ex:

Nest, inject ConfigService into this factory function. The function will read database values from the environment configuration and return the settings TypeORM needs.

Also ensure this exists before TypeORM in the module imports: