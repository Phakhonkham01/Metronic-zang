import { FC } from "react";
import { useAuth } from "../../../../app/modules/auth";
import { Languages } from "./Languages";

const HeaderUserMenu: FC = () => {
  const { currentUser, logout } = useAuth();
  return (
    <div
      className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px"
      data-kt-menu="true"
      data-popper-placement="bottom-start"
    >
      <div className="menu-item px-3">
        <div className="menu-content d-flex align-items-center px-3">
          <div className="symbol symbol-50px me-5">
            <div className="symbol-label fs-2 fw-bold bg-light-primary text-primary">
              {currentUser?.name?.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="d-flex flex-column">
            <div className="fw-bolder d-flex align-items-center fs-5">
              {currentUser?.name}
            </div>
            <span className="fw-bold text-muted fs-7">{currentUser?.email}</span>
          </div>
        </div>
      </div>

      <div className="separator my-2"></div>

      <Languages />

      <div className="menu-item px-5">
        <a onClick={logout} className="menu-link px-5">
          Sign Out
        </a>
      </div>
    </div>
  );
};

export { HeaderUserMenu };
