# RxStack Framework

> RxStack is a realtime object-oriented framework which helps you build a micro service web applications
on top of other frameworks like `express` and `socketio` by adding an abstraction layer.

Component tree goes here

## Getting started

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project folder and file structure](#project-structure)
- [Controllers](#controllers)
- [Event Listeners](#event-listeners)
- [Security](#security)
- [File Upload](#file-upload)
- [Working with sockets and channels](#websockets-channels)
- [Working with databases](#databases)


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

Let's get started:

```bash
$ git clone https://github.com/rxstack/skeleton.git my-project
$ cd my-project
$ npm install
$ npm run dev
```

If you now try to access [localhost](http://localhost:3000/) in the browser you should see the welcome page.

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
        - `app-options.ts` - here you'll import all modules, register providers and configute the application itself.
        - `commands` - command line application files
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

> The controller is the number() method, which lives inside a controller class LuckyController.

This controller is pretty straightforward:

- a `LuckyController` class is created and `@Injectable()` annotation is applied.
- The `constructor` method is used to inject services.
- The `number()` method is created and `@http()` and `@websocket` annotations are applied 
in order to register it in the `Kernel`.
- A `Request` object is passed as a method argument.
- A promise of `Response` object is returned.

> you need to register `LuckyController` in the application providers:

```typescript
// my-project/src/app/controllers/providers.ts
import {ProviderDefinition} from '@rxstack/core';
import {LuckyController} from './lucky-controller';

export const APP_CONTROLLER_PROVIDERS: ProviderDefinition[] = [
  { provide: LuckyController, useClass: LuckyController }
];
```

Let's access it via http:

```bash
curl http://localhost:3000/lucky/number/10
```

and websockets:

```typescript
const io = require('socket.io-client');
const conn = io('ws://localhost:4000', {transports: ['websocket']});

conn.emit('app_lucky_number', {params: {max: 10}}, function (response: any) {
  console.log(response); // should output Response object
});
```

To learn more about the Request Response objects, Routing, Kernel Events
see the [Kernel component documentation](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/kernel.md).

### <a name="routing"></a> Routing
Routing refers to how an application’s endpoints respond to client requests.

##### Http Routing
A route is a map from a URL path to a controller. Suppose you want one route that matches `/blog` 
exactly and another more dynamic route that can match any URL like `/blog/my-post`:

## License

Licensed under the [MIT license](LICENSE).