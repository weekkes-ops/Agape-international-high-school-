import { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck, GraduationCap, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document exists
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // First time login - set default as student
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          role: 'student', // Default role
          createdAt: serverTimestamp(),
          avatarUrl: user.photoURL,
        });
      }

      navigate('/portal');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-gray-100"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center text-brand-secondary font-serif text-4xl font-bold mx-auto mb-4">
            A
          </div>
          <h2 className="text-3xl font-serif text-brand-primary">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Sign in to access the Agape Education Portal</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
             <span className="font-bold">Error:</span> {error}
          </div>
        )}

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 py-4 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm mb-8 disabled:opacity-50"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          {loading ? 'Connecting...' : 'Sign in with Google'}
        </button>

        <div className="relative mb-8 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
          <span className="relative bg-white px-4 text-sm text-gray-400 uppercase tracking-widest">Portal Features</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {[
            { icon: GraduationCap, title: 'Students', text: 'Check results & pay fees' },
            { icon: Briefcase, title: 'Teachers', text: 'Upload grades & manage classes' },
            { icon: ShieldCheck, title: 'Admins', text: 'School system management' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-transparent hover:border-brand-accent/20 transition-all">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-primary shadow-sm">
                <item.icon size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-brand-primary">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-10">
          By signing in, you agree to Agape International's <br />
          <a href="#" className="underline hover:text-brand-primary transition-colors">Privacy Policy</a> and <a href="#" className="underline hover:text-brand-primary transition-colors">Terms of Service</a>
        </p>
      </motion.div>
    </div>
  );
}
