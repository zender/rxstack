# The Server

> Servers are used to represent implementations for inbound transports and/or protocols such as REST over http, etc. 
They typically listen for requests on a specific port, handle them, and return appropriate responses.
A single application can have multiple server instances listening on different ports and working with different protocols.
               
## Documentation

* [Build-in servers](#build-in-servers)
* [Server Events](#server-events)
  - [server.configure](#server-configure-event)
  - [server.connected](#server-connected-event)
  - [server.disconnected](#event-server-disconnected)
* [How to create your own server module](#create-your-own-server-module)

### <a name="build-in-servers"></a>  Build-in servers
Creating a server involves working with the `kernel`, dispatching events, processing the request, building the response, error handling, etc.
Fortunately `@rxstack` has created two ready-to-use server modules  for you
[express-server module](https://github.com/rxstack/rxstack/tree/master/packages/express-server) and 
[socketio-server module](https://github.com/rxstack/rxstack/tree/master/packages/socketio-server)

Here is how you can import them in your application:

```typescript
import {Application} from '@rxstack/framework'
import {ExpressModule} from '@rxstack/express-server';
import {SocketioModule} from '@rxstack/socketio-server';

// creates application instance and starts the servers
new Application({
  // ...
  imports: [
    ExpressModule.configure({'port': 3000}),
    SocketioModule.configure({'port': 4000})
  ],
  // enabling servers
  servers: [ExpressModule.serverName, SocketioModule.serverName],
}).start();
```

### <a name="server-events"></a>  Server events
Servers should dispatch some specific events during bootstrap, client connect and disconnect.

##### <a name="server-configure-event"></a>  Configuration event
The `server.configure` event is used to configure the server before it is started.
Purpose: registering native middlewares, setting specific server configurations and etc. 

Let's create the listener:

```typescript
import {Injectable} from 'injection-js';
import {Observe} from '@rxstack/async-event-dispatcher';
import {ServerConfigurationEvent, ServerEvents} from '@rxstack/framework';
import {ExpressServer} from '@rxstack/express-server';
import {Application} from 'express';
const cors = require('cors');

@Injectable()
export class ExpressServerConfigurationListener {

  @Observe(ServerEvents.CONFIGURE)
  async onConfigure(event: ServerConfigurationEvent): Promise<void> {
    if (event.server.getName() === ExpressServer.serverName) {
      const app: Application = event.server.getEngine();
      app
        .options('*', cors())
        .use(cors())
      ;
    }
  }
}
```

> Make sure that listener is registered in the application providers.

##### <a name="server-conected-event"></a>  Connection event
The `server.connected` event is dispatched when client is connected to the server. It is available only in socket servers.

```typescript
import {Injectable} from 'injection-js';
import {Observe} from '@rxstack/async-event-dispatcher';
import {SocketEvent, ServerEvents} from '@rxstack/framework';

@Injectable()
export class SocketServerListener {

  @Observe(ServerEvents.CONNECTED)
  async onConnect(event: SocketEvent): Promise<void> {
    // do something
  }
}
```

##### <a name="server-disconected-event"></a>  Disconnection event
The `server.disconnected` event is dispatched when client is disconnected from the server. It is available only in socket servers.
Purpose: it is very useful with [`@rxstack-channels`](https://github.com/rxstack/rxstack/tree/master/packages/channels)

```typescript
import {Injectable} from 'injection-js';
import {Observe} from '@rxstack/async-event-dispatcher';
import {SocketEvent, ServerEvents} from '@rxstack/framework';

@Injectable()
export class SocketServerListener {

  @Observe(ServerEvents.DISCONNECTED)
  async onDisconnect(event: SocketEvent): Promise<void> {
    // do something
  }
}
```
 
### <a name="create-your-own-server-module"></a>  How to create your own server module
Creating a server module is relatively simple. You need to extend 
[`AbstractServer`](https://github.com/rxstack/rxstack/blob/master/packages/framework/src/server/abstract-server.ts) class 
and implement certain methods. It needs also to be registered in the application providers:

```typescript

import {SERVER_REGISTRY} from '@rxstack/framework';

// ...
providers: [
  { provide: SERVER_REGISTRY, useClass: NyServer, multi: true },
],
servers: ['my-server']
```

The best tutorial is to study how build-in server modules are created:
- [expressjs](https://github.com/rxstack/rxstack/blob/master/packages/express-server/src/express.server.ts)
- [socketio](https://github.com/rxstack/rxstack/blob/master/packages/socketio-server/src/socketio.server.ts)


