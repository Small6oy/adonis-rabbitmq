const Message = require('./Message')
const safeStringify = require('./utils')
const RabbitConnection = require('./RabbitConnection')

class RabbitManager {

    constructor(Config) {
        const settings = Config.get('rabbitmq');
        if (!settings) throw new Error(`missing rabbitmq config file`);
    
        const { environment, enabled } = settings
    
        this.enabled = (enabled == "true")
        if (!this.enabled) { console.warn("Rabbit-MQ Disabled"); return; }

        const rabbitConfig = settings[environment]
        this.rabbitConnection = new RabbitConnection(rabbitConfig)
    }

    toBuffer(content) {
        return Buffer.isBuffer(content)
            ? content
            : Buffer.from(
                typeof content === 'object' ? safeStringify(content) : content
            )
    }

    async getConnection() {
        return this.rabbitConnection.getConnection()
    }

    async getChannel() {
        const connection = await this.getConnection()

        if (!this.hasChannel) {
            this.channel = await new Promise((resolve, reject) => {
                connection.createChannel((err, channel) => {
                    if (err) {
                        this.hasChannel = false
                        reject(err)
                    } else {
                        channel.on("error", (err) => {
                            if (err.message !== "Channel Closing") {
                                this.hasChannel = false
                            }
                        });
                        channel.on("close", () => {
                            this.hasChannel = false
                        });

                        this.hasChannel = true
                        resolve(channel)
                    }
                })
            })
        }

        return this.channel
    }

    async assertQueue(queueName, options) {
        const channel = await this.getChannel()
        return channel.assertQueue(queueName, options)
    }

    async sendToQueue(queueName, content, options) {
        const channel = await this.getChannel()
        return channel.sendToQueue(queueName, this.toBuffer(content), options)
    }

    async assertExchange(exchangeName, type, options) {
        const channel = await this.getChannel()
        return channel.assertExchange(exchangeName, type, options)
    }

    async bindQueue(queueName, exchangeName, pattern = '') {
        const channel = await this.getChannel()
        return channel.bindQueue(queueName, exchangeName, pattern)
    }

    async sendToExchange(exchangeName, routingKey, content) {
        const channel = await this.getChannel()
        return channel.publish(exchangeName, routingKey, this.toBuffer(content))
    }

    async ackAll() {
        const channel = await this.getChannel()
        return channel.ackAll()
    }

    async nackAll(requeue) {
        const channel = await this.getChannel()
        return channel.nackAll(requeue)
    }

    async consumeFrom(queueName, onMessage) {
        const channel = await this.getChannel()
        channel.prefetch(1)
        return channel.consume(queueName, (message) => {
            const messageInstance = new Message(channel, message)
            onMessage(messageInstance)
        })
    }

    async closeChannel() {
        if (this.hasChannel) {
            await this.channel.close()
            this.hasChannel = false
        }
    }

    async closeConnection() {
        await this.rabbitConnection.closeConnection()
    }
}
module.exports = RabbitManager
