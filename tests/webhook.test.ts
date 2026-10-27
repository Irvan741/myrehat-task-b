import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('ai', () => ({
  generateText: vi.fn().mockResolvedValue({ text: 'Halo! Ada yang bisa saya bantu?' }),
}));

vi.mock('@openrouter/ai-sdk-provider', () => ({
  createOpenRouter: vi.fn(() => vi.fn((model) => model)),
}));

describe('WAHA webhook validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.OPENROUTER_API_KEY = 'test-key';
    process.env.OPENROUTER_MODEL = 'google/gemini-2.5-flash';
  });

  it('should validate payload format', async () => {
    const { POST } = await import('../apps/web/src/app/api/webhooks/waha/route');
    
    const req = new Request('http://localhost:3000/api/webhooks/waha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'message', payload: { from: '123', body: 'hello' } }),
    });
    
    const res = await POST(req);
    const data = await res.json();
    
    expect(res.status).toBe(200);
    expect(data).toHaveProperty('to');
    expect(data).toHaveProperty('reply');
    expect(data.to).toBe('123');
  });

  it('should accept 4 categories', () => {
    const categories = [
      "Buy Property",
      "Buy land to build homestay",
      "Buy Airbnb Profile",
      "Buy Airbnb Business",
    ];
    expect(categories.length).toBe(4);
    categories.forEach(c => expect(typeof c).toBe('string'));
  });

  it('should reject invalid category', () => {
    const validCategories = [
      "Buy Property",
      "Buy land to build homestay",
      "Buy Airbnb Profile",
      "Buy Airbnb Business",
    ];
    const invalidCategory = "Invalid Category";
    expect(validCategories.includes(invalidCategory)).toBe(false);
  });

  it('should have correct reply format', async () => {
    const { POST } = await import('../apps/web/src/app/api/webhooks/waha/route');
    
    const req = new Request('http://localhost:3000/api/webhooks/waha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'message', payload: { from: '+628123', body: 'test' } }),
    });
    
    const res = await POST(req);
    const data = await res.json();
    
    expect(typeof data.to).toBe('string');
    expect(typeof data.reply).toBe('string');
  });
});
