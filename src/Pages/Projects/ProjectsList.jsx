import React, { useEffect, useState } from "react";
import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
  useReorderProjectsMutation,
} from "../../_core/Slices/apiSlice";
import { Link } from "react-router-dom";
import {
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Button } from "../../components/components";
import { Edit, Delete, Add, Search, DragIndicator } from "@mui/icons-material";
import { toast } from "react-toastify";
import MuiTable from "../../components/ui/MuiTable";
import { useProjectFilters } from "../../hooks/useProjectFilters";

const ProjectsList = () => {
  const {
    page,
    limit,
    searchTerm,
    sortConfig,
    handlers,
    queryParams,
    resetFilters,
  } = useProjectFilters(10);

  const {
    data: projectsData,
    error,
    isLoading,
    refetch,
  } = useGetProjectsQuery(queryParams);
  console.log("Project Data", projectsData);
  const [deleteProject] = useDeleteProjectMutation();
  const [reorderProjects] = useReorderProjectsMutation();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id).unwrap();
        toast.success("Project deleted successfully");
        refetch();
      } catch (err) {
        toast.error(
          "Error deleting project: " + err.data?.message || err.message,
        );
      }
    }
  };

  const projects = projectsData?.data?.projects || [];
  const pagination = projectsData?.data?.pagination || {};
  const [displayRows, setDisplayRows] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    setDisplayRows(projects);
  }, [projects]);

  const canReorder =
    sortConfig.sortBy === "displayOrder" &&
    sortConfig.sortOrder === "asc" &&
    !searchTerm;

  const handleDragStart = (index) => (event) => {
    if (!canReorder) return;
    setDragIndex(index);
    event.dataTransfer.setData("text/plain", displayRows[index]?._id || "");
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (index) => (event) => {
    if (!canReorder) return;
    event.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    event.dataTransfer.dropEffect = "move";
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  const handleDrop = (index) => async (event) => {
    if (!canReorder || dragIndex === null) return;
    event.preventDefault();

    if (dragIndex === index) {
      setDragIndex(null);
      return;
    }

    const updatedRows = [...displayRows];
    const [movedRow] = updatedRows.splice(dragIndex, 1);
    updatedRows.splice(index, 0, movedRow);

    const baseOrder = (page - 1) * limit;
    const reorderedRows = updatedRows.map((row, idx) => ({
      ...row,
      displayOrder: baseOrder + idx + 1,
    }));

    setDisplayRows(reorderedRows);
    setDragIndex(null);

    try {
      await reorderProjects(
        reorderedRows.map((row) => ({
          id: row._id,
          displayOrder: row.displayOrder,
        })),
      ).unwrap();
    } catch (err) {
      toast.error(
        "Error updating project order: " + (err.data?.message || err.message),
      );
      refetch();
    }
  };

  const columns = [
    {
      field: "reorder",
      header: "Reorder",
      render: () => (
        <DragIndicator
          sx={{
            opacity: canReorder ? 1 : 0.3,
            cursor: canReorder ? "grab" : "not-allowed",
          }}
        />
      ),
    },
    {
      field: "imageUrl",
      header: "Image",
      render: (value, row) => {
        const imageItem = row.media?.find(
          (item) => item.src && item.src.match(/\.(jpg|jpeg|png|webp|gif)$/i),
        );

        const displaySrc = imageItem ? imageItem.src : "/placeholder-image.jpg";

        return (
          <img
            src={displaySrc}
            alt={row.name || "Project"}
            className="w-fit object-contain rounded"
            style={{ width: "64px", height: "64px" }}
          />
        );
      },
    },
    {
      field: "name",
      header: "Name",
      render: (value) => value || "N/A",
    },
    {
      field: "displayOrder",
      header: "Display Order",
      render: (value) =>
        value !== undefined && value !== null ? value : "N/A",
    },
    {
      field: "description",
      header: "Description",
      render: (value) => (value ? `${value.substring(0, 50)}...` : "N/A"),
    },
    {
      field: "categories",
      header: "Categories",
      render: (value) => {
        if (value && Array.isArray(value) && value.length > 0) {
          return value.map((cat) => cat.name).join(", ");
        }
        return "N/A";
      },
    },
    {
      field: "actions",
      header: "Actions",
      render: (value, row) => (
        <div>
          <Link to={`/dashboard/projects/edit/${row._id}`}>
            <Tooltip title="Edit">
              <IconButton color="primary">
                <Edit />
              </IconButton>
            </Tooltip>
          </Link>
          <Tooltip title="Delete">
            <IconButton color="error" onClick={() => handleDelete(row._id)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  if (isLoading && page === 1)
    return <div className="p-4">Loading projects...</div>;
  if (error)
    return <div className="p-4">Error loading projects: {error.message}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <div className="flex gap-3 items-center">
          <TextField
            variant="outlined"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={handlers.handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            size="small"
          />
          <FormControl size="small" variant="outlined" sx={{ minWidth: 140 }}>
            <InputLabel id="projects-sort-by-label">Sort By</InputLabel>
            <Select
              labelId="projects-sort-by-label"
              label="Sort By"
              value={sortConfig.sortBy}
              onChange={(event) =>
                handlers.handleSortByChange(event.target.value)
              }
            >
              <MenuItem value="createdAt">Created Date</MenuItem>
              <MenuItem value="updatedAt">Updated Date</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="displayOrder">Display Order</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel id="projects-sort-order-label">Order</InputLabel>
            <Select
              labelId="projects-sort-order-label"
              label="Order"
              value={sortConfig.sortOrder}
              onChange={(event) =>
                handlers.handleSortOrderChange(event.target.value)
              }
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
          <Link to="/dashboard/projects/create">
            <Button icon={<Add />}>Create Project</Button>
          </Link>
        </div>
      </div>

      <MuiTable
        title="Projects List"
        subtitle="Manage your projects"
        columns={columns}
        rows={!isLoading && displayRows}
        isLoading={isLoading}
        totalRows={pagination.totalResults || 0}
        page={page - 1}
        rowsPerPage={limit}
        onPageChange={handlers.handleMuiPageChange}
        onRowsPerPageChange={handlers.handleMuiLimitChange}
        showSearch={false}
        getRowProps={(row, rowIndex) =>
          canReorder
            ? {
                draggable: true,
                onDragStart: handleDragStart(rowIndex),
                onDragOver: handleDragOver(rowIndex),
                onDrop: handleDrop(rowIndex),
                onDragEnd: handleDragEnd,
                sx: {
                  cursor: "grab",
                  opacity: dragIndex === rowIndex ? 0.6 : 1,
                },
              }
            : {}
        }
      />
    </div>
  );
};

export default ProjectsList;
