import { describe, it, expect, vi } from 'vitest';
import {
  getTokenBalanceBySymbol,
  getNativeTokenBalanceByChainName,
  getTokenPriceBySymbol,
  getNativeTokenPriceByChainName,
  getSupportChainByName,
  getCurrentChainWalletAddress
} from '../src/lib/helper/WalletHelper';
import { CONST_CHAIN_NAMES, CONST_CHAIN_SYMBOLS } from '../src/const/ChainConsts';

describe('WalletHelper Functions', () => {
  describe('getTokenBalanceBySymbol', () => {
    it('should return balance for a given symbol', () => {
      const balanceList = {
        list: [
          { symbol: 'ETH', balance: '14117448753611798210016' },
          { symbol: 'BTC', balance: '200000000' },
          { symbol: 'SXP', balance: '100000000000' }
        ]
      };

      expect(getTokenBalanceBySymbol(balanceList, 'ETH')).toBe('14117.448753611798210016');
      expect(getTokenBalanceBySymbol(balanceList, 'BTC')).toBe('2');
      expect(getTokenBalanceBySymbol(balanceList, 'SXP')).toBe('1000');
    });

    it('should return 0 when symbol not found', () => {
      const balanceList = {
        list: [
          { symbol: 'ETH', balance: '1000000000000000000' }
        ]
      };

      expect(getTokenBalanceBySymbol(balanceList, 'BNB')).toBe('0');
    });

    it('should handle empty balance list', () => {
      const balanceList = { list: [] };
      expect(getTokenBalanceBySymbol(balanceList, 'ETH')).toBe('0');
    });

    it('should handle null/undefined inputs', () => {
      expect(getTokenBalanceBySymbol(null as any, 'ETH')).toBe('0');
      expect(getTokenBalanceBySymbol(undefined as any, 'ETH')).toBe('0');
      expect(getTokenBalanceBySymbol({ list: [] }, null as any)).toBe('0');
    });
  });

  describe('getNativeTokenBalanceByChainName', () => {
    it('should return balance for Solar chain', () => {
      const balanceList = {
        list: [
          { symbol: 'SXP', balance: '100000000000' },
          { symbol: 'ETH', balance: '1000000000000000000' }
        ]
      };

      expect(getNativeTokenBalanceByChainName(balanceList, CONST_CHAIN_NAMES.SOLAR)).toBe('1000');
    });

    it('should return balance for Ethereum chain', () => {
      const balanceList = {
        list: [
          { symbol: 'ETH', balance: '14117448753611798210016' },
          { symbol: 'BTC', balance: '100000000' }
        ]
      };

      expect(getNativeTokenBalanceByChainName(balanceList, CONST_CHAIN_NAMES.ETHEREUM)).toBe('14117.448753611798210016');
    });

    it('should handle chain with no balance', () => {
      const balanceList = {
        list: [
          { symbol: 'ETH', balance: '1000000000000000000' }
        ]
      };

      expect(getNativeTokenBalanceByChainName(balanceList, CONST_CHAIN_NAMES.SOLAR)).toBe('0');
    });
  });

  describe('getTokenPriceBySymbol', () => {
    it('should return price for a given symbol', () => {
      const priceList = {
        list: [
          { symbol: 'ETH', price: '3000' },
          { symbol: 'BTC', price: '100000' },
          { symbol: 'SXP', price: '0.5' }
        ]
      };

      expect(getTokenPriceBySymbol(priceList, 'ETH')).toBe('3000');
      expect(getTokenPriceBySymbol(priceList, 'BTC')).toBe('100000');
      expect(getTokenPriceBySymbol(priceList, 'SXP')).toBe('0.5');
    });

    it('should return 0 when symbol not found', () => {
      const priceList = {
        list: [
          { symbol: 'ETH', price: '3000' }
        ]
      };

      expect(getTokenPriceBySymbol(priceList, 'BNB')).toBe('0');
    });

    it('should handle empty price list', () => {
      const priceList = { list: [] };
      expect(getTokenPriceBySymbol(priceList, 'ETH')).toBe('0');
    });

    it('should handle null/undefined inputs', () => {
      expect(getTokenPriceBySymbol(null as any, 'ETH')).toBe('0');
      expect(getTokenPriceBySymbol(undefined as any, 'ETH')).toBe('0');
      expect(getTokenPriceBySymbol({ list: [] }, null as any)).toBe('0');
    });
  });

  describe('getSupportChainByName', () => {
    it('should return chain info for valid chain names', () => {
      const ethereumChain = getSupportChainByName(CONST_CHAIN_NAMES.ETHEREUM);
      expect(ethereumChain).toBeDefined();
      expect(ethereumChain?.native.symbol).toBe(CONST_CHAIN_SYMBOLS.ETHEREUM);
      expect(ethereumChain?.native.name).toBe(CONST_CHAIN_NAMES.ETHEREUM);

      const arbitrumChain = getSupportChainByName(CONST_CHAIN_NAMES.ARBITRUM);
      expect(arbitrumChain).toBeDefined();
      expect(arbitrumChain?.native.symbol).toBe(CONST_CHAIN_SYMBOLS.ARBITRUM);
      expect(arbitrumChain?.native.name).toBe(CONST_CHAIN_NAMES.ARBITRUM);
    });

    it('should return undefined for invalid chain name', () => {
      expect(getSupportChainByName('InvalidChain')).toBeUndefined();
      expect(getSupportChainByName('')).toBeUndefined();
      expect(getSupportChainByName(null as any)).toBeUndefined();
    });
  });

  describe('getCurrentChainWalletAddress', () => {
    it('should return correct wallet address for each chain', () => {
      const walletStore = {
        ethereum: '0xETH123',
        solar: 'SSXP123',
        bitcoin: '1BTC123',
        binance: '0xBNB123',
        polygon: '0xMATIC123',
        arbitrum: '0xARB123',
        optimism: '0xOP123',
        avalanche: '0xAVAX123',
        solana: 'SOL123'
      };

      expect(getCurrentChainWalletAddress(walletStore, CONST_CHAIN_NAMES.ETHEREUM)).toBe('0xETH123');
      expect(getCurrentChainWalletAddress(walletStore, CONST_CHAIN_NAMES.SOLAR)).toBe('SSXP123');
      expect(getCurrentChainWalletAddress(walletStore, CONST_CHAIN_NAMES.BITCOIN)).toBe('1BTC123');
      expect(getCurrentChainWalletAddress(walletStore, CONST_CHAIN_NAMES.BINANCE)).toBe('0xBNB123');
      expect(getCurrentChainWalletAddress(walletStore, CONST_CHAIN_NAMES.POLYGON)).toBe('0xMATIC123');
      expect(getCurrentChainWalletAddress(walletStore, CONST_CHAIN_NAMES.ARBITRUM)).toBe('0xARB123');
      expect(getCurrentChainWalletAddress(walletStore, CONST_CHAIN_NAMES.OPTIMISM)).toBe('0xOP123');
      expect(getCurrentChainWalletAddress(walletStore, CONST_CHAIN_NAMES.AVALANCHE)).toBe('0xAVAX123');
      expect(getCurrentChainWalletAddress(walletStore, CONST_CHAIN_NAMES.SOLANA)).toBe('SOL123');
    });

    it('should return empty string for invalid chain name', () => {
      const walletStore = {
        ethereum: '0xETH123',
        solar: 'SSXP123',
        bitcoin: '1BTC123',
        binance: '0xBNB123',
        polygon: '0xMATIC123',
        arbitrum: '0xARB123',
        optimism: '0xOP123',
        avalanche: '0xAVAX123',
        solana: 'SOL123'
      };

      expect(getCurrentChainWalletAddress(walletStore, 'InvalidChain')).toBe('');
      expect(getCurrentChainWalletAddress(walletStore, '')).toBe('');
      expect(getCurrentChainWalletAddress(walletStore, null as any)).toBe('');
    });

    it('should handle missing wallet addresses', () => {
      const partialWallet = {
        ethereum: '0xETH123',
        solar: 'SSXP123'
        // Missing other chains
      } as any;

      expect(getCurrentChainWalletAddress(partialWallet, CONST_CHAIN_NAMES.ETHEREUM)).toBe('0xETH123');
      expect(getCurrentChainWalletAddress(partialWallet, CONST_CHAIN_NAMES.BITCOIN)).toBeUndefined();
    });
  });
});
