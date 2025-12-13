import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminMessages() {
    const [messages, setMessages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, new, read, replied
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const itemsPerPage = 10;
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3000');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_URL}/api/messages`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                // Sort by date descending
                setMessages(data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
            } else {
                console.error('Failed to fetch messages:', data.error);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_URL}/api/messages/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await response.json();
            if (data.success) {
                setMessages(messages.map(m => m.id === id ? { ...m, status: newStatus } : m));
                if (selectedMessage && selectedMessage.id === id) {
                    setSelectedMessage({ ...selectedMessage, status: newStatus });
                }
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleView = (message) => {
        setSelectedMessage(message);
        setShowModal(true);
        if (message.status === 'new') {
            handleStatusUpdate(message.id, 'read');
        }
    };

    // Filter Logic
    const filteredMessages = messages.filter((msg) => {
        const matchesSearch =
            msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.subject?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || msg.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const paginatedMessages = filteredMessages.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-800';
            case 'read': return 'bg-gray-100 text-gray-800';
            case 'replied': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                    <p className="text-gray-600 mt-1">Manage contact form inquiries</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchMessages}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Refresh"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, email, subject..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Messages Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Subject</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginatedMessages.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No messages found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedMessages.map((msg) => (
                                    <motion.tr
                                        key={msg.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={`hover:bg-gray-50 transition-colors ${msg.status === 'new' ? 'bg-blue-50/30' : ''}`}
                                    >
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getStatusColor(msg.status)}`}>
                                                {msg.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{msg.name}</div>
                                            <div className="text-xs text-gray-500">{msg.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 truncate max-w-xs">
                                            {msg.subject || 'No Subject'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-sm">
                                            {new Date(msg.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleView(msg)}
                                                className="text-purple-600 hover:text-purple-800 font-medium text-sm"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
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

            {/* View Modal */}
            <AnimatePresence>
                {showModal && selectedMessage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{selectedMessage.subject || 'No Subject'}</h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Received on {new Date(selectedMessage.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">From</p>
                                        <p className="text-gray-900 font-medium text-lg">{selectedMessage.name}</p>
                                        <a href={`mailto:${selectedMessage.email}`} className="text-purple-600 hover:underline">
                                            {selectedMessage.email}
                                        </a>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Phone</p>
                                        <p className="text-gray-900 font-medium">
                                            {selectedMessage.phone ? (
                                                <a href={`tel:${selectedMessage.phone}`} className="hover:text-purple-600">
                                                    {selectedMessage.phone}
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">Not provided</span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Message Body</p>
                                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                        {selectedMessage.message}
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-700">Mark as:</span>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedMessage.id, 'read')}
                                        className={`px-3 py-1 rounded text-sm border ${selectedMessage.status === 'read' ? 'bg-gray-200 border-gray-300' : 'bg-white border-gray-300 hover:bg-gray-50'}`}
                                    >
                                        Read
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedMessage.id, 'replied')}
                                        className={`px-3 py-1 rounded text-sm border ${selectedMessage.status === 'replied' ? 'bg-green-100 border-green-300 text-green-700' : 'bg-white border-gray-300 hover:bg-gray-50 text-green-600'}`}
                                    >
                                        Replied
                                    </button>
                                </div>
                                <div className="flex gap-3">
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Inquiry'}`}
                                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-sm font-medium flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Reply via Email
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
