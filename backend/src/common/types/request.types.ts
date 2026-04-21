// src/common/types/request.types.ts
export interface AuthenticatedUser {
  sub: number;
  email: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
