export interface IJwtSign {
  access_token: string;
  refresh_token: string;
}

export interface IJwtPayload {
  sub: string;
  username: string;
  roles: string[];
}

export interface IPayload {
  userId: string;
  username: string;
  roles: string[];
}
