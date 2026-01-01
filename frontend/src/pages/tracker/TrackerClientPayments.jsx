import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Search, Filter, Wallet, Calendar, FileText, X, Loader2, CreditCard, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrackerClientPayments() {
    const [payments, setPayments] = useState([]);
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        client_id: '',
        project_id: '',
        amount: 0,
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'NEFT',
        invoice_id: '',
        status: 'Completed',
        type: 'Project Milestone'
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        await Promise.all([fetchPayments(), fetchClients(), fetchProjects()]);
        setLoading(false);
    };

    const fetchPayments = async () => {
        try {
            const { data, error } = await supabase
                .from('payments')
                .select(`
                    *,
                    clients (company_name),
                    tracker_projects (title)
                `)
                .eq('type', 'Project Milestone')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPayments(data || []);
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    };

    const fetchClients = async () => {
        try {
            const { data, error } = await supabase.from('clients').select('id, company_name').order('company_name');
            if (error) throw error;
            setClients(data || []);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const fetchProjects = async () => {
        try {
            const { data, error } = await supabase.from('tracker_projects').select('id, title, client_id').order('title');
            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const handleRecordPayment = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const dataToSubmit = {
            ...formData,
            payment_date: formData.payment_date || new Date().toISOString().split('T')[0]
        };

        try {
            // 1. Record the payment in Unified Ledger
            const { error: paymentError } = await supabase.from('payments').insert([dataToSubmit]);
            if (paymentError) throw paymentError;

            // 2. Reflective Sync: Update project's paid_amount
            if (formData.project_id) {
                await syncProjectStats(formData.project_id);
            }

            setShowAddModal(false);
            resetForm();
            fetchPayments();
        } catch (error) {
            alert('Error recording payment: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeletePayment = async (payment) => {
        if (!confirm('Are you sure you want to delete this payment record? The linked project balance will be reverted.')) return;

        try {
            const { error: deleteError } = await supabase
                .from('payments')
                .delete()
                .eq('id', payment.id);

            if (deleteError) throw deleteError;

            // Reflective Sync: Recalculate project balance
            if (payment.project_id) {
                await syncProjectStats(payment.project_id);
            }

            fetchPayments();
        } catch (error) {
            alert('Error deleting payment: ' + error.message);
        }
    };

    const syncProjectStats = async (projectId) => {
        // Fetch all successful client payments for this project
        const { data: allPayments } = await supabase
            .from('payments')
            .select('amount')
            .eq('project_id', projectId)
            .eq('status', 'Completed');

        const newPaidTotal = allPayments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

        await supabase
            .from('tracker_projects')
            .update({ paid_amount: newPaidTotal })
            .eq('id', projectId);
    };

    const resetForm = () => {
        setFormData({
            client_id: '',
            project_id: '',
            amount: 0,
            payment_date: new Date().toISOString().split('T')[0],
            payment_method: 'NEFT',
            invoice_id: '',
            status: 'Completed',
            type: 'Project Milestone'
        });
    };

    const totalReceived = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    const filteredPayments = payments.filter(payment =>
        payment.clients?.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.tracker_projects?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.invoice_id?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Project Economics</h1>
                    <p className="text-gray-500 mt-1">Unified client capital flow & milestone tracking</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:scale-105 transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Record Milestone
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Capital Inflow" value={`₹${totalReceived.toLocaleString('en-IN')}`} icon={Wallet} color="text-emerald-500" />
                <StatCard title="Total Milestones" value={payments.length} icon={FileText} color="text-brand-purple" />
                <StatCard title="Settled" value={payments.filter(p => p.status === 'Completed').length} icon={Wallet} color="text-blue-500" />
                <StatCard title="Float/Pending" value={payments.filter(p => p.status === 'Pending').length} icon={Wallet} color="text-brand-pink" />
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Identify project, client or invoice..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Capital Source</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Linked Asset</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Volume</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Invoice</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Timestamp</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Method</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500 font-bold uppercase text-xs tracking-widest italic">
                                        System standby: No inflow history detected
                                    </td>
                                </tr>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-black text-gray-800 uppercase text-xs tracking-tight">{payment.clients?.company_name || 'Direct Capital'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-[10px] font-black text-blue-600 uppercase tracking-tighter">{payment.tracker_projects?.title || '-'}</td>
                                        <td className="px-6 py-4 font-black text-gray-800">₹{(payment.amount || 0).toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4 text-[10px] text-gray-400 font-mono font-bold tracking-tight">{payment.invoice_id || '-'}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                                            {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-[10px] text-gray-400 font-bold uppercase">{payment.payment_method || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-[10px] font-black rounded-lg ${payment.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' :
                                                payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                {payment.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDeletePayment(payment)}
                                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Record Payment Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-emerald-50">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">Deploy Capital Entry</h2>
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Syncing with Operations Matrix</p>
                                </div>
                                <button onClick={() => setShowAddModal(false)} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleRecordPayment} className="p-10 space-y-6">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Client</label>
                                        <select
                                            required
                                            value={formData.client_id}
                                            onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-gray-700"
                                        >
                                            <option value="">Select Entity</option>
                                            {clients.map(c => (
                                                <option key={c.id} value={c.id}>{c.company_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Associated Asset</label>
                                        <select
                                            value={formData.project_id}
                                            onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-gray-700"
                                        >
                                            <option value="">Standalone Injection (Optional)</option>
                                            {projects.filter(p => !formData.client_id || p.client_id === formData.client_id).map(p => (
                                                <option key={p.id} value={p.id}>{p.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Volume (₹)</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-black text-gray-800"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Invoice Code</label>
                                        <input
                                            type="text"
                                            value={formData.invoice_id}
                                            onChange={(e) => setFormData({ ...formData, invoice_id: e.target.value })}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-mono text-xs font-bold text-blue-600"
                                            placeholder="INV-..."
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Timestamp</label>
                                        <input
                                            type="date"
                                            value={formData.payment_date}
                                            onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-gray-700"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Channel</label>
                                        <select
                                            value={formData.payment_method}
                                            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-gray-700"
                                        >
                                            <option>NEFT/RTGS</option>
                                            <option>Bank Transfer</option>
                                            <option>UPI</option>
                                            <option>Check</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-6 flex gap-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 px-8 py-5 border border-gray-100 rounded-[24px] text-xs font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-[2] px-8 py-5 bg-gradient-to-r from-blue-700 to-emerald-600 text-white rounded-[24px] text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                    >
                                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                                        {submitting ? 'SYNCING...' : 'COMMIT ENTRY'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
