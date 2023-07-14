import { UserEntity } from 'src/users/entities/users.entity';

export interface PayloadToken {
  sub: string;
  username: string;
}

export interface AuthBody {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserEntity;
}

export interface AuthTokenResult {
  sub: string;
  username: string;
  iat: number;
  exp: number;
}

export interface IUseToken {
  sub: string;
  isExpired: boolean;
  username: string;
}
