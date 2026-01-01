import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Search, Filter, Building2, Mail, Phone, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrackerClients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        company_name: '',
        contact_person: '',
        email: '',
        phone: '',
        client_type: 'Business',
        status: 'Active'
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setClients(data || []);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClient = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { data, error } = await supabase
                .from('clients')
                .insert([formData])
                .select();

            if (error) throw error;

            setShowAddModal(false);
            setFormData({
                company_name: '',
                contact_person: '',
                email: '',
                phone: '',
                client_type: 'Business',
                status: 'Active'
            });
            fetchClients();
        } catch (error) {
            alert('Error adding client: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteClient = async (id) => {
        if (!confirm('Are you sure? This will delete the client and potentially affect linked projects.')) return;
        try {
            const { error } = await supabase
                .from('clients')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchClients();
        } catch (error) {
            alert('Error deleting client: ' + error.message);
        }
    };

    const filteredClients = clients.filter(client =>
        client.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.contact_person?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchQuery.toLowerCase())
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
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Client Management</h1>
                    <p className="text-gray-500 mt-1">Manage your client relationships and contacts</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-brand-purple to-brand-pink text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-purple/30 hover:scale-105 transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Client
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Clients" value={clients.length} icon={Building2} color="text-brand-purple" />
                <StatCard title="Active" value={clients.filter(c => c.status === 'Active').length} icon={Building2} color="text-emerald-500" />
                <StatCard title="Startups" value={clients.filter(c => c.client_type === 'Startup').length} icon={Building2} color="text-blue-500" />
                <StatCard title="Businesses" value={clients.filter(c => c.client_type === 'Business').length} icon={Building2} color="text-brand-pink" />
            </div>

            {/* Search */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                        />
                    </div>
                </div>
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin"></div>
                    </div>
                ) : filteredClients.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No clients found. Click "+ Add Client" to get started.
                    </div>
                ) : (
                    filteredClients.map((client) => (
                        <div key={client.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-tr from-brand-purple to-brand-pink rounded-xl flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-white" />
                                </div>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${client.client_type === 'Startup' ? 'bg-purple-100 text-purple-600' :
                                    client.client_type === 'Business' ? 'bg-blue-100 text-blue-600' :
                                        client.client_type === 'College' ? 'bg-emerald-100 text-emerald-600' :
                                            'bg-gray-100 text-gray-600'
                                    }`}>
                                    {client.client_type}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">{client.company_name}</h3>
                            <p className="text-sm text-gray-600 mb-4 font-medium">{client.contact_person || 'No contact person'}</p>
                            <div className="space-y-2 mb-4">
                                {client.email && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Mail className="w-4 h-4" />
                                        {client.email}
                                    </div>
                                )}
                                {client.phone && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Phone className="w-4 h-4" />
                                        {client.phone}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2 pt-4 border-t border-gray-100">
                                <button className="flex-1 px-3 py-2 bg-brand-purple/10 text-brand-purple rounded-lg hover:bg-brand-purple/20 transition-colors text-sm font-bold">
                                    Overview
                                </button>
                                <button className="p-2 text-gray-400 hover:text-brand-purple transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDeleteClient(client.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Client Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
                                <h2 className="text-xl font-bold text-gray-800">Register New Client</h2>
                                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleAddClient} className="p-8 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Company Name *</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.company_name}
                                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                                        placeholder="Acme Corp"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Contact Person</label>
                                        <input
                                            type="text"
                                            value={formData.contact_person}
                                            onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                                            placeholder="Jane Smith"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Client Type *</label>
                                        <select
                                            required
                                            value={formData.client_type}
                                            onChange={(e) => setFormData({ ...formData, client_type: e.target.value })}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                                        >
                                            <option>Startup</option>
                                            <option>Business</option>
                                            <option>College</option>
                                            <option>Individual</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                                            placeholder="jane@acme.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Phone</label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                                            placeholder="+91 ..."
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 px-6 py-3 border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-[2] px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-pink text-white rounded-2xl text-sm font-bold shadow-lg shadow-brand-purple/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                    >
                                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                        {submitting ? 'Registering...' : 'Add Client'}
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
