export interface GoogleAuthRequest {
  idToken: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
  };
  expiresAt: Date;
}

export interface UserResponse {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
}

export interface LogoutResponse {
  success: boolean;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: UserResponse;
  }
}