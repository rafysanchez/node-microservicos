import express from 'express';
import amqp from 'amqplib';

const app = express();
app.use(express.json());

const PORT = 3000;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const EXCHANGE = 'order_events';

const orders: any[] = [];

async function initRabbitMQ(retries = 5) {
  while (retries) {
    try {
      console.log(`[ORDER-SERVICE] Attempting to connect to RabbitMQ at ${RABBITMQ_URL}...`);
      const connection = await amqp.connect(RABBITMQ_URL);
      const channel = await connection.createChannel();
      await channel.assertExchange(EXCHANGE, 'fanout', { durable: false });
      console.log('[ORDER-SERVICE] Connected to RabbitMQ successfully.');
      return channel;
    } catch (error) {
      console.error(`[ORDER-SERVICE] Connection failed. Retries left: ${retries - 1}`);
      retries -= 1;
      await new Promise(res => setTimeout(res, 5000));
    }
  }
  return null;
}

let channel: amqp.Channel | null = null;

app.post('/orders', async (req, res) => {
  const { productId, quantity, customerEmail } = req.body;
  
  const newOrder = {
    id: orders.length + 1,
    productId,
    quantity,
    customerEmail,
    status: 'created',
    createdAt: new Date()
  };

  orders.push(newOrder);
  console.log(`[ORDER-SERVICE] Order created: ${newOrder.id}`);

  if (channel) {
    const msg = JSON.stringify(newOrder);
    channel.publish(EXCHANGE, '', Buffer.from(msg));
    console.log('[ORDER-SERVICE] Mensagem enviada para o RabbitMQ (Exchange: order_events)');
  } else {
    console.warn('[ORDER-SERVICE] RabbitMQ channel not available, message not sent.');
  }

  res.status(201).json(newOrder);
});

app.get('/orders', (req, res) => {
  res.json(orders);
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    rabbitmq: channel ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, async () => {
  console.log(`[ORDER-SERVICE] Running on port ${PORT}`);
  channel = await initRabbitMQ();
});
