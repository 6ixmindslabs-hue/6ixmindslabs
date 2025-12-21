import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function Showcase() {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('All');
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3000');

    const categories = [
        'All',
        'Internship & Training',
        'Certificates & Achievements',
        'Wins & Recognition',
        'Clients & Collaborations',
        'Social Media Highlights'
    ];

    // Map long category names to short buttons
    const categoryLabels = {
        'All': 'All',
        'Internship & Training': 'Training',
        'Certificates & Achievements': 'Certificates',
        'Wins & Recognition': 'Wins',
        'Clients & Collaborations': 'Clients',
        'Social Media Highlights': 'Social'
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await fetch(`${API_URL}/api/showcase?public=true`);
            const data = await response.json();
            if (data.success) {
                setItems(data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = filter === 'All'
        ? items
        : items.filter(item => item.category === filter);

    const getPlatformIcon = (url) => {
        if (!url) return null;
        if (url.includes('youtube') || url.includes('youtu.be')) {
            return (
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
            );
        }
        if (url.includes('instagram')) {
            return (
                <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            );
        }
        if (url.includes('linkedin')) {
            return (
                <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
            );
        }
        return null;
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <section className="bg-white pt-24 pb-12 px-4 shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                            Showcase & Achievements
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Explore our journey, student success stories, and recognition in the tech world.
                        </p>
                    </motion.div>

                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${filter === cat
                                        ? 'bg-gray-900 text-white shadow-lg scale-105'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {categoryLabels[cat]}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No items found in this category.</p>
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                        {filteredItems.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -5 }}
                                onClick={() => setSelectedItem(item)}
                                className="break-inside-avoid bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group border border-gray-100"
                            >
                                <div className="relative overflow-hidden">
                                    {/* Image Ratio Wrapper - flexible but consistent feel */}
                                    {item.type === 'image' ? (
                                        <div className="aspect-[4/5] md:aspect-square relative">
                                            <img
                                                src={item.media_url}
                                                alt={item.title}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-video bg-gray-100 relative flex items-center justify-center">
                                            {/* Thumbnail placeholder or platform icon */}
                                            <div className="text-center">
                                                <div className="mb-2 flex justify-center">{getPlatformIcon(item.media_url)}</div>
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Video Content</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                        <p className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            {item.title}
                                        </p>
                                        <p className="text-white/80 text-sm mt-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                            Click to view
                                        </p>
                                    </div>

                                    {/* Type Icon Top Right */}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm">
                                        {item.type === 'video' ? (
                                            <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        ) : (
                                            <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        )}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">{categoryLabels[item.category]}</span>
                                        {getPlatformIcon(item.media_url)}
                                    </div>
                                    <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight">{item.title}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox / Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.button
                            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                            onClick={() => setSelectedItem(null)}
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </motion.button>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                        >
                            {/* Media Section */}
                            <div className="flex-1 bg-black flex items-center justify-center relative overflow-hidden">
                                {selectedItem.type === 'video' ? (
                                    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-900">
                                        {/* Simple Embed Implementation */}
                                        <div className="text-center p-8">
                                            <p className="text-white mb-4 text-lg">Watch this content on</p>
                                            <a
                                                href={selectedItem.media_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-3 px-8 py-3 bg-white text-black rounded-xl font-bold hover:scale-105 transition-transform"
                                            >
                                                {getPlatformIcon(selectedItem.media_url)}
                                                <span>Open Original Post</span>
                                            </a>
                                            <p className="text-gray-500 mt-4 text-sm">(External embeds are disabled for performance)</p>
                                        </div>
                                    </div>
                                ) : (
                                    <img
                                        src={selectedItem.media_url}
                                        alt={selectedItem.title}
                                        className="max-w-full max-h-[85vh] object-contain"
                                    />
                                )}
                            </div>

                            {/* Details Section */}
                            <div className="w-full md:w-96 bg-white p-8 flex flex-col overflow-y-auto">
                                <div>
                                    <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                                        {selectedItem.category}
                                    </span>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{selectedItem.title}</h2>
                                    <p className="text-gray-600 leading-relaxed mb-8">
                                        {selectedItem.description || "No description provided."}
                                    </p>
                                </div>

                                <div className="mt-auto pt-6 border-t border-gray-100">
                                    <p className="text-xs text-gray-400 font-bold uppercase mb-2">Share or Verify</p>
                                    <div className="flex gap-2">
                                        <a
                                            href={window.location.href}
                                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-center hover:bg-gray-50 transition-colors"
                                            onClick={(e) => { e.preventDefault(); navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }}
                                        >
                                            Copy Link
                                        </a>
                                        {selectedItem.type === 'video' && (
                                            <a
                                                href={selectedItem.media_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold text-center hover:bg-black transition-colors"
                                            >
                                                Open Post
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
