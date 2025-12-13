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

    useEffect(() => {
        // Load stats from data files
        loadStats();
        loadRecentActivity();
    }, []);

    const loadStats = async () => {
        try {
            const internshipsData = await import('../../data/internships.json');
            const projectsData = await import('../../data/projects.json');
            const certificatesData = await import('../../data/certificates.json');

            // Fetch team count from API
            let teamCount = 0;
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                const teamResponse = await fetch(`${API_URL}/api/team`);
                const teamData = await teamResponse.json();
                if (teamData.success) {
                    teamCount = teamData.count;
                }
            } catch (err) {
                console.error('Error fetching team count:', err);
            }

            setStats({
                internships: internshipsData.default.length,
                projects: projectsData.default.length,
                certificates: certificatesData.default.length,
                unreadMessages: 12, // Mock data
                totalTeamMembers: teamCount,
                totalPages: 6, // Mock data
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const loadRecentActivity = () => {
        // Mock recent activity
        setRecentActivity([
            { id: 1, type: 'certificate', message: 'New certificate issued to Rahul Kumar', time: '2 hours ago', icon: '📜' },
            { id: 2, type: 'message', message: 'New contact message from potential client', time: '3 hours ago', icon: '✉️' },
            { id: 3, type: 'project', message: 'Project "Bus Tracker" was updated', time: '5 hours ago', icon: '💼' },
            { id: 4, type: 'internship', message: 'Web Development internship enrolled: 5 new students', time: '1 day ago', icon: '🎓' },
        ]);
    };

    const kpiCards = [
        {
            title: 'Total Internships',
            value: stats.internships,
            change: '+2 this month',
            changeType: 'positive',
            icon: '🎓',
            color: 'from-purple-500 to-purple-600',
            link: '/admin/internships',
        },
        {
            title: 'Total Projects',
            value: stats.projects,
            change: '+1 this week',
            changeType: 'positive',
            icon: '💼',
            color: 'from-pink-500 to-pink-600',
            link: '/admin/projects',
        },
        {
            title: 'Certificates Issued',
            value: stats.certificates,
            change: '+8 this month',
            changeType: 'positive',
            icon: '📜',
            color: 'from-blue-500 to-blue-600',
            link: '/admin/certificates',
        },
        {
            title: 'Unread Messages',
            value: stats.unreadMessages,
            change: '3 today',
            changeType: 'neutral',
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
                </div>
                <div className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleString()}
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
                                        <p className={`text-xs font-medium ${card.changeType === 'positive' ? 'text-green-600' : 'text-gray-600'
                                            }`}>
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
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.name}
                            to={action.link}
                            className={`p-4 rounded-lg border-2 border-${action.color}-200 bg-${action.color}-50 hover:bg-${action.color}-100 transition-all text-center group`}
                        >
                            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform inline-block">
                                {action.icon}
                            </div>
                            <p className={`text-sm font-medium text-${action.color}-900`}>{action.name}</p>
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* Recent Activity & Analytics */}
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
                            View All
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="text-2xl">{activity.icon}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900">{activity.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* System Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">System Status</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-900">Website Status</span>
                            </div>
                            <span className="text-sm text-green-600 font-medium">Online</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-900">Database</span>
                            </div>
                            <span className="text-sm text-green-600 font-medium">Connected</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-900">Storage Used</span>
                            </div>
                            <span className="text-sm text-blue-600 font-medium">2.4 GB / 10 GB</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-900">API Calls Today</span>
                            </div>
                            <span className="text-sm text-purple-600 font-medium">1,247</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Analytics Chart Placeholder */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Overview</h2>
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                    <div className="text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <p className="text-gray-600">Analytics chart coming soon...</p>
                        <p className="text-sm text-gray-500 mt-1">Integration with Chart.js or D3.js recommended</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
