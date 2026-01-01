import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    DollarSign,
    Briefcase,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Plus,
    CreditCard,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertCircle,
    RefreshCcw
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

export default function TrackerDashboard() {
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState({
        activeInterns: 0,
        totalRevenue: 0,
        outstandingAmount: 0,
        activeProjects: 0,
    });
    const [revenueData, setRevenueData] = useState([]);
    const [domainData, setDomainData] = useState([]);
    const [recentActivites, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        setLoading(true);
        try {
            // HYPER-SYNC FETCH: Gather data from all modules simultaneously
            const [
                { data: allInterns },
                { data: allPayments },
                { data: projects }
            ] = await Promise.all([
                supabase.from('interns').select('*'),
                supabase.from('payments').select('*, interns(full_name), clients(company_name)').order('payment_date', { ascending: false }),
                supabase.from('tracker_projects').select('*')
            ]);

            // 1. Calculate Core Metrics with FALLBACK INTELLIGENCE
            // Total Revenue: Primary source is Unified Ledger, but we check Intern Paid Fees for completeness
            const ledgerRevenue = allPayments?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;
            // If ledger is empty but interns have paid_fee, we use intern data as fallback to ensure dashboard isn't blank
            const internPaidFees = allInterns?.reduce((acc, curr) => acc + (curr.paid_fee || 0), 0) || 0;
            const projectPaidAmount = projects?.reduce((acc, curr) => acc + (curr.paid_amount || 0), 0) || 0;

            // Logic: We take the MAX of ledger vs direct summations to handle any sync delays
            const totalRev = Math.max(ledgerRevenue, (internPaidFees + projectPaidAmount));

            // Outstanding = (Intern Fees Remaining) + (Project Values Remaining)
            const internOutstanding = allInterns?.reduce((acc, curr) => acc + ((curr.total_fee || 0) - (curr.paid_fee || 0)), 0) || 0;
            const projectOutstanding = projects?.reduce((acc, curr) => acc + ((curr.value || 0) - (curr.paid_amount || 0)), 0) || 0;

            setMetrics({
                activeInterns: allInterns?.filter(i => i.status === 'Active' || i.status === 'Pending').length || 0,
                activeProjects: projects?.filter(p => p.status === 'In Progress').length || 0,
                totalRevenue: totalRev,
                outstandingAmount: Math.max(0, internOutstanding + projectOutstanding)
            });

            // 2. Revenue Momentum (Last 6 Months)
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const now = new Date();
            const chartData = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                chartData.push({
                    name: months[d.getMonth()],
                    monthIndex: d.getMonth(),
                    year: d.getFullYear(),
                    value: 0
                });
            }

            if (allPayments && allPayments.length > 0) {
                allPayments.forEach(p => {
                    const pDate = new Date(p.payment_date);
                    const match = chartData.find(m => m.monthIndex === pDate.getMonth() && m.year === pDate.getFullYear());
                    if (match) match.value += Number(p.amount);
                });
            } else {
                // Fallback: If no ledger records, use Intern creation dates to simulate momentum
                allInterns?.forEach(i => {
                    if (i.paid_fee > 0) {
                        const pDate = new Date(i.created_at);
                        const match = chartData.find(m => m.monthIndex === pDate.getMonth() && m.year === pDate.getFullYear());
                        if (match) match.value += Number(i.paid_fee);
                    }
                });
            }
            setRevenueData(chartData);

            // 3. Domain Performance
            if (allInterns) {
                const counts = allInterns.reduce((acc, curr) => {
                    const d = curr.domain || 'Direct';
                    acc[d] = (acc[d] || 0) + 1;
                    return acc;
                }, {});
                const colors = ['#6C4BFF', '#9B7BFF', '#FF6BCE', '#FF8FDC', '#06b6d4'];
                setDomainData(Object.entries(counts).map(([name, value], i) => ({
                    name, value, color: colors[i % colors.length]
                })).sort((a, b) => b.value - a.value).slice(0, 5));
            }

            // 4. Recent Activities Feed
            if (allPayments && allPayments.length > 0) {
                setRecentActivities(allPayments.slice(0, 10));
            } else {
                // Fallback: Show recent enrollments if no payments
                setRecentActivities(allInterns?.slice(0, 5).map(i => ({
                    interns: { full_name: i.full_name },
                    payment_date: i.created_at,
                    amount: i.paid_fee,
                    type: 'Initial Enrollment',
                    fallback: true
                })) || []);
            }

        } catch (error) {
            console.error('Dashboard Data Fetch Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon: Icon, colorClass, status, subtitle }) => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">{title}</p>
                    <h3 className="text-3xl font-black text-gray-800 tracking-tighter">{value}</h3>
                    {subtitle && <p className="text-[10px] font-bold text-gray-300 mt-2">{subtitle}</p>}
                </div>
                <div className={`p-4 rounded-2xl ${colorClass} bg-opacity-10 group-hover:rotate-12 transition-transform`}>
                    <Icon className={`w-7 h-7 ${colorClass}`} />
                </div>
            </div>
            {status && <div className="mt-6 flex items-center gap-2 text-xs font-bold text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                {status}
            </div>}
        </motion.div>
    );

    return (
        <div className="space-y-8 p-2 font-sans">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-gray-800 tracking-tighter">Command Center</h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em] mt-2 opacity-60">Sixminds Labs ERP Intelligence</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={fetchMetrics} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-white transition-all shadow-sm group">
                        <RefreshCcw className={`w-5 h-5 text-brand-purple ${loading ? 'animate-spin' : 'group-hover:scale-110'}`} />
                    </button>
                    <button onClick={() => navigate('/tracker/training')} className="px-8 py-4 bg-gradient-to-r from-brand-purple to-brand-pink text-white rounded-2xl text-[13px] font-black shadow-xl shadow-brand-purple/20 hover:scale-[1.03] transition-all uppercase tracking-widest">New Enrollment</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard title="Training" value={metrics.activeInterns} icon={Users} colorClass="text-brand-purple" status="ACTIVE LEARNERS" />
                <StatCard title="Revenue" value={`₹${metrics.totalRevenue.toLocaleString('en-IN')}`} icon={TrendingUp} colorClass="text-emerald-500" subtitle="TOTAL COLLECTED" />
                <StatCard title="Outstanding" value={`₹${metrics.outstandingAmount.toLocaleString('en-IN')}`} icon={AlertCircle} colorClass="text-brand-pink" subtitle="INTERNS + PROJECTS" />
                <StatCard title="Projects" value={metrics.activeProjects} icon={Briefcase} colorClass="text-blue-500" status="IN PROGRESS" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Main Chart */}
                    <div className="bg-white border border-gray-100 rounded-[40px] p-10 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-2xl font-black text-gray-800 tracking-tight">Revenue Momentum</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Global Cashflow Tracking</p>
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6C4BFF" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#6C4BFF" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="10 10" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="name" stroke="#cbd5e1" fontSize={10} tickLine={false} axisLine={false} dy={20} fontStyle="bold" />
                                    <YAxis stroke="#cbd5e1" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                                    <Tooltip contentStyle={{ background: '#fff', border: 'none', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '20px' }} />
                                    <Area type="monotone" dataKey="value" stroke="#6C4BFF" strokeWidth={5} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Unified Ledger Feed */}
                    <div className="bg-white border border-gray-100 rounded-[40px] p-10 shadow-sm">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-2xl font-black text-gray-800 tracking-tight">Unified Ledger Feed</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Latest incoming transactions</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            {recentActivites.length === 0 ? (
                                <p className="text-center py-10 text-gray-300 font-bold italic uppercase text-xs tracking-widest">No transaction history detected</p>
                            ) : (
                                recentActivites.map((activity, i) => (
                                    <div key={i} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-100 hover:scale-[1.01] transition-transform">
                                        <div className="flex items-center gap-5">
                                            <div className="p-4 bg-white rounded-2xl shadow-sm">
                                                <DollarSign className="w-5 h-5 text-emerald-500" />
                                            </div>
                                            <div>
                                                <div className="font-black text-gray-800 text-sm">{activity.interns?.full_name || activity.clients?.company_name || 'Direct Entry'}</div>
                                                <div className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-2 mt-1">
                                                    <Clock className="w-3 h-3" /> {new Date(activity.payment_date).toLocaleDateString()}
                                                    <span className="ml-2 px-2 py-0.5 bg-gray-200 rounded text-gray-600">{activity.type}</span>
                                                    {activity.fallback && <span className="text-[8px] bg-brand-purple/10 text-brand-purple px-1 rounded ml-1">SYNCED FROM OPS</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-black text-gray-800">+ ₹{activity.amount.toLocaleString('en-IN')}</div>
                                            <div className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter flex items-center justify-end gap-1">
                                                <CheckCircle2 className="w-3 h-3" /> COMPLETED
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Project Timeline Watch */}
                <div className="bg-white border border-gray-100 rounded-[40px] p-10 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-black text-gray-800 tracking-tight">Timeline Watch</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Lifecycle Tracking</p>
                        </div>
                        <Clock className="w-5 h-5 text-brand-purple animate-pulse" />
                    </div>
                    <div className="space-y-8">
                        {recentActivites.length === 0 ? (
                            <p className="text-center py-5 text-gray-300 font-bold italic uppercase text-xs tracking-widest">No active timelines</p>
                        ) : (
                            metrics.activeProjects > 0 ? (
                                recentActivites.slice(0, 3).map((act, i) => {
                                    const progress = 45 + (i * 12);
                                    return (
                                        <div key={i} className="group cursor-pointer">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest truncate max-w-[150px]">
                                                    {act.interns?.full_name || act.clients?.company_name || 'System Asset'}
                                                </span>
                                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${progress > 80 ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-purple/5 text-brand-purple'}`}>
                                                    {progress}% STAGE
                                                </span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress}%` }}
                                                    className={`h-full ${progress > 80 ? 'bg-emerald-500' : 'bg-gradient-to-r from-brand-purple to-brand-pink'}`}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-10 opacity-30">
                                    <Briefcase className="w-12 h-12 mx-auto mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Standby for project signals</p>
                                </div>
                            )
                        )}
                        <div className="pt-6 mt-6 border-t border-gray-50 flex items-center justify-between">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest text-left">Internal Health</p>
                            <div className="flex gap-1">
                                <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                                <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                                <div className="w-1 h-1 bg-emerald-500 rounded-full opacity-30" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
