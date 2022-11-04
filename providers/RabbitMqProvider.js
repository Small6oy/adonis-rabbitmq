const { ServiceProvider } = require('@adonisjs/fold')

class Provider extends ServiceProvider {
  register () {
    this.app.singleton('RabbitMQ', () => {
      const Config = this.app.use('Adonis/Src/Config')
      const RabbitMQ = require('../src')
      return new RabbitMQ(Config)
    })
  }

  boot () {
    const rabbitMq = this.app.use('RabbitMQ')
    rabbitMq.run()
  }
}

module.exports = Provider
