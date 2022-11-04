const safeStringify = require('./utils')

class Message {
  constructor (channel, message) {
    if (message === null) {
      throw { message: 'Message expected, received null.' }
    }

    this.message = message
    this.channel = channel
  }

  ack (allUpTo = false) {
    this.channel.ack(this.message, allUpTo)
  }

  nack (allUpTo = false, requeue = true) {
    this.channel.nack(this.message, allUpTo, requeue)
  }

  reject (requeue = true) {
    this.channel.reject(this.message, requeue)
  }

  handleError (queue, payload, error) {
    this.channel.assertQueue('exceptions')
    this.channel.sendToQueue('exceptions', this.toBuffer({ queue, payload, created_at: (new Date()).getTime(), error }))
  }

  getContent () {
    return JSON.parse(this.message.content.toString())
  }

  getFields () {
    return this.message.fields
  }

  getProperties () {
    return this.message.properties
  }

  toBuffer (content) {
    return Buffer.isBuffer(content)
            ? content
            : Buffer.from(
                typeof content === 'object' ? safeStringify(content) : content
            )
  }
}
module.exports = Message
