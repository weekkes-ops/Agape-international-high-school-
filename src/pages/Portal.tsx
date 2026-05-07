import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  Settings, 
  Bell, 
  LogOut, 
  BookOpen,
  PlusCircle,
  Users,
  Menu,
  X
} from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import StudentDashboard from './portal/StudentDashboard';
import TeacherDashboard from './portal/TeacherDashboard';
import AdminDashboard from './portal/AdminDashboard';
import ResultsPage from './portal/ResultsPage';
import PaymentsPage from './portal/PaymentsPage';
import StudentProfile from './portal/StudentProfile';

export default function Portal() {
  const { userData, isAdmin, isTeacher } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => signOut(auth);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/portal', exact: true },
    { icon: FileText, label: 'Results', path: '/portal/results' },
    { icon: CreditCard, label: 'Payments', path: '/portal/payments' },
    ...(isTeacher || isAdmin ? [{ icon: BookOpen, label: 'Classes', path: '/portal/classes' }] : []),
    ...(isAdmin ? [{ icon: Users, label: 'Users', path: '/portal/users' }] : []),
    { icon: Settings, label: 'Profile Settings', path: '/portal/settings' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-8">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-10 h-10 bg-brand-secondary rounded-lg flex items-center justify-center text-brand-primary font-serif text-2xl font-bold">
            A
          </div>
          <span className="font-serif font-bold tracking-tight text-white">AIHS Portal</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item, i) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={i}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-brand-secondary text-brand-primary font-bold shadow-lg' 
                    : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto p-8">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 text-red-300 hover:text-red-100 transition-colors w-full"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-brand-primary hidden md:block border-r border-gray-100 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 w-72 bg-brand-primary shadow-2xl"
            >
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-6 right-6 p-2 text-white/50 hover:text-white"
              >
                <X size={24} />
              </button>
              <SidebarContent />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow min-w-0 p-4 md:p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-brand-primary bg-white rounded-xl shadow-sm border border-slate-100"
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-serif text-brand-primary truncate max-w-[200px] md:max-w-none">
                Hello, {userData?.name}
              </h2>
              <p className="text-gray-500 text-xs md:text-sm">Welcome to your academic dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <button className="hidden sm:flex w-10 h-10 bg-white rounded-full items-center justify-center text-gray-500 shadow-sm border border-gray-100 relative">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="w-10 h-10 bg-brand-secondary rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-slate-100">
              <img src={userData?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.name || 'Agape'}`} alt="Avatar" />
            </div>
          </div>
        </header>

        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4 }}
        >
          <Routes>
            <Route index element={
              isAdmin ? <AdminDashboard /> : 
              isTeacher ? <TeacherDashboard /> : 
              <StudentDashboard />
            } />
            <Route path="results" element={<ResultsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="student/:id" element={<StudentProfile />} />
            <Route path="*" element={<div className="p-8 bg-white rounded-3xl text-center text-gray-500 border border-dashed border-slate-200">Feature Coming Soon</div>} />
          </Routes>
        </motion.div>
      </main>
    </div>
  );
}
