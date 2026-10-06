import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { toAbsoluteUrl } from "../../../_metronic/helpers";

const AuthLayout = () => {
  useEffect(() => {
    const root = document.getElementById("root");
    if (root) {
      root.style.height = "100%";
    }
    return () => {
      if (root) {
        root.style.height = "auto";
      }
    };
  }, []);

  return (
    <div className="d-flex flex-column flex-lg-row flex-column-fluid h-100">
      {/* begin::Body */}
      <div className="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1">
        <div className="d-flex flex-center flex-column flex-lg-row-fluid">
          <div className="w-lg-500px p-10">
            <Outlet />
          </div>
        </div>
      </div>
      {/* end::Body */}

      {/* begin::Aside */}
      <div
        className="d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2"
        style={{
          backgroundImage: `url(${toAbsoluteUrl("media/misc/auth-bg.png")})`,
        }}
      >
        <div className="d-flex flex-column flex-center py-15 px-5 px-md-15 w-100">
          <img
            alt="Logo"
            src={toAbsoluteUrl("media/logos/custom-1.png")}
            className="h-75px mb-12"
          />
          <h1 className="text-white fs-2qx fw-bolder text-center mb-7">
            Welcome
          </h1>
        </div>
      </div>
      {/* end::Aside */}
    </div>
  );
};

export { AuthLayout };
