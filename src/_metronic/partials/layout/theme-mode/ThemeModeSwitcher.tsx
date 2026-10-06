import clsx from "clsx";
import { KTIcon } from "../../../helpers";
import { ThemeModeType, useThemeMode, systemMode } from "./ThemeModeProvider";

type Props = {
  toggleBtnClass?: string;
  toggleBtnIconClass?: string;
  menuPlacement?: string;
  menuTrigger?: string;
};

const ThemeModeSwitcher = ({
  toggleBtnClass = "",
  toggleBtnIconClass = "fs-1",
  menuPlacement = "bottom-end",
  menuTrigger = "{default: 'click', lg: 'hover'}",
}: Props) => {
  const { mode, menuMode, updateMode, updateMenuMode } = useThemeMode();
  const calculatedMode = mode === "system" ? systemMode : mode;
  const switchMode = (_mode: ThemeModeType) => {
    updateMenuMode(_mode);
    updateMode(_mode);
  };

  return (
    <>
      {/* begin::Menu toggle */}
      <a
        href="#"
        className={clsx("btn btn-icon", toggleBtnClass)}
        data-kt-menu-trigger={menuTrigger}
        data-kt-menu-attach="parent"
        data-kt-menu-placement={menuPlacement}
        id="kt_theme_mode_toggle"
      >
        {calculatedMode === "dark" && (
          <KTIcon iconName="moon" className={clsx("theme-light-hide", toggleBtnIconClass)} />
        )}
        {calculatedMode === "light" && (
          <KTIcon iconName="night-day" className={clsx("theme-dark-hide", toggleBtnIconClass)} />
        )}
      </a>
      {/* end::Menu toggle */}

      {/* begin::Menu */}
      <div
        className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-muted menu-active-bg menu-state-primary fw-semibold py-4 fs-base w-175px"
        data-kt-menu="true"
      >
        {(
          [
            { value: "light", title: "Light", icon: "night-day" },
            { value: "dark", title: "Dark", icon: "moon" },
            { value: "system", title: "System", icon: "screen" },
          ] as const
        ).map((item) => (
          <div className="menu-item px-3 my-0" key={item.value}>
            <a
              href="#"
              className={clsx("menu-link px-3 py-2", { active: menuMode === item.value })}
              onClick={(e) => {
                e.preventDefault();
                switchMode(item.value);
              }}
              data-kt-value={item.value}
            >
              <span className="menu-icon" data-kt-element="icon">
                <KTIcon iconName={item.icon} className="fs-1" />
              </span>
              <span className="menu-title">{item.title}</span>
            </a>
          </div>
        ))}
      </div>
      {/* end::Menu */}
    </>
  );
};

export { ThemeModeSwitcher };
