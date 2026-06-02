import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { 
  User as UserIcon, 
  GraduationCap, 
  CreditCard, 
  ChevronLeft, 
  Mail, 
  Phone, 
  Calendar,
  Award,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';

interface StudentData {
  name: string;
  email: string;
  role: string;
  studentId?: string;
  className?: string;
  phone?: string;
  avatarUrl?: string;
}

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userData, isAdmin, isTeacher } = useAuth();
  
  const [student, setStudent] = useState<StudentData | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Check if the current user is accessing their own student profile page
    const isSelf = user?.uid === id;
    if (!isAdmin && !isTeacher && !isSelf) {
      setLoading(false);
      return;
    }

    const fetchStudentFullData = async () => {
      try {
        // 1. Fetch Profile
        const studentDoc = await getDoc(doc(db, 'users', id));
        if (studentDoc.exists()) {
          setStudent(studentDoc.data() as StudentData);
        }

        // 2. Fetch Results
        const resultsQ = query(collection(db, 'results'), where('studentId', '==', id));
        const resultsSnap = await getDocs(resultsQ);
        const fetchedResults = resultsSnap.docs.map(d => d.data());

        // Sort client-side to prevent missing index exceptions in Firestore
        fetchedResults.sort((a, b) => {
          const yearA = parseInt(a.year) || 0;
          const yearB = parseInt(b.year) || 0;
          if (yearB !== yearA) {
            return yearB - yearA;
          }
          const termOrder: Record<string, number> = { 'First': 1, 'Second': 2, 'Third': 3 };
          const termA = termOrder[a.term] || 0;
          const termB = termOrder[b.term] || 0;
          return termB - termA;
        });
        setResults(fetchedResults);

        // 3. Fetch Payments
        const paymentsQ = query(collection(db, 'payments'), where('studentId', '==', id));
        const paymentsSnap = await getDocs(paymentsQ);
        const fetchedPayments = paymentsSnap.docs.map(d => d.data());

        // Sort client-side to prevent missing index exceptions in Firestore
        fetchedPayments.sort((a, b) => {
          const rawA = a.date;
          const rawB = b.date;
          const tA = rawA?.toMillis ? rawA.toMillis() : (rawA?.seconds ? rawA.seconds * 1000 : 0);
          const tB = rawB?.toMillis ? rawB.toMillis() : (rawB?.seconds ? rawB.seconds * 1000 : 0);
          return tB - tA;
        });
        setPayments(fetchedPayments);

      } catch (err) {
        console.error("Error fetching student records:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentFullData();
  }, [id, user, isAdmin, isTeacher]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div></div>;
  if (!student) return <div className="p-8 bg-white rounded-3xl text-center">Student record not found.</div>;

  const gpaTrendData = results.map(r => ({
    term: `${r.term} ${r.year}`,
    avg: parseFloat(r.average)
  })).reverse();

  return (
    <div className="space-y-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-brand-primary transition-colors font-bold text-sm"
      >
        <ChevronLeft size={18} /> Back to Directory
      </button>

      {/* Profile Header */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-center">
        <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-slate-50 shadow-xl">
           <img src={student.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`} alt={student.name} />
        </div>
        <div className="flex-grow text-center md:text-left">
           <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl font-serif text-brand-primary font-bold">{student.name}</h1>
              <span className="bg-blue-100 text-brand-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Student
              </span>
           </div>
           <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-500 text-sm">
              <span className="flex items-center gap-1"><GraduationCap size={16}/> {student.className || 'Unassigned Class'}</span>
              <span className="flex items-center gap-1"><Mail size={16}/> {student.email}</span>
              <span className="flex items-center gap-1"><Phone size={16}/> {student.phone || 'No Phone'}</span>
           </div>
        </div>
        <div className="flex gap-2">
           <button className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-brand-accent transition-all shadow-lg shadow-brand-primary/20">
             Edit Profile
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Academic Trends */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xl font-bold text-brand-primary flex items-center gap-2">
                    <Award className="text-brand-secondary" /> Performance Analytics
                 </h3>
              </div>
              
              {gpaTrendData.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={gpaTrendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="term" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Line type="monotone" dataKey="avg" stroke="#1e3a8a" strokeWidth={3} dot={{ r: 6, fill: '#facc15', strokeWidth: 2, stroke: '#fff' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-gray-400">
                  Insufficient data for performance trending.
                </div>
              )}
           </div>

           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-brand-primary mb-6">Recent Term Reports</h3>
              <div className="space-y-4">
                 {results.length > 0 ? results.map((r, i) => (
                   <div key={i} className="flex justify-between items-center p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md transition-all">
                      <div>
                         <p className="font-bold text-gray-800">{r.term} Term {r.year}</p>
                         <p className="text-xs text-brand-accent font-bold uppercase tracking-widest">{r.remarks?.slice(0, 50)}...</p>
                      </div>
                      <div className="text-right">
                         <div className="text-sm font-bold text-brand-primary">{r.average}%</div>
                         <div className="text-[10px] text-gray-400 font-bold uppercase">Average Score</div>
                      </div>
                   </div>
                 )) : (
                   <p className="text-center py-10 text-gray-400">No academic reports available yet.</p>
                 )}
              </div>
           </div>
        </div>

        {/* Right Column: Financials & Status */}
        <div className="space-y-8">
           <div className="bg-brand-primary p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                 <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <CreditCard className="text-brand-secondary" /> Financial Standing
                 </h3>
                 <div className="mb-4">
                    <p className="text-blue-200 text-xs uppercase font-bold tracking-widest">Enrollment Status</p>
                    <p className="text-2xl font-bold text-brand-secondary">Full Enrollment</p>
                 </div>
                 <div>
                    <p className="text-blue-200 text-xs uppercase font-bold tracking-widest">Fees Balance</p>
                    <p className="text-4xl font-serif font-bold">₦0.00</p>
                 </div>
              </div>
              <div className="absolute -right-8 -bottom-8 text-white/5 w-40 h-40">
                 <CreditCard size={160} />
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-brand-primary mb-6 flex items-center gap-2">
                 <Clock className="text-brand-accent" /> Recent Activity
              </h3>
              <div className="space-y-6">
                 {payments.length > 0 ? payments.slice(0, 3).map((p, i) => (
                   <div key={i} className="flex gap-4">
                      <div className="w-1 h-10 bg-green-500 rounded-full" />
                      <div>
                         <p className="text-sm text-gray-800 font-bold">Payment: {p.description}</p>
                         <p className="text-[10px] text-gray-400 font-bold uppercase">₦{p.amount.toLocaleString()}</p>
                      </div>
                   </div>
                 )) : (
                   <p className="text-center text-sm text-gray-400">No recent activity.</p>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
