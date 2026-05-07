import { useAuth } from '../../context/AuthContext';
import { 
  TrendingUp, 
  Clock, 
  Calendar, 
  CreditCard,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { motion } from 'motion/react';

export default function StudentDashboard() {
  const { userData } = useAuth();

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">Current GPA</p>
            <h3 className="text-2xl font-bold text-gray-800">4.2</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">Attendance</p>
            <h3 className="text-2xl font-bold text-gray-800">96%</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">Balance</p>
            <h3 className="text-2xl font-bold text-gray-800">₦0.00</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Announcements */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-brand-primary">Announcements</h3>
            <button className="text-sm text-brand-accent hover:underline">View all</button>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Inter-house Sports Day', date: 'May 20, 2026', category: 'Events' },
              { title: 'Mid-term Exams Schedule', date: 'May 12, 2026', category: 'Academic' },
              { title: 'PTA Meeting Notification', date: 'June 5, 2026', category: 'General' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-gray-100">
                <div className="text-center w-12 flex-shrink-0">
                   <div className="text-xs font-bold text-brand-accent">{item.date.split(' ')[0]}</div>
                   <div className="text-lg font-bold text-gray-800">{item.date.split(' ')[1].replace(',', '')}</div>
                </div>
                <div className="flex-grow">
                   <h4 className="font-bold text-gray-800 group-hover:text-brand-primary transition-colors">{item.title}</h4>
                   <p className="text-sm text-gray-500">{item.category}</p>
                </div>
                <ChevronRight className="text-gray-300" size={18} />
              </div>
            ))}
          </div>
        </div>

        {/* Current Subjects */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-brand-primary">My Subjects</h3>
            <button className="text-sm text-brand-accent hover:underline">Full Schedule</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
             {[
               { name: 'Mathematics', sessions: '4/week', color: 'bg-blue-500' },
               { name: 'Physics', sessions: '3/week', color: 'bg-purple-500' },
               { name: 'English', sessions: '4/week', color: 'bg-orange-500' },
               { name: 'Biology', sessions: '2/week', color: 'bg-green-500' },
               { name: 'Economics', sessions: '3/week', color: 'bg-pink-500' },
               { name: 'History', sessions: '2/week', color: 'bg-cyan-500' },
             ].map((sub, i) => (
               <div key={i} className="p-4 rounded-xl bg-slate-50 flex items-center gap-3">
                 <div className={`w-2 h-10 rounded-full ${sub.color}`} />
                 <div>
                    <div className="font-bold text-gray-800 text-sm">{sub.name}</div>
                    <div className="text-gray-500 text-[10px] uppercase font-bold">{sub.sessions}</div>
                 </div>
               </div>
             ))}
          </div>
          <div className="mt-8 bg-brand-primary p-6 rounded-2xl text-white relative overflow-hidden">
             <div className="relative z-10">
                <h4 className="font-bold mb-2">Upcoming Exam</h4>
                <p className="text-blue-100 text-sm mb-4">You have a Mathematics test in 3 days. Good luck!</p>
                <div className="bg-white/20 px-4 py-2 rounded-lg text-xs inline-block font-bold">
                  Friday, 8th May @ 10:00 AM
                </div>
             </div>
             <BookOpen className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
