
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSharedReport } from '../services/firebaseService';
import ResultDisplay from './ResultDisplay';
import { Shield, Loader2, AlertTriangle } from 'lucide-react';

const SharedReportView: React.FC = () => {
    const { shareId } = useParams();
    const [report, setReport] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (shareId) {
            getSharedReport(shareId)
                .then(data => {
                    setReport(data);
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [shareId]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-10 h-10 animate-spin text-teal-500" /></div>;

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-rose-500" />
                </div>
                <h2 className="text-xl font-black text-slate-800 mb-2">Access Denied</h2>
                <p className="text-slate-500 font-medium mb-6">{error === 'Link expired' ? 'This secure link has expired.' : 'This link is invalid or the report has been removed.'}</p>
                <Link to="/" className="px-6 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition">Go to MediSense AI</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f1f5f9] pb-20">
            {/* Minimal Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-teal-100 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="w-6 h-6 text-teal-600" />
                        <span className="font-black text-slate-800 tracking-tight">MediSense AI</span>
                    </div>
                    <div className="px-3 py-1 bg-amber-50 border border-amber-100 rounded-full">
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Read-Only View</p>
                    </div>
                </div>
            </header>

            <main className="p-4 md:p-8">
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Disclaimer Banner */}
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3">
                        <Shield className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">Secure Shared Record</p>
                            <p className="text-sm text-blue-600/80">This medical report was securely shared with you. It is for informational purposes only.</p>
                        </div>
                    </div>

                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-teal-900/5 border border-slate-50 relative overflow-hidden">
                        {/* Patient Context Replicated (Since we can't easily reuse the exact block from ReportView without further refactoring, or we could extract it) */}
                        {/* For expediency, using ResultDisplay embedded */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-100">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Patient Name</p>
                                <p className="text-xl font-black text-slate-800 tracking-tight">{report.patientData.name || 'Unspecified'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Demographics</p>
                                <p className="text-xl font-black text-slate-800 tracking-tight">{report.patientData.age || '--'} / {report.patientData.gender || '--'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Case Status</p>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                                    {report.assessment.urgency}
                                </span>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Shared Date</p>
                                <p className="text-sm font-bold text-slate-500">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    <ResultDisplay assessment={report.assessment} patientData={report.patientData} embedded={true} />
                </div>
            </main>
        </div>
    );
};

export default SharedReportView;
