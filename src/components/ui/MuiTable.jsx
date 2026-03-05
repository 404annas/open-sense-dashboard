import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";

/**
 * A modern, reusable MUI Table component.
 * It intelligently switches between server-side (controlled) and client-side (uncontrolled)
 * pagination and search based on the props provided.
 *
 * @param {string} title - The main title of the table.
 * @param {string} subtitle - A subtitle displayed below the title.
 * @param {array} columns - Array of column configuration objects.
 * @param {array} rows - The data array to be displayed.
 * @param {boolean} isLoading - A boolean to show a loading spinner in the table body.
 * @param {number} totalRows - (Controlled) The total number of rows from the backend for server-side pagination.
 * @param {function} onPageChange - (Controlled) Callback for page change: (event, newPage) => {}.
 * @param {function} onRowsPerPageChange - (Controlled) Callback for rows per page change: (event) => {}.
 * @param {number} page - (Controlled) The current page (0-indexed) from the parent component.
 * @param {number} rowsPerPage - (Controlled) The current rows per page from the parent component.
 * @param {boolean} showSearch - Whether to show the client-side search bar.
 */
const MuiTable = ({
  title = "Data Table",
  subtitle,
  columns = [],
  rows = [],
  isLoading = false,
 // --- Server-Side ("Controlled") Props ---
  totalRows,
  onPageChange,
  onRowsPerPageChange,
  page: controlledPage,
  rowsPerPage: controlledRowsPerPage,
  getRowProps,
  // --- Client-Side ("Uncontrolled") Props ---
  showSearch = true,
}) => {
  // --- Internal State for Client-Side Fallback ---

  const [internalPage, setInternalPage] = useState(0);
  const [tableLoading, setTableLoading] = useState(isLoading);

  const [internalRowsPerPage, setInternalRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setTableLoading(isLoading);
  }, [isLoading]);

  // --- Determine if the component is in controlled mode ---
  const isPaginationControlled =
    controlledPage !== undefined &&
    onPageChange !== undefined &&
    totalRows !== undefined;

  // --- Memoized Filtering for Client-Side Search ---
  const filteredRows = useMemo(() => {
    if (!searchTerm || isPaginationControlled) {
      // If pagination is controlled, we assume search is also handled server-side
      // and we should not filter the already-paginated rows passed in.
      return rows;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return rows.filter((row) =>
      columns.some((col) =>
        String(row[col.field]).toLowerCase().includes(lowercasedFilter),
      ),
    );
  }, [rows, searchTerm, columns, isPaginationControlled]);

  // --- Reset client-side page when search term changes ---
  useEffect(() => {
    setInternalPage(0);
  }, [searchTerm]);

  // --- Determine which rows to display ---
  const rowsToDisplay = isPaginationControlled
    ? rows // In controlled mode, display the rows as they are passed in.
    : filteredRows.slice(
        // In uncontrolled mode, slice the filtered data for client-side pagination.
        internalPage * internalRowsPerPage,
        internalPage * internalRowsPerPage + internalRowsPerPage,
      );

  // --- Handlers ---
  const handleInternalPageChange = (event, newPage) => setInternalPage(newPage);
  const handleInternalRowsPerPageChange = (event) => {
    setInternalRowsPerPage(parseInt(event.target.value, 10));
    setInternalPage(0);
  };

  // Use controlled props if available, otherwise use internal state
  const currentPage = isPaginationControlled ? controlledPage : internalPage;
  const currentRowsPerPage = isPaginationControlled
    ? controlledRowsPerPage
    : internalRowsPerPage;
  const handlePageChange = isPaginationControlled
    ? onPageChange
    : handleInternalPageChange;
  const handleRowsPerPageChange = isPaginationControlled
    ? onRowsPerPageChange
    : handleInternalRowsPerPageChange;
  const rowCount = isPaginationControlled ? totalRows : filteredRows.length;
  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
      {/* Toolbar */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        p={2}
        gap={2}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {showSearch && (
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      </Box>

      {/* Table */}
      <TableContainer className="min-h-68">
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                "& .MuiTableCell-root": {
                  bgcolor: "grey.200",
                  fontWeight: "bold",
                },
              }}
            >
              {columns.map((col) => (
                <TableCell key={col.field} align={col.align || "left"}>
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ py: 10 }}
                >
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : rowsToDisplay.length > 0 ? (
              rowsToDisplay.map((row, rowIndex) => {
                const rowProps = getRowProps
                  ? getRowProps(row, rowIndex)
                  : {};
                const { sx: rowSx, ...restRowProps } = rowProps;

                return (
                  <TableRow
                    key={row._id || rowIndex}
                    hover
                    sx={{
                      "&:nth-of-type(even)": { backgroundColor: "action.hover" },
                      "&:hover": {
                        backgroundColor: "action.selected", // or any color you prefer
                        // You can also use a custom color:
                        // backgroundColor: '#f5f5f5',
                      },
                      ...rowSx,
                    }}
                    {...restRowProps}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.field}
                        align={col.align || "left"}
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        {typeof col.render === "function"
                          ? col.render(row[col.field], row)
                          : row[col.field]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ py: 10 }}
                >
                  <Typography color="text.secondary">
                    {searchTerm ? "No results found." : "No data available."}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={rowCount}
        rowsPerPage={currentRowsPerPage}
        page={currentPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Paper>
  );
};

export default MuiTable;
