import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function Navbar() {
  const { user, userData } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center text-brand-secondary font-serif text-2xl font-bold">
            A
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-brand-primary leading-tight uppercase tracking-tighter">Agape International</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">High School Portal</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/#home" className="text-gray-600 hover:text-brand-primary font-semibold transition-colors">Home</Link>
          <a href="/#academics" className="text-gray-600 hover:text-brand-primary font-semibold transition-colors">Academic</a>
          <a href="/#admission" className="text-gray-600 hover:text-brand-primary font-semibold transition-colors">Admission</a>
          <a href="/#about" className="text-gray-600 hover:text-brand-primary font-semibold transition-colors">About</a>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/portal" className="bg-brand-primary text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-brand-accent transition-colors">
                <User size={18} /> {userData?.name || 'Portal'}
              </Link>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-brand-secondary text-brand-primary px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-brand-primary hover:text-white transition-all">
              <LogIn size={18} /> Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-gray-600" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 shadow-xl">
          <Link to="/#home" className="block py-2 font-semibold text-gray-700" onClick={() => setIsOpen(false)}>Home</Link>
          <a href="/#academics" className="block py-2 font-semibold text-gray-700" onClick={() => setIsOpen(false)}>Academic</a>
          <a href="/#admission" className="block py-2 font-semibold text-gray-700" onClick={() => setIsOpen(false)}>Admission</a>
          <a href="/#about" className="block py-2 font-semibold text-gray-700" onClick={() => setIsOpen(false)}>About</a>
          {user ? (
            <>
              <Link to="/portal" className="block py-2 font-semibold text-brand-primary" onClick={() => setIsOpen(false)}>Portal</Link>
              <button onClick={handleLogout} className="w-full text-left py-2 font-semibold text-red-500">Logout</button>
            </>
          ) : (
            <Link to="/login" className="block py-2 font-semibold text-brand-accent" onClick={() => setIsOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}
