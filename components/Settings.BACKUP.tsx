import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { useTheme } from '../src/contexts/ThemeContext';
import { User, Bell, Lock, Shield, Palette, Smartphone, Check, Save, AlertTriangle, Trash2, Moon, Sun } from 'lucide-react';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { updateProfile, deleteUser, GoogleAuthProvider, reauthenticateWithPopup } from 'firebase/auth';
import { db, auth, storage } from '../services/firebaseService';
import { useNavigate } from 'react-router-dom';
import { ref, deleteObject, listAll } from 'firebase/storage';

const Settings: React.FC = () => {
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // State for form fields

    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        reportReminders: false,
        dataRetention: 30, // days
        anonymousStats: true
        // REMOVED: theme - using ThemeContext instead
    });

    const [displayName, setDisplayName] = useState('');

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || '');
            // Load settings from Firestore
            const loadSettings = async () => {
                try {
                    const snap = await getDoc(doc(db, 'users', user.uid, 'settings', 'preferences'));
                    if (snap.exists()) {
                        const data = snap.data();
                        setPreferences(prev => ({ ...prev, ...data }));
                        // Apply theme from Firestore if it exists
                        if (data.theme) {
                            setTheme(data.theme);
                        }
                    }
                } catch (e) {
                    console.error("Error loading settings", e);
                }
            };
            loadSettings();
        }
    }, [user, setTheme]);

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Save preferences + current theme to Firestore
            await setDoc(doc(db, 'users', user.uid, 'settings', 'preferences'), {
                ...preferences,
                theme: theme // Save current theme from context
            }, { merge: true });

            // Update Auth Profile if changed
            if (user.displayName !== displayName) {
                await updateProfile(auth.currentUser!, { displayName: displayName });
            }

            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error("Error saving settings:", err);
            alert("Failed to save settings. Please try again.");
        }
        setLoading(false);
    };

    const runManualCleanup = async () => {
        if (!user) return;
        if (!window.confirm(`Are you sure you want to delete reports older than ${preferences.dataRetention} days? This cannot be undone.`)) return;

        setLoading(true);
        try {
            // Calculate cutoff date
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - preferences.dataRetention);

            const reportsRef = collection(db, 'users', user.uid, 'reports');
            const snapshot = await getDocs(reportsRef);

            const batch = writeBatch(db);
            let deletedCount = 0;

            snapshot.docs.forEach(doc => {
                const data = doc.data();
                if (data.createdAt && data.createdAt.toDate() < cutoffDate) {
                    batch.delete(doc.ref);
                    deletedCount++;
                }
            });

            if (deletedCount > 0) {
                await batch.commit();
                alert(`Successfully deleted ${deletedCount} old reports.`);
            } else {
                alert("No reports found matching criteria for deletion.");
            }

        } catch (err) {
            console.error("Cleanup error:", err);
            alert("Error running cleanup.");
        }
        setLoading(false);
    };

    const handleDeleteAccount = async () => {
        if (!user || deleteConfirmText !== 'DELETE') return;
        setIsDeleting(true);
        try {
            // Re-authenticate first
            const provider = new GoogleAuthProvider();
            await reauthenticateWithPopup(auth.currentUser!, provider);

            // 1. Delete Reports
            const reportsRef = collection(db, 'users', user.uid, 'reports');
            const reportsSnapshot = await getDocs(reportsRef);
            const batch = writeBatch(db);
            reportsSnapshot.docs.forEach(d => batch.delete(d.ref));
            await batch.commit();

            // 2. Delete Settings
            await deleteDoc(doc(db, 'users', user.uid, 'settings', 'preferences'));

            // 3. Delete Storage (Avatar & Report Media) - Simplified for client-side
            // Note: Client SDK can't easily delete folders, better handled by Cloud Functions.
            // We will attempt to delete what we can or rely on a backend trigger in a real app.

            // 4. Delete Firestore User Doc
            await deleteDoc(doc(db, 'users', user.uid));

            // 5. Delete Auth User
            await deleteUser(auth.currentUser!);

            // Navigate away
            navigate('/');
            alert("Your account has been successfully deleted.");

        } catch (err: any) {
            console.error("Delete account error:", err);
            if (err.code === 'auth/requires-recent-login') {
                alert("Please log in again before deleting your account for security.");
            } else {
                alert("Failed to delete account. Please try again or contact support.");
            }
        }
        setIsDeleting(false);
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-20">
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-8">Account Settings</h1>

            <div className="grid md:grid-cols-12 gap-8">
                {/* Sidebar Navigation */}
                <div className="md:col-span-3 space-y-2">
                    {[
                        { id: 'profile', icon: User, label: 'Profile' },
                        { id: 'notifications', icon: Bell, label: 'Notifications' },
                        { id: 'privacy', icon: Shield, label: 'Privacy & Data' },
                        { id: 'display', icon: Palette, label: 'Display' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab.id
                                ? 'bg-teal-50 text-teal-700 shadow-sm dark:bg-teal-900/20 dark:text-teal-400'
                                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800 dark:text-slate-500'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="md:col-span-9 space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl shadow-teal-900/5 border border-slate-50 dark:border-slate-700 min-h-[500px] transition-colors duration-200">

                        {activeTab === 'profile' && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-black text-slate-800 dark:text-white mb-2">Public Profile</h2>
                                    <p className="text-slate-400 text-sm font-medium">Manage how you are identified in the system.</p>
                                </div>

                                <div className="flex items-center gap-6">
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-600" />
                                    ) : (
                                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-slate-300 dark:text-slate-500">
                                            <User className="w-8 h-8" />
                                        </div>
                                    )}
                                    <div>
                                        <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition">Change Photo</button>
                                        <p className="text-[10px] text-slate-400 mt-2">JPG or PNG. Max 2MB.</p>
                                    </div>
                                </div>

                                <div className="space-y-4 max-w-md">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Display Name</label>
                                        <input
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Email Address</label>
                                        <input type="email" defaultValue={user?.email || ''} disabled className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-400 cursor-not-allowed" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-black text-slate-800 dark:text-white mb-2">Notification Preferences</h2>
                                    <p className="text-slate-400 text-sm font-medium">Control when and how we contact you.</p>
                                </div>

                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-700 rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-xl"><Smartphone className="w-5 h-5" /></div>
                                            <span className="font-bold text-slate-700 dark:text-slate-200">Email Analysis Reports</span>
                                        </div>
                                        <input type="checkbox"
                                            checked={preferences.emailNotifications}
                                            onChange={e => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                                            className="w-5 h-5 accent-teal-600"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-700 rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl"><Bell className="w-5 h-5" /></div>
                                            <span className="font-bold text-slate-700 dark:text-slate-200">Weekly Health Summary</span>
                                        </div>
                                        <input type="checkbox"
                                            checked={preferences.reportReminders}
                                            onChange={e => setPreferences({ ...preferences, reportReminders: e.target.checked })}
                                            className="w-5 h-5 accent-teal-600"
                                        />
                                    </label>
                                </div>
                            </div>
                        )}

                        {activeTab === 'privacy' && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-black text-slate-800 dark:text-white mb-2">Privacy & Data Check</h2>
                                    <p className="text-slate-400 text-sm font-medium">Manage your data retention preferences.</p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Auto-Delete Reports Older Than</label>
                                        <select
                                            value={preferences.dataRetention}
                                            onChange={e => setPreferences({ ...preferences, dataRetention: parseInt(e.target.value) })}
                                            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        >
                                            <option value={30}>30 Days (Recommended)</option>
                                            <option value={90}>90 Days</option>
                                            <option value={365}>1 Year</option>
                                            <option value={-1}>Keep Indefinitely</option>
                                        </select>
                                    </div>

                                    <div className="pt-4">
                                        <button onClick={runManualCleanup} className="text-xs font-bold text-teal-600 hover:text-teal-700 underline">Run Manual Cleanup Now</button>
                                    </div>

                                    <div className="p-6 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-3xl mt-8">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-xl shrink-0">
                                                <AlertTriangle className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-rose-700 dark:text-rose-400 font-bold mb-1">Danger Zone</h4>
                                                <p className="text-rose-600/80 dark:text-rose-400/70 text-sm">Permanently delete your account and all associated medical data.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setDeleteModalOpen(true)}
                                            className="w-full py-3 bg-white dark:bg-rose-950 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-rose-50 dark:hover:bg-rose-900/20 transition shadow-sm"
                                        >
                                            Delete My Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'display' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3">
                                        Theme Preference
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {(['light', 'dark', 'system'] as const).map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setTheme(t)}
                                                className={`p-4 rounded-xl border-2 transition-all ${theme === t
                                                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                                                        : 'border-slate-200 dark:border-gray-700 hover:border-slate-300 dark:hover:border-gray-600'
                                                    }`}
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    {t === 'light' && <Sun className="w-5 h-5" />}
                                                    {t === 'dark' && <Moon className="w-5 h-5" />}
                                                    {t === 'system' && <Smartphone className="w-5 h-5" />}
                                                    <span className="text-sm font-semibold capitalize">{t}</span>
                                                    {theme === t && <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    <div className="flex justify-end gap-3 pb-8">
                        <button onClick={handleSave} disabled={loading} className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-900/20 transition-all flex items-center gap-2 disabled:opacity-50">
                            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                            {saved ? 'Changes Saved' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-2xl max-w-md w-full border border-slate-100 dark:border-slate-700">
                        <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-3xl flex items-center justify-center mb-6 mx-auto">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-center text-slate-800 dark:text-white mb-2">Delete Account?</h3>
                        <p className="text-center text-slate-500 dark:text-slate-400 mb-8 font-medium">
                            This action cannot be undone. All your reports, medical data, and settings will be permanently erased.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Type "DELETE" to confirm</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-center tracking-widest text-slate-800 dark:text-white"
                                    placeholder="DELETE"
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-4">
                                <button
                                    onClick={() => setDeleteModalOpen(false)}
                                    className="p-3 font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                                    className="p-3 bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-900/20 disabled:opacity-50 hover:bg-rose-700 transition"
                                >
                                    {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
