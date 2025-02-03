const amqp = require('amqplib');

const RABBITMQ_URL = 'amqp://localhost';
const QUEUE_NAME = 'user_notifications';

// Function to consume messages from RabbitMQ
async function consumeMessages() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        await channel.assertQueue(QUEUE_NAME, { durable: true });
        console.log(`Notification Service: Waiting for messages in ${QUEUE_NAME}...`);

        channel.consume(QUEUE_NAME, (msg) => {
            if (msg !== null) {
                const user = JSON.parse(msg.content.toString());
                console.log(`Notification Service: New user created: ${JSON.stringify(user)}`);

                // Acknowledge the message
                channel.ack(msg);
            }
            else {
                console.error('Consumer cancelled by server!');
                return;
            }
        }, { noAck: false });
    } catch (error) {
        console.error('Error consuming messages:', error);
    }
}

// Start consuming messages
consumeMessages();
