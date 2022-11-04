'use strict'
const RabbitMq = use('RabbitMq')

class testProducer {

    async submit() {
        try {

            const queueName = 'test'
            const payload = {
                number: 1,
                string: 'test',
                array: ['1', '2', 3]
            }

            await RabbitMq.sendToQueue(queueName, payload)
        } catch (ex) {
            console.error({ ...payload, error: ex.message })            
        }
    }

}
module.exports = testProducer;