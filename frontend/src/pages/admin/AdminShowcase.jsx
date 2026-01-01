import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminShowcase() {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        category: 'Internship & Training',
        type: 'image',
        videoUrl: '',
        description: '',
        status: 'published',
    });
    const [imageFile, setImageFile] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
    const CATEGORIES = [
        'Internship & Training',
        'Certificates & Achievements',
        'Wins & Recognition',
        'Clients & Collaborations',
        'Social Media Highlights'
    ];

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_URL}/api/showcase?view=admin`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setItems(data.data);
            } else {
                console.error('Failed to fetch items:', data.error);
            }
        } catch (err) {
            console.error('Error fetching items:', err);
        } finally {
            setLoading(false);
        }
    }

    const filteredItems = items.filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            item.title.toLowerCase().includes(searchLower) ||
            item.category.toLowerCase().includes(searchLower)
        );
    });

    const handleCreate = () => {
        setModalMode('create');
        setSelectedItem(null);
        setFormData({
            title: '',
            category: 'Internship & Training',
            type: 'image',
            videoUrl: '',
            description: '',
            status: 'published',
        });
        setImageFile(null);
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setModalMode('edit');
        setSelectedItem(item);
        setFormData({
            title: item.title,
            category: item.category,
            type: item.type,
            videoUrl: item.type === 'video' ? item.media_url : '',
            description: item.description || '',
            status: item.status,
        });
        setImageFile(null);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this item? This cannot be undone.')) {
            try {
                const token = localStorage.getItem('admin_token');
                const response = await fetch(`${API_URL}/api/showcase/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setItems(items.filter((item) => item.id !== id));
                } else {
                    alert('Delete failed: ' + data.error);
                }
            } catch (err) {
                console.error(err);
                alert('Delete error');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.type === 'image' && modalMode === 'create' && !imageFile) {
            alert('Please upload an image');
            return;
        }
        if (formData.type === 'video' && !formData.videoUrl) {
            alert('Please enter a video URL');
            return;
        }

        setSaving(true);
        const token = localStorage.getItem('admin_token');

        try {
            const dataToSend = new FormData();
            dataToSend.append('title', formData.title);
            dataToSend.append('category', formData.category);
            dataToSend.append('type', formData.type);
            dataToSend.append('description', formData.description);
            dataToSend.append('status', formData.status);

            if (formData.type === 'video') {
                dataToSend.append('videoUrl', formData.videoUrl);
            } else if (imageFile) {
                dataToSend.append('image', imageFile);
            }

            const url = modalMode === 'edit'
                ? `${API_URL}/api/showcase/${selectedItem.id}`
                : `${API_URL}/api/showcase`;
            const method = modalMode === 'edit' ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: dataToSend
            });

            const data = await response.json();
            if (data.success) {
                fetchItems();
                setShowModal(false);
                alert(modalMode === 'edit' ? 'Item updated!' : 'Item added!');
            } else {
                alert(`Failed: ` + data.error);
            }
        } catch (error) {
            console.error('Error saving item:', error);
            alert('Error saving item');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 p-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Showcase Manager</h1>
                    <p className="text-gray-600 mt-1">Manage public showcase items, achievements, and gallery</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Item
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">Showcase Items</h3>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500 font-bold">
                            <tr>
                                <th className="px-6 py-4">Preview</th>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                            {item.type === 'image' ? (
                                                <img src={item.media_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-red-500">
                                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">{item.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-semibold">{item.category}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {modalMode === 'create' ? 'Add New Item' : 'Edit Item'}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/50 rounded-full transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="p-8 max-h-[80vh] overflow-y-auto">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                                            placeholder="Item Title"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
                                            <select
                                                required
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                                            >
                                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Type *</label>
                                            <select
                                                required
                                                value={formData.type}
                                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                                            >
                                                <option value="image">Image</option>
                                                <option value="video">Video Embed</option>
                                            </select>
                                        </div>
                                    </div>

                                    {formData.type === 'image' ? (
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Image {modalMode === 'create' ? '*' : '(Leave empty to keep current)'}
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                required={modalMode === 'create'}
                                                onChange={e => setImageFile(e.target.files[0])}
                                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                            />
                                            {modalMode === 'edit' && selectedItem.media_url && !imageFile && (
                                                <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                                                    <img src={selectedItem.media_url} alt="Current" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Video URL (YouTube/Insta/LinkedIn) *</label>
                                            <input
                                                type="url"
                                                required
                                                value={formData.videoUrl}
                                                onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Short Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                                            placeholder="Max 2 lines..."
                                        />
                                    </div>

                                    <div>
                                        <label className="inline-flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={formData.status === 'published'}
                                                onChange={e => setFormData({ ...formData, status: e.target.checked ? 'published' : 'hidden' })}
                                                className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                            />
                                            <span className="font-medium text-gray-900">Publish Immediately</span>
                                        </label>
                                    </div>

                                    <div className="pt-6 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="flex-[2] px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                        >
                                            {saving ? (
                                                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Saving...</>
                                            ) : (modalMode === 'edit' ? 'Update Item' : 'Add Item')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
