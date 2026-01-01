import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminCertificates() {
    const [certificates, setCertificates] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [verifyId, setVerifyId] = useState('');
    const [verifyResult, setVerifyResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [issuing, setIssuing] = useState(false);
    const [issuedLink, setIssuedLink] = useState('');

    const [formData, setFormData] = useState({
        studentName: '',
        internshipTitle: '',
        internshipDuration: '2 Weeks',
        startDate: '',
        endDate: '',
        issueDate: new Date().toISOString().split('T')[0],
        skills: '',
    });
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [certificateFile, setCertificateFile] = useState(null);

    const itemsPerPage = 10;
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_URL}/api/certificates`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setCertificates(data.data);
            } else {
                console.error('Failed to fetch certificates:', data.error);
            }
        } catch (err) {
            console.error('Error fetching certificates:', err);
        } finally {
            setLoading(false);
        }
    }

    const filteredCertificates = certificates.filter((cert) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            cert.certificate_id.toLowerCase().includes(searchLower) ||
            cert.student_name.toLowerCase().includes(searchLower) ||
            cert.internship_title.toLowerCase().includes(searchLower)
        );
    });

    const paginatedCertificates = filteredCertificates.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);

    const handleCreate = () => {
        setModalMode('create');
        setSelectedCertificate(null);
        setIssuedLink('');
        setFormData({
            studentName: '',
            internshipTitle: '',
            internshipDuration: '2 Weeks',
            startDate: '',
            endDate: '',
            issueDate: new Date().toISOString().split('T')[0],
            skills: '',
        });
        setProfilePhoto(null);
        setCertificateFile(null);
        setShowModal(true);
    };

    const handleView = (cert) => {
        setModalMode('view');
        setSelectedCertificate(cert);
        setShowModal(true);
    };

    const handleEdit = (cert) => {
        setModalMode('edit');
        setSelectedCertificate(cert);
        setIssuedLink('');
        setFormData({
            studentName: cert.student_name,
            internshipTitle: cert.internship_title,
            internshipDuration: cert.internship_duration || '2 Weeks',
            startDate: cert.start_date || '',
            endDate: cert.end_date || '',
            issueDate: cert.issue_date,
            skills: Array.isArray(cert.skills) ? cert.skills.join(', ') : '',
        });
        setProfilePhoto(null);
        setCertificateFile(null);
        setShowModal(true);
    };

    const handleDelete = async (certId) => {
        if (confirm('Are you sure you want to revoke this certificate? This action is permanent.')) {
            try {
                const token = localStorage.getItem('admin_token');
                const response = await fetch(`${API_URL}/api/certificates/${certId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setCertificates(certificates.filter((c) => c.certificate_id !== certId));
                } else {
                    alert('Revoke failed: ' + data.error);
                }
            } catch (err) {
                console.error(err);
                alert('Revoke error');
            }
        }
    };

    const handleVerifyLocal = async () => {
        if (!verifyId) return;
        try {
            const response = await fetch(`${API_URL}/api/certificates/verify/${verifyId}`);
            const data = await response.json();
            if (data.success && data.valid) {
                setVerifyResult(data.data);
            } else {
                setVerifyResult(false);
            }
        } catch (e) {
            setVerifyResult(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation for create mode
        if (modalMode === 'create') {
            if (!profilePhoto) {
                alert('Profile Photo is required');
                return;
            }
            if (!certificateFile) {
                alert('Certificate File (PDF) is required');
                return;
            }
        }

        if (formData.internshipDuration === 'Custom' && (!formData.startDate || !formData.endDate)) {
            alert('Start Date and End Date are required for custom duration');
            return;
        }

        setIssuing(true);
        const token = localStorage.getItem('admin_token');

        try {
            const dataToSend = new FormData();
            dataToSend.append('studentName', formData.studentName);
            dataToSend.append('internshipTitle', formData.internshipTitle);
            dataToSend.append('internshipDuration', formData.internshipDuration);
            if (formData.startDate) dataToSend.append('startDate', formData.startDate);
            if (formData.endDate) dataToSend.append('endDate', formData.endDate);
            dataToSend.append('issueDate', formData.issueDate);
            dataToSend.append('skills', formData.skills);
            if (profilePhoto) dataToSend.append('profilePhoto', profilePhoto);
            if (certificateFile) dataToSend.append('certificateFile', certificateFile);

            const url = modalMode === 'edit'
                ? `${API_URL}/api/certificates/${selectedCertificate.certificate_id}`
                : `${API_URL}/api/certificates`;
            const method = modalMode === 'edit' ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: dataToSend
            });

            const data = await response.json();
            if (data.success) {
                fetchCertificates();
                if (modalMode === 'create') {
                    setIssuedLink(data.verificationUrl);
                } else {
                    alert('Certificate updated successfully!');
                    setShowModal(false);
                }
            } else {
                alert(`${modalMode === 'edit' ? 'Update' : 'Issuance'} failed: ` + data.error);
            }
        } catch (error) {
            console.error('Error saving certificate:', error);
            alert('Error saving certificate');
        } finally {
            setIssuing(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Link copied to clipboard!');
    };

    return (
        <div className="space-y-6 p-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Certificate Verification</h1>
                    <p className="text-gray-600 mt-1">Manage and issue official company certificates</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-purple-200 hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Issue New Certificate
                </button>
            </div>

            {/* Quick Verify */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Public Verification Tool
                </h2>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={verifyId}
                        onChange={(e) => setVerifyId(e.target.value)}
                        placeholder="Enter ID (e.g. 6ML-IN-2025-00001)"
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all font-mono"
                    />
                    <button
                        onClick={handleVerifyLocal}
                        className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors font-medium"
                    >
                        Verify
                    </button>
                </div>

                {verifyResult !== null && (
                    <div className={`mt-4 p-4 rounded-xl border ${verifyResult ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                        {verifyResult ? (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {verifyResult.profile_photo_url ? (
                                        <img src={verifyResult.profile_photo_url} className="w-10 h-10 rounded-full object-cover" alt="Profile" />
                                    ) : (
                                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-bold text-green-900">{verifyResult.student_name}</p>
                                        <p className="text-sm text-green-700">{verifyResult.internship_title}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => window.open(`/verify/${verifyResult.certificate_id}`, '_blank')}
                                    className="text-green-700 font-semibold hover:underline"
                                >
                                    Open Page →
                                </button>
                            </div>
                        ) : (
                            <p className="text-red-700 font-medium">Invalid or Unverified Certificate ❌</p>
                        )}
                    </div>
                )}
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">Issued Certificates</h3>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Filter by name or ID..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500 font-bold">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">Program</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedCertificates.map((cert) => (
                                <tr key={cert.certificate_id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-sm text-purple-600">{cert.certificate_id}</td>
                                    <td className="px-6 py-4 font-medium">{cert.student_name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{cert.internship_title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(cert.issue_date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleView(cert)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="View Details">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            </button>
                                            <button onClick={() => handleEdit(cert)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Edit">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const url = `https://6ixmindslabs.vercel.app/verify/${cert.certificate_id}`;
                                                    copyToClipboard(url);
                                                }}
                                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg" title="Copy URL"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                            </button>
                                            <button onClick={() => handleDelete(cert.certificate_id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Revoke">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {modalMode === 'create' ? 'Issue Official Certificate' : modalMode === 'edit' ? 'Edit Certificate' : 'Certificate Details'}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/50 rounded-full transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="p-8 max-h-[80vh] overflow-y-auto">
                                {issuedLink ? (
                                    <div className="text-center py-8">
                                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Certificate Issued!</h3>
                                        <p className="text-gray-500 mb-6">The verification link is now live and permanent.</p>

                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center gap-3 mb-8">
                                            <input readOnly value={issuedLink} className="flex-1 bg-transparent border-none text-sm font-mono focus:ring-0" />
                                            <button
                                                onClick={() => copyToClipboard(issuedLink)}
                                                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors"
                                            >
                                                Copy Link
                                            </button>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => window.open(issuedLink, '_blank')}
                                                className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold"
                                            >
                                                View Public Page
                                            </button>
                                            <button
                                                onClick={() => { setIssuedLink(''); handleCreate(); }}
                                                className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold hover:bg-gray-50"
                                            >
                                                Issue Another
                                            </button>
                                        </div>
                                    </div>
                                ) : modalMode === 'view' ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-6">
                                            {selectedCertificate.profile_photo_url ? (
                                                <img src={selectedCertificate.profile_photo_url} className="w-24 h-24 rounded-2xl object-cover border-4 border-gray-50 shadow-sm" alt="" />
                                            ) : (
                                                <div className="w-24 h-24 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 text-3xl font-bold">
                                                    {selectedCertificate.student_name[0]}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">Authenticated</p>
                                                <h3 className="text-2xl font-bold text-gray-900">{selectedCertificate.student_name}</h3>
                                                <p className="text-gray-500 font-mono">{selectedCertificate.certificate_id}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl">
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Internship Title</p>
                                                <p className="font-semibold">{selectedCertificate.internship_title}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Duration</p>
                                                <p className="font-semibold">
                                                    {selectedCertificate.internship_duration === 'Custom' && selectedCertificate.start_date && selectedCertificate.end_date
                                                        ? `${new Date(selectedCertificate.start_date).toLocaleDateString()} - ${new Date(selectedCertificate.end_date).toLocaleDateString()}`
                                                        : selectedCertificate.internship_duration || 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Issue Date</p>
                                                <p className="font-semibold">{new Date(selectedCertificate.issue_date).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        {selectedCertificate.certificate_file_url && (
                                            <div className="pt-4">
                                                <a
                                                    href={selectedCertificate.certificate_file_url}
                                                    target="_blank"
                                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                    View Full Certificate
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="col-span-1 md:col-span-2">
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Student Name *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.studentName}
                                                    onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                                                    placeholder="Enter full name"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Issue Date *</label>
                                                <input
                                                    type="date"
                                                    required
                                                    value={formData.issueDate}
                                                    onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                                                />
                                            </div>

                                            <div className="col-span-1 md:col-span-2">
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Internship Title *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.internshipTitle}
                                                    onChange={e => setFormData({ ...formData, internshipTitle: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                                                    placeholder="e.g. Web Development, IoT, AI"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Internship Duration *</label>
                                                <select
                                                    required
                                                    value={formData.internshipDuration}
                                                    onChange={e => setFormData({ ...formData, internshipDuration: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                                                >
                                                    <option value="2 Weeks">2 Weeks</option>
                                                    <option value="1 Month">1 Month</option>
                                                    <option value="Custom">Custom</option>
                                                </select>
                                            </div>

                                            {formData.internshipDuration === 'Custom' && (
                                                <>
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">Start Date *</label>
                                                        <input
                                                            type="date"
                                                            required
                                                            value={formData.startDate}
                                                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">End Date *</label>
                                                        <input
                                                            type="date"
                                                            required
                                                            value={formData.endDate}
                                                            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            <div className="col-span-1 md:col-span-2">
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Skills (Optional, comma separated)</label>
                                                <input
                                                    type="text"
                                                    value={formData.skills}
                                                    onChange={e => setFormData({ ...formData, skills: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                                                    placeholder="React, Node.js, AWS..."
                                                />
                                            </div>

                                            <div className="col-span-1">
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Profile Photo {modalMode === 'create' ? '(Required) *' : '(Optional - leave empty to keep current)'}
                                                </label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    required={modalMode === 'create'}
                                                    onChange={e => setProfilePhoto(e.target.files[0])}
                                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                                />
                                            </div>

                                            <div className="col-span-1">
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Certificate File (PDF Only) {modalMode === 'create' ? '*' : '(Optional - leave empty to keep current)'}
                                                </label>
                                                <input
                                                    type="file"
                                                    accept="application/pdf"
                                                    required={modalMode === 'create'}
                                                    onChange={e => setCertificateFile(e.target.files[0])}
                                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-6 flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                                className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={issuing}
                                                className="flex-[2] px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                            >
                                                {issuing ? (
                                                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> {modalMode === 'edit' ? 'Updating...' : 'Issuing...'}</>
                                                ) : (modalMode === 'edit' ? 'Update Certificate' : 'Issue Certificate')}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
