import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const EXCHANGE = 'order_events';

async function start(retries = 5) {
  while (retries) {
    try {
      console.log(`[NOTIFICATION-SERVICE] Attempting to connect to RabbitMQ at ${RABBITMQ_URL}...`);
      const connection = await amqp.connect(RABBITMQ_URL);
      const channel = await connection.createChannel();

      await channel.assertExchange(EXCHANGE, 'fanout', { durable: false });
      const q = await channel.assertQueue('', { exclusive: true });
      
      console.log(`[NOTIFICATION-SERVICE] Waiting for messages in ${q.queue}...`);
      await channel.bindQueue(q.queue, EXCHANGE, '');

      channel.consume(q.queue, (msg) => {
        if (msg !== null) {
          const order = JSON.parse(msg.content.toString());
          console.log(`[NOTIFICATION-SERVICE] Sending email to ${order.customerEmail}...`);
          console.log(`[NOTIFICATION-SERVICE] Subject: Order #${order.id} Confirmed!`);
          console.log(`[NOTIFICATION-SERVICE] Body: Your order for ${order.quantity} units has been received.`);
          
          channel.ack(msg);
        }
      });
      return; // Success
    } catch (error) {
      console.error(`[NOTIFICATION-SERVICE] Connection failed. Retries left: ${retries - 1}`);
      retries -= 1;
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

start();
