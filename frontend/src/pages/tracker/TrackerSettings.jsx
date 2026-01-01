import { Settings as SettingsIcon, User, Lock, Bell, Database, Shield } from 'lucide-react';

export default function TrackerSettings() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your account and system preferences</p>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Settings */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-brand-purple/10 rounded-lg">
                            <User className="w-5 h-5 text-brand-purple" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Profile</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                            <input
                                type="text"
                                defaultValue="6ixminds Labs"
                                className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                            <input
                                type="email"
                                defaultValue="6ixmindslabs@gmail.com"
                                className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                            />
                        </div>
                        <button className="px-4 py-2 bg-brand-purple text-white rounded-xl text-sm font-medium hover:bg-brand-purple/90">
                            Update Profile
                        </button>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <Lock className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Security</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Current Password</label>
                            <input
                                type="password"
                                className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">New Password</label>
                            <input
                                type="password"
                                className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            />
                        </div>
                        <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700">
                            Change Password
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Bell className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { label: 'Email notifications', enabled: true },
                            { label: 'New intern enrollments', enabled: true },
                            { label: 'Payment reminders', enabled: false },
                            { label: 'Project updates', enabled: true },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                <button className={`w-12 h-6 rounded-full transition-colors ${item.enabled ? 'bg-brand-purple' : 'bg-gray-300'}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${item.enabled ? 'translate-x-7' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Database className="w-5 h-5 text-brand-pink" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">System</h3>
                    </div>
                    <div className="space-y-3">
                        <button className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-left text-sm font-medium text-gray-700 transition-colors">
                            Export All Data
                        </button>
                        <button className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-left text-sm font-medium text-gray-700 transition-colors">
                            Clear Cache
                        </button>
                        <button className="w-full p-3 bg-red-50 hover:bg-red-100 rounded-xl text-left text-sm font-medium text-red-600 transition-colors">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Session Info */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <Shield className="w-6 h-6 text-brand-purple mt-1" />
                    <div>
                        <h4 className="font-bold text-gray-800 mb-2">Session Control</h4>
                        <p className="text-sm text-gray-600">
                            Auto-logout is enabled for security. You will be logged out after 30 minutes of inactivity.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
