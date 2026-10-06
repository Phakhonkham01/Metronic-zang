import { FC } from "react";
import { User } from "../../core/_models";

type Props = {
  user: User;
};

const UserInfoCell: FC<Props> = ({ user }) => (
  <div className="d-flex align-items-center">
    {/* begin:: Avatar */}
    <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
      <div className="symbol-label fs-3 bg-light-primary text-primary">
        {user.name?.charAt(0).toUpperCase()}
      </div>
    </div>
    {/* end:: Avatar */}
    <div className="d-flex flex-column">
      <span className="text-gray-800 mb-1">{user.name}</span>
      <span>{user.email}</span>
    </div>
  </div>
);

export { UserInfoCell };
