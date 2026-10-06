import { useIntl } from "react-intl";
import { AsideMenuItem } from "./AsideMenuItem";
import { useAuth } from "../../../../app/modules/auth";

export function AsideMenuMain() {
  const intl = useIntl();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";

  return (
    <>
      <AsideMenuItem
        to="/dashboard"
        icon="element-11"
        title={intl.formatMessage({ id: "MENU.DASHBOARD" })}
      />

      {isAdmin && (
        <>
          <div className="menu-item">
            <div className="menu-content pt-8 pb-2">
              <span className="menu-section text-muted text-uppercase fs-8 ls-1">
                Administration
              </span>
            </div>
          </div>
          <AsideMenuItem
            to="/user-management/users"
            icon="profile-user"
            title="User Management"
          />
        </>
      )}
    </>
  );
}
