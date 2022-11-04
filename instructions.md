## Registering provider

Make sure you register the provider inside `start/app.js` file before making use throttle request.

```js
const providers = [
  `@small6oy/adonis-rabbitmq/providers/RabbitMqProvider`
]
```

## Usage

### Consumers

Use the `throttle` middleware to limit request for a given route (eg. Login Route)

The following example throttle request be limiting the number of login attempts for 5 requests every 3 minutes.

Throttle 5 request per minute

```javascript
// app/Consumer/****.js

```
