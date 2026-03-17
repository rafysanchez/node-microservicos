import { Type } from '@google/genai'; // Just for reference if needed, but we'll use a simple object check

describe('Contract/Schema Validation', () => {
  // This represents the "Contract" that all services must follow
  const expectedOrderSchema = {
    id: 'number',
    productId: 'number',
    quantity: 'number',
    customerEmail: 'string',
    status: 'string'
  };

  const validateSchema = (data: any, schema: any) => {
    for (const key in schema) {
      if (typeof data[key] !== schema[key]) {
        throw new Error(`Contract Violation: Field "${key}" expected ${schema[key]}, got ${typeof data[key]}`);
      }
    }
    return true;
  };

  it('Order Service message should strictly follow the contract', () => {
    const messageFromOrderService = {
      id: 1,
      productId: 101,
      quantity: 5,
      customerEmail: 'buyer@test.com',
      status: 'created'
    };

    expect(() => validateSchema(messageFromOrderService, expectedOrderSchema)).not.toThrow();
  });

  it('should fail if a required field is missing or has wrong type', () => {
    const brokenMessage = {
      id: "1", // Wrong type (string instead of number)
      productId: 101,
      quantity: 5
      // Missing customerEmail
    };

    expect(() => validateSchema(brokenMessage, expectedOrderSchema)).toThrow();
  });
});
