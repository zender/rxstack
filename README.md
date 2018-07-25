# RxStack Framework

> RxStack is a realtime object-oriented framework which helps you build a micro service web applications
on top of other frameworks like `express` and `socketio` by adding an abstraction layer.


Component tree goes here

## Getting started

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project folder and file structure](#project-structure)
- [Controllers](#controllers)
    - [Creating a Controller]()
    - [Mapping a URL and socket event to a Controller]()
    - [Managing errors]()
    - [The Request and Response Object]()
- [Event Listeners](#event-listeners)
- [Security](#security)
    - [Installation](#security-installation)
    - [Configurations](#security-configuration)
    - [Registering a user provider](#security-user-provider)
    - [Securing a controller](#security-controller)
    - [Obtaining the token](#security-obtaining-token)
    - [Securing controller with authentication listener](#security-listener)
    - [References](https://github.com/rxstack/rxstack/tree/master/packages/security)
- [Servers](#servers)
    - [Express](#)
    - [SocketIO](#)
- [Databases](#quides)
    - [TypeORM](#databases)
    - [Mongoose](#databases)
- [Testing](#testing)
    - [Unit]()
    - [Integration]()
    - [Functional]()
    - [Load]()


### <a name="prerequisites"></a> Prerequisites
`RxStack` requires `Node v8.0.0` and later. On MacOS and other Unix systems the 
[Node Version Manager](https://github.com/creationix/nvm) is a good way 
to quickly install the latest version of NodeJS and keep up it up to date. You'll also need git installed.
After successful installation, the node, npm and git commands should be available on the terminal 
and show something similar when running the following commands:

```bash
$ node --version
v8.5.0
```

```bash
$ npm --version
6.1.0
```

```bash
$ git --version
git version 2.7.4
```

### <a name="installation"></a> Installation

Let's clone the pre-configured skeleton application:

```bash
$ git clone https://github.com/rxstack/skeleton.git my-project
$ cd my-project
$ npm install
$ npm run dev
```

If you now try to access [localhost](http://localhost:3000/) in the browser you should see the welcome page 
or you can access it via websockets:

```typescript
const io = require('socket.io-client');
const conn = io('ws://localhost:4000', {transports: ['websocket']});

conn.emit('app_index', null, function (response: any) {
  console.log(response); // should output Response object
});
```

### <a name="project-structure"></a> Project folder and file structure

- `src` - all your code lives here
    - `index.ts` - application entry file
    - `app` - application related files
        - `app-options.ts` - all application configurations [read more](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/application.md).
        - `commands` - command line application files [read more](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/console.md)
        - `controllers` - all your controller files
        - `event-listeners` - all your event listener files
    - `environments` - configuration files [read more](https://github.com/rxstack/rxstack/tree/master/packages/configuration)
- `test` - all tests files
- `static` - all static files
- `gulpfile.ts` - gulp tasks
- `tslint.json` - typescript linter configuration
- `tsconfig.json` - typescript configuration
    
### <a name="controllers"></a> Controllers
A controller is a typescript function you create that reads information from the `Request` object 
and creates and returns a `Response` object. The response could be an HTML page, JSON, XML, a file download, 
a 404 error or anything else you can dream up. 
The controller executes whatever arbitrary logic your application needs to send a response to the client.
 
##### <a name="creating-a-controller"></a> Creating a controller 
A controller is usually a method inside a controller class:

```typescript
// my-project/src/app/controllers/lucky.controller.ts

import {Injectable} from 'injection-js';
import {Http, Logger, Request, Response, WebSocket} from '@rxstack/core';

@Injectable()
export class LuckyController {

  // Logger is injected via constructor method
  constructor(private logger: Logger) { }

  @Http('GET', '/lucky/number/:max', 'app_lucky_number')
  @WebSocket('app_lucky_number')
  async number(request: Request): Promise<Response> {
    this.logger.source(this.constructor.name).debug('Debugging request params: ', request.params.toObject());
    const num: number = Math.floor(Math.random() * Math.floor(request.params.get('max')));
    return new Response({num});
  }
}
```

This controller is pretty straightforward:

- a `LuckyController` class is created and [@Injectable()](https://github.com/mgechev/injection-js) annotation is applied.
- The `number()` method is created and 
[`@http()` and `@websocket`](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/kernel.md#decorators) 
annotations are applied 
in order to register it in the `Kernel`.
- A [`Request`](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/kernel.md#request-object) object is passed as a method argument.
- A promise of [`Response`](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/kernel.md#response-object) object is returned.

> you need to register `LuckyController` in the application providers:

```typescript
// my-project/src/app/controllers/providers.ts
import {ProviderDefinition} from '@rxstack/core';
import {LuckyController} from './lucky-controller';

export const APP_CONTROLLER_PROVIDERS: ProviderDefinition[] = [
  { provide: LuckyController, useClass: LuckyController }
];
```

##### <a name="mapping-a-url-and-socket-event-to-a-controller"></a> Mapping a URL and socket event to a Controller

In order to view the result of this controller, you need to map a URL to it via a `@http()` decorator.

```typescript
@Http('GET', '/lucky/number/:max', 'app_lucky_number')
```

then you can access it via http:
            
```bash
curl http://localhost:3000/lucky/number/10
```

and setting an event name via a `@websocket()` decorator.

```typescript
@WebSocket('app_lucky_number')
```

then you can access it using socketio-client:

```typescript
const io = require('socket.io-client');
const conn = io('ws://localhost:4000', {transports: ['websocket']});

conn.emit('app_lucky_number', {params: {max: 10}}, function (response: any) {
  console.log(response); // should output Response object
});
```

##### <a name="managing-errors"></a> Managing errors

If you throw an exception that extends or is an instance of [`HttpException`](https://github.com/rxstack/rxstack/blob/master/packages/exceptions/src/http.exception.ts), 
`RxStack` will use the appropriate HTTP status code. 
Otherwise, the response will have a 500 HTTP status code:

```typescript
// my-project/src/app/controllers/lucky.controller.ts

import {Injectable} from 'injection-js';
import {Http, Logger, Request, Response, WebSocket} from '@rxstack/core';
import {BadRequestException} from '@rxstack/exceptions';

@Injectable()
export class LuckyController {
  // ...
  async number(request: Request): Promise<Response> {
    if (parseInt(request.params.get('max')) < 3) {
      throw new BadRequestException('Number should be greater than 3.');
    }
    // ...
  }
}
```

##### Learn more:

- [Application](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/application.md)
- [Kernel](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/kernel.md)
- [Exceptions](https://github.com/rxstack/rxstack/tree/master/packages/exceptions)

##### <a name="request-response-objects"></a> The Request and Response Object

The `Request` object is created from the underlying framework incoming request. It lives only in the controller method.
It has several public properties that return any information you need about the request.

Learn more about [Request Object](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/kernel.md#request-object).

The `Response` object passes information to the underlying framework to construct the response and send it to the client.

Learn more about [Response Object](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/kernel.md#response-object).

### <a name="event-listeners"></a> Events and Event Listeners
During the execution of a `RxStack` application, some event notifications are triggered. 
Your application can listen to these notifications and respond to them by executing any piece of code.

`RxStack` triggers several events related to the kernel while processing the Request. 
Third-party modules may also dispatch events, and you can even dispatch custom events from your own code.

##### <a name="creating-listener"></a> Creating an event listener
The most common way to listen to an event is to register an event listener:

```typescript
// my-project/src/app/event-listeners/exception.listener.ts
import {Injectable} from 'injection-js';
import {ExceptionEvent, KernelEvents, Response} from '@rxstack/core';
import {HttpException} from '@rxstack/exceptions';
import {Observe} from '@rxstack/async-event-dispatcher';

@Injectable()
export class ExceptionListener {

  @Observe(KernelEvents.KERNEL_EXCEPTION)
  async onException(event: ExceptionEvent): Promise<void> {
    // make sure it is applied only on LuckyController.number
    if (event.getRequest().routeName !== 'app_lucky_number') {
      return;
    }
    // You get the exception object from the received event
    const exception = event.getException();
    const errMsg = `My error says: ${exception.message}`;

    // Customize your response object to display the exception details
    const response = new Response(errMsg);

    if (exception instanceof HttpException) {
      response.statusCode = exception.statusCode;
    } else {
      response.statusCode = 500;
    }

    // sends the modified response object to the event
    event.setResponse(response);
  }
}
```

> you need to register `ExceptionListener` in the application providers:

```typescript
// my-project/src/app/event-listeners/providers.ts
import {ProviderDefinition} from '@rxstack/core';
import {ExceptionListener} from './exception.listener';

export const APP_LISTENERS_PROVIDERS: ProviderDefinition[] = [
  // ...
  { provide: ExceptionListener, useClass: ExceptionListener }
];
```


##### Learn more:

- [Async Event Dispatcher](https://github.com/rxstack/rxstack/tree/master/packages/async-event-dispatcher)
- [Application Events](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/application.md#bootstrap-event)
- [Kernel Events](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/kernel.md#events)
- [Server Events](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/server.md#server-events)


### <a name="security"></a> Security
In this article you'll learn how to set up your application's security step-by-step, from configuring your application 
and how you load users, to denying access and fetching the `User` object.

##### <a name="security-installation"></a> Installation

```bash
npm install @rxstack/security --save
```

##### <a name="security-configuration"></a> Configurations

Add the following configurations to the environment file:

```typescript
// my-project/src/environments/environment.ts

// ...
  security: {
    local_authentication: true,
    token_extractors: {
      authorization_header: {
        enabled: true
      }
    },
    ttl: 300,
    secret: 'my_secret',
    signature_algorithm: 'HS512'
  }
```

and register the module:

```typescript
// my-project/src/app/app-options.ts
// ...

import {ApplicationOptions} from '@rxstack/core';
import {environment} from '../environments/environment';
import {SecurityModule} from '@rxstack/security';

export const APP_OPTIONS: ApplicationOptions = {
  // ...
  imports: [
    // ...
    SecurityModule.configure(environment.security)
  ]
};
```

[Learn more about security configurations](https://github.com/rxstack/rxstack/tree/master/packages/security#configurations)


##### <a name="security-user-provider"></a> Registering a user provider
The easiest (but most limited) way, is to configure `RxStack` to load hardcoded users directly from configurations. 
This is called an "in memory" provider, but it's better to think of it as an "in configuration" provider:

- Let's create the `User` model:

```typescript
// my-project/src/app/models/user.ts
import {EncoderAwareInterface, PlainTextPasswordEncoder, User as BaseUser} from '@rxstack/security';

export class User extends BaseUser implements EncoderAwareInterface {
  getEncoderName(): string {
    return PlainTextPasswordEncoder.ENCODER_NAME;
  }
}
```

We extend `User` from `@rxstack/security` and tell the model to use a specific password encoder.

[Lear more about password encoders](https://github.com/rxstack/rxstack/tree/master/packages/security#password-encoders)

- Let's add users to `environment.ts` file:

```typescript
// my-project/src/environments/environment.ts

// ...
  users: [
    {
      username: 'admin',
      password: 'admin',
      roles: ['ROLE_ADMIN']
    },
    {
      username: 'user',
      password: 'user',
      roles: ['ROLE_USER']
    }
  ]
```

> We added two users with different roles `ROLE_ADMIN` and `ROLE_USER`.

- Let's register the in-memory user provider in the application providers:

Create the providers file:

```bash
$ mkdir my-project/src/app/security
$ touch my-project/src/app/security/provider.ts 
```

and put the following content:

```typescript
// my_project/src/app/security/provider.ts 

import {ProviderDefinition, UserInterface} from '@rxstack/core';
import {InMemoryUserProvider, USER_PROVIDER_REGISTRY} from '@rxstack/security';
import {environment} from '../../environments/environment';
import {User} from '../models/user';

export const APP_SECURITY_PROVIDERS: ProviderDefinition[] = [
  {
    provide: USER_PROVIDER_REGISTRY,
    useFactory: () => {
      return new InMemoryUserProvider<UserInterface>(
        environment.users,
        (data: UserInterface) => new User(data.username, data.password, data.roles)
      );
    },
    deps: [],
    multi: true
  },
];
```

register the security providers in the application options:

```typescript
// my-project/src/app/app-options.ts
// ...

import {ApplicationOptions} from '@rxstack/core';
import {APP_SECURITY_PROVIDERS} from './security/providers';

export const APP_OPTIONS: ApplicationOptions = {
  // ...
  providers: [
    // ...
    ...APP_SECURITY_PROVIDERS
  ]
};
```

[Learn more about user providers](https://github.com/rxstack/rxstack/tree/master/packages/security#user-providers)

##### <a name="security-controller"></a> Securing a controller
As we successfully set up and configured security module, let's create our first secured controller:

```typescript
// my-project/src/app/controllers/secured.controller.ts
import {Injectable} from 'injection-js';
import {Http, Request, Response, WebSocket} from '@rxstack/core';
import {ForbiddenException} from '@rxstack/exceptions';

@Injectable()
export class SecuredController {

  @Http('GET', '/secured/admin', 'app_secured_admin')
  @WebSocket('app_secured_admin')
  async adminAction(request: Request): Promise<Response> {
    if (!request.token.hasRole('ROLE_ADMIN')) {
      throw new ForbiddenException();
    }
    return new Response('secured admin action');
  }
}
```

> you need to register `SecuredController` in the application controller providers:

```typescript
// my-project/src/app/controllers/providers.ts
import {ProviderDefinition} from '@rxstack/core';
import {SecuredController} from './secured.controller';

export const APP_CONTROLLER_PROVIDERS: ProviderDefinition[] = [
  // ...
  { provide: SecuredController, useClass: SecuredController }
];
```

As you see in the `Request` object we retrieve the security token and check if the logged in user has a certain role.

[Learn more about tokens](https://github.com/rxstack/rxstack/tree/master/packages/security#working-with-token)

##### <a name="security-obtaining-token"></a> Obtaining the token
By default `@rxstack/security` is using JWT. The token could be generated on a dedicated authentication server 
or in the `RxStack` application if `local_authentication` is enabled.

Let's obtain the token:

```bash
curl -X POST \
  http://localhost:3000/security/login \
  -H 'content-type: application/json' \
  -d '{
	"username": "admin",
	"password": "admin"
}'
```

or via websockets:


```typescript
const io = require('socket.io-client');
const conn = io('ws://localhost:4000', {transports: ['websocket']});

conn.emit('security_login', {params: {username: "admin", password: "admin"}}, function (response: any) {
  console.log(response.content); // should output {"token": "...", "refreshToken": "..."}
});
```

> Token expiration time is set in the `ttl` option in the security module.


As we now have the token we can try to access `app_secured_admin` via http:

```bash
curl -X GET \
  http://localhost:3000/secured/admin \
  -H 'authorization: Bearer your-generated-token' 
```

To access secured controller actions via websocket, you first need to authenticate:

```typescript
// ...

conn.emit('security_authenticate', {params: {bearer: "your-generated-token"}}, function (response: any) {
  console.log(response.statusCode); // should output 204 or 401
});
```

After you are successfully authenticated, you can access `app_secured_admin`:

```typescript
// ...

conn.emit('app_secured_admin', null, function (response: any) {
  console.log(response.statusCode); // should output 200
});
```

[Learn more about local authentication](https://github.com/rxstack/rxstack/tree/master/packages/security#local-authentication)

##### <a name="security-listener"></a> Securing with authentication listener
If you need to restrict the access on application level then you need to create an authentication listener.

Let's add another action to the `SecuredController`:

```typescript
// my-project/src/app/controllers/secured.controller.ts
import {Injectable} from 'injection-js';
import {Http, Request, Response, WebSocket} from '@rxstack/core';
import {ForbiddenException} from '@rxstack/exceptions';

@Injectable()
export class SecuredController {
  // ...
  
  @Http('GET', '/secured/user', 'app_secured_user')
  @WebSocket('app_secured_user')
  async userAction(request: Request): Promise<Response> {
    return new Response('secured user action');
  }
}
```

As you see the `userAction` is not secured. Let's create the listener:

```typescript
// my-project/src/app/listeners/authentication.listener.ts
import {Injectable} from 'injection-js';
import {KernelEvents, RequestEvent} from '@rxstack/core';
import {ForbiddenException} from '@rxstack/exceptions';
import {Observe} from '@rxstack/async-event-dispatcher';

@Injectable()
export class AuthenticationListener {

  @Observe(KernelEvents.KERNEL_REQUEST)
  async onRequest(event: RequestEvent): Promise<void> {
    // make sure route/event name starts with "app_secured_"
    if (event.getRequest().routeName.search('^app_secured_') === -1) {
      return;
    }
    // checks whether user is authenticated or not
    if (!event.getRequest().token.isAuthenticated()) {
      throw new ForbiddenException();
    }
  }
}
```

> you need to register `AuthenticationListener` in the application listener providers:

```typescript
// my-project/src/app/listener/providers.ts
import {ProviderDefinition} from '@rxstack/core';
import {AuthenticationListener} from './authentication.listener';

export const APP_LISTENERS_PROVIDERS: ProviderDefinition[] = [
  // ...
  { provide: AuthenticationListener, useClass: AuthenticationListener },
];
```

As you see `RxStack` security module provides powerful and flexible authentication system.

[Complete security module documentations](https://github.com/rxstack/rxstack/tree/master/packages/security)

## License

Licensed under the [MIT license](LICENSE).