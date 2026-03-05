import React from 'react';
import { useGetProjectsQuery, useDeleteProjectMutation } from '../../_core/Slices/apiSlice';
import { Link } from 'react-router-dom';
import { IconButton, Tooltip, TextField, InputAdornment } from '@mui/material';
import { Button } from '../../components/components';
import { Edit, Delete, Add, Search } from '@mui/icons-material';
import { toast } from 'react-toastify';
import MuiTable from '../../components/ui/MuiTable';
import { useProjectFilters } from '../../hooks/useProjectFilters';

const ProjectsList = () => {
    const {
        page,
        limit,
        searchTerm,
        handlers,
        queryParams,
        resetFilters
    } = useProjectFilters(10);

    const { data: projectsData, error, isLoading, refetch } = useGetProjectsQuery(queryParams);
    const [deleteProject] = useDeleteProjectMutation();

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteProject(id).unwrap();
                toast.success('Project deleted successfully');
                refetch();
            } catch (err) {
                toast.error('Error deleting project: ' + err.data?.message || err.message);
            }
        }
    };

    // Extract projects and pagination data from the response
    const projects = projectsData?.data?.projects || [];
    const pagination = projectsData?.data?.pagination || {};

    // Define columns for the MuiTable
    const columns = [
        {
            field: 'imageUrl',
            header: 'Image',
            render: (value, row) => {
                // 1. Find the item in the array that is an IMAGE
                const imageItem = row.media?.find(item =>
                    item.src && item.src.match(/\.(jpg|jpeg|png|webp|gif)$/i)
                );

                // 2. Use the found image, or fallback to placeholder
                const displaySrc = imageItem ? imageItem.src : '/placeholder-image.jpg';

                return (
                    <img
                        src={displaySrc}
                        alt={row.name || 'Project'}
                        className="w-fit object-contain rounded"
                        style={{ width: '64px', height: '64px' }}
                    />
                );
            }
        },
        {
            field: 'name',
            header: 'Name',
            render: (value) => value || 'N/A'
        },
        {
            field: 'description',
            header: 'Description',
            render: (value) => (value ? `${value.substring(0, 50)}...` : 'N/A')
        },
        {
            field: 'categories',
            header: 'Categories',
            render: (value) => {
                if (value && Array.isArray(value) && value.length > 0) {
                    return value.map(cat => cat.name).join(', ');
                }
                return 'N/A';
            }
        },
        {
            field: 'actions',
            header: 'Actions',
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
                        <IconButton
                            color="error"
                            onClick={() => handleDelete(row._id)}
                        >
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </div>
            )
        }
    ];

    if (isLoading && page === 1) return <div className="p-4">Loading projects...</div>;
    if (error) return <div className="p-4">Error loading projects: {error.message}</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
                <div className="flex gap-3">
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
                    <Link to="/dashboard/projects/create">
                        <Button icon={<Add />}>
                            Create Project
                        </Button>
                    </Link>
                </div>
            </div>

            <MuiTable
                title="Projects List"
                subtitle="Manage your projects"
                columns={columns}
                rows={!isLoading && projects}
                isLoading={isLoading}
                totalRows={pagination.totalResults || 0}
                page={page - 1} // Convert from 1-indexed to 0-indexed for MUI table
                rowsPerPage={limit}
                onPageChange={handlers.handleMuiPageChange}
                onRowsPerPageChange={handlers.handleMuiLimitChange}
                showSearch={false} // Disable client-side search since we're using server-side pagination
            />
        </div>
    );
};

export default ProjectsList;