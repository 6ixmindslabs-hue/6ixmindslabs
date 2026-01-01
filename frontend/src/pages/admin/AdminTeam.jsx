import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import teamData from '../../data/team.json';

export default function AdminTeam() {
    const [teamMembers, setTeamMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedMember, setSelectedMember] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        title: '',
        microBio: '',
        fullBio: '',
        photo: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        twitter: '',
        order: 0,
        active: true,
    });
    const [seeding, setSeeding] = useState(false);

    const itemsPerPage = 9;
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const fetchTeamMembers = async () => {
        try {
            const response = await fetch(`${API_URL}/api/team`);
            const data = await response.json();
            if (data.success) {
                setTeamMembers(data.data);
            } else {
                console.error('Failed to fetch team members:', data.error);
            }
        } catch (error) {
            console.error('Error fetching team members:', error);
        }
    };

    const handleSeedData = async () => {
        if (!confirm('This will overwrite existing data with the default team data. Continue?')) return;

        setSeeding(true);
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_URL}/api/team/seed`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ data: teamData })
            });
            const data = await response.json();
            if (data.success) {
                alert('Team data seeded successfully!');
                fetchTeamMembers();
            } else {
                alert('Failed to seed data: ' + data.error);
            }
        } catch (error) {
            console.error('Error seeding data:', error);
            alert('Error seeding data');
        } finally {
            setSeeding(false);
        }
    };

    const filteredMembers = teamMembers.filter((member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedMembers = filteredMembers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

    const handleCreate = () => {
        setModalMode('create');
        setSelectedMember(null);
        setImagePreview('');
        setFormData({
            name: '',
            role: '',
            title: '',
            microBio: '',
            fullBio: '',
            photo: '',
            email: '',
            phone: '',
            linkedin: '',
            github: '',
            twitter: '',
            order: teamMembers.length + 1,
            active: true,
        });
        setShowModal(true);
    };

    const handleEdit = (member) => {
        setModalMode('edit');
        setSelectedMember(member);
        setFormData(member);
        setImagePreview(member.photo);
        setShowModal(true);
    };

    const handleView = (member) => {
        setModalMode('view');
        setSelectedMember(member);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this team member?')) {
            try {
                const token = localStorage.getItem('admin_token');
                const response = await fetch(`${API_URL}/api/team/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                if (data.success) {
                    setTeamMembers(teamMembers.filter((m) => m._id !== id));
                } else {
                    alert('Failed to delete member: ' + data.error);
                }
            } catch (error) {
                console.error('Error deleting member:', error);
                alert('Error deleting member');
            }
        }
    };

    // Updated to resize images for Vercel/Serverless limits
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Resize to max 600px width (Team photos are small usually)
                const { resizeImage } = await import('../../utils/imageResizer');
                const resizedDataUrl = await resizeImage(file, 600, 0.8);

                setImagePreview(resizedDataUrl);
                setFormData({ ...formData, photo: resizedDataUrl });
            } catch (error) {
                console.error("Image processing failed", error);
                alert("Failed to process image");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('admin_token');

        try {
            let response;
            const url = modalMode === 'create'
                ? `${API_URL}/api/team`
                : `${API_URL}/api/team/${selectedMember._id}`;

            const method = modalMode === 'create' ? 'POST' : 'PUT';

            let body = { ...formData };
            if (modalMode === 'create') {
                delete body.id;
                delete body._id;
            }

            console.log(`Submitting to: ${url}`); // Debug log

            response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            // Check for non-JSON responses (like 404 HTML from Vercel)
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                throw new Error(`API returned non-JSON response (${response.status} ${response.statusText}). URL: ${url}. Preview: ${text.substring(0, 50)}...`);
            }

            const data = await response.json();

            if (data.success) {
                if (modalMode === 'create') {
                    setTeamMembers([...teamMembers, data.data]);
                } else {
                    setTeamMembers(teamMembers.map((m) => (m._id === data.data._id ? data.data : m)));
                }
                setShowModal(false);
            } else {
                throw new Error(data.error || 'Operation failed');
            }
        } catch (error) {
            console.error('Error saving member:', error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
                    <p className="text-gray-600 mt-1">Manage your team members and their profiles</p>
                </div>
                <div className="flex gap-2">
                    {teamMembers.length === 0 && (
                        <button
                            onClick={handleSeedData}
                            disabled={seeding}
                            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
                        >
                            {seeding ? 'Seeding...' : '📥 Initialize Default Data'}
                        </button>
                    )}
                    <button
                        onClick={handleCreate}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Team Member
                    </button>
                </div>
            </div>

            {/* Info Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-900">
                    <strong>💡 Real-time Sync:</strong> Changes made here will automatically appear on your website's team page!
                </p>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
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
                        placeholder="Search by name or role..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedMembers.map((member) => (
                    <motion.div
                        key={member._id || member.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all"
                    >
                        {/* Photo */}
                        <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100">
                            {member.photo ? (
                                <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <svg className="w-20 h-20 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                            {!member.active && (
                                <div className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                                    Inactive
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="p-5">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                            <p className="text-sm text-purple-600 font-medium mb-3">{member.role}</p>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{member.microBio || member.bio}</p>

                            {/* Social Links */}
                            <div className="flex gap-2 mb-4">
                                {member.linkedin && (
                                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                    </a>
                                )}
                                {member.github && (
                                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                    </a>
                                )}
                                {member.twitter && (
                                    <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-600">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                                    </a>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => handleView(member)}
                                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                >
                                    View
                                </button>
                                <button
                                    onClick={() => handleEdit(member)}
                                    className="flex-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(member._id)}
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
                                    {modalMode === 'create' ? '👤 Add Team Member' : modalMode === 'edit' ? '✏️ Edit Team Member' : '👁️ View Team Member'}
                                </h2>
                            </div>

                            {modalMode === 'view' ? (
                                <div className="p-6 space-y-4">
                                    {selectedMember?.photo && (
                                        <div className="flex justify-center">
                                            <img src={selectedMember.photo} alt={selectedMember.name} className="w-32 h-32 rounded-full object-cover" />
                                        </div>
                                    )}
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold text-gray-900">{selectedMember?.name}</h3>
                                        <p className="text-purple-600 font-medium mt-1">{selectedMember?.role}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Bio</p>
                                        <p className="text-gray-900">{selectedMember?.bio}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Email</p>
                                            <p className="text-gray-900">{selectedMember?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Phone</p>
                                            <p className="text-gray-900">{selectedMember?.phone || 'N/A'}</p>
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
                                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                    {/* Photo Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                                        <div className="flex items-center gap-4">
                                            {imagePreview && (
                                                <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-full object-cover" />
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Role (Short) *</label>
                                            <input
                                                type="text"
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="e.g., Senior Developer"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Title (Full) *</label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="e.g., Senior Developer - Frontend"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Short Bio (Card) *</label>
                                        <textarea
                                            value={formData.microBio || formData.bio}
                                            onChange={(e) => setFormData({ ...formData, microBio: e.target.value, bio: e.target.value })}
                                            rows={2}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Bio (Modal) *</label>
                                        <textarea
                                            value={formData.fullBio}
                                            onChange={(e) => setFormData({ ...formData, fullBio: e.target.value })}
                                            rows={4}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                                            <input
                                                type="url"
                                                value={formData.linkedin}
                                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="https://linkedin.com/in/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                                            <input
                                                type="url"
                                                value={formData.github}
                                                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="https://github.com/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
                                            <input
                                                type="url"
                                                value={formData.twitter}
                                                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="https://twitter.com/..."
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                                            <input
                                                type="number"
                                                value={formData.order}
                                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                min="1"
                                            />
                                        </div>
                                        <div className="flex items-center pt-7">
                                            <input
                                                type="checkbox"
                                                id="active"
                                                checked={formData.active}
                                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                            />
                                            <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-700">
                                                Active (Show on website)
                                            </label>
                                        </div>
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
                                            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                                        >
                                            {modalMode === 'create' ? 'Add Member' : 'Update Member'}
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
