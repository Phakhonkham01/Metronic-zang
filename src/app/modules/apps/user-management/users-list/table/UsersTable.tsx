import { useMemo, useState } from "react";
import { useTable, ColumnInstance, Row } from "react-table";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import {
  useQueryResponseData,
  useQueryResponseLoading,
} from "../core/QueryResponseProvider";
import { usersColumns } from "./columns/_columns";
import { User } from "../core/_models";
import { UsersListLoading } from "../components/loading/UsersListLoading";

import { KTCardBody } from "../../../../../../_metronic/helpers";

const UsersTable = () => {
  const users = useQueryResponseData();
  const isLoading = useQueryResponseLoading();
  const data = useMemo(() => users, [users]);
  const columns = useMemo(() => usersColumns, []);
  
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  // Manual pagination
  const paginatedRows = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    return rows.slice(startIndex, startIndex + itemsPerPage);
  }, [rows, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(rows.length / itemsPerPage);

  // สร้าง array ของ page numbers สำหรับแสดง
  const getPageNumbers = () => {
    if (totalPages <= 1) return [];
    
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  const handlePageChange = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  return (
    <KTCardBody className="py-4">
      <div className="table-responsive">
        <table
          id="kt_table_users"
          className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
          {...getTableProps()}
        >
          <thead>
            <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
              {headers.map((column: ColumnInstance<User>) => (
                <CustomHeaderColumn key={column.id} column={column} />
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-600 fw-bold" {...getTableBodyProps()}>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row: Row<User>, i: number) => {
                prepareRow(row);
                return <CustomRow row={row} key={`row-${i}-${row.id}`} />;
              })
            ) : (
              <tr>
                <td colSpan={columns.length}>
                  <div className="d-flex text-center w-100 align-content-center justify-content-center">
                    No matching records found
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Metronic Style Pagination - แสดงเฉพาะเมื่อมีข้อมูลมากกว่า 1 หน้า */}
      {rows.length > itemsPerPage && (
        <div className="d-flex flex-stack flex-wrap pt-10">
          <div className="fs-6 fw-bold text-gray-700">
            Showing {paginatedRows.length > 0 ? (currentPage * itemsPerPage) + 1 : 0} to{" "}
            {(currentPage * itemsPerPage) + paginatedRows.length} of {rows.length} entries
          </div>

          <ul className="pagination">
            {/* First Page */}
            <li className={`page-item previous ${currentPage === 0 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(0)}
                disabled={currentPage === 0}
              >
                <i className="previous"></i>
              </button>
            </li>

            {/* Previous Page */}
            <li className={`page-item previous ${currentPage === 0 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                <i className="previous"></i>
              </button>
            </li>

            {/* Page Numbers */}
            {getPageNumbers().map((pageNumber) => (
              <li
                key={pageNumber}
                className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber + 1}
                </button>
              </li>
            ))}

            {/* Next Page */}
            <li className={`page-item next ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
              >
                <i className="next"></i>
              </button>
            </li>

            {/* Last Page */}
            <li className={`page-item next ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(totalPages - 1)}
                disabled={currentPage === totalPages - 1}
              >
                <i className="next"></i>
              </button>
            </li>
          </ul>
        </div>
      )}

      {isLoading && <UsersListLoading />}
    </KTCardBody>
  );
};

export { UsersTable };