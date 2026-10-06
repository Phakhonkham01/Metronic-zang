import { ID, Response } from "../_metronic/helpers";

export type Role = "admin" | "user";

/** ຜູ້ໃຊ້ທີ່ login ຢູ່ (ບໍ່ມີ password) */
export type AuthUser = {
  id: number;
  username: string;
  name: string;
  email: string;
  role: Role;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

/** ຂໍ້ມູນ user ໃນໜ້າ User Management */
export type User = {
  id?: ID;
  username?: string;
  name?: string;
  email?: string;
  role?: Role;
  password?: string;
  created_at?: string;
};

export type UsersQueryResponse = Response<Array<User>>;
