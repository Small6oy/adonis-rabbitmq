const log = use('Logger')
const amqp = require('amqplib/callback_api')

// Declare Universal Variable
const max_retries = 10

class RabbitConnection {

  constructor (config) {
    const { username, password, host, port } = config
    this.credentials = this.handleCredentials(username, password)
    this.hostname = this.handleHostname(host, port)
    return this
  }

  handleCredentials (username, password) {
    if (!username) throw { message: 'Missing RabbitMQ user' }
    if (!password) throw { message: 'Missing RabbitMQ password' }
    return `${username}:${password}@`
  }

  handleHostname (host, port) {
    if (!host) throw { message: 'Missing RabbitMQ hostname' }
    return port ? `${host}:${port}` : host
  }

  get url () {
    return `amqp://${this.credentials}${this.hostname}`
  }

  async getConnection () {
    if (!this.connection) {
      try {
                // Check if maxed out trying to connect to server
        if (this.retries == max_retries) throw { message: `Failed to Connect to RabbitMq ${host}:${port}` }
        this.retries++

        this.connection = new Promise((resolve, reject) => {
          amqp.connect(this.url, (err, conn) => {
            if (err) return setTimeout(() => { this.getConnection() }, 2000)

            conn.on('error', (err) => {
              if (err.message !== 'Connection closing') {
                log.error(`${this.tag} :: conn error`, { error: err.message })
              }
            })
            conn.on('close', () => {
              log.error(`${this.tag} :: Connection Closed`)
              return setTimeout(() => { this.getConnection() }, 2000)
            })

            resolve(conn)
          })
        })
      } catch (error) {
        throw error
      }
    }

    return this.connection
  }

  async closeConnection () {
    if (this.hasConnection) {
      await this.connection.close()
      this.hasConnection = false
    }
  }
}
module.exports = RabbitConnection
