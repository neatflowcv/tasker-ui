import type { 
  CreateUserRequest, 
  CreateTokenRequest, 
  CreateTokenResponse, 
  RefreshTokenRequest, 
  RefreshTokenResponse,
  ErrorResponse 
} from './types';

const API_BASE_URL = 'http://127.0.0.1:8080';

class ApiError extends Error {
  constructor(public status: number, public message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (response.status === 204) {
      return {} as T;
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      const errorData = data as ErrorResponse;
      throw new ApiError(response.status, errorData.error || 'Unknown error');
    }
    
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, 'Network error or server unavailable');
  }
}

export async function createUser(userData: CreateUserRequest): Promise<void> {
  await apiRequest<void>('/identity/v1/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function login(loginData: CreateTokenRequest): Promise<CreateTokenResponse> {
  return apiRequest<CreateTokenResponse>('/identity/v1/tokens', {
    method: 'POST',
    body: JSON.stringify(loginData),
  });
}

export async function refreshToken(tokenData: RefreshTokenRequest): Promise<RefreshTokenResponse> {
  return apiRequest<RefreshTokenResponse>('/identity/v1/refresh', {
    method: 'POST',
    body: JSON.stringify(tokenData),
  });
}

export { ApiError }; 