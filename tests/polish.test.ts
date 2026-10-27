import { describe, it, expect, vi } from 'vitest';

vi.mock('ai', () => ({
  generateText: vi.fn().mockResolvedValue({ text: 'Polished description' }),
}));

vi.mock('ai-sdk-provider-opencode-sdk', () => ({
  createOpenCodeSDK: vi.fn(() => vi.fn((model: string) => model)),
}));

describe('polish.ts', () => {
  it('should use ai-sdk-provider-opencode-sdk', async () => {
    const { polishDescription } = await import('../scripts/polish');
    const result = await polishDescription('test description');
    expect(result).toBe('Polished description');
  });

  it('should use generateText', async () => {
    const ai = await import('ai');
    const { polishDescription } = await import('../scripts/polish');
    await polishDescription('test');
    expect(ai.generateText).toHaveBeenCalled();
  });
});
