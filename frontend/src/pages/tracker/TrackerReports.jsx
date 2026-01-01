import { FileText, Download, Calendar, Filter } from 'lucide-react';

export default function TrackerReports() {
    const reports = [
        { id: 1, name: 'Monthly Enrollment Report', type: 'Internships', date: '2026-01-01', size: '245 KB' },
        { id: 2, name: 'Revenue Summary Q4 2025', type: 'Finance', date: '2025-12-31', size: '128 KB' },
        { id: 3, name: 'Project Delivery Status', type: 'Projects', date: '2026-01-01', size: '89 KB' },
        { id: 4, name: 'Trainer Performance Review', type: 'Operations', date: '2025-12-28', size: '156 KB' },
        { id: 5, name: 'Client Engagement Analysis', type: 'Clients', date: '2025-12-25', size: '203 KB' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Reports</h1>
                    <p className="text-gray-500 mt-1">Generate and download comprehensive reports</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-brand-purple to-brand-pink text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-purple/30 hover:scale-105 transition-all flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Generate New Report
                </button>
            </div>

            {/* Report Types */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6 text-brand-purple" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">Internship Report</h3>
                    <p className="text-sm text-gray-600 mb-4">Enrollment, completion, and performance metrics</p>
                    <button className="text-brand-purple text-sm font-medium hover:text-brand-pink">Generate →</button>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">Revenue Ledger</h3>
                    <p className="text-sm text-gray-600 mb-4">Complete financial transactions and balances</p>
                    <button className="text-emerald-600 text-sm font-medium hover:text-emerald-700">Generate →</button>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">Project Summary</h3>
                    <p className="text-sm text-gray-600 mb-4">Client projects, timelines, and deliverables</p>
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-700">Generate →</button>
                </div>
            </div>

            {/* Previous Reports */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Recent Reports</h3>
                    <button className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm hover:bg-gray-100 flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>

                <div className="space-y-3">
                    {reports.map((report) => (
                        <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-brand-purple" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-800">{report.name}</h4>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="text-xs text-gray-500">{report.type}</span>
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(report.date).toLocaleDateString()}
                                        </span>
                                        <span className="text-xs text-gray-400">{report.size}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-brand-purple transition-colors opacity-0 group-hover:opacity-100">
                                <Download className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
