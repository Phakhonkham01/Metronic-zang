import { Column } from "react-table";
import { UserInfoCell } from "./UserInfoCell";
import { UserActionsCell } from "./UserActionsCell";
import { UserSelectionCell } from "./UserSelectionCell";
import { UserCustomHeader } from "./UserCustomHeader";
import { UserRoleCell } from "./UserRoleCell";
import { UserSelectionHeader } from "./UserSelectionHeader";
import { User } from "../../core/_models";

const usersColumns: ReadonlyArray<Column<User>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: "selection",
    Cell: ({ ...props }) => (
      <UserSelectionCell id={props.data[props.row.index].id} />
    ),
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title="Name" className="min-w-125px" />
    ),
    id: "name",
    Cell: ({ ...props }) => <UserInfoCell user={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title="Username" className="min-w-125px" />
    ),
    id: "username",
    accessor: "username",
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title="Role" className="min-w-125px" />
    ),
    id: "role",
    Cell: ({ ...props }) => <UserRoleCell user={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title="Joined Date" className="min-w-125px" />
    ),
    id: "created_at",
    Cell: ({ ...props }) => {
      const date = props.data[props.row.index].created_at;
      return <>{date ? new Date(date).toLocaleDateString() : "-"}</>;
    },
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="Actions"
        className="text-end min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => (
      <UserActionsCell id={props.data[props.row.index].id} />
    ),
  },
];

export { usersColumns };
