import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPages() {
    const [pages, setPages] = useState([]);
    const [selectedPage, setSelectedPage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('edit');
    const [formData, setFormData] = useState({
        pageName: '',
        sections: [],
    });

    useEffect(() => {
        // Initialize with website pages
        const initialPages = [
            {
                id: 1,
                pageName: 'Home - Hero Section',
                key: 'home_hero',
                sections: {
                    title: 'Welcome to 6ixminds Labs',
                    subtitle: 'Empowering the Next Generation of Innovators',
                    description: 'Transform your career with cutting-edge internship programs',
                    buttonText: 'Explore Programs',
                    backgroundImage: '',
                },
                lastUpdated: new Date().toISOString(),
            },
            {
                id: 2,
                pageName: 'About - Mission & Vision',
                key: 'about_mission',
                sections: {
                    missionTitle: 'Our Mission',
                    missionText: 'To provide hands-on, industry-relevant training that bridges the gap between academic learning and professional requirements.',
                    visionTitle: 'Our Vision',
                    visionText: 'To be the leading platform for tech education, empowering students to build successful careers in technology.',
                },
                lastUpdated: new Date().toISOString(),
            },
            {
                id: 3,
                pageName: 'About - Company Info',
                key: 'about_info',
                sections: {
                    companyName: '6ixminds Labs',
                    foundedYear: '2025',
                    description: 'A premier tech education platform offering specialized internship programs in Web Development, AI/ML, IoT, and more.',
                    email: 'info@6ixmindslabs.com',
                    phone: '+91 9876543210',
                    address: 'Bangalore, India',
                },
                lastUpdated: new Date().toISOString(),
            },
            {
                id: 4,
                pageName: 'Services - Overview',
                key: 'services_overview',
                sections: {
                    title: 'Our Services',
                    subtitle: 'Comprehensive Tech Training Programs',
                    description: 'We offer industry-aligned internship programs designed to make you job-ready.',
                },
                lastUpdated: new Date().toISOString(),
            },
            {
                id: 5,
                pageName: 'Contact - Information',
                key: 'contact_info',
                sections: {
                    title: 'Get in Touch',
                    subtitle: 'Have questions? We\'d love to hear from you.',
                    email: 'contact@6ixmindslabs.com',
                    phone: '+91 9025873422, +91 9080534488',
                    address: 'Bangalore, Karnataka, India',
                    mapEmbedUrl: '',
                },
                lastUpdated: new Date().toISOString(),
            },
        ];
        setPages(initialPages);
    }, []);

    const handleEdit = (page) => {
        setSelectedPage(page);
        setFormData({ pageName: page.pageName, sections: page.sections });
        setModalMode('edit');
        setShowModal(true);
    };

    const handleView = (page) => {
        setSelectedPage(page);
        setModalMode('view');
        setShowModal(true);
    };

    const handleSectionChange = (key, value) => {
        setFormData({
            ...formData,
            sections: {
                ...formData.sections,
                [key]: value,
            },
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedPages = pages.map((page) =>
            page.id === selectedPage.id
                ? { ...page, sections: formData.sections, lastUpdated: new Date().toISOString() }
                : page
        );

        setPages(updatedPages);
        setShowModal(false);

        // TODO: API call to save changes
        alert('Page content updated successfully!');
    };

    const renderSectionFields = (sections) => {
        return Object.keys(sections).map((key) => (
            <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                {key.includes('description') || key.includes('Text') || key.includes('address') ? (
                    <textarea
                        value={formData.sections[key] || ''}
                        onChange={(e) => handleSectionChange(key, e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                ) : (
                    <input
                        type="text"
                        value={formData.sections[key] || ''}
                        onChange={(e) => handleSectionChange(key, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                )}
            </div>
        ));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Page Editor</h1>
                <p className="text-gray-600 mt-1">Edit website pages and content blocks</p>
            </div>

            {/* Pages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map((page) => (
                    <motion.div
                        key={page.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{page.pageName}</h3>
                                <p className="text-xs text-gray-500">
                                    Last updated: {new Date(page.lastUpdated).toLocaleDateString()} at{' '}
                                    {new Date(page.lastUpdated).toLocaleTimeString()}
                                </p>
                            </div>
                            <div className="text-3xl">📄</div>
                        </div>

                        {/* Preview sections */}
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 mb-2">Sections: {Object.keys(page.sections).length}</p>
                            <div className="space-y-1">
                                {Object.keys(page.sections).slice(0, 3).map((key) => (
                                    <p key={key} className="text-xs text-gray-600 truncate">
                                        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>{' '}
                                        {page.sections[key]?.toString().substring(0, 40)}...
                                    </p>
                                ))}
                                {Object.keys(page.sections).length > 3 && (
                                    <p className="text-xs text-purple-600 font-medium">
                                        +{Object.keys(page.sections).length - 3} more fields
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleView(page)}
                                className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                            >
                                👁️ View
                            </button>
                            <button
                                onClick={() => handleEdit(page)}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-sm font-medium"
                            >
                                ✏️ Edit
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl">📝</div>
                        <h3 className="text-lg font-bold text-purple-900">Total Pages</h3>
                    </div>
                    <p className="text-3xl font-bold text-purple-700">{pages.length}</p>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl">✅</div>
                        <h3 className="text-lg font-bold text-pink-900">Active Sections</h3>
                    </div>
                    <p className="text-3xl font-bold text-pink-700">
                        {pages.reduce((acc, page) => acc + Object.keys(page.sections).length, 0)}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl">🔄</div>
                        <h3 className="text-lg font-bold text-blue-900">Recent Updates</h3>
                    </div>
                    <p className="text-sm text-blue-700 font-medium">
                        {new Date(Math.max(...pages.map((p) => new Date(p.lastUpdated)))).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && selectedPage && (
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
                            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8"
                        >
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {modalMode === 'view' ? '👁️ View' : '✏️ Edit'} {selectedPage.pageName}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Last updated: {new Date(selectedPage.lastUpdated).toLocaleString()}
                                </p>
                            </div>

                            {modalMode === 'view' ? (
                                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                    {Object.keys(selectedPage.sections).map((key) => (
                                        <div key={key} className="border-b border-gray-100 pb-3">
                                            <p className="text-sm font-medium text-gray-500 capitalize mb-1">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                            </p>
                                            <p className="text-gray-900">{selectedPage.sections[key]}</p>
                                        </div>
                                    ))}
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
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                        <p className="text-sm text-blue-900">
                                            <strong>💡 Tip:</strong> Changes will be reflected on the website immediately after saving.
                                            Make sure to review your content before saving.
                                        </p>
                                    </div>

                                    {renderSectionFields(selectedPage.sections)}

                                    <div className="pt-4 flex gap-3 justify-end border-t border-gray-200 sticky bottom-0 bg-white">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
                                        >
                                            💾 Save Changes
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
