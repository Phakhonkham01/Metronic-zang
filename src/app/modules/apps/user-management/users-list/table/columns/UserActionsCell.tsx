import { FC, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import { MenuComponent } from "../../../../../../../_metronic/assets/ts/components";
import { ID, KTIcon, QUERIES } from "../../../../../../../_metronic/helpers";
import { useListView } from "../../core/ListViewProvider";
import { useQueryResponse } from "../../core/QueryResponseProvider";
import { userAPI } from "../../../../../../../services/api";

type Props = {
  id: ID;
};

const UserActionsCell: FC<Props> = ({ id }) => {
  // ==================== Hooks ====================
  const { setItemIdForUpdate } = useListView();
  const { query } = useQueryResponse();
  const queryClient = useQueryClient();

  // ==================== Effects ====================
  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  // ==================== Mutations ====================
  const deleteItem = useMutation(() => userAPI.deleteUser(id), {
    onSuccess: () => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`]);

      // Show success popup
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "User has been deleted successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: () => {
      // Show error popup
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Unable to delete user. Please try again.",
        buttonsStyling: false,
        customClass: { confirmButton: "btn btn-primary" },
      });
    },
  });

  // ==================== Handlers ====================
  const openEditModal = () => {
    setItemIdForUpdate(id);
  };

  const handleDelete = async () => {
    // Show confirmation popup
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      buttonsStyling: false,
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-light me-3",
      },
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    // If confirmed, proceed with deletion
    if (result.isConfirmed) {
      await deleteItem.mutateAsync();
    }
  };

  // ==================== Render ====================
  return (
    <>
      {/* Actions Button */}
      <a
        href="#"
        className="btn btn-light btn-active-light-primary btn-sm"
        data-kt-menu-trigger="click"
        data-kt-menu-placement="bottom-end"
      >
        Actions
        <KTIcon iconName="down" className="fs-5 m-0" />
      </a>

      {/* Dropdown Menu */}
      <div
        className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4"
        data-kt-menu="true"
      >
        {/* Edit Menu Item */}
        <div className="menu-item px-3">
          <a
            className="menu-link px-3"
            onClick={openEditModal}
            style={{ cursor: "pointer" }}
          >
            Edit
          </a>
        </div>

        {/* Delete Menu Item */}
        <div className="menu-item px-3">
          <a
            className="menu-link px-3"
            data-kt-users-table-filter="delete_row"
            onClick={handleDelete}
            style={{ cursor: "pointer" }}
          >
            Delete
          </a>
        </div>
      </div>
    </>
  );
};

export { UserActionsCell };
