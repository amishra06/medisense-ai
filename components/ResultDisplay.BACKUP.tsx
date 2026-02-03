import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { PreliminaryAssessment, UrgencyLevel, PatientData } from '../types';
import remarkGfm from 'remark-gfm';

interface ResultDisplayProps {
   assessment: PreliminaryAssessment;
   patientData: PatientData;
}

const ResultDisplay: React.FC<ResultDisplayProps & { embedded?: boolean }> = ({ assessment, patientData, embedded }) => {
   const getUrgencyConfig = (level: UrgencyLevel) => {
      switch (level) {
         case UrgencyLevel.LOW: return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' };
         case UrgencyLevel.MEDIUM: return { color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' };
         case UrgencyLevel.HIGH: return { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' };
         case UrgencyLevel.EMERGENCY: return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' };
         default: return { color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' };
      }
   };

   const config = getUrgencyConfig(assessment.urgency);

   return (
      <div className={`space-y-8 ${embedded ? '' : 'pb-24 max-w-4xl mx-auto'}`}>

         {/* Patient Header - Only show if NOT embedded (legacy support or standalone use) */}
         {!embedded && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-[4rem] -z-0 opacity-50" />
               <div className="relative z-10">
                  <h3 className="text-xs font-black text-teal-600 uppercase tracking-[0.2em] mb-6">Patient Identification Record</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Name</p>
                        <p className="text-lg font-black text-slate-800">{patientData.name || 'Unspecified'}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Age / Sex</p>
                        <p className="text-lg font-black text-slate-800">{patientData.age || '--'} / {patientData.gender || '--'}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Case Status</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${config.bg} ${config.color} border ${config.border}`}>
                           {assessment.urgency}
                        </span>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date generated</p>
                        <p className="text-sm font-bold text-slate-500">{new Date().toLocaleDateString()}</p>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Urgency Alert Bar */}
         <div className={`${config.bg} ${config.border} border-2 rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-lg shadow-teal-900/5`}>
            <div className={`w-14 h-14 shrink-0 rounded-2xl ${config.bg} border-2 ${config.border} flex items-center justify-center ${config.color}`}>
               <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={config.icon} /></svg>
            </div>
            <div>
               <p className={`text-xs font-black uppercase tracking-widest mb-1 ${config.color}`}>AI Triage Recommendation</p>
               <h4 className={`text-2xl font-black ${config.color} tracking-tight`}>{assessment.summary}</h4>
            </div>
         </div>


         {/* Detailed Clinical Reasoning Report - Full Width */}
         <section className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-50 dark:border-gray-800">
            {/* Enhanced Report Header */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg mb-6 border-l-4 border-blue-600">
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Clinical Reasoning Report</h3>
               <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">GENERATED BY GEMINI 3 PRO MULTIMODAL MODEL</p>
            </div>



            <div className="prose prose-slate dark:prose-invert max-w-none">
               <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  remarkPlugins={[remarkGfm]}
                  components={{
                     // Main Section Headers (1., 2., 3.) - BIGGER AND BOLDER
                     h1: ({ node, ...props }) => (
                        <div className="mt-8 first:mt-0 mb-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border-l-4 border-blue-600">
                           <h1 className="text-2xl font-bold text-gray-900 dark:text-white m-0" {...props} />
                        </div>
                     ),
                     // Subsection Headers (A., B., C.) - MEDIUM BOLD
                     h2: ({ node, ...props }) => (
                        <h2 className="mt-6 mb-3 pl-4 border-l-4 border-blue-400 dark:border-blue-500 text-lg font-semibold text-gray-800 dark:text-gray-200" {...props} />
                     ),
                     // Field Labels - SMALLER HEADERS
                     h3: ({ node, ...props }) => (
                        <h3 className="mt-4 mb-2 text-base font-medium text-gray-700 dark:text-gray-300" {...props} />
                     ),
                     // Paragraphs - NORMAL TEXT
                     p: ({ node, ...props }) => (
                        <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-3" {...props} />
                     ),
                     // Lists
                     ul: ({ node, ...props }) => (
                        <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-400 space-y-2" {...props} />
                     ),
                     li: ({ node, ...props }) => (
                        <li className="mb-2 leading-relaxed" {...props} />
                     ),
                     // Strong text
                     strong: ({ node, ...props }) => {
                        const text = String(props.children).toLowerCase();
                        // Status badge detection
                        if (text.includes('suppressed') || text.includes('low')) {
                           return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" {...props} />;
                        }
                        if (text.includes('elevated') || text.includes('normal')) {
                           return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" {...props} />;
                        }
                        if (text.includes('high') && !text.includes('very')) {
                           return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300" {...props} />;
                        }
                        if (text.includes('very high') || text.includes('critical')) {
                           return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" {...props} />;
                        }
                        return <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props} />;
                     },
                     // Tables
                     table: ({ node, ...props }) => (
                        <div className="my-6 overflow-x-auto border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm">
                           <table className="w-full min-w-full" {...props} />
                        </div>
                     ),
                     thead: ({ node, ...props }) => (
                        <thead className="bg-gray-100 dark:bg-gray-700" {...props} />
                     ),
                     th: ({ node, ...props }) => (
                        <th className="px-4 py-3 text-left font-bold text-gray-900 dark:text-gray-100 border-b-2 border-gray-300 dark:border-gray-600 whitespace-nowrap" {...props} />
                     ),
                     tbody: ({ node, ...props }) => (
                        <tbody className="bg-white dark:bg-gray-800" {...props} />
                     ),
                     tr: ({ node, ...props }) => (
                        <tr className="border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-750" {...props} />
                     ),
                     td: ({ node, ...props }) => (
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300" {...props} />
                     ),
                     // Blockquotes
                     blockquote: ({ node, ...props }) => (
                        <div className="my-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-md">
                           <blockquote className="italic text-gray-700 dark:text-gray-300 m-0" {...props} />
                        </div>
                     ),
                     // Code blocks
                     code: ({ node, inline, ...props }: any) =>
                        inline ? (
                           <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-sm rounded text-gray-800 dark:text-gray-200 font-mono" {...props} />
                        ) : (
                           <code className="block p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-mono overflow-x-auto" {...props} />
                        )
                  }}
               >
                  {assessment.reportHtml}
               </ReactMarkdown>
            </div>
         </section>

         <div className="grid md:grid-cols-2 gap-8">
            {/* Potential Conditions */}
            <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-teal-900/5 border border-slate-50">
               <h3 className="text-xs font-black text-cyan-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Differential Considerations
               </h3>
               <div className="space-y-3">
                  {assessment.potentialConditions.map((condition, i) => (
                     <div key={i} className="flex items-center gap-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-100 group hover:border-cyan-200 transition-colors">
                        <span className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[10px] font-black text-cyan-600 shadow-sm border border-slate-100">{i + 1}</span>
                        <span className="text-sm font-bold text-slate-700">{condition}</span>
                     </div>
                  ))}
               </div>
            </section>

            {/* Next Steps */}
            <section className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-900/20 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-bl-[10rem] -z-0" />
               <h3 className="text-xs font-black text-teal-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 relative z-10">
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                  Immediate Next Steps
               </h3>
               <div className="space-y-4 relative z-10">
                  {assessment.nextSteps.map((step, i) => (
                     <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="w-6 h-6 rounded-lg bg-teal-500 flex items-center justify-center font-black text-[10px] shrink-0 text-white shadow-lg shadow-teal-500/20">{i + 1}</div>
                        <p className="text-sm font-medium text-slate-300 leading-relaxed">{step}</p>
                     </div>
                  ))}
               </div>
            </section>
         </div>

         {/* Red Flags & Safety */}
         {assessment.redFlags.length > 0 && (
            <section className="bg-red-50/50 border-2 border-red-100 p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden">
               <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-100 rounded-full opacity-50 blur-3xl" />
               <div className="relative z-10">
                  <h3 className="text-xs font-black text-red-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                     Critical Risk Factors
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                     {assessment.redFlags.map((flag, i) => (
                        <div key={i} className="bg-white p-4 rounded-2xl border border-red-100 text-sm font-bold text-red-900 flex items-center gap-3 shadow-sm">
                           <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                           {flag}
                        </div>
                     ))}
                  </div>
               </div>
            </section>
         )}

         {/* Grounding Sources */}
         {assessment.groundingSources && assessment.groundingSources.length > 0 && (
            <section className="pt-8 border-t border-slate-100">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Referenced Clinical Guidelines & Literature</h4>
               <div className="flex flex-wrap justify-center gap-3">
                  {assessment.groundingSources.map((source, i) => (
                     <a key={i} href={source.uri} target="_blank" rel="noopener" className="px-4 py-3 bg-white hover:bg-teal-50 border border-slate-100 rounded-xl flex items-center gap-3 transition-all shadow-sm group">
                        <div className="p-1 bg-teal-50 rounded-full text-teal-600 group-hover:bg-white group-hover:text-teal-700 transition-colors">
                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </div>
                        <span className="text-xs font-bold text-slate-600 truncate max-w-[200px]">{source.title}</span>
                     </a>
                  ))}
               </div>
            </section>
         )}

         <div className="max-w-2xl mx-auto mt-12 p-6 bg-slate-100/50 rounded-2xl text-center">
            <p className="text-[10px] font-medium italic text-slate-500 leading-relaxed">
               &ldquo;{assessment.disclaimer}&rdquo;
            </p>
         </div>
      </div>
   );
};

export default ResultDisplay;
