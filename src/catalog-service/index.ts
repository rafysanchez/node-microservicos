import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const EXCHANGE = 'order_events';

const catalog = [
  { id: 1, name: 'Laptop', stock: 10 },
  { id: 2, name: 'Mouse', stock: 50 },
  { id: 3, name: 'Keyboard', stock: 30 }
];

async function start(retries = 5) {
  while (retries) {
    try {
      console.log(`[CATALOG-SERVICE] Attempting to connect to RabbitMQ at ${RABBITMQ_URL}...`);
      const connection = await amqp.connect(RABBITMQ_URL);
      const channel = await connection.createChannel();

      await channel.assertExchange(EXCHANGE, 'fanout', { durable: false });
      const q = await channel.assertQueue('', { exclusive: true });
      
      console.log(`[CATALOG-SERVICE] Waiting for messages in ${q.queue}...`);
      await channel.bindQueue(q.queue, EXCHANGE, '');

      channel.consume(q.queue, (msg) => {
        if (msg !== null) {
          const order = JSON.parse(msg.content.toString());
          console.log(`[CATALOG-SERVICE] Received order event for product ID: ${order.productId}`);
          
          const item = catalog.find(p => p.id === order.productId);
          if (item) {
            item.stock -= order.quantity;
            console.log(`[CATALOG-SERVICE] Stock updated for ${item.name}. New stock: ${item.stock}`);
          }
          
          channel.ack(msg);
        }
      });
      return; // Success
    } catch (error) {
      console.error(`[CATALOG-SERVICE] Connection failed. Retries left: ${retries - 1}`);
      retries -= 1;
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

start();
