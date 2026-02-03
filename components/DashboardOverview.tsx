
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Calendar, ArrowRight, Plus, FileText, Clock, AlertTriangle } from 'lucide-react';
import { getUserReports } from '../services/firebaseService';
import { useAuth } from '../App';
import { UserReport, UrgencyLevel } from '../types';

const DashboardOverview: React.FC = () => {
    const { user } = useAuth();
    const [recentReports, setRecentReports] = useState<UserReport[]>([]);
    const [totalReports, setTotalReports] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            getUserReports(user.uid).then(data => {
                setTotalReports(data.length);
                setRecentReports(data.slice(0, 3)); // Only show top 3
                setLoading(false);
            });
        }
    }, [user]);

    const stats = [
        { label: "Total Reports", value: totalReports, icon: <FileText className="w-5 h-5 text-teal-600" />, bg: "bg-teal-50" },
        { label: "Latest Analysis", value: recentReports[0]?.createdAt?.toDate ? recentReports[0].createdAt.toDate().toLocaleDateString() : "N/A", icon: <Clock className="w-5 h-5 text-cyan-600" />, bg: "bg-cyan-50" },
        { label: "Pending Actions", value: "0", icon: <AlertTriangle className="w-5 h-5 text-amber-600" />, bg: "bg-amber-50" },
    ];

    if (loading) return <div className="p-8"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
                        Welcome back, <span className="text-teal-600">{user?.displayName?.split(' ')[0] || 'Doctor'}</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Here's what's happening with your diagnostics today.</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/dashboard/reports" className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition text-sm">
                        View All Reports
                    </Link>
                    <Link to="/dashboard/new-diagnosis" className="px-6 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition shadow-lg shadow-teal-900/20 text-sm flex items-center gap-2">
                        <Plus className="w-4 h-4" /> New Diagnosis
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                {stats.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6"
                    >
                        <div className={`w-14 h-14 ${s.bg} rounded-2xl flex items-center justify-center shrink-0`}>
                            {s.icon}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{s.label}</p>
                            <p className="text-2xl font-black text-slate-800">{s.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-slate-800">Recent Activity</h3>
                    <Link to="/dashboard/reports" className="text-teal-600 text-sm font-bold hover:underline flex items-center gap-1">
                        View History <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {recentReports.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {recentReports.map((report) => (
                            <Link
                                key={report.id}
                                to={`/dashboard/report/${report.id}`}
                                className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-sm hover:shadow-md transition flex flex-col gap-4 group cursor-pointer h-full"
                            >
                                <div className="w-full h-48 rounded-xl bg-slate-100 dark:bg-gray-700 overflow-hidden shrink-0 relative">
                                    {report.media[0] ? (
                                        <img src={report.media[0].dataUrl} className="w-full h-full object-cover" alt="Scan" />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full">
                                            <FileText className="w-8 h-8 text-slate-300 dark:text-gray-600" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-grow flex flex-col gap-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <h4 className="font-bold text-slate-800 dark:text-gray-100 text-sm sm:text-base line-clamp-2 flex-1 min-w-0">
                                            {report.assessment.summary}
                                        </h4>
                                        <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded shrink-0 whitespace-nowrap ${report.assessment.urgency === UrgencyLevel.EMERGENCY ? 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300' :
                                                report.assessment.urgency === UrgencyLevel.HIGH ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                                                    'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300'
                                            }`}>
                                            {report.assessment.urgency}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 dark:text-gray-500 font-medium">
                                        {report.createdAt?.toDate ? report.createdAt.toDate().toLocaleDateString() : 'Just now'} • {report.patientData.age} / {report.patientData.gender}
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-gray-400 break-words line-clamp-3 leading-relaxed">
                                        {report.patientData.symptoms}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-12 text-center">
                        <Activity className="w-8 h-8 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium mb-4">No recent activity detected.</p>
                        <Link to="/dashboard/new-diagnosis" className="text-teal-600 font-bold hover:underline">Start a new diagnosis</Link>
                    </div>
                )}
            </div>

        </div >
    );
};

const ChevronRight = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>;

export default DashboardOverview;
