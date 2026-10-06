import { useLayout } from "../../core";
import { ThemeModeSwitcher } from "../../../partials";
import { DefaultTitle } from "./page-title/DefaultTitle";

const HeaderToolbar = () => {
  const { classes } = useLayout();

  return (
    <div className="toolbar d-flex align-items-stretch">
      {/* begin::Toolbar container */}
      <div
        className={`${classes.headerContainer.join(
          " "
        )} py-6 py-lg-0 d-flex flex-column flex-lg-row align-items-lg-stretch justify-content-lg-between`}
      >
        <DefaultTitle />

        {/* begin::Action group */}
        <div className="d-flex align-items-center overflow-auto">
          {/* begin::Theme mode */}
          <div className="d-flex align-items-center">
            <ThemeModeSwitcher toggleBtnClass="btn-sm btn-icon-muted btn-active-icon-primary" />
          </div>
          {/* end::Theme mode */}
        </div>
        {/* end::Action group */}
      </div>
      {/* end::Toolbar container */}
    </div>
  );
};

export { HeaderToolbar };
