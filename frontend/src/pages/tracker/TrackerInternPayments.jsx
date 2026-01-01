import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Search, Filter, CreditCard, Calendar, CheckCircle, XCircle, X, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrackerInternPayments() {
    const [payments, setPayments] = useState([]);
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        intern_id: '',
        amount: 0,
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'UPI',
        transaction_id: '',
        status: 'Completed',
        type: 'Internship Fee'
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        await Promise.all([fetchPayments(), fetchInterns()]);
        setLoading(false);
    };

    const fetchPayments = async () => {
        try {
            const { data, error } = await supabase
                .from('payments')
                .select(`
                    *,
                    interns (full_name, email)
                `)
                .eq('type', 'Internship Fee')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPayments(data || []);
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    };

    const fetchInterns = async () => {
        try {
            const { data, error } = await supabase
                .from('interns')
                .select('id, full_name, email')
                .order('full_name');

            if (error) throw error;
            setInterns(data || []);
            if (data?.length > 0 && !formData.intern_id) {
                setFormData(prev => ({ ...prev, intern_id: data[0].id }));
            }
        } catch (error) {
            console.error('Error fetching interns:', error);
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
            // 1. Record the payment
            const { data: paymentData, error: paymentError } = await supabase
                .from('payments')
                .insert([dataToSubmit])
                .select();

            if (paymentError) throw paymentError;

            // 2. Reflective Intelligence: Update intern stats
            await syncInternStats(formData.intern_id);

            setShowAddModal(false);
            setFormData({
                intern_id: interns[0]?.id || '',
                amount: 0,
                payment_date: new Date().toISOString().split('T')[0],
                payment_method: 'UPI',
                transaction_id: '',
                status: 'Completed',
                type: 'Internship Fee'
            });
            fetchPayments();
        } catch (error) {
            alert('Error recording payment: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeletePayment = async (payment) => {
        if (!confirm('Are you sure you want to delete this payment record? This will revert the intern\'s balance.')) return;

        try {
            // 1. Delete the payment
            const { error: deleteError } = await supabase
                .from('payments')
                .delete()
                .eq('id', payment.id);

            if (deleteError) throw deleteError;

            // 2. Reflective Intelligence: Re-calculate and Sync intern stats
            if (payment.intern_id) {
                await syncInternStats(payment.intern_id);
            }

            fetchPayments();
        } catch (error) {
            alert('Error deleting legacy: ' + error.message);
        }
    };

    // Master Sync Function: Recalculates everything for an intern based on their actual payment history
    const syncInternStats = async (internId) => {
        // Fetch ALL payments for this intern
        const { data: allInternPayments } = await supabase
            .from('payments')
            .select('amount')
            .eq('intern_id', internId)
            .eq('status', 'Completed');

        const { data: intern } = await supabase
            .from('interns')
            .select('total_fee')
            .eq('id', internId)
            .single();

        const newPaidTotal = allInternPayments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

        let newStatus = 'Unpaid';
        if (newPaidTotal >= (intern?.total_fee || 0) && (intern?.total_fee || 0) > 0) {
            newStatus = 'Paid';
        } else if (newPaidTotal > 0) {
            newStatus = 'Partial';
        }

        await supabase
            .from('interns')
            .update({
                paid_fee: newPaidTotal,
                payment_status: newStatus
            })
            .eq('id', internId);
    };

    const totalReceived = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const completedPayments = payments.filter(p => p.status === 'Completed').length;

    const filteredPayments = payments.filter(payment =>
        payment.interns?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.transaction_id?.toLowerCase().includes(searchQuery.toLowerCase())
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
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Financial Ecosystem: Interns</h1>
                    <p className="text-gray-500 mt-1">Unified ledger syncing training & revenue states</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-brand-purple to-brand-pink text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-purple/30 hover:scale-105 transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Record Payment
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Collected" value={`₹${totalReceived.toLocaleString('en-IN')}`} icon={CreditCard} color="text-emerald-500" />
                <StatCard title="Ledger Entries" value={payments.length} icon={CreditCard} color="text-brand-purple" />
                <StatCard title="Successful" value={completedPayments} icon={CheckCircle} color="text-blue-500" />
                <StatCard title="Awaiting" value={payments.length - completedPayments} icon={XCircle} color="text-brand-pink" />
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Identify intern or transaction..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Intern Identity</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Timestamp</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Method</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Ref ID</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <div className="flex justify-center">
                                            <div className="w-8 h-8 border-4 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        Ecosystem standby: No payments found.
                                    </td>
                                </tr>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-800 uppercase text-xs">{payment.interns?.full_name || 'System Managed'}</div>
                                            <div className="text-[10px] text-gray-400 font-bold">{payment.interns?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 font-black text-gray-800">₹{(payment.amount || 0).toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                                            {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-gray-400">{payment.payment_method || '-'}</td>
                                        <td className="px-6 py-4 text-[10px] text-brand-purple font-mono font-bold tracking-tighter">{payment.transaction_id || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-[10px] font-black rounded-lg ${payment.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}>
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
                            <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-blue-50">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">Record Financial Pulse</h2>
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Syncing with Training Roster</p>
                                </div>
                                <button onClick={() => setShowAddModal(false)} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleRecordPayment} className="p-10 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Intern</label>
                                    <select
                                        required
                                        value={formData.intern_id}
                                        onChange={(e) => setFormData({ ...formData, intern_id: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-gray-700"
                                    >
                                        <option value="">Select Identity</option>
                                        {interns.map(i => (
                                            <option key={i.id} value={i.id}>{i.full_name} ({i.email})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Volume (₹)</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-black text-gray-800"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Timestamp</label>
                                        <input
                                            required
                                            type="date"
                                            value={formData.payment_date}
                                            onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-gray-700"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gateway</label>
                                        <select
                                            value={formData.payment_method}
                                            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-gray-700"
                                        >
                                            <option>UPI</option>
                                            <option>Bank Transfer</option>
                                            <option>Cash</option>
                                            <option>Card</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reference Code</label>
                                        <input
                                            type="text"
                                            value={formData.transaction_id}
                                            onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-mono text-xs font-bold text-brand-purple"
                                            placeholder="UTR / Ref No."
                                        />
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
                                        className="flex-[2] px-8 py-5 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-[24px] text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                    >
                                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                                        {submitting ? 'SYNCING...' : 'COMMIT TRANSACTION'}
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
