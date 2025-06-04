import BigNumber from 'bignumber.js';

// Configure for cryptocurrency precision - matching MetaMask's approach
BigNumber.config({
  DECIMAL_PLACES: 36, // Max decimals for tokens per MetaMask
  ROUNDING_MODE: BigNumber.ROUND_HALF_DOWN, // MetaMask's default rounding mode
  EXPONENTIAL_AT: [-18, 20]
});

/**
 * Converts raw blockchain value (wei, satoshi, etc.) to human-readable format
 * Handles both decimal and hex input formats
 * @param value Raw value as string (decimal or hex with 0x prefix)
 * @param decimals Number of decimal places for the token
 * @returns Human-readable value as string
 */
export const convertFromRaw = (value: string, decimals: number): string => {
  if (!value || value === '0' || value === '0x0') return '0';

  let bn: BigNumber;

  // Check if value is hex (starts with 0x)
  if (value.startsWith('0x')) {
    // Convert hex to BigNumber
    bn = new BigNumber(value.slice(2), 16);
  } else {
    // Already decimal
    bn = new BigNumber(value);
  }

  const divisor = new BigNumber(10).pow(decimals);
  return bn.dividedBy(divisor).toFixed();
};

/**
 * Converts human-readable value to raw blockchain format
 * @param value Human-readable value as string
 * @param decimals Number of decimal places for the token
 * @returns Raw value as string
 */
export const convertToRaw = (value: string, decimals: number): string => {
  if (!value || value === '0') return '0';
  
  const bn = new BigNumber(value);
  const multiplier = new BigNumber(10).pow(decimals);
  return bn.multipliedBy(multiplier).toFixed(0);
};

/**
 * Multiplies two values with full precision
 * @param a First value as string
 * @param b Second value as string
 * @returns Product as string
 */
export const multiply = (a: string, b: string): string => {
  if (!a || !b || a === '0' || b === '0') return '0';
  
  return new BigNumber(a).multipliedBy(b).toFixed();
};

/**
 * Adds multiple values with full precision
 * @param values Array of values as strings
 * @returns Sum as string
 */
export const add = (...values: string[]): string => {
  return values.reduce((sum, val) => {
    if (!val || val === '0') return sum;
    return new BigNumber(sum).plus(val).toFixed();
  }, '0');
};

// Industry standard thresholds based on MetaMask and Uniswap
const MIN_DISPLAY_AMOUNT = 0.000001;
const MIN_DISPLAY_STRING = '<0.000001';

/**
 * Formats value for display with appropriate decimal places
 * Following industry standards from MetaMask and Uniswap
 * @param value Value as string
 * @param displayDecimals Number of decimal places to show (default: 6 for tokens, 2 for fiat)
 * @returns Formatted string for display
 */
export const formatForDisplay = (value: string, displayDecimals: number = 6): string => {
  if (!value || value === '0') return '0';

  const bn = new BigNumber(value);

  // Handle very small values (MetaMask/Uniswap standard)
  if (bn.isLessThan(MIN_DISPLAY_AMOUNT) && !bn.isZero()) {
    return MIN_DISPLAY_STRING;
  }

  // Handle large values with abbreviations
  if (bn.isGreaterThanOrEqualTo(1e12)) {
    const val = bn.dividedBy(1e12);
    return val.isInteger() ? val.toFormat(0) + 'T' : val.toFormat(2) + 'T';
  }
  if (bn.isGreaterThanOrEqualTo(1e9)) {
    const val = bn.dividedBy(1e9);
    return val.isInteger() ? val.toFormat(0) + 'B' : val.toFormat(2) + 'B';
  }
  if (bn.isGreaterThanOrEqualTo(1e6)) {
    const val = bn.dividedBy(1e6);
    return val.isInteger() ? val.toFormat(0) + 'M' : val.toFormat(2) + 'M';
  }
  if (bn.isGreaterThanOrEqualTo(1e3)) {
    const val = bn.dividedBy(1e3);
    if (val.isInteger()) {
      return val.toFormat(0) + 'K';
    } else {
      // Remove trailing zeros from decimal part
      const formatted = val.toFormat(2);
      return formatted.replace(/\.?0+$/, '') + 'K';
    }
  }

  // Standard display with proper decimals
  // Remove trailing zeros but keep at least 2 decimal places for consistency
  const formatted = bn.toFormat(displayDecimals);
  if (displayDecimals > 2) {
    // Remove trailing zeros after 2 decimal places
    const parts = formatted.split('.');
    if (parts.length === 2) {
      const decimals = parts[1];
      let trimmedDecimals = decimals.replace(/0+$/, '');
      // Keep at least 2 decimal places
      if (trimmedDecimals.length < 2) {
        trimmedDecimals = decimals.substring(0, 2);
      }
      return parts[0] + '.' + trimmedDecimals;
    }
  }

  return formatted;
};

