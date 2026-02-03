
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Activity, FileText, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import Header from './Header';
import Disclaimer from './Disclaimer';

const Landing: React.FC = () => {
  const features = [
    { icon: <Activity className="w-6 h-6 text-teal-500" />, title: "Multimodal Analysis", desc: "Analyze images, lab PDFs, and voice descriptions simultaneously." },
    { icon: <Shield className="w-6 h-6 text-cyan-500" />, title: "AI-Powered Insights", desc: "Leverage Gemini 3 Pro technology for complex clinical reasoning." },
    { icon: <FileText className="w-6 h-6 text-teal-500" />, title: "Report History", desc: "Keep track of your medical investigations in a secure dashboard." },
    { icon: <Lock className="w-6 h-6 text-cyan-500" />, title: "Secure & Private", desc: "Your data is encrypted and remains under your control." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-teal-50/50 to-transparent -z-10" />
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-100/30 rounded-full blur-[120px] -z-10" />
      
      <Header />

      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 border border-teal-200 rounded-full mb-6">
                 <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                 <span className="text-[10px] font-black text-teal-800 uppercase tracking-widest">Next-Gen Diagnostics</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
                Intelligent <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">Clinical Intake</span>
              </h1>
              <p className="text-xl text-slate-500 mb-10 max-w-lg leading-relaxed">
                Cross-analyze medical records, diagnostic imaging, and symptoms with world-class multimodal AI reasoning.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="px-8 py-4 bg-teal-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-teal-900/20 hover:bg-teal-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#features" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center">
                  Learn More
                </a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 bg-white p-4 rounded-[2.5rem] shadow-2xl border border-white/50">
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800" 
                  className="rounded-[2rem] w-full h-[500px] object-cover" 
                  alt="Medical Professional"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 z-20 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white max-w-[240px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-500 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-slate-800 text-sm">Educational Tool</span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">For preliminary educational analysis only. Not for medical diagnosis.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-white py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-xs font-black text-teal-600 uppercase tracking-[0.3em] mb-4">Core Technology</h2>
              <p className="text-4xl font-black text-slate-900 tracking-tight">Diagnostic Excellence by Design</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((f, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -8 }}
                  className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:shadow-xl transition-all"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mb-3">{f.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex justify-center">
             <Disclaimer />
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 py-16 text-center">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-2xl font-black text-white mb-8 block tracking-tight">MediSense AI</span>
            <p className="text-slate-500 text-sm font-medium mb-8">Empowering clinical awareness through multimodal intelligence.</p>
            <div className="flex justify-center gap-8 mb-12">
               <Link to="/privacy" className="text-slate-400 hover:text-white transition">Privacy Policy</Link>
               <Link to="/terms" className="text-slate-400 hover:text-white transition">Terms of Service</Link>
               <Link to="/hipaa-policy" className="text-slate-400 hover:text-white transition">HIPAA Compliance</Link>
            </div>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">© 2026 MEDISENSE AI • EDUCATIONAL USE ONLY</p>
         </div>
      </footer>
    </div>
  );
};

export default Landing;
