import { describe, it, expect } from 'vitest';
import { convertFromRaw } from '../src/lib/helper/balanceUtils';

describe('convertFromRaw hex handling', () => {
  it('should handle hex input directly from Ethereum APIs', () => {
    const hexValue = '0x2fd4ef54bf5f45be5e0'; // 14117448753611798210016 wei
    const ethValue = convertFromRaw(hexValue, 18);
    expect(ethValue).toBe('14117.448753611798210016');
  });

  it('should handle decimal input as well', () => {
    const decimalValue = '14117448753611798210016';

    const ethValue = convertFromRaw(decimalValue, 18);
    expect(ethValue).toBe('14117.448753611798210016');
  });

  it('should handle very large hex values', () => {
    const maxHex = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

    const ethValue = convertFromRaw(maxHex, 18);
    expect(ethValue).toBe('115792089237316195423570985008687907853269984665640564039457.584007913129639935');
  });

  it('should handle zero values', () => {
    expect(convertFromRaw('0x0', 18)).toBe('0');
    expect(convertFromRaw('0', 18)).toBe('0');
    expect(convertFromRaw('', 18)).toBe('0');
  });

  it('should handle hex values without 0x prefix as decimal', () => {
    const decimalValue = '1000000000000000000'; // 1 ETH in wei
    const ethValue = convertFromRaw(decimalValue, 18);
    expect(ethValue).toBe('1');
  });
});
