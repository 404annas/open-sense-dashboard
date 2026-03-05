// File: src/hooks/useGalleryFilters.js
import { useState, useMemo, useCallback } from 'react';

export const useGalleryFilters = (initialLimit = 10) => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(initialLimit);
    const [sortConfig, setSortConfig] = useState({ sortBy: 'createdAt', sortOrder: 'desc' });

    const handleMuiPageChange = useCallback((event, newPageZeroIndexed) => {
        setPage(newPageZeroIndexed + 1);
    }, []);

    const handleMuiLimitChange = useCallback((event) => {
        setLimit(parseInt(event.target.value, 10));
        setPage(1);
    }, []);

    const handleSortChange = useCallback((newSortBy) => {
        setSortConfig(prev => {
            const isAsc = prev.sortBy === newSortBy && prev.sortOrder === 'asc';
            return { sortBy: newSortBy, sortOrder: isAsc ? 'desc' : 'asc' };
        });
    }, []);

    const queryParams = useMemo(() => ({
        page,
        limit,
        sortBy: sortConfig.sortBy,
        sortOrder: sortConfig.sortOrder,
    }), [page, limit, sortConfig]);

    return {
        page,
        limit,
        sortConfig,
        setSortConfig,
        handlers: {
            handleMuiPageChange,
            handleMuiLimitChange,
            handleSortChange,
        },
        queryParams,
    };
};
