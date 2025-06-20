declare interface UserInfo {
  email: string;
  name: string;
  avatar: string | null;
  created_at: number;
}

declare interface GoogleUserInfo {
  sub: string;
  name: string;
  given_name: string;
  picture?: string;
  email: string;
  email_verified: boolean;
}
