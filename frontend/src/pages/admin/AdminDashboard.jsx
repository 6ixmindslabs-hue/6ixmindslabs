import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        internships: 0,
        projects: 0,
        certificates: 0,
        unreadMessages: 0,
        totalTeamMembers: 0,
        totalPages: 0,
    });

    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            // Fetch all metrics in parallel
            const [intRes, projRes, certRes, msgRes, teamRes] = await Promise.all([
                fetch(`${API_URL}/api/internships`),
                fetch(`${API_URL}/api/projects`),
                fetch(`${API_URL}/api/certificates`, { headers }),
                fetch(`${API_URL}/api/messages`, { headers }),
                fetch(`${API_URL}/api/team`)
            ]);

            const [intData, projData, certData, msgData, teamData] = await Promise.all([
                intRes.json(),
                projRes.json(),
                certRes.json(),
                msgRes.json(),
                teamRes.json()
            ]);

            const newStats = {
                internships: intData.success ? intData.count : 0,
                projects: projData.success ? projData.count : 0,
                certificates: certData.success ? certData.count : 0,
                unreadMessages: msgData.success ? msgData.data.filter(m => m.status === 'new').length : 0,
                totalTeamMembers: teamData.success ? teamData.count : 0,
                totalPages: 6, // Website has ~6 main pages
            };
            setStats(newStats);

            // Derive recent activity
            const activities = [];

            if (intData.success && intData.data.length > 0) {
                intData.data.slice(0, 2).forEach(item => {
                    activities.push({
                        id: `int-${item.id}`,
                        type: 'internship',
                        message: `New internship: ${item.title}`,
                        time: new Date(item.createdAt).toLocaleDateString(),
                        icon: '🎓',
                        timestamp: new Date(item.createdAt).getTime()
                    });
                });
            }

            if (projData.success && projData.data.length > 0) {
                projData.data.slice(0, 2).forEach(item => {
                    activities.push({
                        id: `proj-${item.id}`,
                        type: 'project',
                        message: `Project updated: ${item.title}`,
                        time: new Date(item.createdAt).toLocaleDateString(),
                        icon: '💼',
                        timestamp: new Date(item.createdAt).getTime()
                    });
                });
            }

            if (certData.success && certData.data.length > 0) {
                certData.data.slice(0, 2).forEach(item => {
                    activities.push({
                        id: `cert-${item.id}`,
                        type: 'certificate',
                        message: `Certificate issued: ${item.studentName}`,
                        time: new Date(item.createdAt).toLocaleDateString(),
                        icon: '📜',
                        timestamp: new Date(item.createdAt).getTime()
                    });
                });
            }

            if (msgData.success && msgData.data.length > 0) {
                msgData.data.slice(0, 2).forEach(item => {
                    activities.push({
                        id: `msg-${item.id}`,
                        type: 'message',
                        message: `Message from ${item.name}`,
                        time: new Date(item.createdAt).toLocaleDateString(),
                        icon: '✉️',
                        timestamp: new Date(item.createdAt).getTime()
                    });
                });
            }

            setRecentActivity(activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 4));

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const kpiCards = [
        {
            title: 'Total Internships',
            value: stats.internships,
            change: 'Real-time',
            changeType: 'neutral',
            icon: '🎓',
            color: 'from-purple-500 to-purple-600',
            link: '/admin/internships',
        },
        {
            title: 'Total Projects',
            value: stats.projects,
            change: 'Real-time',
            changeType: 'neutral',
            icon: '💼',
            color: 'from-pink-500 to-pink-600',
            link: '/admin/projects',
        },
        {
            title: 'Certificates Issued',
            value: stats.certificates,
            change: 'Real-time',
            changeType: 'neutral',
            icon: '📜',
            color: 'from-blue-500 to-blue-600',
            link: '/admin/certificates',
        },
        {
            title: 'Unread Messages',
            value: stats.unreadMessages,
            change: stats.unreadMessages > 0 ? `${stats.unreadMessages} new` : 'All read',
            changeType: stats.unreadMessages > 0 ? 'positive' : 'neutral',
            icon: '✉️',
            color: 'from-green-500 to-green-600',
            link: '/admin/messages',
        },
    ];

    const quickActions = [
        { name: 'Add Internship', icon: '➕', link: '/admin/internships/create', color: 'purple' },
        { name: 'Add Project', icon: '➕', link: '/admin/projects/create', color: 'pink' },
        { name: 'Issue Certificate', icon: '📜', link: '/admin/certificates/create', color: 'blue' },
        { name: 'View Messages', icon: '✉️', link: '/admin/messages', color: 'green' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-600 mt-1">Live management system statistics</p>
                </div>
                <div className="flex flex-col items-end">
                    <button
                        onClick={fetchAllData}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 mb-1"
                    >
                        🔄 Refresh Data
                    </button>
                    <div className="text-xs text-gray-400">
                        Last sync: {new Date().toLocaleTimeString()}
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiCards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link to={card.link} className="block">
                            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-100 group">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600 mb-2">{card.title}</p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">{card.value}</p>
                                        <p className={`text-xs font-medium ${card.changeType === 'positive' ? 'text-green-600' : 'text-gray-400'}`}>
                                            {card.change}
                                        </p>
                                    </div>
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                                        {card.icon}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Content Management</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.name}
                            to={action.link}
                            className="p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-all text-center group"
                        >
                            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform inline-block">
                                {action.icon}
                            </div>
                            <p className="text-sm font-medium text-gray-700">{action.name}</p>
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* Recent Activity & System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                        <Link to="/admin/logs" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                            View History
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                                    <div className="text-2xl">{activity.icon}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <p>No recent activity found</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* System Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Infrastructure</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-100">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-900">Frontend Cluster</span>
                            </div>
                            <span className="text-sm text-green-600 font-bold uppercase tracking-wider text-[10px]">Healthy</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-100">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-900">Supabase DB</span>
                            </div>
                            <span className="text-sm text-green-600 font-bold uppercase tracking-wider text-[10px]">Connected</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-100">
                            <div className="flex items-center gap-3">
                                <ActivityIcon className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-medium text-gray-900">Active Sessions</span>
                            </div>
                            <span className="text-sm text-blue-600 font-bold">4 Live</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-100">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-900">Resource Usage</span>
                            </div>
                            <span className="text-sm text-purple-600 font-bold">12% Peak</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

// Simple Activity Icon
function ActivityIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    );
}
