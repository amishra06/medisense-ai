
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebaseService';
import { AppUser } from './types';

// Pages & Components
import Landing from './components/Landing';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import NewDiagnosis from './components/NewDiagnosis';
import ReportHistory from './components/ReportHistory';
import ReportView from './components/ReportView';
import SharedReportView from './components/SharedReportView';
import DashboardOverview from './components/DashboardOverview';
import Settings from './components/Settings';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import HipaaPolicy from './components/HipaaPolicy';
import { ThemeProvider } from './src/contexts/ThemeContext';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });
export const useAuth = () => useContext(AuthContext);

/**
 * Fix: Explicitly define the props type for ProtectedRoute to ensure children are correctly typed.
 * Changed children to optional to resolve the "children is missing in type {}" error (line 76) in some TS/JSX configurations.
 */
interface ProtectedRouteProps {
  children?: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-teal-50">
      <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

/**
 * Fix: Removed React.FC to avoid potential issues with children typing across different React versions.
 */
const App = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>

            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Auth mode="login" />} />
            <Route path="/signup" element={<Auth mode="signup" />} />

            {/* Policy Pages */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/hipaa-policy" element={<HipaaPolicy />} />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardOverview />} />
              <Route path="new-diagnosis" element={<NewDiagnosis />} />
              <Route path="reports" element={<ReportHistory />} />
              <Route path="report/:id" element={<ReportView />} />
            </Route>

            <Route path="/shared/:shareId" element={<SharedReportView />} />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Dashboard>
                  <Settings />
                </Dashboard>
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthContext.Provider>
  );
};

export default App;
