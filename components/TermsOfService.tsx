
import React from 'react';
import { ArrowLeft, AlertTriangle, FileCheck, ShieldAlert, Gavel } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-slate-900 p-8 sm:p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-cyan-900/20 -z-10" />
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-8 text-sm font-bold uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                    <h1 className="text-4xl font-black mb-4">Terms of Service</h1>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Effective Date: January 30, 2026</p>
                </div>

                <div className="p-8 sm:p-12 space-y-12 text-slate-700 leading-relaxed">

                    <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl">
                        <div className="flex items-start gap-4">
                            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-black text-amber-900 uppercase tracking-widest mb-2">Crucial Disclaimer</h3>
                                <p className="text-amber-800 text-sm font-medium">
                                    MediSense AI is an <strong>educational tool only</strong>. We do not provide medical advice, diagnosis, or treatment.
                                    In a medical emergency, call 911 immediately.
                                </p>
                            </div>
                        </div>
                    </div>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <FileCheck className="w-6 h-6 text-teal-600" />
                            1. Acceptance of Terms
                        </h2>
                        <div className="pl-9">
                            <p>
                                By accessing or using MediSense AI, you agree to be bound by these Terms of Service.
                                If you do not agree to these terms, you may not use our platform.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <ShieldAlert className="w-6 h-6 text-cyan-600" />
                            2. Description of Service
                        </h2>
                        <div className="pl-9 space-y-4">
                            <p>MediSense AI provides AI-powered preliminary health assessments based on user-uploaded data.</p>
                            <ul className="list-disc pl-5 space-y-2 marker:text-cyan-500">
                                <li><strong>Educational Use Only:</strong> All reports are for informational purposes to facilitate discussion with healthcare providers.</li>
                                <li><strong>No Doctor-Patient Relationship:</strong> Use of this app does not create a doctor-patient relationship.</li>
                                <li><strong>Accuracy Not Guaranteed:</strong> AI analysis may contain errors. Always verify findings with a professional.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <Gavel className="w-6 h-6 text-teal-600" />
                            3. User Responsibilities
                        </h2>
                        <div className="pl-9 space-y-4">
                            <p>You agree to use the platform responsibly:</p>
                            <ul className="list-disc pl-5 space-y-2 marker:text-teal-500">
                                <li>You must be at least 18 years old to use this service.</li>
                                <li>You agree not to upload illegal, offensive, or malicious content.</li>
                                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                                <li>You warrant that you have the rights to any medical data you upload.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-6">4. Limitation of Liability</h2>
                        <div className="pl-9">
                            <p className="mb-4">
                                TO THE MAXIMUM EXTENT PERMITTED BY LAW, MEDISENSE AI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES RESULTING FROM THE USE OR INABILITY TO USE THE SERVICE.
                            </p>
                            <p>
                                WE ARE NOT LIABLE FOR ANY MEDICAL DECISIONS MADE BASED ON INFORMATION PROVIDED BY OUR AI.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-6">5. Indemnification</h2>
                        <div className="pl-9">
                            <p>
                                You agree to indemnify and hold MediSense AI harmless from any claims resulting from your use of the service or violation of these terms.
                            </p>
                        </div>
                    </section>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-8">
                        <h3 className="font-black text-slate-900 mb-2">Legal Contact</h3>
                        <p className="text-sm text-slate-600 mb-4">Notices regarding these terms should be sent to:</p>
                        <a href="mailto:legal@medisense-ai.com" className="text-teal-600 font-bold hover:underline">legal@medisense-ai.com</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
