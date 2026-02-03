
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseService';
import { useAuth } from '../App';
import { UserReport } from '../types';
import ResultDisplay from './ResultDisplay';
import { ArrowLeft, Share2, Download, Trash2, Loader2, FileDown } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';
import ShareModal from './ShareModal';

const ReportView: React.FC = () => {
   const { id } = useParams();
   const { user } = useAuth();
   const navigate = useNavigate();
   const [report, setReport] = useState<UserReport | null>(null);
   const [loading, setLoading] = useState(true);
   const [downloading, setDownloading] = useState(false);
   const [showShareModal, setShowShareModal] = useState(false);

   const handleDownload = async () => {
      if (!report) return;
      setDownloading(true);
      await generatePDF('report-view-container', `MediSense-Report-${report.patientData.name || 'Anonymous'}.pdf`);
      setDownloading(false);
   };

   useEffect(() => {
      if (user && id) {
         const docRef = doc(db, 'users', user.uid, 'reports', id);
         getDoc(docRef).then(snap => {
            if (snap.exists()) {
               setReport({ id: snap.id, ...snap.data() } as UserReport);
            }
            setLoading(false);
         });
      }
   }, [user, id]);

   if (loading) return <div className="flex flex-col items-center py-40 gap-4"><Loader2 className="w-10 h-10 animate-spin text-teal-500" /><p className="text-xs font-black text-slate-400 uppercase tracking-widest">Decrypting Clinical Record...</p></div>;
   if (!report) return <div className="text-center py-20">Report not found.</div>;

   return (
      <div className="animate-in fade-in duration-700">
         {showShareModal && report && <ShareModal reportId={report.id} onClose={() => setShowShareModal(false)} />}

         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <Link to="/dashboard" className="flex items-center gap-2 text-teal-600 font-black text-xs uppercase tracking-widest hover:text-teal-800 transition">
               <ArrowLeft className="w-4 h-4" /> Back to History
            </Link>
            <div className="flex items-center gap-3">
               <button onClick={handleDownload} disabled={downloading} className="px-6 py-3 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition shadow-sm disabled:opacity-50">
                  {downloading ? <Loader2 className="w-4 h-4 animate-spin text-teal-500" /> : <Download className="w-4 h-4 text-teal-500" />}
                  {downloading ? 'Exporting...' : 'Export PDF'}
               </button>
               <button onClick={() => setShowShareModal(true)} className="px-6 py-3 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition shadow-sm">
                  <Share2 className="w-4 h-4 text-cyan-500" /> Share Record
               </button>
               <button className="p-3 bg-rose-50 border border-rose-100 text-rose-500 rounded-2xl hover:bg-rose-100 transition">
                  <Trash2 className="w-4 h-4" />
               </button>
            </div>
         </div>

         {/* Content to Capture */}
         {/* Content to Capture */}
         <div id="report-view-container" className="max-w-5xl mx-auto space-y-10 mb-20">

            {/* 1. Patient Context & ID */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-teal-900/5 border border-slate-50 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50/50 rounded-bl-[10rem] -z-0" />
               <div className="relative z-10">
                  <h3 className="text-xs font-black text-teal-600 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-teal-500" />
                     Patient Identification Record
                  </h3>

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
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600`}>
                           {report.assessment.urgency}
                        </span>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Report Date</p>
                        <p className="text-sm font-bold text-slate-500">{new Date().toLocaleDateString()}</p>
                     </div>
                  </div>

                  <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Narrative History</p>
                     <p className="text-lg font-medium text-slate-700 leading-relaxed italic border-l-4 border-teal-200 pl-4 py-1">
                        &ldquo;{report.patientData.symptoms}&rdquo;
                     </p>
                     <div className="flex gap-8 mt-4 pl-5">
                        <p className="text-xs font-bold text-slate-500"><span className="text-slate-400 uppercase tracking-wider mr-2">Duration:</span> {report.patientData.duration || 'N/A'}</p>
                        <p className="text-xs font-bold text-slate-500"><span className="text-slate-400 uppercase tracking-wider mr-2">History:</span> {report.patientData.history || 'None'}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* 2. Result Display Component (AI Triage, Clinical Report, etc) */}
            <ResultDisplay assessment={report.assessment} patientData={report.patientData} embedded={true} />

            {/* 3. Investigative Media */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-teal-900/5 border border-slate-50">
               <h3 className="text-xs font-black text-cyan-600 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  Investigative Media & Data
               </h3>
               {report.media.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {report.media.map((m, i) => (
                        <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-slate-100 relative group">
                           {m.type.includes('image') ? (
                              <img src={m.dataUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                           ) : (
                              <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center gap-2 text-slate-400">
                                 <FileDown className="w-8 h-8" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">Document</span>
                              </div>
                           )}
                           <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors" />
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                     <p className="text-slate-400 text-sm font-medium">No media assets attached to this record.</p>
                  </div>
               )}
            </div>

         </div>
      </div>
   );
};

export default ReportView;
