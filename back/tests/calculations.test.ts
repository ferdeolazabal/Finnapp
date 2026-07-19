import { describe, expect, it } from 'vitest';
import { calculateNetPnL, calculatePositionSize } from '../src/application/calculations.js';
describe('calculations', () => {
  it('subtracts commissions', () => expect(calculateNetPnL('100', '112', '5', '3.5')).toBe('56.5'));
  it('floors whole-unit size', () => expect(calculatePositionSize('10000', '1', '100', '95')).toBe('20'));
});

