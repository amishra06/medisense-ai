
import React from 'react';
import { ArrowLeft, Lock, FileWarning, ShieldCheck, Server } from 'lucide-react';
import { Link } from 'react-router-dom';

const HipaaPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-slate-900 p-8 sm:p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-teal-900/20 -z-10" />
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-8 text-sm font-bold uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                    <h1 className="text-4xl font-black mb-4">HIPAA Compliance Statement</h1>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Transparency & Regulatory Status</p>
                </div>

                <div className="p-8 sm:p-12 space-y-12 text-slate-700 leading-relaxed">

                    <div className="bg-rose-50 border-l-4 border-rose-500 p-8 rounded-r-xl shadow-sm">
                        <div className="flex items-start gap-4">
                            <FileWarning className="w-8 h-8 text-rose-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-black text-rose-900 uppercase tracking-widest mb-3">Compliance Disclaimer</h3>
                                <p className="text-rose-800 font-medium">
                                    MediSense AI is currently an <strong>educational and research tool</strong>.
                                    We are <span className="underline">NOT</span> a covered entity under HIPAA regulations.
                                    This platform should NOT be used for official medical records, billing, or transmitting Protected Health Information (PHI) that requires HIPAA compliance.
                                </p>
                            </div>
                        </div>
                    </div>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <Lock className="w-6 h-6 text-teal-600" />
                            Security Measures
                        </h2>
                        <div className="pl-9 space-y-4">
                            <p>While we are not currently HIPAA compliant, we implement industry-standard security practices to protect your data:</p>
                            <ul className="list-disc pl-5 space-y-2 marker:text-teal-500">
                                <li><strong>Encryption:</strong> AES-256 for data at rest and TLS 1.3 for data in transit.</li>
                                <li><strong>Authentication:</strong> Secure OAuth 2.0 flows via Google Identity Platform.</li>
                                <li><strong>Infrastructure:</strong> Hosted on Google Cloud Platform, using secure Firebase environments.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <Server className="w-6 h-6 text-cyan-600" />
                            Future Roadmap
                        </h2>
                        <div className="pl-9 space-y-4">
                            <p>We are actively working towards full regulatory compliance to better serve healthcare providers. Our roadmap includes:</p>
                            <ul className="list-disc pl-5 space-y-2 marker:text-cyan-500">
                                <li>Signing Business Associate Agreements (BAAs) with all data vendors.</li>
                                <li>Implementing comprehensive audit logs and access controls.</li>
                                <li>Establishing formal administrative, physical, and technical safeguards.</li>
                                <li>Third-party security audits and HITRUST certification.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6 text-teal-600" />
                            Patient Rights
                        </h2>
                        <div className="pl-9">
                            <p className="mb-4">
                                Even without formal HIPAA status, we respect your rights to your data:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 marker:text-teal-500">
                                <li>You have the right to access any data you upload.</li>
                                <li>You have the right to request deletion of your data.</li>
                                <li>You have the right to know how your data is being used.</li>
                            </ul>
                        </div>
                    </section>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-8">
                        <h3 className="font-black text-slate-900 mb-2">Compliance Officer</h3>
                        <p className="text-sm text-slate-600 mb-4">For questions regarding compliance and security:</p>
                        <a href="mailto:compliance@medisense-ai.com" className="text-teal-600 font-bold hover:underline">compliance@medisense-ai.com</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HipaaPolicy;
