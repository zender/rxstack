# The RxStack Configuration Component

> The Configuration component allows you to load different configuration files depending on node environment.

## Installation

```
npm install @rxstack/configuration --save
```

## Documentation
By default in the `/src/environments` folder you have an environment.ts file for development. 
Let’s say we want to load different file in production environment 
then we need to create a new file `/src/environments/environment.production.ts`.
The production environment will inherit all configurations from `environment.ts`. 
Under the hood it uses lodash `_.merge()` to overwrite configurations.


### Example
In `environments/environment.ts` we want to use the local development environment:

```typescript
export const environment = {
  "host": "localhost",
  "port": 3000,
  "mongodb": "mongodb://localhost:27017/myapp",
};
```

In `environments/environment.production.ts` we are going to use environment variables:

```typescript
export const environment = {
  "host": "MONGO_HOST",
  "port": "MONGO_PORT",
  "mongodb": "MONGOHQ_URL",
};
```

Now it can be used in our `app.ts` like this:

```typescript
import {Configuration} from '@rxstack/configuration';
Configuration.initialize();
import {environment} from './environments/environment';

// in development it will return localhost
environment.host
```

### Changing the location of the environments directory

The `Configuration.initialize()` takes up to two options:

1. By default i will look for `src/environments` directory in the root of your application. 
You can change it for example to `Configuration.initialize(process.env.AP_DIR + '/src/configs')`.
2. Files are named `environment.ts` or `environment.testing.ts`. 
You can change the name `Configuration.initialize(null, 'config')` then it will become `config.ts`


### Variable types
`@rxstack/configuration` uses the following variable mechanisms:

- If the value is a valid environment variable (e.v. NODE_ENV), use its value instead
- If the value starts with `./` or `../` turn it into an absolute path relative to the application root path

### Setting app directory variable
When calling `Configuration.initialize()` or `Configuration.initAppDirectory()`, 
it will set `process.env.APP_DIR` to the absolute path of root project directory

