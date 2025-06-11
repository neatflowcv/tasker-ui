export interface User {
  username: string;
  password: string;
}

export interface CreateUserRequest {
  user: User;
}

export interface CreateTokenRequest {
  user: User;
}

export interface CreateTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

export interface RefreshTokenRequest {
  token: {
    access_token: string;
    refresh_token: string;
  };
}

export interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

export interface ErrorResponse {
  error: string;
}

export interface AuthStore {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  username: string | null;
  expiresAt: number | null;
} 