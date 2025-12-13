import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: '📊', exact: true },
        { name: 'Internships', path: '/admin/internships', icon: '🎓' },
        { name: 'Projects', path: '/admin/projects', icon: '💼' },
        { name: 'Certificates', path: '/admin/certificates', icon: '📜' },
        { name: 'Team', path: '/admin/team', icon: '👥' },
        { name: 'Pages', path: '/admin/pages', icon: '📄' },
        { name: 'Messages', path: '/admin/messages', icon: '✉️' },
        { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
        { name: 'Audit Logs', path: '/admin/logs', icon: '📋' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } bg-white border-r border-gray-200 shadow-xl`}
                style={{ width: '280px' }}
            >
                <div className="h-full px-4 py-6 overflow-y-auto">
                    {/* Logo */}
                    <div className="flex items-center justify-between mb-6 px-2">
                        <div>
                            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                6ixminds Labs
                            </h2>
                            <p className="text-xs text-gray-500">Admin Panel</p>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{user?.username}</p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.exact}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${isActive
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                        : 'text-gray-700 hover:bg-purple-50'
                                    }`
                                }
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Logout Button */}
                    <div className="mt-auto pt-6 border-t border-gray-200">
                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all group"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`transition-all ${sidebarOpen ? 'ml-[280px]' : 'ml-0'}`}>
                {/* Header */}
                <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* Visit Website */}
                            <a
                                href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Visit Website
                            </a>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowLogoutModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                        >
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Logout</h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    Are you sure you want to logout? You'll need to sign in again to access the admin panel.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowLogoutModal(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
