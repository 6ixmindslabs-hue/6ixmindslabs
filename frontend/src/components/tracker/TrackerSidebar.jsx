
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    GraduationCap,
    Building2,
    Briefcase,
    Package,
    CreditCard,
    Wallet,
    BookOpen,
    BarChart2,
    FileText,
    Settings,
    LogOut,
    LogOut,
    Hexagon,
    MessageSquare
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTrackerAuth } from '../../contexts/TrackerAuthContext';

export default function TrackerSidebar() {
    const { signOut } = useTrackerAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');

    useEffect(() => {
        fetchUnreadCount();
        // Poll every minute
        const interval = setInterval(fetchUnreadCount, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            // If we don't have a token, we might not be able to fetch, but let's try or fail silently
            if (!token) return;

            const response = await fetch(`${API_URL}/api/messages`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                const count = data.data.filter(m => m.status === 'new').length;
                setUnreadCount(count);
            }
        } catch (error) {
            console.error('Error fetching unread messages:', error);
        }
    };

    const navItems = [
        { name: 'Dashboard', path: '/tracker/dashboard', icon: LayoutDashboard },

        { section: 'OPERATIONS' },
        { name: 'Training', path: '/tracker/training', icon: GraduationCap },
        { name: 'Messages', path: '/tracker/messages', icon: MessageSquare, badge: unreadCount },
        { name: 'Clients', path: '/tracker/clients', icon: Building2 },
        { name: 'Products', path: '/tracker/products', icon: Package },

        { section: 'FINANCE' },
        { name: 'Intern Payments', path: '/tracker/payments/interns', icon: CreditCard },
        { name: 'Client Payments', path: '/tracker/payments/clients', icon: Wallet },
        { name: 'Revenue Ledger', path: '/tracker/finance/ledger', icon: BookOpen },

        { section: 'SYSTEM' },
        { name: 'Settings', path: '/tracker/settings', icon: Settings },
    ];

    return (
        <div className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 shadow-sm z-20">
            <div className="p-6 border-b border-gray-50 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-brand-purple to-brand-pink rounded-xl flex items-center justify-center shadow-lg shadow-brand-purple/20">
                    <Hexagon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="font-bold text-gray-800 tracking-tight leading-none text-lg">6IXMINDS</h2>
                    <span className="text-[10px] text-brand-purple font-bold tracking-widest uppercase">Labs Tracker</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-hide">
                {navItems.map((item, index) => {
                    if (item.section) {
                        return (
                            <div key={index} className="pt-6 pb-2 px-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.section}</p>
                            </div>
                        );
                    }

                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                        >
                            {({ isActive }) => (
                                <div className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group duration-300
                                    ${isActive
                                        ? 'bg-brand-purple/5 text-brand-purple shadow-sm ring-1 ring-brand-purple/10'
                                        : 'hover:bg-gray-50 text-gray-500 hover:text-gray-900'}
                                `}>
                                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-brand-purple' : 'text-gray-400'}`} />
                                    <span className="flex-1">{item.name}</span>
                                    {item.badge > 0 && (
                                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <button
                    onClick={signOut}
                    className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Disconnect
                </button>
            </div>
        </div>
    );
}
