// File: src/hooks/useProjectFilters.js
import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useProjectFilters = (initialLimit = 10) => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Initialize state from URL parameters
    const [page, setPage] = useState(() => {
        const paramPage = searchParams.get('page');
        return paramPage ? parseInt(paramPage, 10) : 1;
    });
    
    const [limit, setLimit] = useState(() => {
        const paramLimit = searchParams.get('limit');
        return paramLimit ? parseInt(paramLimit, 10) : initialLimit;
    });
    
    const [searchTerm, setSearchTerm] = useState(() => {
        return searchParams.get('search') || '';
    });
    
    const [sortConfig, setSortConfig] = useState(() => {
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';
        return { sortBy, sortOrder };
    });

    // Update URL parameters when state changes
    const updateSearchParams = useCallback((newParams) => {
        const params = new URLSearchParams(searchParams);
        
        // Update page parameter
        if (newParams.page !== undefined) {
            if (newParams.page === 1) {
                params.delete('page');
            } else {
                params.set('page', newParams.page.toString());
            }
        }
        
        // Update limit parameter
        if (newParams.limit !== undefined) {
            if (newParams.limit === initialLimit) {
                params.delete('limit');
            } else {
                params.set('limit', newParams.limit.toString());
            }
        }
        
        // Update search parameter
        if (newParams.search !== undefined) {
            if (!newParams.search.trim()) {
                params.delete('search');
            } else {
                params.set('search', newParams.search);
            }
        }
        
        // Update sort parameters
        if (newParams.sortBy !== undefined) {
            if (newParams.sortBy === 'createdAt') {
                params.delete('sortBy');
            } else {
                params.set('sortBy', newParams.sortBy);
            }
        }
        
        if (newParams.sortOrder !== undefined) {
            if (newParams.sortOrder === 'desc') {
                params.delete('sortOrder');
            } else {
                params.set('sortOrder', newParams.sortOrder);
            }
        }
        
        setSearchParams(params);
    }, [searchParams, setSearchParams, initialLimit]);

    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset to first page when search changes
        updateSearchParams({ search: e.target.value, page: 1 });
    }, [updateSearchParams]);

    const handleMuiPageChange = useCallback((event, newPageZeroIndexed) => {
        const newPage = newPageZeroIndexed + 1;
        setPage(newPage);
        updateSearchParams({ page: newPage });
    }, [updateSearchParams]);

    const handleMuiLimitChange = useCallback((event) => {
        const newLimit = parseInt(event.target.value, 10);
        setLimit(newLimit);
        setPage(1); // Reset to first page when limit changes
        updateSearchParams({ limit: newLimit, page: 1 });
    }, [updateSearchParams]);

    const handleSortChange = useCallback((newSortBy) => {
        setSortConfig(prev => {
            const isAsc = prev.sortBy === newSortBy && prev.sortOrder === 'asc';
            const newSortOrder = isAsc ? 'desc' : 'asc';
            
            setSortConfig({ sortBy: newSortBy, sortOrder: newSortOrder });
            updateSearchParams({ sortBy: newSortBy, sortOrder: newSortOrder });
            
            return { sortBy: newSortBy, sortOrder: newSortOrder };
        });
    }, [updateSearchParams]);

    const resetFilters = useCallback(() => {
        setSearchTerm('');
        setPage(1);
        setSortConfig({ sortBy: 'createdAt', sortOrder: 'desc' });
        
        const params = new URLSearchParams();
        params.set('limit', initialLimit.toString());
        setSearchParams(params);
    }, [initialLimit, setSearchParams]);

    const queryParams = useMemo(() => {
        const params = {
            page,
            limit,
            sortBy: sortConfig.sortBy,
            sortOrder: sortConfig.sortOrder,
        };

        if (searchTerm) {
            params.search = searchTerm;
        }

        return params;
    }, [page, limit, sortConfig, searchTerm]);

    return {
        page,
        limit,
        searchTerm,
        sortConfig,
        setSortConfig,
        handlers: {
            handleSearchChange,
            handleMuiPageChange,
            handleMuiLimitChange,
            handleSortChange,
        },
        queryParams,
        resetFilters,
    };
};