/**
 * Formats value for transaction input/output with full precision
 * Based on Uniswap's SwapTradeAmount formatting
 * @param value Value as string
 * @param maxDecimals Maximum decimal places to show (default: 9)
 * @returns Formatted string preserving precision
 */
export const formatForTransaction = (value: string, maxDecimals: number = 9): string => {
  if (!value || value === '0') return '0';

  const bn = new BigNumber(value);

  // For very large values, show without decimals and without thousand separators
  if (bn.isGreaterThanOrEqualTo(1e6)) {
    return bn.toFixed(0);
  }

  // For standard values, show appropriate decimals
  const formatted = bn.toFixed(maxDecimals);

  // Remove trailing zeros but preserve at least 2 decimals
  const parts = formatted.split('.');
  if (parts.length === 2) {
    let decimals = parts[1].replace(/0+$/, '');
    if (decimals.length === 0) {
      decimals = '00';
    } else if (decimals.length === 1) {
      decimals += '0';
    }
    return parts[0] + '.' + decimals;
  }

  return formatted + '.00';
};

/**
 * Formats fiat currency values with standard 2 decimal places
 * @param value Value as string
 * @param currencySymbol Currency symbol (default: $)
 * @returns Formatted currency string
 */
export const formatFiatAmount = (value: string, currencySymbol: string = '$'): string => {
  if (!value || value === '0') return `${currencySymbol}0.00`;

  const bn = new BigNumber(value);

  // Handle very small values
  if (bn.isLessThan(0.01) && !bn.isZero()) {
    return `<${currencySymbol}0.01`;
  }

  // Handle large values with abbreviations
  if (bn.isGreaterThanOrEqualTo(1e12)) {
    const val = bn.dividedBy(1e12);
    return currencySymbol + (val.isInteger() ? val.toFormat(0) : val.toFormat(2)) + 'T';
  }
  if (bn.isGreaterThanOrEqualTo(1e9)) {
    const val = bn.dividedBy(1e9);
    return currencySymbol + (val.isInteger() ? val.toFormat(0) : val.toFormat(2)) + 'B';
  }
  if (bn.isGreaterThanOrEqualTo(1e6)) {
    const val = bn.dividedBy(1e6);
    return currencySymbol + (val.isInteger() ? val.toFormat(0) : val.toFormat(2)) + 'M';
  }

  return currencySymbol + bn.toFormat(2);
};

/**
 * Compares two values
 * @param a First value
 * @param b Second value
 * @returns -1 if a < b, 0 if a = b, 1 if a > b
 */
export const compare = (a: string, b: string): number => {
  const bnA = new BigNumber(a || '0');
  const bnB = new BigNumber(b || '0');
  return bnA.comparedTo(bnB);
};

/**
 * Checks if value is greater than zero
 * @param value Value to check
 * @returns true if value > 0
 */
export const isPositive = (value: string): boolean => {
  return new BigNumber(value || '0').isGreaterThan(0);
};