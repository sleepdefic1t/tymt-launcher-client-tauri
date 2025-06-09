import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { AuthAPI } from '../src/lib/api/AuthAPI';
import tymtCore from '../src/lib/core/tymtCore';
import * as WalletHelper from '../src/lib/helper/WalletHelper';
import axiosAuth from '../src/lib/core/AxiosAuth';

// Mock axios
vi.mock('axios');

// Mock the config
vi.mock('../src/config/MainConfig', () => ({
  CONFIG_TYMT_BACKEND_URL: 'https://api.tymt.com'
}));

// Mock dependencies
vi.mock('../src/lib/core/tymtCore', () => ({
  default: {
    Blockchains: {
      solar: {
        wallet: {
          signMessage: vi.fn()
        }
      }
    }
  }
}));

vi.mock('../src/lib/helper/WalletHelper', () => ({
  getPublicKey: vi.fn()
}));

// Mock axiosAuth
vi.mock('../src/lib/core/AxiosAuth', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    }
  }
}));

describe('AuthAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('requestMessage', () => {
    it('should request message with correct URL and data', async () => {
      const publicKey = 'test-public-key';
      const mockResponse = { data: { data: 'test-message-uuid' } };

      vi.mocked(axiosAuth.post).mockResolvedValueOnce(mockResponse);

      const result = await AuthAPI.requestMessage(publicKey);

      expect(vi.mocked(axiosAuth).post).toHaveBeenCalledWith(
        '/auth/request-message',
        { publicKey }
      );
      expect(result).toBe('test-message-uuid');
    });

    it('should throw error on failure', async () => {
      const publicKey = 'test-public-key';
      const error = {
        response: { data: { error: 'Invalid public key' } }
      };

      vi.mocked(axiosAuth).post.mockRejectedValueOnce(error);

      await expect(AuthAPI.requestMessage(publicKey)).rejects.toThrow('Invalid public key');
    });
  });

  describe('signup', () => {
    it('should complete signup flow correctly', async () => {
      const params = {
        nickname: 'testuser',
        sxpAddress: 'test-address',
        passphrase: 'test-passphrase'
      };
      const mockPublicKey = 'mock-public-key';
      const mockMessage = 'mock-message-uuid';
      const mockSignature = 'mock-signature';
      const mockUser = { id: '123', nickname: 'testuser' };

      // Mock the flow
      vi.mocked(WalletHelper.getPublicKey).mockReturnValue(mockPublicKey);
      vi.mocked(axiosAuth).post
        .mockResolvedValueOnce({ data: { data: mockMessage } }) // requestMessage
        .mockResolvedValueOnce({ data: { data: mockUser } }); // signup
      vi.mocked(tymtCore.Blockchains.solar.wallet.signMessage).mockResolvedValue(mockSignature);

      const result = await AuthAPI.signup(params);

      // Verify the flow
      expect(WalletHelper.getPublicKey).toHaveBeenCalledWith(params.passphrase);
      expect(vi.mocked(axiosAuth).post).toHaveBeenNthCalledWith(1, '/auth/request-message', { publicKey: mockPublicKey });
      expect(tymtCore.Blockchains.solar.wallet.signMessage).toHaveBeenCalledWith(mockMessage, params.passphrase);
      expect(vi.mocked(axiosAuth).post).toHaveBeenNthCalledWith(2, '/auth/signup', {
        nickname: params.nickname,
        sxpAddress: params.sxpAddress,
        publicKey: mockPublicKey,
        signedMessage: mockSignature
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('should complete login flow correctly', async () => {
      const params = {
        sxpAddress: 'test-address',
        passphrase: 'test-passphrase'
      };
      const mockPublicKey = 'mock-public-key';
      const mockMessage = 'mock-message-uuid';
      const mockSignature = 'mock-signature';
      const mockLoginResponse = {
        accessToken: 'test-token',
        refreshToken: 'test-refresh-token',
        user: { id: '123' }
      };

      // Mock the flow
      vi.mocked(WalletHelper.getPublicKey).mockReturnValue(mockPublicKey);
      vi.mocked(axiosAuth).post
        .mockResolvedValueOnce({ data: { data: mockMessage } }) // requestMessage
        .mockResolvedValueOnce({ data: { data: mockLoginResponse } }); // login
      vi.mocked(tymtCore.Blockchains.solar.wallet.signMessage).mockResolvedValue(mockSignature);

      const result = await AuthAPI.login(params);

      // Verify the flow
      expect(WalletHelper.getPublicKey).toHaveBeenCalledWith(params.passphrase);
      expect(vi.mocked(axiosAuth).post).toHaveBeenNthCalledWith(1, '/auth/request-message', { publicKey: mockPublicKey });
      expect(tymtCore.Blockchains.solar.wallet.signMessage).toHaveBeenCalledWith(mockMessage, params.passphrase);
      expect(vi.mocked(axiosAuth).post).toHaveBeenNthCalledWith(2, '/auth/login', {
        sxpAddress: params.sxpAddress,
        publicKey: mockPublicKey,
        signedMessage: mockSignature
      });
      expect(result).toEqual(mockLoginResponse);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token with correct URL', async () => {
      const refreshToken = 'test-refresh-token';
      const mockResponse = {
        data: {
          data: {
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token'
          }
        }
      };

      vi.mocked(axiosAuth).post.mockResolvedValueOnce(mockResponse);

      const result = await AuthAPI.refreshToken(refreshToken);

      expect(vi.mocked(axiosAuth).post).toHaveBeenCalledWith(
        '/auth/refresh-token',
        { refreshToken }
      );
      expect(result).toEqual(mockResponse.data.data);
    });
  });

  describe('getDrmToken', () => {
    it('should get DRM token with correct URL', async () => {
      const gameId = 'test-game-id';
      const mockResponse = { data: { data: 'drm-token-value' } };

      vi.mocked(axiosAuth).get.mockResolvedValueOnce(mockResponse);

      const result = await AuthAPI.getDrmToken(gameId);

      expect(vi.mocked(axiosAuth).get).toHaveBeenCalledWith(
        `/auth/game/drm-token/${gameId}`
      );
      expect(result).toBe('drm-token-value');
    });
  });
});
