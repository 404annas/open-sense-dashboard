import React, { useState, useEffect } from 'react';
import {
    useUpdateProjectMutation,
    useGetProjectByIdQuery,
    useGetCategoriesQuery
} from '../../_core/Slices/apiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Input, Select, Heading, Textarea, CircularProgressBox } from '../../components/components.js';
import { toast } from 'react-toastify';
import { uploadMultipleImagesToCloudinary } from '../../utils/cloudinaryUpload';

const EditProject = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: projectData, isLoading: projectLoading, isError } = useGetProjectByIdQuery(id);
    const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery();
    const [updateProject, { isLoading }] = useUpdateProjectMutation();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [media, setMedia] = useState([]);
    const [displayOrder, setDisplayOrder] = useState('');
    const [imageFiles, setImageFiles] = useState([]); // Store actual file objects
    const [uploading, setUploading] = useState(false); // Track upload status
    const [showIframeModal, setShowIframeModal] = useState(false);
    const [iframeUrl, setIframeUrl] = useState('');

    const categories = categoriesData?.data || [];

    useEffect(() => {
        if (projectData?.data) {
            const project = projectData.data;
            setName(project.name);
            setDescription(project.description);
            setSelectedCategories(project.categories.map(c => c._id));
            setMedia(project.media);
            setDisplayOrder(project.displayOrder ?? '');
        }
    }, [projectData]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // Validate file types and sizes before adding
        const validFiles = files.filter(file => {
            const validType = file.type.startsWith('image/');
            const validSize = file.size <= 25 * 1024 * 1024; // Max 25MB

            if (!validType) {
                toast.error(`${file.name} is not a valid image file.`);
            }

            if (!validSize) {
                toast.error(`${file.name} exceeds 25MB limit.`);
            }

            return validType && validSize;
        });

        if (validFiles.length !== files.length) {
            // Show message if some files were filtered out
            if (validFiles.length === 0) return; // No valid files to add
        }

        // Add preview images to media state
        const newMedia = validFiles.map(file => ({
            type: 'image',
            src: URL.createObjectURL(file),
            alt: file.name,
            isNew: true,
            file: file
        }));

        setMedia(prev => [...prev, ...newMedia]);
        setImageFiles(prev => [...prev, ...validFiles]);
    };

    const handleAddIframe = () => {
        if (iframeUrl) {
            setMedia(prev => [...prev, { type: 'iframe', src: iframeUrl, alt: 'Embedded Video' }]);
            setIframeUrl('');
            setShowIframeModal(false);
        }
    };

    const handleRemoveMedia = (index) => {
        const newMedia = [...media];
        const newImageFiles = [...imageFiles];
        const removedMedia = newMedia.splice(index, 1)[0];

        if (removedMedia.file) {
            // Revoke object URL to free memory
            URL.revokeObjectURL(removedMedia.src);
        }

        if (removedMedia.isNew) {
            const fileIndex = newImageFiles.findIndex(f => f.name === removedMedia.alt);
            if (fileIndex > -1) {
                newImageFiles.splice(fileIndex, 1);
            }
        }

        setMedia(newMedia);
        setImageFiles(newImageFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !description || selectedCategories.length === 0) {
            toast.error('Please fill all fields and select at least one category');
            return;
        }

        if (imageFiles.length > 0) {
            setUploading(true);
            try {
                // Upload new images directly to Cloudinary
                const cloudinaryResults = await uploadMultipleImagesToCloudinary(
                    imageFiles,
                    'opensense-projects',
                    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
                );

                // Prepare project data with existing media and new Cloudinary URLs
                const projectData = {
                    name,
                    description,
                    categories: JSON.stringify(selectedCategories),
                    media: JSON.stringify([...media.filter(m => m.type === 'iframe' || !m.isNew), ...cloudinaryResults]),
                    ...(displayOrder !== '' ? { displayOrder } : {})
                };

                // Submit project data to backend
                await updateProject({ id, updateData: projectData }).unwrap();
                toast.success('Project updated successfully');
                navigate('/dashboard/projects');
            } catch (err) {
                console.error('Update Project Error:', err);

                // Provide more specific error messages
                if (err.message.includes('Upload preset')) {
                    toast.error('Upload configuration error. Please check your Cloudinary settings.');
                } else {
                    toast.error('Error updating project: ' + (err.message || err.data?.message || err.message));
                }
            } finally {
                setUploading(false);
            }
        } else {
            // If no new images, submit without uploading
            const projectData = {
                name,
                description,
                categories: JSON.stringify(selectedCategories),
                media: JSON.stringify(media.filter(m => m.type === 'iframe' || !m.isNew)),
                ...(displayOrder !== '' ? { displayOrder } : {})
            };

            try {
                await updateProject({ id, updateData: projectData }).unwrap();
                toast.success('Project updated successfully');
                navigate('/dashboard/projects');
            } catch (err) {
                console.error('Update Project Error:', err);
                toast.error('Error updating project: ' + (err.data?.message || err.message));
            }
        }
    };

    if (projectLoading || categoriesLoading) return <div className="p-4"><CircularProgressBox /></div>;
    if (isError) return <div className="p-4">Error loading project</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Heading level={2} className="mb-6">Edit Project</Heading>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input label="Project Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <Input
                    label="Display Order"
                    type="number"
                    min="0"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    placeholder="e.g. 1"
                />
                <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} />

                <div>
                    <label className="block text-sm font-medium mb-1">Categories</label>
                    <Select
                        multiple
                        value={selectedCategories}
                        options={categories.map(c => ({ value: c._id, label: c.name }))}
                        onChange={(e) => setSelectedCategories(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Media</label>
                    <div className="flex gap-4 mb-4">
                        <Button type="button" onClick={() => document.getElementById('imageUpload').click()} disabled={uploading}>
                            {uploading ? 'Uploading...' : 'Add Images'}
                        </Button>
                        <input
                            type="file"
                            id="imageUpload"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={uploading}
                        />
                        <Button type="button" onClick={() => setShowIframeModal(true)} disabled={uploading}>Add Video</Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {media.map((m, index) => (
                            <div key={index} className="relative">
                                {m.type === 'image' ? (
                                    <img src={m.src} alt={m.alt} className="w-full h-32 object-cover rounded-md" />
                                ) : (
                                    <iframe src={m.src} title={m.alt} className="w-full h-32 rounded-md" />
                                )}
                                <Button
                                    type="button"
                                    onClick={() => handleRemoveMedia(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                    disabled={uploading}
                                >
                                    X
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={isLoading || uploading}>
                        {(isLoading || uploading) ? 'Updating...' : 'Update Project'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => navigate('/dashboard/projects')} disabled={uploading}>
                        Cancel
                    </Button>
                </div>
            </form>

            {showIframeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
                        <Heading level={3} className="mb-4">Add Video URL</Heading>
                        <Input label="YouTube or Vimeo URL" value={iframeUrl} onChange={(e) => setIframeUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." />
                        <div className="flex gap-4 mt-4">
                            <Button onClick={handleAddIframe}>Add</Button>
                            <Button variant="outline" onClick={() => setShowIframeModal(false)}>Cancel</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditProject;
