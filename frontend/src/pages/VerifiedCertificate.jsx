
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function VerifiedCertificate() {
    const { certificateId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3000');

    useEffect(() => {
        fetchCertificate();
    }, [certificateId]);

    const fetchCertificate = async () => {
        try {
            const response = await fetch(`${API_URL}/api/certificates/verify/${certificateId}`);
            const result = await response.json();

            if (result.success && result.valid) {
                setData(result.data);
            } else {
                setError('Invalid or Unverified Certificate ❌');
            }
        } catch (err) {
            setError('An error occurred while verifying the certificate.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = async () => {
        if (!data?.certificate_file_url && !data?.download_url) {
            alert("Certificate file not available for download.");
            return;
        }
        // If it's a URL to a PDF/Image, just open it or trigger download
        const url = data.certificate_file_url || data.download_url;
        window.open(url, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-red-100"
                >
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
                    <p className="text-red-500 font-medium text-lg mb-6">{error}</p>
                    <Link to="/verify">
                        <Button variant="primary" className="w-full">Try Another ID</Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    {/* Header Badge */}
                    <div className="bg-green-500 text-white text-center py-3 font-bold uppercase tracking-wider text-sm">
                        Certificate Verified ✅
                    </div>

                    <div className="grid md:grid-cols-3 gap-0">
                        {/* Sidebar / Student Info */}
                        <div className="p-8 bg-gray-50 border-r border-gray-100 col-span-1">
                            <div className="text-center">
                                {data.profile_photo_url ? (
                                    <img
                                        src={data.profile_photo_url}
                                        alt={data.student_name}
                                        className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-lg mb-4"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full mx-auto bg-purple-100 flex items-center justify-center mb-4 text-purple-500 text-2xl font-bold">
                                        {data.student_name.charAt(0)}
                                    </div>
                                )}
                                <h2 className="text-xl font-bold text-gray-900 mb-1">{data.student_name}</h2>
                                <p className="text-sm text-gray-500 mb-4">{data.certificate_id}</p>
                            </div>

                            <div className="space-y-4 mt-6">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Internship</p>
                                    <p className="font-medium text-gray-900">{data.internship_title}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Duration</p>
                                    <p className="font-bold text-gray-900 text-lg">
                                        {data.internship_duration === 'Custom' && data.start_date && data.end_date
                                            ? `${new Date(data.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${new Date(data.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                                            : data.internship_duration || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Issue Date</p>
                                    <p className="font-medium text-gray-900">{new Date(data.issue_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                                {data.skills && data.skills.length > 0 && (
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Skills Validated</p>
                                        <div className="flex flex-wrap gap-1">
                                            {data.skills.map((skill, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md text-[10px] font-bold border border-purple-100">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Verification Status</p>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 mt-1">
                                        Authentic & Verified
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Main Content / Certificate */}
                        <div className="p-8 col-span-2 flex flex-col justify-between bg-white">
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src="/logo.jpg" 
                                            alt="6ixminds Labs" 
                                            className="w-12 h-12 rounded-xl shadow-lg shadow-purple-200 object-cover" 
                                        />
                                        <div>
                                            <h3 className="font-black text-gray-900 tracking-tight text-lg">6ixminds Labs</h3>
                                            <p className="text-[10px] text-purple-600 font-bold uppercase tracking-widest">Innovation Powered by Mind</p>
                                        </div>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Authenticated On</p>
                                        <p className="text-sm font-bold text-gray-900">{new Date().toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50 p-4 mb-8 min-h-[350px] flex items-center justify-center relative group overflow-hidden">
                                    {/* Certificate Preview */}
                                    {data.certificate_file_url ? (
                                        data.certificate_file_url.toLowerCase().endsWith('.pdf') ? (
                                            <div className="text-center group-hover:scale-105 transition-transform duration-300">
                                                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-900 font-bold">PDF Document</p>
                                                <p className="text-xs text-gray-500 mt-1">Ready for download</p>
                                            </div>
                                        ) : (
                                            <img
                                                src={data.certificate_file_url}
                                                alt="Certificate"
                                                className="max-w-full max-h-[450px] object-contain shadow-2xl rounded-lg group-hover:scale-[1.02] transition-transform duration-500"
                                            />
                                        )
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <svg className="w-12 h-12 mx-auto mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-sm font-medium">Digital Version Only</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    onClick={downloadPDF}
                                    variant="primary"
                                    className="flex-1 py-4 flex items-center justify-center gap-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 shadow-xl shadow-gray-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download Original PDF
                                </Button>
                                <Link to="/verify" className="flex-1">
                                    <Button variant="outline" className="w-full">Verify Another</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
