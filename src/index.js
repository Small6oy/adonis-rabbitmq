'use strict'

// Declare Dependencies
const fs = require('fs')
const path = require('path')
const Helpers = use('Adonis/Src/Helpers')
const RabbitManager = require('./RabbitManager')

// Declare Universal Variable
const _consumersFolder = path.normalize(path.join(Helpers.appRoot(), 'app', 'Consumers'))

class RabbitMQ extends RabbitManager {
  async run () {
    if (!fs.existsSync(_consumersFolder)) return

    const consumerFiles = fs.readdirSync(_consumersFolder)
    const files = consumerFiles.filter(file => path.extname(file) === '.js')

    for (const file of files) {
            // Get instance of consumer controller class
      const filePath = path.join(_consumersFolder, file)
      const consumer = require(filePath)
      const consumerInstance = new consumer()

      this._handleConsumer(consumer, consumerInstance)
    }
  }

  async _handleConsumer (consumer, consumerInstance) {
        // Every consumer must expose a channel
    if (!('channel' in consumer)) throw { message: 'Missing Static Channel Name' }
    if (!('receive' in consumerInstance)) throw { message: 'Missing Receive Handler Function' }

        // Register task handler
    const { exchange = null, maxPriority = null, consumers = 1 } = consumer
    const options = { exchange, maxPriority }
    const queueName = consumer.channel
    const onMessage = consumerInstance.receive.bind(consumerInstance)

    for (let i = 0; i < consumers; i++) {
      await this.assertQueue(queueName, options)
      await this.consumeFrom(queueName, onMessage)
    }
  }
}

module.exports = RabbitMQ
