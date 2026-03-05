// src/components/Pagination/Pagination.jsx

import React from 'react';
import { Button } from '../components'; // Your reusable Button component

/**
 * An enhanced pagination component with "Previous/Next" buttons,
 * a page counter, and clickable, border-less page numbers.
 */
const Pagination = ({ currentPage, totalPages, onPageChange, isFetching }) => {
    // Don't render pagination if there's only one page or fewer
    if (totalPages <= 1) {
        return null;
    }

    const handlePageClick = (page) => {
        // Prevent unnecessary calls if the page is out of bounds, the same, or fetching
        if (page < 1 || page > totalPages || page === currentPage || isFetching) {
            return;
        }
        onPageChange(page);
    };

    // --- Logic to generate the page numbers to display ---
    // This creates a "window" of numbers around the current page (e.g., 1 ... 4 5 6 ... 10)
    const getPageNumbers = () => {
        const pages = [];
        const pageLimit = 3; // Max numbers to show besides first, last, and ellipses
        const startPage = Math.max(2, currentPage - Math.floor(pageLimit / 2));
        const endPage = Math.min(totalPages - 1, startPage + pageLimit - 1);

        // Always add the first page
        pages.push(1);

        // Add '...' if we are not near the beginning
        if (startPage > 2) {
            pages.push('...');
        }

        // Add the main window of page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Add '...' if we are not near the end
        if (endPage < totalPages - 1) {
            pages.push('...');
        }

        // Always add the last page, if it's different from the first
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center space-x-2">
            {/* Previous Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1 || isFetching}
            >
                Previous
            </Button>

            {/* --- NEW: Page Number Buttons --- */}
            <div className="flex items-center space-x-1">
                {pageNumbers.map((page, index) =>
                    page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-2 py-1 text-sm text-gray-500">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => handlePageClick(page)}
                            disabled={isFetching}
                            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors
                                ${currentPage === page
                                    ? 'bg-primary text-white' // Active page style
                                    : 'text-gray-700 hover:bg-gray-100' // Inactive page style
                                }`
                            }
                            aria-current={currentPage === page ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    )
                )}
            </div>

            {/* Next Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages || isFetching}
            >
                Next
            </Button>
        </div>
    );
};

export default Pagination;