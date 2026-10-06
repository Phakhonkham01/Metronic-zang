import { FC, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import Swal from "sweetalert2";
import { isNotEmpty } from "../../../../../../_metronic/helpers";
import { initialUser, User } from "../core/_models";
import { useListView } from "../core/ListViewProvider";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { useQueryResponse } from "../core/QueryResponseProvider";
import { userAPI } from "../../../../../../services/api";

type Props = {
  isUserLoading: boolean;
  user: User;
};

const roles = [
  {
    value: "admin",
    title: "Administrator",
    description: "Full access to every menu, including User Management",
  },
  {
    value: "user",
    title: "User",
    description: "Standard access to the system",
  },
] as const;

const buildSchema = (isEdit: boolean) =>
  Yup.object().shape({
    username: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Username is required"),
    name: Yup.string()
      .min(2, "Minimum 2 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Name is required"),
    email: Yup.string()
      .email("Wrong email format")
      .max(50, "Maximum 50 symbols")
      .required("Email is required"),
    role: Yup.string().required("Role is required"),
    // ຕອນແກ້ໄຂ: ປ່ອຍວ່າງ = ບໍ່ປ່ຽນລະຫັດ
    password: isEdit
      ? Yup.string().min(6, "Minimum 6 symbols")
      : Yup.string().min(6, "Minimum 6 symbols").required("Password is required"),
  });

const UserEditModalForm: FC<Props> = ({ user, isUserLoading }) => {
  const { setItemIdForUpdate } = useListView();
  const { refetch } = useQueryResponse();
  const isEdit = isNotEmpty(user.id);

  const [userForEdit] = useState<User>({
    ...initialUser,
    ...user,
    password: "",
  });

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch();
    }
    setItemIdForUpdate(undefined);
  };

  const formik = useFormik({
    initialValues: userForEdit,
    validationSchema: buildSchema(isEdit),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setSubmitting(true);
      try {
        if (isEdit) {
          await userAPI.updateUser(values);
        } else {
          await userAPI.createUser(values);
        }
        await Swal.fire({
          icon: "success",
          text: isEdit ? "User has been updated." : "User has been created.",
          timer: 1500,
          showConfirmButton: false,
        });
        cancel(true);
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fieldClass = (name: keyof User) =>
    clsx(
      "form-control form-control-solid mb-3 mb-lg-0",
      { "is-invalid": formik.touched[name] && formik.errors[name] },
      { "is-valid": formik.touched[name] && !formik.errors[name] }
    );

  const fieldError = (name: keyof User) =>
    formik.touched[name] &&
    formik.errors[name] && (
      <div className="fv-plugins-message-container">
        <div className="fv-help-block">
          <span role="alert">{formik.errors[name]}</span>
        </div>
      </div>
    );

  const isBusy = formik.isSubmitting || isUserLoading;

  return (
    <>
      <form id="kt_modal_add_user_form" className="form" onSubmit={formik.handleSubmit} noValidate>
        {/* begin::Scroll */}
        <div
          className="d-flex flex-column scroll-y me-n7 pe-7"
          id="kt_modal_add_user_scroll"
          data-kt-scroll="true"
          data-kt-scroll-activate="{default: false, lg: true}"
          data-kt-scroll-max-height="auto"
          data-kt-scroll-dependencies="#kt_modal_add_user_header"
          data-kt-scroll-wrappers="#kt_modal_add_user_scroll"
          data-kt-scroll-offset="300px"
        >
          {formik.status && (
            <div className="alert alert-danger mb-7">
              <div className="alert-text">{formik.status}</div>
            </div>
          )}

          {/* begin::Input group */}
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2">Username</label>
            <input
              placeholder="Username"
              {...formik.getFieldProps("username")}
              type="text"
              autoComplete="off"
              className={fieldClass("username")}
              disabled={isBusy}
            />
            {fieldError("username")}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2">Full Name</label>
            <input
              placeholder="Full name"
              {...formik.getFieldProps("name")}
              type="text"
              autoComplete="off"
              className={fieldClass("name")}
              disabled={isBusy}
            />
            {fieldError("name")}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2">Email</label>
            <input
              placeholder="Email"
              {...formik.getFieldProps("email")}
              type="email"
              autoComplete="off"
              className={fieldClass("email")}
              disabled={isBusy}
            />
            {fieldError("email")}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className="fv-row mb-7">
            <label className={clsx("fw-bold fs-6 mb-2", { required: !isEdit })}>
              Password
            </label>
            <input
              placeholder={isEdit ? "Leave blank to keep current password" : "Password"}
              {...formik.getFieldProps("password")}
              type="password"
              autoComplete="new-password"
              className={fieldClass("password")}
              disabled={isBusy}
            />
            {fieldError("password")}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className="mb-7">
            <label className="required fw-bold fs-6 mb-5">Role</label>
            {roles.map((role, i) => (
              <div key={role.value}>
                <div className="d-flex fv-row">
                  <div className="form-check form-check-custom form-check-solid">
                    <input
                      className="form-check-input me-3"
                      {...formik.getFieldProps("role")}
                      name="role"
                      type="radio"
                      value={role.value}
                      id={`kt_modal_update_role_option_${i}`}
                      checked={formik.values.role === role.value}
                      disabled={isBusy}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`kt_modal_update_role_option_${i}`}
                    >
                      <div className="fw-bolder text-gray-800">{role.title}</div>
                      <div className="text-gray-600">{role.description}</div>
                    </label>
                  </div>
                </div>
                {i < roles.length - 1 && (
                  <div className="separator separator-dashed my-5"></div>
                )}
              </div>
            ))}
          </div>
          {/* end::Input group */}
        </div>
        {/* end::Scroll */}

        {/* begin::Actions */}
        <div className="text-center pt-15">
          <button
            type="reset"
            onClick={() => cancel()}
            className="btn btn-light me-3"
            data-kt-users-modal-action="cancel"
            disabled={isBusy}
          >
            Discard
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            data-kt-users-modal-action="submit"
            disabled={isBusy || !formik.isValid}
          >
            <span className="indicator-label">Submit</span>
            {isBusy && (
              <span className="indicator-progress">
                Please wait...{" "}
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </button>
        </div>
        {/* end::Actions */}
      </form>
      {isBusy && <UsersListLoading />}
    </>
  );
};

export { UserEditModalForm };
