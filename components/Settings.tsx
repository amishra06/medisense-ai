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
                theme: theme
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
                alert(`Successfully deleted ${deletedCount} old report(s).`);
            } else {
                alert("No reports found older than the specified retention period.");
            }
        } catch (err) {
            console.error("Cleanup error:", err);
            alert("Failed to cleanup old reports.");
        }
        setLoading(false);
    };

    const handleDeleteAccount = async () => {
        if (!user || deleteConfirmText !== 'DELETE') return;
        setIsDeleting(true);

        try {
            // 1. Delete all user reports
            const reportsRef = collection(db, 'users', user.uid, 'reports');
            const reportsSnapshot = await getDocs(reportsRef);
            const batch = writeBatch(db);
            reportsSnapshot.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();

            // 2. Delete all user storage files
            const storageRef = ref(storage, `users/${user.uid}`);
            try {
                const fileList = await listAll(storageRef);
                await Promise.all(fileList.items.map(item => deleteObject(item)));
            } catch (err) {
                console.log("No storage files to delete or error:", err);
            }

            // 3. Delete user document
            await deleteDoc(doc(db, 'users', user.uid));

            // 4. Re-authenticate and delete account
            const provider = new GoogleAuthProvider();
            await reauthenticateWithPopup(auth.currentUser!, provider);
            await deleteUser(auth.currentUser!);

            navigate('/');
        } catch (err) {
            console.error("Account deletion error:", err);
            alert("Failed to delete account. Please try again or contact support.");
        }
        setIsDeleting(false);
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy & Data', icon: Shield },
        { id: 'display', label: 'Display', icon: Palette },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-800 dark:text-gray-100 mb-2">Account Settings</h1>
                    <p className="text-slate-600 dark:text-gray-400">Manage your preferences and account settings.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Tabs */}
                    <div className="lg:w-64 space-y-2">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                                        activeTab === tab.id
                                            ? 'bg-teal-600 text-white shadow-lg'
                                            : 'bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 md:p-8">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                                        Display Name
                                    </label>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-slate-800 dark:text-gray-100"
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="w-full px-4 py-3 border border-slate-200 dark:border-gray-600 rounded-xl bg-slate-50 dark:bg-gray-900 text-slate-500 dark:text-gray-400 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-700 rounded-xl">
                                    <div>
                                        <p className="font-semibold text-slate-800 dark:text-gray-100">Email Notifications</p>
                                        <p className="text-sm text-slate-500 dark:text-gray-400">Receive updates via email</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={preferences.emailNotifications}
                                        onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                                        className="w-5 h-5 rounded border-slate-300 dark:border-gray-600 text-teal-600 focus:ring-teal-500"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-700 rounded-xl">
                                    <div>
                                        <p className="font-semibold text-slate-800 dark:text-gray-100">Report Reminders</p>
                                        <p className="text-sm text-slate-500 dark:text-gray-400">Get reminded about pending reports</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={preferences.reportReminders}
                                        onChange={(e) => setPreferences({ ...preferences, reportReminders: e.target.checked })}
                                        className="w-5 h-5 rounded border-slate-300 dark:border-gray-600 text-teal-600 focus:ring-teal-500"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Privacy & Data Tab */}
                        {activeTab === 'privacy' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3">
                                        Data Retention Period
                                    </label>
                                    <select
                                        value={preferences.dataRetention}
                                        onChange={(e) => setPreferences({ ...preferences, dataRetention: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 border border-slate-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-slate-800 dark:text-gray-100"
                                    >
                                        <option value={30}>30 days</option>
                                        <option value={90}>90 days</option>
                                        <option value={180}>6 months</option>
                                        <option value={365}>1 year</option>
                                        <option value={730}>2 years</option>
                                        <option value={-1}>Keep forever</option>
                                    </select>
                                </div>

                                <button
                                    onClick={runManualCleanup}
                                    disabled={loading}
                                    className="w-full px-4 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : 'Run Cleanup Now'}
                                </button>

                                <div className="border-t border-slate-200 dark:border-gray-700 pt-6 mt-6">
                                    <button
                                        onClick={() => setDeleteModalOpen(true)}
                                        className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Display Tab */}
                        {activeTab === 'display' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-4">
                                        Theme Preference
                                    </label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {(['light', 'dark', 'system'] as const).map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setTheme(t)}
                                                className={`p-6 rounded-xl border-2 transition-all ${
                                                    theme === t
                                                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 shadow-lg'
                                                        : 'border-slate-200 dark:border-gray-600 hover:border-slate-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                                                }`}
                                            >
                                                <div className="flex flex-col items-center gap-3">
                                                    {t === 'light' && <Sun className={`w-6 h-6 ${theme === t ? 'text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-gray-400'}`} />}
                                                    {t === 'dark' && <Moon className={`w-6 h-6 ${theme === t ? 'text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-gray-400'}`} />}
                                                    {t === 'system' && <Smartphone className={`w-6 h-6 ${theme === t ? 'text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-gray-400'}`} />}
                                                    <span className={`text-sm font-semibold capitalize ${theme === t ? 'text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-gray-400'}`}>
                                                        {t}
                                                    </span>
                                                    {theme === t && <Check className="w-5 h-5 text-teal-600 dark:text-teal-400" />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="mt-8 flex items-center gap-4">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition disabled:opacity-50 flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                            {saved && (
                                <span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                                    <Check className="w-4 h-4" /> Saved!
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                            <h3 className="text-xl font-bold text-slate-800 dark:text-gray-100">Delete Account</h3>
                        </div>
                        <p className="text-slate-600 dark:text-gray-400 mb-6">
                            This will permanently delete your account, all reports, and associated data. This action cannot be undone.
                        </p>
                        <p className="text-sm text-slate-700 dark:text-gray-300 font-semibold mb-2">
                            Type <span className="text-red-600 dark:text-red-400">DELETE</span> to confirm:
                        </p>
                        <input
                            type="text"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 dark:border-gray-600 rounded-xl mb-6 bg-white dark:bg-gray-700 text-slate-800 dark:text-gray-100"
                            placeholder="DELETE"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setDeleteModalOpen(false); setDeleteConfirmText(''); }}
                                className="flex-1 px-4 py-3 bg-slate-200 dark:bg-gray-700 text-slate-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-slate-300 dark:hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                                className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition disabled:opacity-50"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
