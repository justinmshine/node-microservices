Assignment 1

Objective: Create two microservices that send messages between each other.

Ths task was solved by asynchronous communication between microservices using RabbitMQ, we will set up two microservices: User Service and Notification Service. The User Service will publish messages to RabbitMQ when a new user is created. The Notification Service will consume those messages and send a notification (for simplicity, we will log the notification to the console).

Install and run RabbitMQ on you local machine using Docker with cli command, 

docker run -d --hostname my-rabbit --name some-rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management

You can access the RabbitMQ management interface at http://localhost:15672/ with username guest and password guest.

Go into the user and noficication services folders and run them using cli command, 

node index.js

Explanation of the Code

User Service:
This service listens for POST requests to create a user.
When a new user is created, it publishes a message to the RabbitMQ queue (user_notifications) containing the user information.
The message is sent in a persistent manner, ensuring that it will not be lost even if RabbitMQ restarts.

Notification Service:
This service connects to the same RabbitMQ instance and listens for messages in the user_notifications queue.
When a message is received, it logs the new user information to the console and acknowledges the message, indicating that it has been processed.

Test thw service work using a POST request to the user on Postman, 

POST http://localhost:3001/users
Content-Type: application/json

{
    "username": "Justin Shine",
    "email": "justin@shine.com"
}

In terminal you will see the notification result, 

justinmshine@penguin:/opt/lampp/htdocs/microservices/notification$ node index.js 
Notification Service: Waiting for messages in user_notifications...
Notification Service: New user created: {"id":1738588381768,"username":"Justin Shine","email":"justin@shine.com"}

You will also be able to view in the RabbitMQ management interface. 

Unit tests for the API endpoint can be run from the user directory using the cli command, 

npm test