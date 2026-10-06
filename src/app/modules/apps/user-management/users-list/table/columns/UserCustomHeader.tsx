import clsx from "clsx";
import { FC, PropsWithChildren, useMemo } from "react";
import { HeaderProps } from "react-table";
import { initialQueryState } from "../../../../../../../_metronic/helpers";
import { useQueryRequest } from "../../core/QueryRequestProvider";
import { User } from "../../core/_models";

type Props = {
  className?: string;
  title?: string;
  tableProps: PropsWithChildren<HeaderProps<User>>;
};

const UserCustomHeader: FC<Props> = ({ className, title, tableProps }) => {
  const id = tableProps.column.id;
  const { state, updateState } = useQueryRequest();

  const isSelectedForSorting = useMemo(
    () => state.sort && state.sort === id,
    [state, id]
  );
  const order: "asc" | "desc" | undefined = useMemo(() => state.order, [state]);

  const sortColumn = () => {
    if (id === "actions" || id === "selection") return;

    if (!isSelectedForSorting) {
      updateState({ sort: id, order: "asc", ...initialQueryState });
      return;
    }

    if (isSelectedForSorting && order !== undefined) {
      if (order === "asc") {
        updateState({ sort: id, order: "desc", ...initialQueryState });
        return;
      }
      updateState({ sort: undefined, order: undefined, ...initialQueryState });
    }
  };

  // ✅ destructure key ออกมาก่อน
  const { key, ...rest } = tableProps.column.getHeaderProps();

  return (
    <th
      key={key} // ใส่ key ตรงนี้
      {...rest}
      className={clsx(
        className,
        isSelectedForSorting && order !== undefined && `table-sort-${order}`
      )}
      style={{ cursor: "pointer" }}
      onClick={sortColumn}
    >
      {title}
    </th>
  );
};

export { UserCustomHeader };
