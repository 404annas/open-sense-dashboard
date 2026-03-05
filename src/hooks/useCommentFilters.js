// File: src/hooks/useCommentFilters.js
import { useState, useMemo, useCallback } from 'react';

export const useCommentFilters = (initialLimit = 10) => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(initialLimit);
    const [filters, setFilters] = useState({
        isApproved: '',
        articleId: '',
        userId: '',
    });
    const [sortConfig, setSortConfig] = useState({ sortBy: 'createdAt', sortOrder: 'desc' });

    const handleFilterChange = useCallback((e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(1);
    }, []);

    const handleStatusFilterChange = useCallback((e) => {
        setFilters(prev => ({ ...prev, isApproved: e.target.value }));
        setPage(1);
    }, []);

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
        articleId: filters.articleId,
        userId: filters.userId,
        isApproved: filters.isApproved === '' ? undefined : filters.isApproved === 'true',
        sortBy: sortConfig.sortBy,
        sortOrder: sortConfig.sortOrder,
    }), [page, limit, filters, sortConfig]);

    return {
        page,
        limit,
        filters, // Expose filters object for direct binding
        sortConfig,
        setSortConfig,
        handlers: {
            handleFilterChange,
            handleStatusFilterChange,
            handleMuiPageChange,
            handleMuiLimitChange,
            handleSortChange,
        },
        queryParams,
    };
};
