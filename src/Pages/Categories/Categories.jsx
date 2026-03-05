import React, { useState } from 'react';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} from '../../_core/Slices/apiSlice';
import { Button, Input, Heading, Card } from '../../components/components.js';

import { toast } from 'react-toastify';

const Categories = () => {
  const { data: categoriesData, isLoading, refetch } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: ''
  });

  const categories = categoriesData?.data || [];

  const handleOpenModal = (category = null) => {
    if (category) {
      setSelectedCategory(category);
      setFormData({
        name: category.name || ''
      });
    } else {
      setSelectedCategory(null);
      setFormData({
        name: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setFormData({
      name: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedCategory) {
        // Update existing category
        await updateCategory({ id: selectedCategory._id, name: formData.name }).unwrap();
        toast.success('Category updated successfully');
      } else {
        // Create new category
        await createCategory({ name: formData.name }).unwrap();
        toast.success('Category created successfully');
      }

      handleCloseModal();
      refetch(); // Refresh the data
    } catch (error) {
      toast.error('Error saving category: ' + error.data?.message || error.message);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Heading level={2}>Categories</Heading>
        <Button onClick={() => handleOpenModal()}>Add Category</Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category._id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">
                  {category.name || 'Untitled Category'}
                </h3>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenModal(category)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this category?')) {
                      deleteCategory(category._id)
                        .unwrap()
                        .then(() => {
                          toast.success('Category deleted successfully');
                          refetch();
                        })
                        .catch(error => {
                          toast.error('Error deleting category: ' + error.data?.message || error.message);
                        });
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99] p-4">
          <Card className="w-full max-w-md p-6">
            <Heading level={3}>
              {selectedCategory ? 'Edit Category' : 'Add Category'}
            </Heading>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {isCreating || isUpdating
                    ? (selectedCategory ? 'Updating...' : 'Creating...')
                    : (selectedCategory ? 'Update' : 'Create')
                  }
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={isCreating || isUpdating}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Categories;