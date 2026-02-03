
import React, { useState } from 'react';
import { GuidelinesModal, SecurityModal, SupportModal } from './InfoModals';

const Header: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<'guidelines' | 'security' | 'support' | null>(null);

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md border-b border-teal-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-2 rounded-xl shadow-lg shadow-teal-200/50">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040L3 20l9 1 9-1-1.382-14.016z" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-900 to-cyan-800 tracking-tight">MediSense AI</span>
                <span className="block text-[10px] text-teal-500 font-bold uppercase tracking-widest leading-none">Intelligence • Diagnostics</span>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <button onClick={() => setModalOpen('guidelines')} className="text-xs font-bold text-slate-400 hover:text-teal-600 uppercase tracking-wider transition">Guidelines</button>
              <button onClick={() => setModalOpen('security')} className="text-xs font-bold text-slate-400 hover:text-teal-600 uppercase tracking-wider transition">Security</button>
              <button onClick={() => setModalOpen('support')} className="text-xs font-bold text-slate-400 hover:text-teal-600 uppercase tracking-wider transition">Support</button>
            </nav>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-100 rounded-full">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-teal-700 uppercase">Live Reasoning</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <GuidelinesModal isOpen={modalOpen === 'guidelines'} onClose={() => setModalOpen(null)} />
      <SecurityModal isOpen={modalOpen === 'security'} onClose={() => setModalOpen(null)} />
      <SupportModal isOpen={modalOpen === 'support'} onClose={() => setModalOpen(null)} />
    </>
  );
};

export default Header;
