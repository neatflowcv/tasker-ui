import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
  if (browser) {
    const stored = localStorage.getItem('auth');
    if (stored) {
      try {
        const parsedAuth = JSON.parse(stored);
        // 토큰이 만료되지 않았는지 확인
        if (parsedAuth.expiresAt && Date.now() < parsedAuth.expiresAt && parsedAuth.isAuthenticated) {
          return {};
        }
      } catch (error) {
        console.error('Failed to parse stored auth data:', error);
      }
    }
    
    // 인증되지 않았거나 토큰이 만료된 경우 로그인 페이지로 리다이렉트
    throw redirect(302, '/login');
  }
  
  return {};
}; 