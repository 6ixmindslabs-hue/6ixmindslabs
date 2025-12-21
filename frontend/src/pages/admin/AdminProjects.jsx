import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import projectsData from '../../data/projects.json'; // REMOVED

export default function AdminProjects() {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedProject, setSelectedProject] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        image: '',
        tags: [],
        github: '',
        liveDemo: '',
        featured: false,
    });
    const [loading, setLoading] = useState(false); // added loading state

    const itemsPerPage = 9;
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3000');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch(`${API_URL}/api/projects`);
            const data = await response.json();
            if (data.success) {
                setProjects(data.data);
            } else {
                console.error('Failed to fetch projects');
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const categories = ['all', ...new Set(projects.map((p) => p.category))];

    const filteredProjects = projects.filter((project) => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const paginatedProjects = filteredProjects.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

    const handleCreate = () => {
        setModalMode('create');
        setSelectedProject(null);
        setImagePreview('');
        setFormData({
            title: '',
            category: '',
            description: '',
            image: '',
            tags: [],
            github: '',
            liveDemo: '',
            featured: false,
        });
        setShowModal(true);
    };

    const handleEdit = (project) => {
        setModalMode('edit');
        setSelectedProject(project);
        setFormData(project);
        setImagePreview(project.image);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this project?')) {
            try {
                const token = localStorage.getItem('admin_token');
                const response = await fetch(`${API_URL}/api/projects/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setProjects(projects.filter((p) => p.id !== id));
                } else {
                    alert('Failed to delete: ' + data.error);
                }
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Resize to max 800px width for projects
                const { resizeImage } = await import('../../utils/imageResizer');
                const resizedDataUrl = await resizeImage(file, 800, 0.85);

                setImagePreview(resizedDataUrl);
                setFormData({ ...formData, image: resizedDataUrl });
            } catch (error) {
                console.error("Image processing error", error);
                alert("Image processing failed");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('admin_token');

        try {
            let response;
            const slug = formData.title.toLowerCase().replace(/\s+/g, '-');
            const payload = { ...formData, slug };

            if (modalMode === 'create') {
                response = await fetch(`${API_URL}/api/projects`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
            } else if (modalMode === 'edit') {
                response = await fetch(`${API_URL}/api/projects/${selectedProject.id}`, {
                    method: 'PUT', // or PATCH
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
            }

            const data = await response.json();
            if (data.success) {
                fetchProjects(); // Reload list
                setShowModal(false);
            } else {
                alert('Operation failed: ' + data.error);
            }
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Error saving project');
        } finally {
            setLoading(false);
        }
    };

    const handleArrayInput = (field, value) => {
        const array = value.split(',').map((item) => item.trim()).filter(Boolean);
        setFormData({ ...formData, [field]: array });
    };

    // Need to handle initialization from Seed/JSON if empty?
    // Maybe add a seed button like Team section?
    const handleSeed = async () => {
        if (!confirm('Overwrite all projects with default data?')) return;
        setLoading(true);
        try {
            // Import dynamically or fetch from a known location
            // For now assume backend knows how to seed if we just call /seed with nothing? 
            // Or send the data file. 
            // backend projects.js route expects body.data
            // Let's import the json here to send it.
            const projectsData = (await import('../../data/projects.json')).default;
            const token = localStorage.getItem('admin_token');

            const response = await fetch(`${API_URL}/api/projects/seed`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ data: projectsData })
            });

            const data = await response.json();
            if (data.success) fetchProjects();
            else alert('Seed failed: ' + data.error);

        } catch (e) {
            console.error(e);
            alert('Seed error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                    <p className="text-gray-600 mt-1">Manage your portfolio projects</p>
                </div>
                <div className="flex gap-2">
                    {/* Seed Button only if empty */}
                    {projects.length === 0 && (
                        <button
                            onClick={handleSeed}
                            disabled={loading}
                            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
                        >
                            {loading ? 'Seeding...' : '📥 Initialize Defaults'}
                        </button>
                    )}
                    <button
                        onClick={handleCreate}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Project
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search projects..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category === 'all' ? 'All Categories' : category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProjects.map((project) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all group"
                    >
                        <div className="relative h-48 overflow-hidden bg-gray-100">
                            {project.image ? (
                                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                            {project.featured && (
                                <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
                                    ⭐ Featured
                                </div>
                            )}
                        </div>

                        <div className="p-5">
                            <div className="mb-3">
                                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{project.title}</h3>
                                <p className="text-sm text-purple-600 font-medium">{project.category}</p>
                            </div>

                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.tags?.slice(0, 3).map((tag, index) => (
                                    <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => handleEdit(project)}
                                    className="flex-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8"
                        >
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {modalMode === 'create' ? '➕ Add New Project' : '✏️ Edit Project'}
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                        <input
                                            type="text"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="e.g., Web, Web + IoT, Mobile"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Project Image
                                            <span className="text-xs text-gray-500 ml-2">(Upload or URL)</span>
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                        />
                                    </div>
                                </div>

                                {imagePreview && (
                                    <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Live Demo URL</label>
                                        <input
                                            type="url"
                                            value={formData.liveDemo}
                                            onChange={(e) => setFormData({ ...formData, liveDemo: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={formData.tags?.join(', ')}
                                        onChange={(e) => handleArrayInput('tags', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="React, Node.js, MongoDB"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="projectFeatured"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                    />
                                    <label htmlFor="projectFeatured" className="text-sm font-medium text-gray-700">
                                        Mark as Featured
                                    </label>
                                </div>

                                <div className="pt-4 flex gap-3 justify-end border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : modalMode === 'create' ? 'Create Project' : 'Update Project'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
