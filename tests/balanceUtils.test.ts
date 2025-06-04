import { describe, it, expect, beforeEach } from 'vitest';
import BigNumber from 'bignumber.js';
import {
  convertFromRaw,
  convertToRaw,
  multiply,
  add,
  formatForDisplay,
  formatForTransaction,
  formatFiatAmount,
  isPositive,
  compare
} from '../src/lib/helper/balanceUtils';

describe('Balance Utilities', () => {
  beforeEach(() => {
    BigNumber.config({
      DECIMAL_PLACES: 18,
      ROUNDING_MODE: BigNumber.ROUND_DOWN,
      EXPONENTIAL_AT: [-18, 20]
    });
  });

  describe('convertFromRaw', () => {
    it('should convert Wei to ETH correctly for large values', () => {
      const weiValue = '14117448753611798210016';
      const ethValue = convertFromRaw(weiValue, 18);

      expect(ethValue).toBe('14117.448753611798210016');
      expect(weiValue.length).toBeGreaterThan(15); // MAX_SAFE_INTEGER has 16 digits
    });

    it('should handle different decimal places', () => {
      expect(convertFromRaw('1000000', 6)).toBe('1');
      expect(convertFromRaw('100000000', 8)).toBe('1');
      expect(convertFromRaw('1000000000000000000', 18)).toBe('1');
    });

    it('should handle edge cases', () => {
      expect(convertFromRaw('0', 18)).toBe('0');
      expect(convertFromRaw('', 18)).toBe('0');
      expect(convertFromRaw(null as any, 18)).toBe('0');
      expect(convertFromRaw(undefined as any, 18)).toBe('0');
    });

    it('should handle extremely large values without losing precision', () => {
      const maxUint256 = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
      const result = convertFromRaw(maxUint256, 18);

      expect(result).toContain('115792089237316195423570985008687907853269984665640564039457');
    });
  });

  describe('convertToRaw', () => {
    it('should convert ETH to Wei correctly', () => {
      expect(convertToRaw('1', 18)).toBe('1000000000000000000');
      expect(convertToRaw('0.1', 18)).toBe('100000000000000000');
      expect(convertToRaw('14117.448753611798210016', 18)).toBe('14117448753611798210016');
    });
  });

  describe('multiply', () => {
    it('should multiply string values correctly', () => {
      expect(multiply('100', '3')).toBe('300');
      expect(multiply('0.1', '0.1')).toBe('0.01');
      expect(multiply('14117.45', '3000')).toBe('42352350');
    });

    it('should handle empty/null values', () => {
      expect(multiply('', '100')).toBe('0');
      expect(multiply('100', '')).toBe('0');
      expect(multiply(null as any, '100')).toBe('0');
    });
  });

  describe('add', () => {
    it('should add string values correctly', () => {
      expect(add('100', '50')).toBe('150');
      expect(add('0.1', '0.2')).toBe('0.3');
      expect(add('42352350', '500')).toBe('42352850');
    });
  });

  describe('formatForDisplay', () => {
    it('should format according to MetaMask/Uniswap standards', () => {
      expect(formatForDisplay('0.0000001')).toBe('<0.000001');
      expect(formatForDisplay('0.0000009')).toBe('<0.000001');

      expect(formatForDisplay('1.123456789')).toBe('1.123456');
      expect(formatForDisplay('100.123456789')).toBe('100.123456');

      expect(formatForDisplay('1000')).toBe('1K');
      expect(formatForDisplay('1500')).toBe('1.5K');
      expect(formatForDisplay('1000000')).toBe('1M');
      expect(formatForDisplay('1000000000')).toBe('1B');
      expect(formatForDisplay('1000000000000')).toBe('1T');
    });

    it('should handle zero and empty values', () => {
      expect(formatForDisplay('0')).toBe('0');
      expect(formatForDisplay('')).toBe('0');
    });

    it('should remove trailing zeros but keep minimum 2 decimals', () => {
      expect(formatForDisplay('1.100000', 6)).toBe('1.10');
      expect(formatForDisplay('1.123000', 6)).toBe('1.123');
      expect(formatForDisplay('1.000000', 6)).toBe('1.00');
    });

    it('should handle the zero address balance display correctly', () => {
      const ethBalance = '14117.448753611798210016';
      expect(formatForDisplay(ethBalance)).toBe('14.11K');
      expect(formatForDisplay(ethBalance, 2)).toBe('14.11K');
    });
  });

  describe('formatForTransaction', () => {
    it('should format for transaction input following Uniswap patterns', () => {
      expect(formatForTransaction('1.123456789')).toBe('1.123456789');
      expect(formatForTransaction('1000000')).toBe('1000000'); // No decimals for large values
      expect(formatForTransaction('100.100000')).toBe('100.10');
      expect(formatForTransaction('0.001')).toBe('0.001');
    });

    it('should always show at least 2 decimals', () => {
      expect(formatForTransaction('1')).toBe('1.00');
      expect(formatForTransaction('100')).toBe('100.00');
    });
  });

  describe('formatFiatAmount', () => {
    it('should format USD amounts correctly', () => {
      expect(formatFiatAmount('1.234', '$')).toBe('$1.23');
      expect(formatFiatAmount('1000', '$')).toBe('$1,000.00');
      expect(formatFiatAmount('1000000', '$')).toBe('$1M');
      expect(formatFiatAmount('0.001', '$')).toBe('<$0.01');
    });

    it('should handle other currency symbols', () => {
      expect(formatFiatAmount('100', '€')).toBe('€100.00');
      expect(formatFiatAmount('1000', '£')).toBe('£1,000.00');
    });
  });

  describe('isPositive', () => {
    it('should correctly identify positive values', () => {
      expect(isPositive('1')).toBe(true);
      expect(isPositive('0.0001')).toBe(true);
      expect(isPositive('0')).toBe(false);
      expect(isPositive('-1')).toBe(false);
      expect(isPositive('')).toBe(false);
      expect(isPositive(null as any)).toBe(false);
    });
  });

  describe('compare', () => {
    it('should compare values correctly', () => {
      expect(compare('100', '50')).toBe(1); // 100 > 50
      expect(compare('50', '100')).toBe(-1); // 50 < 100
      expect(compare('100', '100')).toBe(0); // 100 = 100
    });
  });
});
