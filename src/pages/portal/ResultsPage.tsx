import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { FileDown, FileText, Download, Award, TrendingUp } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface Result {
  id: string;
  term: string;
  year: string;
  totalScore: number;
  average: number;
  grades: Record<string, number>;
  remarks: string;
  studentName?: string;
  studentId: string;
}

export default function ResultsPage() {
  const { user, userData, isAdmin, isTeacher } = useAuth();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        let q;
        const resultsRef = collection(db, 'results');

        if (isAdmin) {
          q = query(resultsRef, orderBy('year', 'desc'));
        } else if (isTeacher) {
          q = query(
            resultsRef, 
            where('teacherId', '==', user.uid),
            orderBy('year', 'desc')
          );
        } else {
          q = query(
            resultsRef,
            where('studentId', '==', user.uid),
            orderBy('year', 'desc')
          );
        }

        const querySnapshot = await getDocs(q);
        const fetchedResults = querySnapshot.docs.map(doc => {
          const data = doc.data() as any;
          return {
            id: doc.id,
            studentId: data.studentId || 'N/A',
            ...data
          } as Result;
        });
        setResults(fetchedResults);
      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user, isAdmin, isTeacher]);

  const formatChartData = (grades: Record<string, number>) => {
    return Object.entries(grades).map(([subject, score]) => ({
      subject: subject.charAt(0) + subject.slice(1).toLowerCase(),
      score
    }));
  };

  const COLORS = ['#1e3a8a', '#3b82f6', '#facc15', '#60a5fa', '#eab308'];

  const sampleChartData = [
    { subject: 'Math', score: 85 },
    { subject: 'English', score: 78 },
    { subject: 'Physics', score: 92 },
    { subject: 'Chemistry', score: 81 },
    { subject: 'History', score: 88 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-brand-primary">Academic Performance</h2>
          <p className="text-gray-500 text-sm">Official results and term reports</p>
        </div>
        <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center">
            <Award size={24} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
        </div>
      ) : results.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingUp size={40} className="text-brand-accent" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Visual Performance Analysis</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto mb-10">
            Once your results are published, interactive charts like the one below will visualize your scores across all subjects.
          </p>
          
          <div className="bg-slate-50 p-8 rounded-3xl max-w-2xl mx-auto border border-dashed border-gray-200">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 text-left">Preview: Term Performance Distribution</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sampleChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="subject" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={40}>
                    {sampleChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {results.map((result) => (
            <div key={result.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
               <div className="flex justify-between items-start mb-6">
                 <div>
                    {(isAdmin || isTeacher) && (result.studentName || result.studentId) && (
                      <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest mb-1">
                        Student: {result.studentName || 'Unknown'} {result.studentId !== 'N/A' && `(${result.studentId})`}
                      </p>
                    )}
                    <h3 className="font-bold text-xl text-gray-800">{result.term} Term</h3>
                    <p className="text-gray-500 text-sm">Academic Year {result.year}</p>
                 </div>
                 <button className="p-2 text-brand-primary hover:bg-brand-primary hover:text-white rounded-lg transition-all flex items-center gap-2 text-sm font-bold border border-brand-primary/20">
                    <Download size={16} /> Report
                 </button>
               </div>
               
               <div className="h-64 w-full mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={formatChartData(result.grades)}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="subject" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 11 }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="score" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={30}>
                        {formatChartData(result.grades).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.score >= 80 ? '#1e3a8a' : entry.score >= 60 ? '#3b82f6' : '#facc15'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100">
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Aggregate</p>
                     <p className="text-2xl font-bold text-brand-primary">{result.average}%</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100">
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Standing</p>
                     <p className="text-2xl font-bold text-brand-primary">Excellent</p>
                  </div>
               </div>

               <div className="space-y-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <p className="text-xs font-bold text-brand-primary uppercase tracking-widest">Faculty Remarks</p>
                  <p className="text-sm italic text-gray-700 leading-relaxed">
                    "{result.remarks}"
                  </p>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
