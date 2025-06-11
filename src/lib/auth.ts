import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { AuthStore } from './types';
import { login as apiLogin, refreshToken as apiRefreshToken } from './api';

const initialState: AuthStore = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  username: null,
  expiresAt: null,
};

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthStore>(initialState);

  // 브라우저에서 실행될 때 localStorage에서 인증 정보 복원
  if (browser) {
    const stored = localStorage.getItem('auth');
    if (stored) {
      try {
        const parsedAuth = JSON.parse(stored);
        // 토큰이 만료되지 않았는지 확인
        if (parsedAuth.expiresAt && Date.now() < parsedAuth.expiresAt) {
          set(parsedAuth);
        } else {
          // 만료된 토큰 정리
          localStorage.removeItem('auth');
        }
      } catch (error) {
        console.error('Failed to parse stored auth data:', error);
        localStorage.removeItem('auth');
      }
    }
  }

  return {
    subscribe,
    login: async (username: string, password: string) => {
      try {
        const response = await apiLogin({
          user: { username, password }
        });

        const expiresAt = Date.now() + (response.expires_in * 1000);
        const authData: AuthStore = {
          isAuthenticated: true,
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
          username,
          expiresAt,
        };

        set(authData);
        
        // localStorage에 저장
        if (browser) {
          localStorage.setItem('auth', JSON.stringify(authData));
        }

        return true;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    logout: () => {
      set(initialState);
      if (browser) {
        localStorage.removeItem('auth');
      }
    },
    refreshToken: async () => {
      const currentAuth = get(authStore);
      if (!currentAuth.accessToken || !currentAuth.refreshToken) {
        throw new Error('No tokens available for refresh');
      }

      try {
        const response = await apiRefreshToken({
          token: {
            access_token: currentAuth.accessToken,
            refresh_token: currentAuth.refreshToken,
          }
        });

        const expiresAt = Date.now() + (response.expires_in * 1000);
        const authData: AuthStore = {
          ...currentAuth,
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
          expiresAt,
        };

        set(authData);
        
        if (browser) {
          localStorage.setItem('auth', JSON.stringify(authData));
        }

        return true;
      } catch (error) {
        console.error('Token refresh failed:', error);
        // 토큰 갱신 실패시 로그아웃
        authStore.logout();
        throw error;
      }
    },
    // 토큰 만료 체크 및 자동 갱신
    checkAndRefreshToken: async () => {
      const currentAuth = get(authStore);
      if (!currentAuth.isAuthenticated || !currentAuth.expiresAt) {
        return false;
      }

      // 토큰이 5분 이내에 만료되면 갱신
      const fiveMinutes = 5 * 60 * 1000;
      if (Date.now() + fiveMinutes >= currentAuth.expiresAt) {
        try {
          await authStore.refreshToken();
          return true;
        } catch (error) {
          return false;
        }
      }

      return true;
    }
  };
}

// get 함수를 별도로 import해야 함
import { get } from 'svelte/store';

export const authStore = createAuthStore(); 