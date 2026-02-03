
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, AlertCircle, FileText, ChevronRight, MoreVertical } from 'lucide-react';
import { getUserReports } from '../services/firebaseService';
import { useAuth } from '../App';
import { UserReport, UrgencyLevel } from '../types';


const ReportHistory: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      getUserReports(user.uid).then(data => {
        setReports(data);
        setLoading(false);
      });
    }
  }, [user]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
      // Ideally call a delete service here
      setReports(prev => prev.filter(r => r.id !== id));
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.assessment.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUrgency = filterUrgency === 'all' || report.assessment.urgency === filterUrgency;
    return matchesSearch && matchesUrgency;
  });

  const getUrgencyBadge = (level: UrgencyLevel) => {
    switch (level) {
      case UrgencyLevel.EMERGENCY: return "bg-rose-100 text-rose-700 border-rose-200";
      case UrgencyLevel.HIGH: return "bg-orange-100 text-orange-700 border-orange-200";
      case UrgencyLevel.MEDIUM: return "bg-teal-100 text-teal-700 border-teal-200";
      default: return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  if (loading) return <div className="flex flex-col items-center py-20 gap-4"><Loader2 className="w-8 h-8 animate-spin text-teal-500" /><p className="text-xs font-black text-slate-400 uppercase tracking-widest">Retrieving Clinical Records...</p></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Report History</h1>
          <p className="text-slate-500 text-sm font-medium">Manage and review your clinical investigations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input
              type="text"
              placeholder="Search ID or condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-teal-500/20 transition-all w-full md:w-64 shadow-sm"
            />
          </div>
          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value)}
            className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 text-xs font-bold outline-none shadow-sm"
          >
            <option value="all">All Urgencies</option>
            <option value={UrgencyLevel.LOW}>Low</option>
            <option value={UrgencyLevel.MEDIUM}>Medium</option>
            <option value={UrgencyLevel.HIGH}>High</option>
            <option value={UrgencyLevel.EMERGENCY}>Emergency</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-teal-900/5 border border-white overflow-hidden">
        {filteredReports.length === 0 ? (
          <div className="py-32 flex flex-col items-center text-center px-6">
            <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-6">
              <FileText className="w-10 h-10 text-teal-200" />
            </div>
            <h4 className="text-lg font-black text-slate-800 mb-2">No records found</h4>
            <p className="text-slate-500 font-medium mb-8 max-w-xs">Try adjusting your filters or start a new diagnosis.</p>
            <Link to="/dashboard/new-diagnosis" className="px-8 py-4 bg-teal-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-teal-900/20 hover:bg-teal-700 transition-all">
              Create Diagnosis
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Diagnostic Detail</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Processed</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredReports.map((report, i) => (
                  <tr key={report.id} className="hover:bg-teal-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl border border-slate-100 overflow-hidden shrink-0 bg-slate-100">
                          {report.media[0] ? (
                            <img src={report.media[0].dataUrl} className="w-full h-full object-cover" />
                          ) : (
                            <FileText className="w-5 h-5 text-slate-300 m-auto mt-3.5" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 leading-none mb-1 max-w-[200px] truncate">{report.assessment.summary}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {report.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getUrgencyBadge(report.assessment.urgency)}`}>
                        {report.assessment.urgency}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar className="w-3 h-3" />
                        <span className="text-xs font-bold">{report.createdAt?.toDate ? report.createdAt.toDate().toLocaleDateString() : 'Just now'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/dashboard/report/${report.id}`} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-slate-200 transition">
                          View
                        </Link>
                        <button onClick={() => handleDelete(report.id)} className="p-2 text-slate-300 hover:text-rose-500 transition">
                          <span className="sr-only">Delete</span>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const Loader2 = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>;

export default ReportHistory;
