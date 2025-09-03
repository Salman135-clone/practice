import React, { useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import DOMPurify from "dompurify";
import TablePagination from "@mui/material/TablePagination";
import { GoSortAsc } from "react-icons/go";
import { GoSortDesc } from "react-icons/go";

const Table = ({
  columns = [],
  loading,
  data = [],
  sortColumn,
  setSortColumn,
  sortDirection,
  setSortDirection,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalPages = Math.ceil(data?.length / rowsPerPage);
  const paginatedData = data?.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleSort = (accessor) => {
    if (sortColumn === accessor) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else setSortColumn(accessor), setSortDirection("asc");
  };

  return (
    <>
      <div className="main w-full overflow-auto m-auto">
        {/* <h2 className="titlet text-xl font-semibold mb-2">Blog List</h2> */}
        <table className="w-full text-left whitespace-nowrap border-b border-gray-200  rounded-lg overflow-hidden ">
          <thead className="bg-gray-800 cursor-pointer text-white  ">
            <tr>
              {columns.map((col, index) => (
                <th
                  onClick={() => !col.disableSort && handleSort(col.accessor)}
                  key={index}
                  className="font-semibold"
                >
                  <span className="flex px-3 py-4 items-center gap-1 text-center">
                    {col.header}
                    {!col.disableSort &&
                      sortColumn === col.accessor &&
                      (sortDirection === "asc" ? (
                        <GoSortAsc size={20} />
                      ) : (
                        <GoSortDesc size={20} />
                      ))}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-100">
            {loading && (
              <tr>
                <td colSpan={columns.length}>
                  <LinearProgress />
                </td>
              </tr>
            )}
            {!loading && paginatedData?.length > 0
              ? paginatedData?.map((dataRow, rowIndex) => (
                  <tr
                    key={dataRow.id || rowIndex}
                    className={`hover:bg-gray-100 ${
                      rowIndex !== paginatedData?.length - 1 ? "border-b" : ""
                    } border-gray-200`}
                  >
                    {(columns || []).map((col, colIndex) => (
                      <td key={colIndex} className="px-3 py-3 truncate">
                        {col.render
                          ? col.render(dataRow)
                          : dataRow[col.accessor]}
                      </td>
                    ))}
                  </tr>
                ))
              : !loading && (
                  <tr className="text-center text-2xl font-medium">
                    <td colSpan={columns.length} className="mt-5 text-gray-400">
                      No data available.
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
        <TablePagination
          component="div"
          count={data?.length || 0}
          page={currentPage}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20]}
        />
      </div>
    </>
  );
};

export default Table;
