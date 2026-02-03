
import React from 'react';

const Disclaimer: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto bg-amber-50 border-l-8 border-amber-500 p-8 rounded-r-xl shadow-lg my-12 text-left">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="flex-shrink-0">
          <div className="bg-amber-100 p-4 rounded-full">
            <svg className="h-10 w-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-black text-amber-900 uppercase tracking-widest mb-2 flex items-center gap-2">
            ⚠️ Safety Advisory
          </h4>
          <p className="text-base font-medium text-amber-800 leading-relaxed mb-4">
            This platform uses Gemini 3 Pro multimodal reasoning for educational analysis.
            It is <span className="font-bold">not a licensed medical device</span>.
          </p>
          <div className="bg-white/50 p-4 rounded-lg border border-amber-200">
            <p className="text-base font-bold text-red-600">
              🚨 If in distress, call <a href="tel:911" className="underline hover:text-red-800">911</a> or visit the nearest emergency department immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
