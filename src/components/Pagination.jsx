import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight, FirstPage, LastPage } from '@mui/icons-material';

const Pagination = ({ 
    currentPage, 
    totalPages, 
    totalResults, 
    resultsPerPage,
    onPageChange,
    showFirstLast = true 
}) => {
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            onPageChange(newPage);
        }
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const delta = 2; // Number of pages to show around current page
        const range = [];
        const rangeWithDots = [];

        // Always show first page
        if (totalPages <= 1) return [1];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const pageNumbers = getPageNumbers();

    if (totalPages <= 1) return null;

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mt: 2,
                px: 1
            }}
        >
            <Typography variant="body2" color="textSecondary">
                Showing {((currentPage - 1) * resultsPerPage) + 1} - {Math.min(currentPage * resultsPerPage, totalResults)} of {totalResults} results
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {showFirstLast && (
                    <Button
                        size="small"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        startIcon={<FirstPage />}
                    >
                        First
                    </Button>
                )}
                
                <Button
                    size="small"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    startIcon={<ChevronLeft />}
                >
                    Previous
                </Button>
                
                {pageNumbers.map((page, index) => (
                    page === '...' ? (
                        <Typography key={`ellipsis-${index}`} variant="body2" sx={{ mx: 0.5 }}>
                            ...
                        </Typography>
                    ) : (
                        <Button
                            key={page}
                            size="small"
                            variant={page === currentPage ? "contained" : "outlined"}
                            onClick={() => handlePageChange(page)}
                            sx={{ minWidth: 36 }}
                        >
                            {page}
                        </Button>
                    )
                ))}
                
                <Button
                    size="small"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    endIcon={<ChevronRight />}
                >
                    Next
                </Button>
                
                {showFirstLast && (
                    <Button
                        size="small"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        endIcon={<LastPage />}
                    >
                        Last
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default Pagination;