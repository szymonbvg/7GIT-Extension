import { JwtPayload } from "jwt-decode";

export interface Payload extends JwtPayload {
  id: number;
  login: string;
  avatar_url: string;
}

export const excludedPaths = ["settings", "orgs"];
