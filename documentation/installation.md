## Install

In order to use adonis-rabbitmq
```bash
npm install -save https://github.com/Small6oy/adonis-rabbitmq
```

## Register provider

Make sure you register the provider inside `start/app.js` file.

```js
const providers = [
  ...
  `adonis-rabbitmq/providers/RabbitMqProvider`
]
```