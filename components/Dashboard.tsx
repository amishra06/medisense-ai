
import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, PlusCircle, History, Shield, LogOut, Bell, Settings, User } from 'lucide-react';
import { logOut, auth } from '../services/firebaseService';
import { useAuth } from '../App';

interface DashboardProps {
   children?: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
   const { user } = useAuth();
   const navigate = useNavigate();
   const location = useLocation();

   const handleLogout = async () => {
      await logOut();
      navigate('/');
   };

   const navItems = [
      { icon: <LayoutDashboard className="w-5 h-5" />, label: "Overview", path: "/dashboard" },
      { icon: <PlusCircle className="w-5 h-5" />, label: "New Diagnosis", path: "/dashboard/new-diagnosis" },
      { icon: <History className="w-5 h-5" />, label: "Report History", path: "/dashboard/reports" },
   ];

   return (
      <div className="min-h-screen bg-[#f1f5f9] flex">
         {/* Sidebar */}
         <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
            <div className="p-8 border-b border-slate-100">
               <Link to="/" className="flex items-center gap-3">
                  <div className="bg-teal-600 p-2 rounded-xl shadow-lg shadow-teal-200">
                     <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-black text-slate-800 tracking-tight">MediSense AI</span>
               </Link>
            </div>

            <nav className="flex-grow p-6 space-y-2">
               {navItems.map((item, i) => (
                  <Link
                     key={i} to={item.path}
                     className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
                        ? 'bg-teal-50 text-teal-700 border border-teal-100 shadow-sm'
                        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                        }`}
                  >
                     {item.icon}
                     {item.label}
                  </Link>
               ))}
            </nav>

            <div className="p-6 border-t border-slate-100 space-y-4">
               <Link to="/settings" className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 font-bold hover:text-slate-600 transition">
                  <Settings className="w-5 h-5" />
                  Settings
               </Link>
               <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 font-bold hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition">
                  <LogOut className="w-5 h-5" />
                  Log Out
               </button>
            </div>
         </aside>

         {/* Main Content */}
         <div className="flex-grow flex flex-col">
            <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
               <div className="flex items-center gap-4">
                  <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Clinical Workspace</h2>
                  <div className="h-4 w-px bg-slate-200" />
                  <div className="flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-100 rounded-full">
                     <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
                     <span className="text-[10px] font-black text-teal-700 uppercase tracking-widest">Systems Active</span>
                  </div>
               </div>

               <div className="flex items-center gap-6">
                  <button className="relative p-2 text-slate-400 hover:text-teal-600 transition">
                     <Bell className="w-5 h-5" />
                     <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                  </button>
                  <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
                     <div className="text-right">
                        <p className="text-xs font-black text-slate-800 tracking-tight leading-none mb-1">{user?.displayName || 'Physician'}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Standard Tier</p>
                     </div>
                     {user?.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-xl border border-slate-100 object-cover" />
                     ) : (
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                           <User className="w-6 h-6" />
                        </div>
                     )}
                  </div>
               </div>
            </header>

            <main className="p-8 max-w-7xl mx-auto w-full">
               {children || <Outlet />}
            </main>
         </div>
      </div>
   );
};

export default Dashboard;
