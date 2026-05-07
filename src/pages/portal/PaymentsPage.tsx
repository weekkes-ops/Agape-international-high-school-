import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, query, where, getDocs, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { CreditCard, History, CheckCircle2, AlertCircle, Plus, X, Wallet, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { handleFirestoreError, OperationType } from '../../lib/firestoreUtils';

interface Payment {
  id: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
  date: any;
}

export default function PaymentsPage() {
  const { user, userData } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    description: 'Tuition Fees',
    paymentMethod: 'Card'
  });

  const fetchPayments = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'payments'),
        where('studentId', '==', user.uid),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      setPayments(querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        date: doc.data().date?.toDate ? doc.data().date.toDate().toLocaleDateString() : 'Just now'
      })) as any[]);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user]);

  const handleMakePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    
    try {
      const amount = parseFloat(paymentForm.amount);
      if (isNaN(amount) || amount <= 0) throw new Error("Please enter a valid amount");

      await addDoc(collection(db, 'payments'), {
        studentId: user.uid,
        studentName: userData?.name || 'Student',
        amount: amount,
        currency: 'NGN',
        date: serverTimestamp(),
        status: 'paid', // For demo we mark as paid immediately
        description: paymentForm.description,
        paymentMethod: paymentForm.paymentMethod,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setIsModalOpen(false);
      setPaymentForm({ amount: '', description: 'Tuition Fees', paymentMethod: 'Card' });
      fetchPayments();
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, 'payments');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-brand-primary text-white p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <p className="text-blue-200 uppercase tracking-widest text-xs font-bold mb-3">Student Financial Summary</p>
          <div className="flex flex-col md:flex-row md:items-end gap-2 mb-8">
            <h2 className="text-5xl font-serif">₦ 0.00</h2>
            <span className="text-blue-300 text-sm mb-2">Outstanding Balance</span>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-secondary text-brand-primary px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-white transition-all transform hover:-translate-y-1 shadow-lg"
          >
            <Plus size={20} /> Make a Payment
          </button>
        </div>
        <div className="absolute -right-20 -bottom-20 text-white/5 w-96 h-96 opacity-20">
          <CreditCard size={384} className="rotate-12" />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 text-brand-primary rounded-2xl flex items-center justify-center">
              <History size={24} />
            </div>
            <h3 className="text-2xl font-bold text-brand-primary">Payment History</h3>
          </div>
          <button onClick={fetchPayments} className="text-sm font-semibold text-brand-accent hover:underline">Refresh</button>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-primary"></div>
              <p className="text-gray-400 text-sm">Reviewing transactions...</p>
            </div>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CreditCard size={40} className="text-gray-300" />
             </div>
             <p className="text-gray-500 font-medium">No payment history found for this session.</p>
             <p className="text-gray-400 text-sm mt-1">Start by making your first fee payment above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map(p => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={p.id} 
                className="flex flex-wrap justify-between items-center p-6 border border-slate-100 rounded-3xl hover:bg-slate-50 transition-all hover:shadow-sm"
              >
                <div className="flex items-center gap-5">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                     p.status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                   }`}>
                     {p.status === 'paid' ? <CheckCircle2 size={28} /> : <AlertCircle size={28} />}
                   </div>
                   <div>
                      <p className="font-bold text-gray-800 text-lg">{p.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <span className="flex items-center gap-1"><History size={14}/> {p.date}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>ID: {p.id.slice(0, 8)}</span>
                      </div>
                   </div>
                </div>
                <div className="text-right mt-4 sm:mt-0 w-full sm:w-auto flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                  <p className="font-bold text-gray-900 text-xl font-serif">₦{p.amount.toLocaleString()}</p>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest ${
                    p.status === 'paid' ? 'bg-green-100/50 text-green-700' : 'bg-yellow-100/50 text-yellow-700'
                  }`}>{p.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-primary/20 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl p-8 overflow-hidden"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors bg-slate-50 rounded-full"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-brand-secondary text-brand-primary rounded-2xl flex items-center justify-center shadow-md">
                   <Wallet size={24} />
                </div>
                <div>
                   <h3 className="text-2xl font-bold text-brand-primary">Secure Payment</h3>
                   <p className="text-gray-500 text-sm">Enter transaction details below</p>
                </div>
              </div>

              <form onSubmit={handleMakePayment} className="space-y-6">
                 <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Payment Description</label>
                    <select 
                       value={paymentForm.description}
                       onChange={e => setPaymentForm({...paymentForm, description: e.target.value})}
                       className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-2 focus:ring-brand-accent outline-none appearance-none font-medium"
                    >
                       <option>Tuition Fees (Term 1)</option>
                       <option>Medical Insurace</option>
                       <option>Uniforms & Kits</option>
                       <option>Exam Registration</option>
                       <option>Bus Service</option>
                    </select>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Amount (₦)</label>
                        <input 
                           type="number"
                           required
                           step="0.01"
                           min="100"
                           placeholder="0.00"
                           value={paymentForm.amount}
                           onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-2 focus:ring-brand-accent outline-none font-bold text-xl"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Method</label>
                        <select 
                           value={paymentForm.paymentMethod}
                           onChange={e => setPaymentForm({...paymentForm, paymentMethod: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-2 focus:ring-brand-accent outline-none appearance-none font-medium"
                        >
                           <option>Credit/Debit Card</option>
                           <option>Bank Transfer</option>
                           <option>Digital Wallet</option>
                        </select>
                    </div>
                 </div>

                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex justify-between text-sm">
                       <span className="text-gray-500">Processing Fee</span>
                       <span className="font-bold">₦0.00</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-brand-primary pt-2 border-t border-slate-200">
                       <span>Total to Pay</span>
                       <span className="font-serif italic font-bold">₦{parseFloat(paymentForm.amount || '0').toLocaleString()}</span>
                    </div>
                 </div>

                 <button 
                   type="submit"
                   disabled={isSubmitting}
                   className="w-full bg-brand-primary text-white py-5 rounded-[1.25rem] font-bold flex items-center justify-center gap-3 hover:bg-brand-accent transition-all shadow-xl disabled:opacity-50 group"
                 >
                   {isSubmitting ? (
                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                   ) : (
                     <>Proceed to Secure Hub <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                   )}
                 </button>

                 <p className="text-center text-[10px] text-gray-400 font-medium px-8">
                   Transactions are secured by Agape FinTech encryption. By proceeding, you authorize this charge for educational purposes.
                 </p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
