'use strict'

class testConsumer {

    static get channel() {
        return 'test'
    }

    static get consumers() {
        return 1
    }

    async receive(message) {
        const payload = message.getContent();
        try {
            console.log(payload)
            return message.ack()
        } catch (ex) {
            console.error({ ...payload, error: ex.message })
            return message.nack()
        }
    }

}
module.exports = testConsumer;