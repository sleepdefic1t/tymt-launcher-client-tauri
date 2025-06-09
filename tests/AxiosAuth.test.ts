import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Mock modules before imports
vi.mock('axios');

const mockStorage = {
  get: vi.fn(),
  set: vi.fn(),
  remove: vi.fn()
};

vi.mock('../src/lib/storage/tymtStorage', () => ({
  default: mockStorage
}));

vi.mock('../src/config/MainConfig', () => ({
  CONFIG_TYMT_BACKEND_URL: 'https://api.tymt.com'
}));

// Mock window.location
const mockLocation = { href: '' };
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

describe('AxiosAuth', () => {
  let mockAxiosInstance: any;
  let requestInterceptor: any;
  let responseInterceptor: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockLocation.href = '';

    // Setup mock axios instance - make it callable for retry functionality
    mockAxiosInstance = Object.assign(vi.fn(), {
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      },
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    });

    // Mock axios.create to return our mock instance
    vi.mocked(axios.create).mockReturnValue(mockAxiosInstance as AxiosInstance);
    vi.mocked(axios.post).mockResolvedValue({
      data: {
        data: {
          accessToken: 'new-token',
          refreshToken: 'new-refresh'
        }
      }
    });

    // Capture interceptors when they're registered
    mockAxiosInstance.interceptors.request.use.mockImplementation((onFulfilled: any) => {
      requestInterceptor = onFulfilled;
      return 1; // Return interceptor ID
    });

    mockAxiosInstance.interceptors.response.use.mockImplementation((onFulfilled: any, onRejected: any) => {
      responseInterceptor = { onFulfilled, onRejected };
      return 1; // Return interceptor ID
    });

    // Import the module to trigger setup
    vi.resetModules();
    await import('../src/lib/core/AxiosAuth');
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe('axios instance creation', () => {
    it('should create axios instance with correct baseURL', () => {
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.tymt.com/api',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });
  });

  describe('request interceptor', () => {
    it('should add Authorization header when token exists', async () => {
      const mockAuth = JSON.stringify({
        accessToken: 'test-token',
        refreshToken: 'test-refresh'
      });
      mockStorage.get.mockReturnValue(mockAuth);

      const config: InternalAxiosRequestConfig = {
        headers: {} as any,
        method: 'get',
        url: '/test'
      };
      const result = await requestInterceptor(config);

      expect(mockStorage.get).toHaveBeenCalledWith('auth');
      expect(result.headers.Authorization).toBe('Bearer test-token');
    });

    it('should not add Authorization header when no token exists', async () => {
      mockStorage.get.mockReturnValue(null);

      const config: InternalAxiosRequestConfig = {
        headers: {} as any,
        method: 'get',
        url: '/test'
      };
      const result = await requestInterceptor(config);

      expect(mockStorage.get).toHaveBeenCalledWith('auth');
      expect(result.headers.Authorization).toBeUndefined();
    });
  });

  describe('response interceptor', () => {
    it('should pass through successful responses', async () => {
      const response = { data: 'success' };
      const result = await responseInterceptor.onFulfilled(response);

      expect(result).toBe(response);
    });

    it('should refresh token on 401 and retry request', async () => {
      const mockAuth = JSON.stringify({
        accessToken: 'old-token',
        refreshToken: 'test-refresh'
      });
      mockStorage.get.mockReturnValue(mockAuth);

      const originalRequest: any = {
        headers: { Authorization: 'Bearer old-token' },
        _retry: undefined
      };
      const error = {
        response: { status: 401 },
        config: originalRequest
      };

      // Mock the retry
      const retryResponse = { data: 'retry-success' };
      mockAxiosInstance.mockResolvedValueOnce(retryResponse);

      // Execute the error handler
      const result = await responseInterceptor.onRejected(error);

      // Verify refresh token was called
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.tymt.com/api/auth/refresh-token',
        { refreshToken: 'test-refresh' }
      );

      // Verify auth was updated
      expect(mockStorage.set).toHaveBeenCalledWith(
        'auth',
        JSON.stringify({
          accessToken: 'new-token',
          refreshToken: 'new-refresh'
        })
      );

      // Verify request was retried with new token
      expect(originalRequest.headers.Authorization).toBe('Bearer new-token');
      expect(originalRequest._retry).toBe(true);
      expect(result).toEqual(retryResponse);
    });

    it('should redirect to / on refresh token failure', async () => {
      const mockAuth = JSON.stringify({
        accessToken: 'old-token',
        refreshToken: 'test-refresh'
      });
      mockStorage.get.mockReturnValue(mockAuth);

      // Mock refresh token failure
      vi.mocked(axios.post).mockRejectedValueOnce(new Error('Refresh failed'));

      const originalRequest = {
        headers: { Authorization: 'Bearer old-token' },
        _retry: undefined
      };
      const error = {
        response: { status: 401 },
        config: originalRequest
      };

      // Execute the error handler
      await expect(responseInterceptor.onRejected(error)).rejects.toThrow('Refresh failed');

      // Verify auth was removed and redirect happened
      expect(mockStorage.remove).toHaveBeenCalledWith('auth');
      expect(mockLocation.href).toBe('/');
    });

    it('should pass through non-401 errors', async () => {
      const error = {
        response: { status: 500 },
        config: {}
      };

      await expect(responseInterceptor.onRejected(error)).rejects.toBe(error);
    });

    it('should not retry if already retried', async () => {
      const originalRequest = {
        headers: { Authorization: 'Bearer old-token' },
        _retry: true
      };
      const error = {
        response: { status: 401 },
        config: originalRequest
      };

      await expect(responseInterceptor.onRejected(error)).rejects.toBe(error);

      // Should not attempt refresh
      expect(axios.post).not.toHaveBeenCalled();
    });
  });
});
