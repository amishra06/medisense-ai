
import React, { useState } from 'react';
import { Share2, Link, Mail, QrCode, Clipboard, Check, X, Clock } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { createShareLink } from '../services/firebaseService';
import { useAuth } from '../App';

interface ShareModalProps {
    reportId: string;
    onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ reportId, onClose }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'link' | 'email' | 'qr'>('link');
    const [expiry, setExpiry] = useState(24); // hours
    const [shareLink, setShareLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateLink = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const link = await createShareLink(reportId, user.uid, expiry);
            setShareLink(window.location.origin + '/shared/' + link);
        } catch (error) {
            console.error("Share failed", error);
        }
        setLoading(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-teal-600" /> Share Clinical Record
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition"><X className="w-5 h-5 text-slate-400" /></button>
                </div>

                <div className="p-6">
                    <div className="flex gap-2 mb-6 bg-slate-50 p-1 rounded-xl">
                        {['link', 'email', 'qr'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {tab === 'link' ? 'Copy Link' : tab === 'email' ? 'Email' : 'QR Code'}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'link' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Link Expiration</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[24, 168, 720].map((hours) => (
                                        <button
                                            key={hours}
                                            onClick={() => setExpiry(hours)}
                                            className={`py-2 border-2 rounded-xl text-xs font-bold transition-all ${expiry === hours ? 'border-teal-500 text-teal-600 bg-teal-50' : 'border-slate-100 text-slate-500 hover:border-slate-200'
                                                }`}
                                        >
                                            {hours === 24 ? '24 Hours' : hours === 168 ? '7 Days' : '30 Days'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {!shareLink ? (
                                <button
                                    onClick={generateLink}
                                    disabled={loading}
                                    className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-900/20 transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Generating Secure Link...' : 'Generate New Link'}
                                </button>
                            ) : (
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
                                    <div className="flex-grow truncate text-xs font-medium text-slate-600 font-mono bg-white p-2 rounded border border-slate-100">
                                        {shareLink}
                                    </div>
                                    <button
                                        onClick={copyToClipboard}
                                        className={`p-3 rounded-xl transition-all ${copied ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                                    >
                                        {copied ? <Check className="w-5 h-5" /> : <Clipboard className="w-5 h-5" />}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'email' && (
                        <div className="text-center py-8">
                            <Mail className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium text-sm mb-6">Send this report directly via your default email client.</p>
                            <a href={`mailto:?subject=Medical Report Share&body=I am sharing a medical report with you. Access it here: ${shareLink || '[Generate Link First]'}`} className="inline-block px-8 py-3 bg-slate-800 text-white font-bold rounded-xl">
                                Open Email Client
                            </a>
                        </div>
                    )}

                    {activeTab === 'qr' && (
                        <div className="flex flex-col items-center py-4">
                            {shareLink ? (
                                <>
                                    <div className="p-4 bg-white border-4 border-slate-100 rounded-3xl mb-4">
                                        <QRCodeCanvas value={shareLink} size={150} />
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scan to view</p>
                                </>
                            ) : (
                                <div className="text-center">
                                    <p className="text-slate-500 font-medium mb-4">Generate a link first to create a QR code.</p>
                                    <button onClick={generateLink} className="text-teal-600 font-bold hover:underline">Generate Link</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
