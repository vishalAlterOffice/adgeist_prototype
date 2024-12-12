export interface UserGoogleProfile {
  googleId: string;
  email: string;
  name: string;
  picture: any;
  accessToken?: string;
  refreshToken?: string;
}
