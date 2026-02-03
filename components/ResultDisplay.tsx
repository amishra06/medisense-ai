
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { PreliminaryAssessment, UrgencyLevel, PatientData } from '../types';

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
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-gray-700 overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 dark:bg-teal-900/20 rounded-bl-[4rem] -z-0 opacity-50" />
               <div className="relative z-10">
                  <h3 className="text-xs font-black text-teal-600 dark:text-teal-400 uppercase tracking-[0.2em] mb-6">Patient Identification Record</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-1">Name</p>
                        <p className="text-lg font-black text-slate-800 dark:text-gray-100">{patientData.name || 'Unspecified'}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-1">Age / Sex</p>
                        <p className="text-lg font-black text-slate-800 dark:text-gray-100">{patientData.age || '--'} / {patientData.gender || '--'}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-1">Case Status</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${config.bg} ${config.color} border ${config.border}`}>
                           {assessment.urgency}
                        </span>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-1">Date generated</p>
                        <p className="text-sm font-bold text-slate-500 dark:text-gray-400">{new Date().toLocaleDateString()}</p>
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


         {/* Clinical Reasoning Report - FORCED WHITE BACKGROUND INDEPENDENT OF THEME */}
         <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-200">
            {/* Report Header */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg mb-6 border-l-4 border-blue-600">
               <h3 className="text-2xl font-bold text-gray-900 mb-1">Clinical Reasoning Report</h3>
               <p className="text-xs text-gray-500 font-medium tracking-wide">GENERATED BY GEMINI 3 PRO MULTIMODAL MODEL</p>
            </div>

            <div className="prose prose-slate max-w-none">
               <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  remarkPlugins={[remarkGfm]}
                  components={{
                     // Main Section Headers (1., 2., 3.)
                     h1: ({ node, ...props }) => (
                        <div className="mt-8 first:mt-0 mb-4 p-3 bg-gray-50 rounded-md border-l-4 border-blue-500">
                           <h1 className="text-xl font-bold text-gray-900 m-0" {...props} />
                        </div>
                     ),

                     // Subsection Headers (A., B., C.)
                     h2: ({ node, ...props }) => (
                        <h2 className="mt-6 mb-3 pl-4 border-l-2 border-gray-300 text-lg font-semibold text-gray-800" {...props} />
                     ),

                     // Field Labels / Smaller Headers
                     h3: ({ node, ...props }) => (
                        <h3 className="mt-4 mb-2 text-base font-semibold text-gray-700" {...props} />
                     ),

                     // Paragraphs
                     p: ({ node, ...props }) => (
                        <p className="text-base text-gray-600 leading-relaxed mb-3" {...props} />
                     ),

                     // Unordered Lists
                     ul: ({ node, ...props }) => (
                        <ul className="list-disc pl-6 mb-3 text-gray-600" {...props} />
                     ),
                     // List Items
                     li: ({ node, ...props }) => (
                        <li className="mb-2" {...props} />
                     ),

                     // Strong/Bold Text
                     strong: ({ node, ...props }) => (
                        <strong className="font-semibold text-gray-700" {...props} />
                     ),

                     // Tables - DARK HEADERS WITH WHITE TEXT
                     table: ({ node, ...props }) => (
                        <div className="my-4 overflow-hidden border border-gray-300 rounded-lg shadow-sm">
                           <table className="w-full" {...props} />
                        </div>
                     ),
                     thead: ({ node, ...props }) => (
                        <thead className="bg-slate-800" {...props} />
                     ),
                     th: ({ node, ...props }) => (
                        <th className="px-4 py-3 text-left font-semibold text-white border-b-2 border-slate-700" {...props} />
                     ),
                     tbody: ({ node, ...props }) => (
                        <tbody {...props} />
                     ),
                     tr: ({ node, ...props }) => (
                        <tr className="border-b border-gray-200 last:border-0" {...props} />
                     ),
                     td: ({ node, ...props }) => (
                        <td className="px-4 py-3 text-gray-700" {...props} />
                     ),

                     // Blockquotes (for interpretation sections)
                     blockquote: ({ node, ...props }) => (
                        <div className="my-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-md">
                           <blockquote className="italic text-gray-700 m-0" {...props} />
                        </div>
                     ),
                  }}
               >
                  {assessment.reportHtml}
               </ReactMarkdown>
            </div>
         </section>

         <div className="grid md:grid-cols-2 gap-8">
            {/* Potential Conditions */}
            <section className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl shadow-teal-900/5 border border-slate-50 dark:border-gray-700">
               <h3 className="text-xs font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Differential Considerations
               </h3>
               <div className="space-y-3">
                  {assessment.potentialConditions.map((condition, i) => (
                     <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-gray-700/50 rounded-2xl border border-slate-100 dark:border-gray-600 group hover:border-cyan-200 dark:hover:border-cyan-500 transition-colors">
                        <span className="w-6 h-6 rounded-lg bg-white dark:bg-gray-600 flex items-center justify-center text-[10px] font-black text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-100 dark:border-gray-500">{i + 1}</span>
                        <span className="text-sm font-bold text-slate-700 dark:text-gray-200">{condition}</span>
                     </div>
                  ))}
               </div>
            </section>

            {/* Next Steps */}
            <section className="bg-slate-900 dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-900/20 text-white relative overflow-hidden border border-slate-800 dark:border-gray-800">
               <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-bl-[10rem] -z-0" />
               <h3 className="text-xs font-black text-teal-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 relative z-10">
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                  Immediate Next Steps
               </h3>
               <div className="space-y-4 relative z-10">
                  {assessment.nextSteps.map((step, i) => (
                     <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="w-6 h-6 rounded-lg bg-teal-500 flex items-center justify-center font-black text-[10px] shrink-0 text-white shadow-lg shadow-teal-500/20">{i + 1}</div>
                        <p className="text-sm font-medium text-slate-200 leading-relaxed">{step}</p>
                     </div>
                  ))}
               </div>
            </section>
         </div>

         {/* Red Flags & Safety */}
         {assessment.redFlags.length > 0 && (
            <section className="bg-red-50/50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-800 p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden">
               <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-100 dark:bg-red-900/30 rounded-full opacity-50 blur-3xl" />
               <div className="relative z-10">
                  <h3 className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                     Critical Risk Factors
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                     {assessment.redFlags.map((flag, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-red-100 dark:border-red-800 text-sm font-bold text-red-900 dark:text-red-300 flex items-center gap-3 shadow-sm">
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
            <section className="pt-8 border-t border-slate-100 dark:border-gray-700">
               <h4 className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-4 text-center">Referenced Clinical Guidelines & Literature</h4>
               <div className="flex flex-wrap justify-center gap-3">
                  {assessment.groundingSources.map((source, i) => (
                     <a key={i} href={source.uri} target="_blank" rel="noopener" className="px-4 py-3 bg-white dark:bg-gray-800 hover:bg-teal-50 dark:hover:bg-gray-700 border border-slate-100 dark:border-gray-700 rounded-xl flex items-center gap-3 transition-all shadow-sm group">
                        <div className="p-1 bg-teal-50 dark:bg-teal-900/30 rounded-full text-teal-600 dark:text-teal-400 group-hover:bg-white dark:group-hover:bg-teal-900/50 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </div>
                        <span className="text-xs font-bold text-slate-600 dark:text-gray-300 truncate max-w-[200px]">{source.title}</span>
                     </a>
                  ))}
               </div>
            </section>
         )}

         <div className="max-w-2xl mx-auto mt-12 p-6 bg-slate-100/50 dark:bg-gray-800/50 rounded-2xl text-center">
            <p className="text-[10px] font-medium italic text-slate-500 dark:text-gray-400 leading-relaxed">
               &ldquo;{assessment.disclaimer}&rdquo;
            </p>
         </div>
      </div>
   );
};

export default ResultDisplay;
