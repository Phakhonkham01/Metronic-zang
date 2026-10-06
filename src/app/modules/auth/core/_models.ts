import type { AuthUser } from "../../../../services/types";

export interface AuthModel {
  api_token: string;
}

export type UserModel = AuthUser;
