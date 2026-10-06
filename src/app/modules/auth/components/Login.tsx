import { useState } from "react";
import * as Yup from "yup";
import clsx from "clsx";
import { useFormik } from "formik";
import { authAPI } from "../../../../services/api";
import { useAuth } from "../core/Auth";

const loginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const initialValues = {
  username: "",
  password: "",
};

export function Login() {
  const [loading, setLoading] = useState(false);
  const { saveAuth, setCurrentUser } = useAuth();

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        const { token, user } = await authAPI.login(
          values.username,
          values.password
        );
        saveAuth({ api_token: token });
        setCurrentUser(user);
      } catch (error) {
        saveAuth(undefined);
        setStatus(
          error instanceof Error ? error.message : "The login details are incorrect"
        );
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  return (
    <form
      className="form w-100"
      onSubmit={formik.handleSubmit}
      noValidate
      id="kt_login_signin_form"
    >
      {/* begin::Heading */}
      <div className="text-center mb-11">
        <h1 className="text-gray-900 fw-bolder mb-3">Sign In</h1>
        <div className="text-gray-500 fw-semibold fs-6">
          Enter your username and password
        </div>
      </div>
      {/* end::Heading */}

      {formik.status && (
        <div className="mb-lg-15 alert alert-danger">
          <div className="alert-text font-weight-bold">{formik.status}</div>
        </div>
      )}

      {/* begin::Form group */}
      <div className="fv-row mb-8">
        <label className="form-label fs-6 fw-bolder text-gray-900">
          Username
        </label>
        <input
          type="text"
          placeholder="Username"
          autoComplete="username"
          {...formik.getFieldProps("username")}
          className={clsx("form-control bg-transparent", {
            "is-invalid": formik.touched.username && formik.errors.username,
            "is-valid": formik.touched.username && !formik.errors.username,
          })}
        />
        {formik.touched.username && formik.errors.username && (
          <div className="fv-plugins-message-container">
            <span role="alert">{formik.errors.username}</span>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className="fv-row mb-8">
        <label className="form-label fw-bolder text-gray-900 fs-6 mb-0">
          Password
        </label>
        <input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          {...formik.getFieldProps("password")}
          className={clsx("form-control bg-transparent", {
            "is-invalid": formik.touched.password && formik.errors.password,
            "is-valid": formik.touched.password && !formik.errors.password,
          })}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="fv-plugins-message-container">
            <span role="alert">{formik.errors.password}</span>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Action */}
      <div className="d-grid mb-10">
        <button
          type="submit"
          id="kt_sign_in_submit"
          className="btn btn-primary"
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className="indicator-label">Continue</span>}
          {loading && (
            <span className="indicator-progress" style={{ display: "block" }}>
              Please wait...
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
      </div>
      {/* end::Action */}
    </form>
  );
}
