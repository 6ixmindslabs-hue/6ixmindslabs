import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import internshipsData from '../../data/internships.json'; // REMOVED

export default function AdminInternships() {
    const [internships, setInternships] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDomain, setFilterDomain] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // create, edit, view
    const [selectedInternship, setSelectedInternship] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTimer, setDeleteTimer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        domain: '',
        duration: '',
        price: '',
        description: '',
        skills: [],
        projects: [],
        featured: false,
    });

    const itemsPerPage = 10;
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');

    useEffect(() => {
        fetchInternships();
    }, []);

    const fetchInternships = async () => {
        try {
            const response = await fetch(`${API_URL}/api/internships`);
            const data = await response.json();
            if (data.success) {
                setInternships(data.data);
            } else {
                console.error('Failed to fetch internships');
            }
        } catch (error) {
            console.error('Error fetching internships:', error);
        }
    };

    const domains = ['all', ...new Set(internships.map((i) => i.domain))];

    const filteredInternships = internships.filter((internship) => {
        const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDomain = filterDomain === 'all' || internship.domain === filterDomain;
        return matchesSearch && matchesDomain;
    });

    const paginatedInternships = filteredInternships.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredInternships.length / itemsPerPage);

    const handleCreate = () => {
        setModalMode('create');
        setSelectedInternship(null);
        setFormData({
            title: '',
            domain: '',
            duration: '',
            price: '',
            description: '',
            skills: [],
            projects: [],
            featured: false,
        });
        setShowModal(true);
    };

    const handleEdit = (internship) => {
        setModalMode('edit');
        setSelectedInternship(internship);
        setFormData(internship);
        setShowModal(true);
    };

    const handleView = (internship) => {
        setModalMode('view');
        setSelectedInternship(internship);
        setShowModal(true);
    };

    const handleDelete = (internship) => {
        setSelectedInternship(internship);
        setShowDeleteConfirm(true);

        // Start 30-second undo timer
        const timer = setTimeout(() => {
            performDelete(internship.id);
            setShowDeleteConfirm(false);
        }, 30000);

        setDeleteTimer(timer);
    };

    const performDelete = async (id) => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_URL}/api/internships/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setInternships(internships.filter((i) => i.id !== id));
            } else {
                console.error('Failed to delete internship:', data.error);
                // Maybe show alert, but this is background delete
            }
        } catch (error) {
            console.error('Error deleting internship:', error);
        }
    };

    const handleUndoDelete = () => {
        if (deleteTimer) {
            clearTimeout(deleteTimer);
            setDeleteTimer(null);
        }
        setShowDeleteConfirm(false);
        setSelectedInternship(null);
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
                response = await fetch(`${API_URL}/api/internships`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
            } else if (modalMode === 'edit') {
                response = await fetch(`${API_URL}/api/internships/${selectedInternship.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
            }

            const data = await response.json();
            if (data.success) {
                fetchInternships();
                setShowModal(false);
            } else {
                alert('Operation failed: ' + data.error);
            }
        } catch (error) {
            console.error('Error saving internship:', error);
            alert('Error saving internship');
        } finally {
            setLoading(false);
        }
    };

    const handleSeed = async () => {
        if (!confirm('Overwrite all internships with default data?')) return;
        setLoading(true);
        try {
            // Import dynamically
            const internshipsData = (await import('../../data/internships.json')).default;
            const token = localStorage.getItem('admin_token');

            const response = await fetch(`${API_URL}/api/internships/seed`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ data: internshipsData })
            });

            const data = await response.json();
            if (data.success) fetchInternships();
            else alert('Seed failed: ' + data.error);

        } catch (e) {
            console.error(e);
            alert('Seed error');
        } finally {
            setLoading(false);
        }
    }

    const handleArrayInput = (field, value) => {
        const array = value.split(',').map((item) => item.trim()).filter(Boolean);
        setFormData({ ...formData, [field]: array });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Internships</h1>
                    <p className="text-gray-600 mt-1">Manage all internship programs</p>
                </div>
                <div className="flex gap-2">
                    {internships.length === 0 && (
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
                        Add Internship
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
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
                                placeholder="Search internships..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Domain Filter */}
                    <div>
                        <select
                            value={filterDomain}
                            onChange={(e) => setFilterDomain(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            {domains.map((domain) => (
                                <option key={domain} value={domain}>
                                    {domain === 'all' ? 'All Domains' : domain}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                    <span>Showing {paginatedInternships.length} of {filteredInternships.length} internships</span>
                </div>
            </div>

            {/* Delete Undo Toast */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-6 right-6 z-50 bg-red-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-4"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <div>
                            <p className="font-medium">Deleting "{selectedInternship?.title}"</p>
                            <p className="text-sm opacity-90">Undo within 30 seconds</p>
                        </div>
                        <button
                            onClick={handleUndoDelete}
                            className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                        >
                            Undo
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Internships Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Domain</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Duration</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginatedInternships.map((internship) => (
                                <motion.tr
                                    key={internship.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <p className="font-medium text-gray-900">{internship.title}</p>
                                                <p className="text-sm text-gray-500">{internship.skills?.slice(0, 3).join(', ')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                            {internship.domain}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{internship.duration}</td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-gray-900">₹{internship.price}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {internship.featured ? (
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1 w-fit">
                                                ⭐ Featured
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                                Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleView(internship)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleEdit(internship)}
                                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(internship)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
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
            </div>

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
                                    {modalMode === 'create' ? '➕ Add New Internship' : modalMode === 'edit' ? '✏️ Edit Internship' : '👁️ View Internship'}
                                </h2>
                            </div>

                            {modalMode === 'view' ? (
                                <div className="p-6 space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">{selectedInternship?.title}</h3>
                                        <p className="text-gray-600">{selectedInternship?.description}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Domain</p>
                                            <p className="text-gray-900">{selectedInternship?.domain}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Duration</p>
                                            <p className="text-gray-900">{selectedInternship?.duration}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Price</p>
                                            <p className="text-gray-900">₹{selectedInternship?.price}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Status</p>
                                            <p className="text-gray-900">{selectedInternship?.featured ? 'Featured' : 'Active'}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-2">Skills</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedInternship?.skills?.map((skill, index) => (
                                                <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="pt-4 flex justify-end">
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
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
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Domain *</label>
                                            <input
                                                type="text"
                                                value={formData.domain}
                                                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
                                            <input
                                                type="text"
                                                value={formData.duration}
                                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="e.g., 2 Weeks / 1 Month"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                                            <input
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>

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

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
                                        <input
                                            type="text"
                                            value={formData.skills?.join(', ')}
                                            onChange={(e) => handleArrayInput('skills', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="React, Node.js, MongoDB"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="featured"
                                            checked={formData.featured}
                                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                        />
                                        <label htmlFor="featured" className="text-sm font-medium text-gray-700">
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
                                            {loading ? 'Saving...' : modalMode === 'create' ? 'Create Internship' : 'Update Internship'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
