// File: src/hooks/useUserFilters.js
import { useState, useMemo, useCallback } from "react";

export const useUserFilters = (initialLimit = 10) => {
  const [page, setPage] = useState(1); // API uses 1-indexed page
  const [limit, setLimit] = useState(initialLimit);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [sortConfig, setSortConfig] = useState({
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  }, []);

  const handleRoleChange = useCallback((e) => {
    setSelectedRole(e.target.value);
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
    setSortConfig((prev) => {
      const isAsc = prev.sortBy === newSortBy && prev.sortOrder === "asc";
      return { sortBy: newSortBy, sortOrder: isAsc ? "desc" : "asc" };
    });
  }, []);

  const queryParams = useMemo(() => {
    const params = {
      page,
      limit,
      sort: sortConfig.sortBy,
      sortOrder: sortConfig.sortOrder,
      searchQuery: searchTerm,
    };

    if (selectedRole) {
      params.role = selectedRole;
    }

    return params;
  }, [page, limit, selectedRole, sortConfig, searchTerm]);

  return {
    page,
    limit,
    searchTerm, // Expose searchTerm for direct binding if needed
    selectedRole, // Expose selectedRole for direct binding
    sortConfig,
    setSortConfig,
    handlers: {
      handleSearchChange,
      handleRoleChange,
      handleMuiPageChange,
      handleMuiLimitChange,
      handleSortChange,
    },
    queryParams,
  };
};
