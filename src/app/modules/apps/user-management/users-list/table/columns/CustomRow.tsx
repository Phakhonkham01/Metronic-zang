import clsx from "clsx";
import { FC } from "react";
import { Row } from "react-table";
import { User } from "../../core/_models";

type Props = {
  row: Row<User>;
};

const CustomRow: FC<Props> = ({ row }) => {
  const { key: rowKey, ...rowProps } = row.getRowProps();

  return (
    <tr key={rowKey} {...rowProps}>
      {row.cells.map((cell) => {
        const { key: cellKey, ...cellProps } = cell.getCellProps(); // ✅ ดึง key ออกก่อน spread
        return (
          <td
            key={cellKey}
            {...cellProps}
            className={clsx({
              "text-end min-w-100px": cell.column.id === "actions",
            })}
          >
            {cell.render("Cell")}
          </td>
        );
      })}
    </tr>
  );
};

export { CustomRow };
