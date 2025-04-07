export interface JwtPayload {
    sub: string;  // The subject, typically the user ID
    username: string;  // The username or any other identifier for the user
  }