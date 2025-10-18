export interface RefreshResp {
  refresh_token: string;
  expires_in: number; // seconds
}

export interface AccessResp {
  access_token: string;
  expires_in: number; // seconds
}

export interface AuthUser {
  id: string;
  orgId: string;
}
