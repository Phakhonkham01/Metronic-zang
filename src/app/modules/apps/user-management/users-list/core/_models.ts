import type { User } from "../../../../../../services/types";

export type { User, UsersQueryResponse } from "../../../../../../services/types";

export const initialUser: User = {
  username: "",
  name: "",
  email: "",
  role: "user",
  password: "",
};
