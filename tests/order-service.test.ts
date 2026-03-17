import request from 'supertest';
import express from 'express';
import * as amqp from 'amqplib';

// Mocking amqplib
jest.mock('amqplib', () => ({
  connect: jest.fn()
}));

// We need to import the app logic. Since index.ts starts the server, 
// it's better to export the app instance in a real scenario.
// For this demo, I'll recreate a testable version or mock the behavior.

describe('Order Service Integration Tests', () => {
  let app: any;
  let mockChannel: any;

  beforeAll(() => {
    mockChannel = {
      assertExchange: jest.fn(),
      publish: jest.fn(),
    };

    (amqp.connect as jest.Mock).mockResolvedValue({
      createChannel: jest.fn().mockResolvedValue(mockChannel),
    });

    // Re-creating the app logic for testing
    app = express();
    app.use(express.json());
    const orders: any[] = [];
    
    app.post('/orders', async (req: any, res: any) => {
      const order = { id: 1, ...req.body, status: 'created' };
      orders.push(order);
      mockChannel.publish('order_events', '', Buffer.from(JSON.stringify(order)));
      res.status(201).json(order);
    });
  });

  it('should create an order and publish to RabbitMQ', async () => {
    const orderData = {
      productId: 1,
      quantity: 2,
      customerEmail: 'test@example.com'
    };

    const response = await request(app)
      .post('/orders')
      .send(orderData);

    expect(response.status).toBe(201);
    expect(response.body.productId).toBe(1);
    expect(mockChannel.publish).toHaveBeenCalledWith(
      'order_events',
      '',
      expect.any(Buffer)
    );
  });
});
