import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import { WalletProvider, useWallet } from '../src/providers/WalletProvider';

// Mock CryptoAPI to prevent real API calls
vi.mock('../src/lib/api/CryptoAPI', () => ({
  CryptoAPI: {
    getAllPrices: vi.fn().mockResolvedValue([]),
    getAllCurrencyRates: vi.fn().mockResolvedValue({ list: [] }),
    getAllBalance: vi.fn().mockResolvedValue([]),
    getSxpTransactions: vi.fn().mockResolvedValue(null),
    getEthTransactions: vi.fn().mockResolvedValue(null),
    getBscTransactions: vi.fn().mockResolvedValue(null),
    getPolTransactions: vi.fn().mockResolvedValue(null),
    getArbTransactions: vi.fn().mockResolvedValue(null),
    getAvaxTransactions: vi.fn().mockResolvedValue(null),
    getOpTransactions: vi.fn().mockResolvedValue(null),
  }
}));

// Mock tymtCore to prevent wallet operations
vi.mock('../src/lib/core/tymtCore', () => ({
  default: {
    Blockchains: {
      solar: {
        wallet: {
          getBalance: vi.fn().mockResolvedValue('0'),
          sendTransaction: vi.fn(),
          vote: vi.fn()
        }
      },
      eth: {
        wallet: {
          getPrivateKey: vi.fn().mockResolvedValue('mock-private-key'),
          sendTransaction: vi.fn()
        }
      },
      bsc: { wallet: { sendTransaction: vi.fn() } },
      polygon: { wallet: { sendTransaction: vi.fn() } },
      avalanche: { wallet: { sendTransaction: vi.fn() } },
      arbitrum: { wallet: { sendTransaction: vi.fn() } },
      op: { wallet: { sendTransaction: vi.fn() } }
    }
  }
}));

// Test component to access totalBalance from WalletProvider
const TotalBalanceTestComponent = () => {
  const { totalBalance } = useWallet();
  return <div data-testid="total-balance">{totalBalance}</div>;
};

describe('WalletProvider totalBalance calculation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Regression test for ETH double-counting bug where totalBalance showed $84,704,692.52
  // instead of $42,352,346.26 when Arbitrum used 'ETH' symbol (same as Ethereum)
  it('calculates correct totalBalance when ETH exists only on mainnet', () => {
    const store = configureStore({
      reducer: {
        auth: () => ({ data: { isLoggedIn: true } }),
        account: () => ({ data: { mnemonic: 'test' } }),
        currentChain: () => ({ data: { chain: 'Ethereum' } }),
        currentCurrency: () => ({ data: { currency: 'USD' } }),
        currentToken: () => ({ data: { token: 'ETH' } }),
        wallet: () => ({
          data: {
            ethereum: '0x0000000000000000000000000000000000000000',
            solar: 'S1234567890123456789012345678901234567890',
            bitcoin: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
            binance: '0x1234567890123456789012345678901234567890',
            polygon: '0x1234567890123456789012345678901234567890',
            arbitrum: '0x1234567890123456789012345678901234567890',
            optimism: '0x1234567890123456789012345678901234567890',
            avalanche: '0x1234567890123456789012345678901234567890',
            solana: 'SolanaAddress1234567890'
          }
        }),
        balanceList: () => ({
          data: {
            list: [
              { symbol: 'ETH', balance: '14117448753611798210016' }, // ~14,117 ETH
              { symbol: 'ARBETH', balance: '0' },
              { symbol: 'OETH', balance: '0' },
              { symbol: 'BNB', balance: '0' },
              { symbol: 'MATIC', balance: '0' },
              { symbol: 'AVAX', balance: '0' },
              { symbol: 'SOL', balance: '0' },
              { symbol: 'BTC', balance: '0' },
              { symbol: 'SXP', balance: '0' }
            ]
          }
        }),
        priceList: () => ({
          data: {
            list: [
              { symbol: 'ETH', price: '3000' },
              { symbol: 'ARBETH', price: '3000' },
              { symbol: 'OETH', price: '3000' },
              { symbol: 'BNB', price: '0' },
              { symbol: 'MATIC', price: '0' },
              { symbol: 'AVAX', price: '0' },
              { symbol: 'SOL', price: '0' },
              { symbol: 'BTC', price: '0' },
              { symbol: 'SXP', price: '0' }
            ]
          }
        }),
        reserveList: () => ({
          data: {
            list: [{ currency: 'USD', reserve: 1 }]
          }
        }),
        walletSetting: () => ({ data: { feeLevel: 'average' } })
      }
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <WalletProvider>
          <TotalBalanceTestComponent />
        </WalletProvider>
      </Provider>
    );

    // Should be $42,352,346.26 NOT $84,704,692.52 (which was the bug when both ETH and ARBETH used 'ETH' symbol)
    expect(getByTestId('total-balance').textContent).toBe('42352346.26');
  });
});
