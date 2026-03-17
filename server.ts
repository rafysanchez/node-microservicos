import express from 'express';
import { createServer as createViteServer } from 'vite';
import amqp from 'amqplib';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
  const EXCHANGE = 'order_events';

  app.use(express.json());

  // Mock database for the demo
  const orders: any[] = [];
  let channel: amqp.Channel | null = null;

  // RabbitMQ Init Logic
  async function initRabbitMQ(retries = 3) {
    while (retries) {
      try {
        console.log(`[SERVER] Attempting to connect to RabbitMQ at ${RABBITMQ_URL}...`);
        const connection = await amqp.connect(RABBITMQ_URL);
        const ch = await connection.createChannel();
        await ch.assertExchange(EXCHANGE, 'fanout', { durable: false });
        console.log('[SERVER] Connected to RabbitMQ successfully.');
        return ch;
      } catch (error) {
        console.warn(`[SERVER] RabbitMQ connection failed. Retries left: ${retries - 1}`);
        retries -= 1;
        if (retries) await new Promise(res => setTimeout(res, 2000));
      }
    }
    console.error('[SERVER] Could not connect to RabbitMQ. Running in simulation mode.');
    return null;
  }

  channel = await initRabbitMQ();

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      rabbitmq: channel ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV || 'development',
      message: channel 
        ? 'RabbitMQ está ativo e conectado.' 
        : 'RabbitMQ não encontrado. O sistema está simulando o comportamento localmente.'
    });
  });

  app.post('/api/orders', async (req, res) => {
    const order = { id: orders.length + 1, ...req.body, status: 'created', createdAt: new Date() };
    orders.push(order);
    
    if (channel) {
      channel.publish(EXCHANGE, '', Buffer.from(JSON.stringify(order)));
      console.log(`[SERVER] Order ${order.id} published to RabbitMQ.`);
    } else {
      console.log(`[SERVER] Order ${order.id} created (Simulation Mode).`);
    }
    
    res.status(201).json(order);
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER] Running on http://localhost:${PORT}`);
  });
}

startServer();
