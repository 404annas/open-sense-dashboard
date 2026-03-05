// import React, { useState, useMemo } from 'react';
// import {
//     Box,
//     Paper, // Using Paper for a cleaner, elevated look
//     Typography,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     TablePagination,
//     TextField,
//     InputAdornment,
//     IconButton,
// } from "@mui/material";
// import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

// const MuiTable = ({
//     title = "Table",
//     subtitle,
//     columns = [],
//     rows = [],
//     showSearch = true,
//     showPagination = true,
//     actions = null, // Prop for custom action buttons in the toolbar
// }) => {
//     // --- State for Search and Pagination ---
//     const [searchTerm, setSearchTerm] = useState('');
//     const [page, setPage] = useState(0); // MUI pagination is 0-indexed
//     const [rowsPerPage, setRowsPerPage] = useState(10);

//     // --- Memoized Filtering Logic for Performance ---
//     // This ensures the filtering logic only runs when the rows or search term change.
//     const filteredRows = useMemo(() => {
//         if (!searchTerm) {
//             return rows; // No search, return all rows
//         }
//         const lowercasedFilter = searchTerm.toLowerCase();
//         return rows.filter(row =>
//             // Check if any value in the row contains the search term
//             Object.values(row).some(value =>
//                 String(value).toLowerCase().includes(lowercasedFilter)
//             )
//         );
//     }, [rows, searchTerm]);

//     // --- Memoized Pagination Logic ---
//     // Slices the filtered rows for the current page.
//     const paginatedRows = useMemo(() =>
//         showPagination
//             ? filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//             : filteredRows,
//         [filteredRows, page, rowsPerPage, showPagination]
//     );

//     // --- Handlers for Pagination ---
//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0); // Reset to the first page when rows per page changes
//     };

//     return (
//         <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
//             {/* --- Table Toolbar --- */}
//             <Box
//                 display="flex"
//                 flexDirection={{ xs: 'column', sm: 'row' }}
//                 justifyContent="space-between"
//                 alignItems="center"
//                 p={2}
//                 gap={2}
//             >
//                 <Box>
//                     <Typography variant="h6" fontWeight="bold">{title}</Typography>
//                     {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
//                 </Box>
//                 <Box display="flex" alignItems="center" gap={2}>
//                     {showSearch && (
//                         <TextField
//                             size="small"
//                             variant="outlined"
//                             placeholder="Search..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <SearchIcon fontSize="small" />
//                                     </InputAdornment>
//                                 ),
//                                 endAdornment: searchTerm && (
//                                     <InputAdornment position="end">
//                                         <IconButton size="small" onClick={() => setSearchTerm('')}>
//                                             <ClearIcon fontSize="small" />
//                                         </IconButton>
//                                     </InputAdornment>
//                                 )
//                             }}
//                         />
//                     )}
//                     {actions}
//                 </Box>
//             </Box>

