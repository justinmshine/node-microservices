const amqp = require('amqplib');
const express = require("express");
const app = express();
app.use(express.json());
const port = 3001;

const RABBITMQ_URL = 'amqp://localhost';
const QUEUE_NAME = 'user_notifications';

// Function to publish messages to RabbitMQ
async function publishMessage(message) {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        await channel.assertQueue(QUEUE_NAME, { durable: true });
        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
            persistent: true,
        });

        console.log(`User Service: Message sent to queue: ${JSON.stringify(message)}`);
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error publishing message:', error);
    }
}

// Endpoint to create a new user
app.post('/users', async (req, res) => {

    // Check if the request body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Request body cannot be empty.' });
    }

    const { username, email } = req.body;

    // Simulate user creation
    const newUser = { id: Date.now(), username, email };
    console.log('User created:', newUser);

    // Publish a message to RabbitMQ
    await publishMessage(newUser);

    res.status(201).json(newUser);
});

// Start the server
app.listen(port, () => {
    console.log(`User Service running at http://localhost:${port}`);
});

module.exports = app;