
import React from 'react';
import { X, ShieldCheck, HelpCircle, FileText, AlertTriangle, Phone, Mail, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const BaseModal: React.FC<ModalProps> = ({ isOpen, onClose, title, icon, children }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                >
                    <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 p-6 flex justify-between items-center z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-teal-50 rounded-xl text-teal-600">
                                {icon}
                            </div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">{title}</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-400 hover:text-slate-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-8">
                        {children}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export const GuidelinesModal: React.FC<{ isOpen: boolean; onClose: () => void }> = (props) => (
    <BaseModal {...props} title="Clinical Guidelines" icon={<FileText className="w-6 h-6" />}>
        <div className="space-y-8">
            <section>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xs">1</span>
                    When to Use MediSense AI
                </h3>
                <ul className="grid gap-3 pl-8">
                    {['Non-emergency symptom assessment', 'Preparing for doctor visits', 'Educational medical research', 'Understanding lab results'].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                            <div className="w-1.5 h-1.5 bg-teal-400 rounded-full" /> {item}
                        </li>
                    ))}
                </ul>
            </section>

            <div className="bg-rose-50 border-l-4 border-rose-500 p-6 rounded-r-xl">
                <h3 className="text-rose-900 font-bold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> When NOT to Use
                </h3>
                <p className="text-rose-800 text-sm mb-3">Do not use this tool for medical emergencies or critical conditions such as:</p>
                <div className="grid grid-cols-2 gap-2 text-rose-700 text-xs font-bold">
                    <span>• Chest Pain</span>
                    <span>• Severe Bleeding</span>
                    <span>• Difficulty Breathing</span>
                    <span>• Stroke Symptoms</span>
                </div>
            </div>

            <section>
                <h3 className="text-lg font-bold text-slate-900 mb-4">How AI Analysis Works</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    We utilize <strong>Gemini 3 Pro</strong>, a state-of-the-art multimodal AI model, to process your inputs. It cross-references your symptoms and images against a vast database of medical literature to provide educational insights.
                </p>
                <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-500 border border-slate-100">
                    <strong>Accuracy Disclaimer:</strong> While highly advanced, AI can make mistakes. Always verify results with a licensed physician.
                </div>
            </section>
        </div>
    </BaseModal>
);

export const SecurityModal: React.FC<{ isOpen: boolean; onClose: () => void }> = (props) => (
    <BaseModal {...props} title="Security & Privacy" icon={<Lock className="w-6 h-6" />}>
        <div className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-4">
                {[
                    { title: "Data Encryption", desc: "AES-256 for data at rest, TLS 1.3 for transit." },
                    { title: "Google Cloud", desc: "Enterprise-grade infrastructure protection." },
                    { title: "User Control", desc: "You own your data. Delete it anytime." },
                    { title: "Secure Login", desc: "OAuth 2.0 authentication via Google." }
                ].map((item, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <h4 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                ))}
            </div>

            <section className="bg-cyan-50 p-6 rounded-2xl border border-cyan-100">
                <h3 className="font-bold text-cyan-900 mb-2">Compliance Status</h3>
                <p className="text-cyan-800 text-sm mb-4">
                    MediSense AI is currently an <strong>educational tool</strong>. We are working towards HIPAA compliance but are not yet a covered entity.
                </p>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-white/50 text-cyan-700 text-xs font-bold rounded">GDPR Compliant</span>
                    <span className="px-2 py-1 bg-white/50 text-cyan-700 text-xs font-bold rounded">CCPA Ready</span>
                </div>
            </section>
        </div>
    </BaseModal>
);

export const SupportModal: React.FC<{ isOpen: boolean; onClose: () => void }> = (props) => (
    <BaseModal {...props} title="Help & Support" icon={<HelpCircle className="w-6 h-6" />}>
        <div className="space-y-8">
            <section>
                <h3 className="font-bold text-slate-900 mb-4">Emergency Resources</h3>
                <div className="grid grid-cols-2 gap-3">
                    <a href="tel:911" className="flex items-center justify-center gap-2 p-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition">
                        <Phone className="w-4 h-4" /> Call 911
                    </a>
                    <a href="tel:18002221222" className="flex items-center justify-center gap-2 p-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition text-xs">
                        Poison Control
                    </a>
                </div>
            </section>

            <section>
                <h3 className="font-bold text-slate-900 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-3">
                    {[
                        { q: "How accurate is the analysis?", a: "Gemini 3 Pro has high clinical reasoning capabilities but is not a doctor." },
                        { q: "Is my data private?", a: "Yes, only you can access your report history." },
                        { q: "Can I print reports?", a: "Yes, you can download a PDF of any report." }
                    ].map((faq, i) => (
                        <details key={i} className="group p-4 border border-slate-100 rounded-xl open:bg-slate-50 transition">
                            <summary className="font-bold text-slate-800 text-sm cursor-pointer list-none flex justify-between items-center">
                                {faq.q}
                                <span className="group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="text-slate-500 text-xs mt-3 leading-relaxed">{faq.a}</p>
                        </details>
                    ))}
                </div>
            </section>

            <div className="pt-6 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4">Contact Support</h3>
                <div className="flex items-center gap-3 p-4 bg-teal-50 rounded-2xl border border-teal-100">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                        <Mail className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                        <p className="text-xs text-teal-600 font-bold uppercase tracking-wider">Email Us</p>
                        <a href="mailto:support@medisense-ai.com" className="font-bold text-slate-800 hover:underline">support@medisense-ai.com</a>
                    </div>
                </div>
            </div>
        </div>
    </BaseModal>
);
