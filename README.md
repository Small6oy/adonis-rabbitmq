# Registering provider

## Setup

Add new relic provider in the top of providers list.

```js
// app/start.js

const providers = [
  `@small6oy/adonis-rabbitmq/providers/Provider`
  // ...
];
```

In the main directory add `rabbitmq.js` and copy

```js
/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use("Env");

/**
 * Rabbit MQ configuration.
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * application name.
   */
  app_name: Env.get("APP_NAME"),

  /**
   * Rabbit MQ HOST DETAILS.
   */
  host: Env.get('RABBITMQ_HOST'),
  port: Env.get('RABBITMQ_PORT'),
  username: Env.get('RABBITMQ_USERNAME'),
  password: Env.get('RABBITMQ_PASSWORD'),

  /**
   * Disable Rabbit MQ.
   */
  enabled: Env.get("RABBITMQ_ENABLED", true),

  /**
   * Level at which to log. 'trace' is lowest when diagnosing
   * issues with the agent, 'info' and higher will impose the least overhead on
   * production applications.
   */
  level: Env.get('RABBITMQ_LOG_LEVEL', 'info'),

};
```

In your `.env` file add this variable and paste your new relic key

```env
RABBITMQ_ENABLED=
RABBITMQ_LOG_LEVEL=
RABBITMQ_HOST=
RABBITMQ_PORT=
RABBITMQ_USERNAME=
RABBITMQ_PASSWORD=
```