//             {/* --- Table Content --- */}
//             <TableContainer>
//                 <Table size="small">
//                     <TableHead>
//                         <TableRow sx={{ '& .MuiTableCell-root': { bgcolor: 'grey.100', fontWeight: 'bold' } }}>
//                             {columns.map((col, i) => (
//                                 <TableCell key={i} align={col.align || "left"}>{col.header || col.field}</TableCell>
//                             ))}
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {paginatedRows.length > 0 ? (
//                             paginatedRows.map((row, rowIndex) => (
//                                 <TableRow key={rowIndex} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
//                                     {columns.map((col, colIndex) => (
//                                         <TableCell key={colIndex} align={col.align || "left"} sx={{ whiteSpace: "nowrap" }}>
//                                             {col.render ? col.render(row[col.field], row) : row[col.field]}
//                                         </TableCell>
//                                     ))}
//                                 </TableRow>
//                             ))
//                         ) : (
//                             // --- Empty State ---
//                             <TableRow>
//                                 <TableCell colSpan={columns.length} align="center" sx={{ py: 5 }}>
//                                     <Typography variant="body1" color="text.secondary">
//                                         {searchTerm ? "No results found for your search." : "No data available."}
//                                     </Typography>
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                     </TableBody>
//                 </Table>
//             </TableContainer>

//             {/* --- Table Pagination --- */}
//             {showPagination && rows.length > 0 && (
//                 <TablePagination
//                     rowsPerPageOptions={[5, 10, 25, 50]}
//                     component="div"
//                     count={filteredRows.length} // Count is based on filtered rows
//                     rowsPerPage={rowsPerPage}
//                     page={page}
//                     onPageChange={handleChangePage}
//                     onRowsPerPageChange={handleChangeRowsPerPage}
//                 />
//             )}
//         </Paper>
//     );
// };

// export default MuiTable;

import React, { useState, useMemo, useEffect } from 'react';
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
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

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
    // --- Client-Side ("Uncontrolled") Props ---
    showSearch = true,
}) => {
    // --- Internal State for Client-Side Fallback ---

    const [internalPage, setInternalPage] = useState(0);
    const [tableLoading, setTableLoading] = useState(isLoading);

    const [internalRowsPerPage, setInternalRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setTableLoading(isLoading)


    }, [isLoading])

    // --- Determine if the component is in controlled mode ---
    const isPaginationControlled = controlledPage !== undefined && onPageChange !== undefined && totalRows !== undefined;

    // --- Memoized Filtering for Client-Side Search ---
    const filteredRows = useMemo(() => {
        if (!searchTerm || isPaginationControlled) {
            // If pagination is controlled, we assume search is also handled server-side
            // and we should not filter the already-paginated rows passed in.
            return rows;
        }
        const lowercasedFilter = searchTerm.toLowerCase();
        return rows.filter(row =>
            columns.some(col =>
                String(row[col.field]).toLowerCase().includes(lowercasedFilter)
            )
        );
    }, [rows, searchTerm, columns, isPaginationControlled]);

    // --- Reset client-side page when search term changes ---
    useEffect(() => {
        setInternalPage(0);
    }, [searchTerm]);

    // --- Determine which rows to display ---
    const rowsToDisplay = isPaginationControlled
        ? rows // In controlled mode, display the rows as they are passed in.
        : filteredRows.slice( // In uncontrolled mode, slice the filtered data for client-side pagination.
            internalPage * internalRowsPerPage,
            internalPage * internalRowsPerPage + internalRowsPerPage
        );

    // --- Handlers ---
    const handleInternalPageChange = (event, newPage) => setInternalPage(newPage);
    const handleInternalRowsPerPageChange = (event) => {
        setInternalRowsPerPage(parseInt(event.target.value, 10));
        setInternalPage(0);
    };

    // Use controlled props if available, otherwise use internal state
    const currentPage = isPaginationControlled ? controlledPage : internalPage;
    const currentRowsPerPage = isPaginationControlled ? controlledRowsPerPage : internalRowsPerPage;
    const handlePageChange = isPaginationControlled ? onPageChange : handleInternalPageChange;
    const handleRowsPerPageChange = isPaginationControlled ? onRowsPerPageChange : handleInternalRowsPerPageChange;
    const rowCount = isPaginationControlled ? totalRows : filteredRows.length;
    return (
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            {/* Toolbar */}
            <Box
                display="flex"
                flexDirection={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems="center"
                p={2} gap={2}
            >
                <Box>
                    <Typography variant="h6" fontWeight="bold">{title}</Typography>
                    {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
                </Box>
                {showSearch && (
                    <TextField
                        size="small" variant="outlined" placeholder="Search table..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
                            endAdornment: searchTerm && <InputAdornment position="end"><IconButton size="small" onClick={() => setSearchTerm('')}><ClearIcon fontSize="small" /></IconButton></InputAdornment>
                        }}
                    />
                )}
            </Box>

            {/* Table */}
            <TableContainer className='min-h-68'>
                <Table size="small" >
                    <TableHead>
                        <TableRow sx={{ '& .MuiTableCell-root': { bgcolor: 'grey.200', fontWeight: 'bold' } }}>
                            {columns.map((col) => (
                                <TableCell key={col.field} align={col.align || "left"}>{col.header}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableLoading ? (
                            <TableRow><TableCell colSpan={columns.length} align="center" sx={{ py: 10 }}><CircularProgress /></TableCell></TableRow>
                        ) : rowsToDisplay.length > 0 ? (
                            rowsToDisplay.map((row, rowIndex) => (
                                <TableRow key={row._id || rowIndex} hover
                                    sx={{
                                        '&:nth-of-type(even)': { backgroundColor: 'action.hover' },
                                        '&:hover': {
                                            backgroundColor: 'action.selected', // or any color you prefer
                                            // You can also use a custom color:
                                            // backgroundColor: '#f5f5f5',
                                        }
                                    }}
                                >
                                    {columns.map((col) => (
                                        <TableCell key={col.field} align={col.align || "left"} sx={{ whiteSpace: "nowrap" }}>
                                            {
                                                typeof col.render === 'function'
                                                    ? col.render(row[col.field], row)
                                                    : row[col.field]
                                            }
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={columns.length} align="center" sx={{ py: 10 }}><Typography color="text.secondary">{searchTerm ? "No results found." : "No data available."}</Typography></TableCell></TableRow>
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