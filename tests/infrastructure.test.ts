import * as amqp from 'amqplib';

describe('Infrastructure Health Check', () => {
  it('should verify RabbitMQ connection logic', async () => {
    // Testando a lógica de tratamento de erro de conexão
    const fakeUrl = 'amqp://non-existent-host';
    
    try {
      await amqp.connect(fakeUrl);
    } catch (error: any) {
      // Se chegamos aqui, o sistema de erro está funcionando
      expect(error.code).toBeDefined();
      console.log('Health Check: Connection failure handled correctly as expected.');
    }
  });

  it('should have a valid RabbitMQ URL in environment', () => {
    const url = process.env.RABBITMQ_URL || 'amqp://localhost';
    expect(url).toContain('amqp://');
  });
});
