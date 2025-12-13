import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function AdminSettings() {
    const { user, changePassword } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [message, setMessage] = useState(null);
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match!' });
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setMessage({ type: 'error', text: 'Password must be at least 8 characters long!' });
            return;
        }

        const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);

        if (result.success) {
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
            setMessage({ type: 'error', text: result.error || 'Failed to change password' });
        }
    };

    const tabs = [
        { id: 'profile', name: 'Profile', icon: '👤' },
        { id: 'security', name: 'Security', icon: '🔒' },
        { id: 'api', name: 'API Settings', icon: '🔑' },
        { id: 'admins', name: 'Admin Users', icon: '👥' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Manage your admin account and preferences</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-4 text-sm font-medium transition-all flex items-center gap-2 ${activeTab === tab.id
                                        ? 'border-b-2 border-purple-600 text-purple-600'
                                        : 'text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-4xl text-white font-bold">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{user?.username}</h3>
                                    <p className="text-gray-600">{user?.email}</p>
                                    <p className="text-sm text-purple-600 mt-1 capitalize">Role: {user?.role}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                                    <input
                                        type="text"
                                        value={user?.username || ''}
                                        readOnly
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        readOnly
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                    <input
                                        type="text"
                                        value={user?.role || ''}
                                        readOnly
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 capitalize"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Created</label>
                                    <input
                                        type="text"
                                        value={new Date().toLocaleDateString()}
                                        readOnly
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Change Password */}
                            <div className="border border-gray-200 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                    Change Password
                                </h3>

                                {message && (
                                    <div
                                        className={`mb-4 p-4 rounded-lg ${message.type === 'success'
                                                ? 'bg-green-100 text-green-800 border border-green-200'
                                                : 'bg-red-100 text-red-800 border border-red-200'
                                            }`}
                                    >
                                        {message.text}
                                    </div>
                                )}

                                <form onSubmit={handlePasswordChange} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password *</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword.current ? 'text' : 'password'}
                                                value={passwordForm.currentPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            >
                                                {showPassword.current ? '👁️' : '👁️‍🗨️'}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password *</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword.new ? 'text' : 'password'}
                                                value={passwordForm.newPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            >
                                                {showPassword.new ? '👁️' : '👁️‍🗨️'}
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password *</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword.confirm ? 'text' : 'password'}
                                                value={passwordForm.confirmPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            >
                                                {showPassword.confirm ? '👁️' : '👁️‍🗨️'}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
                                    >
                                        Update Password
                                    </button>
                                </form>
                            </div>

                            {/* Two-Factor Authentication */}
                            <div className="border border-gray-200 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Two-Factor Authentication
                                </h3>
                                <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
                                <button className="px-6 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium">
                                    Enable 2FA (Coming Soon)
                                </button>
                            </div>

                            {/* IP Whitelist */}
                            <div className="border border-gray-200 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                    </svg>
                                    IP Address Restriction
                                </h3>
                                <p className="text-gray-600 mb-4">Restrict admin access to specific IP addresses</p>
                                <button className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                                    Configure IP Lock (Coming Soon)
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* API Settings Tab */}
                    {activeTab === 'api' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="border border-gray-200 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">API Configuration</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">API Base URL</label>
                                        <input
                                            type="text"
                                            defaultValue="https://api.6ixmindslabs.com"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">JWT Token Expiry (hours)</label>
                                        <input
                                            type="number"
                                            defaultValue="24"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                    <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
                                        Save API Settings
                                    </button>
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Rate Limiting</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Requests per Minute</label>
                                        <input
                                            type="number"
                                            defaultValue="100"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                                        <input
                                            type="number"
                                            defaultValue="5"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Admin Users Tab */}
                    {activeTab === 'admins' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-900">Admin Users</h3>
                                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-sm">
                                    ➕ Add Admin
                                </button>
                            </div>

                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Username</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                                            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        <tr>
                                            <td className="px-6 py-4 font-medium text-gray-900">{user?.username}</td>
                                            <td className="px-6 py-4 text-gray-600">{user?.email}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium capitalize">
                                                    {user?.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-sm text-gray-500">You</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-900">
                                    <strong>Note:</strong> Only super-admin users can create or modify other admin accounts. Contact your system administrator for access.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
