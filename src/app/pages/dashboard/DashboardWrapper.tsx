import { useIntl } from "react-intl";
import { PageTitle } from "../../../_metronic/layout/core";
import { KTIcon } from "../../../_metronic/helpers";
import { useAuth } from "../../modules/auth";

const DashboardPage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="row g-5 g-xl-8">
      <div className="col-xl-12">
        {/* begin::Card */}
        <div className="card card-flush">
          <div className="card-body d-flex align-items-center py-10">
            <div className="symbol symbol-60px me-5">
              <span className="symbol-label bg-light-primary">
                <KTIcon iconName="element-11" className="fs-2x text-primary" />
              </span>
            </div>
            <div className="d-flex flex-column">
              <h3 className="fw-bolder text-gray-900 mb-1">
                Welcome, {currentUser?.name}
              </h3>
              <span className="text-gray-500 fw-semibold fs-6">
                This is a blank dashboard. Start building your modules here.
              </span>
            </div>
          </div>
        </div>
        {/* end::Card */}
      </div>
    </div>
  );
};

const DashboardWrapper = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: "MENU.DASHBOARD" })}</PageTitle>
      <DashboardPage />
    </>
  );
};

export { DashboardWrapper };
