import type { JwtPayload } from "jwt-decode";

export interface GoogleJwtPayload extends JwtPayload {
  name: string;
  email: string;
  picture: string;
  sub: string;
}
