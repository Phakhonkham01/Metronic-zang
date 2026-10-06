import clsx from "clsx";
import { FC } from "react";
import { User } from "../../core/_models";

type Props = {
  user: User;
};

const UserRoleCell: FC<Props> = ({ user }) => (
  <span
    className={clsx("badge fw-bolder", {
      "badge-light-primary": user.role === "admin",
      "badge-light-success": user.role !== "admin",
    })}
  >
    {user.role === "admin" ? "Administrator" : "User"}
  </span>
);

export { UserRoleCell };
