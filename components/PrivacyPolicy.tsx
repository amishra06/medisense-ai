
import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Globe, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-slate-900 p-8 sm:p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-teal-900/20 -z-10" />
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-8 text-sm font-bold uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                    <h1 className="text-4xl font-black mb-4">Privacy Policy</h1>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Last Updated: January 30, 2026</p>
                </div>

                <div className="p-8 sm:p-12 space-y-12 text-slate-700 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <Database className="w-6 h-6 text-teal-600" />
                            1. Information We Collect
                        </h2>
                        <div className="pl-9 space-y-4">
                            <p>We collect information to provide, improve, and protect our comprehensive multimodal analysis services:</p>
                            <ul className="list-disc pl-5 space-y-2 marker:text-teal-500">
                                <li><strong>Account Information:</strong> Name, email address, and authentication credentials via Google OAuth.</li>
                                <li><strong>Medical Data:</strong> Images, PDF reports, symptom descriptions, and other health data you explicitly upload for analysis.</li>
                                <li><strong>Usage Data:</strong> Timestamps of analysis, feature usage patterns, and device information for optimization.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <Eye className="w-6 h-6 text-cyan-600" />
                            2. How We Use Your Information
                        </h2>
                        <div className="pl-9 space-y-4">
                            <p>Your data is used solely for the purpose of generating preliminary educational health assessments:</p>
                            <ul className="list-disc pl-5 space-y-2 marker:text-cyan-500">
                                <li>To generate detailed multimodal analysis reports using Gemini 3 Pro technology.</li>
                                <li>To maintain your secure personal dashboard and report history.</li>
                                <li>To improve the accuracy of our educational models (anonymized data only).</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <Lock className="w-6 h-6 text-teal-600" />
                            3. Data Storage & Security
                        </h2>
                        <div className="pl-9 space-y-4">
                            <p>We employ enterprise-grade security measures utilizing Google Cloud Platform infrastructure:</p>
                            <ul className="list-disc pl-5 space-y-2 marker:text-teal-500">
                                <li><strong>Encryption:</strong> Data is encrypted in transit (TLS 1.3) and at rest (AES-256).</li>
                                <li><strong>Access Control:</strong> Strict identity access management policies ensure only you access your private reports.</li>
                                <li><strong>Firebase Security:</strong> We leverage Firebase Authentication and Firestore security rules to protect your records.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <Shield className="w-6 h-6 text-cyan-600" />
                            4. Third-Party Services
                        </h2>
                        <div className="pl-9">
                            <p>We utilize trusted third-party providers to power our platform:</p>
                            <ul className="list-disc pl-5 mt-4 space-y-2 marker:text-cyan-500">
                                <li><strong>Google Gemini API:</strong> Used for processing diagnostic image and text data.</li>
                                <li><strong>Google Firebase:</strong> Used for secure authentication and database storage.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <Globe className="w-6 h-6 text-teal-600" />
                            5. Your Rights
                        </h2>
                        <div className="pl-9">
                            <p>You retain full control over your data. You have the right to:</p>
                            <ul className="list-disc pl-5 mt-4 space-y-2 marker:text-teal-500">
                                <li>Access all your personal data and reports.</li>
                                <li>Export your data in a portable format.</li>
                                <li>Permanently delete your account and all associated data at any time.</li>
                            </ul>
                        </div>
                    </section>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-8">
                        <h3 className="font-black text-slate-900 mb-2">Contact Us</h3>
                        <p className="text-sm text-slate-600 mb-4">If you have any questions about this Privacy Policy, please contact us at:</p>
                        <a href="mailto:privacy@medisense-ai.com" className="text-teal-600 font-bold hover:underline">privacy@medisense-ai.com</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
