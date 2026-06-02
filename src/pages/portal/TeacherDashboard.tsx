import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  FileSpreadsheet, 
  Search,
  CheckCircle2,
  Users,
  ChevronRight,
  X
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function TeacherDashboard() {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const AVAILABLE_SUBJECTS = [
    'Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 
    'Economics', 'Geography', 'Literature', 'Government', 'Civic Education', 
    'Agricultural Science', 'Further Mathematics'
  ];

  const [formData, setFormData] = useState({
    studentId: '',
    term: 'First',
    year: '2026',
    remarks: '',
    grades: {} as Record<string, number>
  });

  const [selectedSubject, setSelectedSubject] = useState(AVAILABLE_SUBJECTS[0]);

  const handleAddSubject = () => {
    if (!formData.grades[selectedSubject]) {
      setFormData({
        ...formData,
        grades: { ...formData.grades, [selectedSubject]: 0 }
      });
    }
  };

  const handleRemoveSubject = (subject: string) => {
    const newGrades = { ...formData.grades };
    delete newGrades[subject];
    setFormData({ ...formData, grades: newGrades });
  };

  const updateGrade = (subject: string, score: number) => {
    setFormData({
      ...formData,
      grades: { ...formData.grades, [subject]: score }
    });
  };

  const calculateAverage = () => {
    const scores = Object.values(formData.grades) as number[];
    if (scores.length === 0) return "0";
    const sum = scores.reduce((a, b) => a + b, 0);
    return (sum / scores.length).toFixed(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(formData.grades).length === 0) {
      alert("Please add at least one subject score.");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'results'), {
        studentId: formData.studentId,
        studentName: 'Student Name', // Should fetch but for demo we simplify
        teacherId: userData?.id || '',
        teacherName: userData?.name || 'Teacher',
        term: formData.term,
        year: formData.year,
        grades: formData.grades,
        average: calculateAverage(),
        remarks: formData.remarks,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setFormData({
        studentId: '',
        term: 'First',
        year: '2026',
        remarks: '',
        grades: {}
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Results Entry Form */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
           <h3 className="text-xl font-bold text-brand-primary mb-6 flex items-center gap-2">
             <Plus className="text-brand-accent" /> Record Student Results
           </h3>
           
           <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Student ID</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.studentId}
                    onChange={e => setFormData({...formData, studentId: e.target.value})}
                    className="w-full bg-slate-50 border border-gray-100 rounded-xl p-3 focus:ring-2 focus:ring-brand-accent outline-none" 
                    placeholder="e.g. USER_ID_123"
                    required
                  />
                  {formData.studentId && (
                    <Link 
                      to={`/portal/student/${formData.studentId}`}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-brand-primary text-white px-2 py-1 rounded-md font-bold uppercase"
                    >
                      Verify Profile
                    </Link>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Term</label>
                    <select 
                      value={formData.term}
                      onChange={e => setFormData({...formData, term: e.target.value})}
                      className="w-full bg-slate-50 border border-gray-100 rounded-xl p-3"
                    >
                       <option>First</option>
                       <option>Second</option>
                       <option>Third</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Year</label>
                    <input 
                      type="text" 
                      value={formData.year}
                      onChange={e => setFormData({...formData, year: e.target.value})}
                      className="w-full bg-slate-50 border border-gray-100 rounded-xl p-3" 
                    />
                 </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-4">
                 <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Subject Assessment</label>
                 <div className="flex gap-2 mb-6">
                    <select 
                      value={selectedSubject}
                      onChange={e => setSelectedSubject(e.target.value)}
                      className="flex-grow bg-white border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-accent outline-none text-sm"
                    >
                       {AVAILABLE_SUBJECTS.map(s => (
                         <option key={s} value={s}>{s}</option>
                       ))}
                    </select>
                    <button 
                      type="button"
                      onClick={handleAddSubject}
                      className="bg-brand-secondary text-brand-primary px-4 rounded-xl font-bold hover:bg-white transition-all shadow-sm flex items-center gap-1 text-sm border border-transparent hover:border-brand-primary/10"
                    >
                       <Plus size={18} /> Add
                    </button>
                 </div>

                 <div className="space-y-3">
                   {Object.entries(formData.grades).map(([subject, score]) => (
                     <div key={subject} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 group">
                        <span className="flex-grow text-sm font-bold text-gray-700">{subject}</span>
                        <input 
                          type="number" 
                          max="100" 
                          min="0"
                          value={score}
                          onChange={e => updateGrade(subject, parseInt(e.target.value) || 0)}
                          className="w-16 bg-slate-50 border border-slate-100 rounded-lg p-2 text-center font-bold text-brand-primary" 
                        />
                        <button 
                          type="button"
                          onClick={() => handleRemoveSubject(subject)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                           <X size={16} />
                        </button>
                     </div>
                   ))}

                   {Object.keys(formData.grades).length === 0 && (
                     <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
                        <p className="text-xs text-gray-400 font-medium">No subjects added yet.</p>
                     </div>
                   )}

                   {Object.keys(formData.grades).length > 0 && (
                     <div className="pt-4 mt-4 border-t border-slate-200 flex justify-between items-center px-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Aggregate Score</span>
                        <span className="text-lg font-bold text-brand-primary">{calculateAverage()}%</span>
                     </div>
                   )}
                 </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">General Remarks</label>
                <textarea 
                  value={formData.remarks}
                  onChange={e => setFormData({...formData, remarks: e.target.value})}
                  className="w-full bg-slate-50 border border-gray-100 rounded-xl p-3 h-24" 
                  placeholder="Student academic performance notes..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-accent transition-all disabled:opacity-50"
              >
                {loading ? 'Publishing...' : success ? <><CheckCircle2 /> Published!</> : 'Publish Results'}
              </button>
           </form>
        </div>

        {/* Classes Overview */}
        <div className="space-y-6">
           <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-brand-primary mb-6 flex items-center gap-2">
                <Users className="text-brand-accent" size={20} /> Class Directory
              </h3>
              <div className="space-y-4">
                 {[
                   { id: 'student_1', name: 'John Doe', class: 'SS3 Gold', status: '82%' },
                   { id: 'student_2', name: 'Michael Chen', class: 'SS3 Gold', status: '75%' },
                   { id: 'student_3', name: 'Sarah Wilson', class: 'SS3 Gold', status: '91%' },
                 ].map((std, i) => (
                   <Link 
                     key={i} 
                     to={`/portal/student/${std.id}`}
                     className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center group hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                   >
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-primary group-hover:bg-brand-secondary group-hover:text-brand-primary transition-all">
                            <Users size={18} />
                         </div>
                         <div>
                            <h4 className="font-bold">{std.name}</h4>
                            <p className="text-xs text-gray-500 group-hover:text-blue-100">{std.class}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="text-right">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-brand-accent group-hover:text-white">Avg. Score</div>
                            <div className="text-xs font-bold">{std.status}</div>
                         </div>
                         <ChevronRight size={16} className="text-gray-300 group-hover:text-white" />
                      </div>
                   </Link>
                 ))}
              </div>
           </div>

           <div className="bg-blue-600 p-8 rounded-3xl text-white relative overflow-hidden shadow-lg">
              <div className="relative z-10">
                 <h3 className="text-xl font-bold mb-2">Curriculum Update</h3>
                 <p className="text-blue-100 text-sm mb-6">Download the revised 2026 scheme of work for Mathematics and Sciences.</p>
                 <button className="bg-white text-blue-600 px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-secondary hover:text-brand-primary transition-all">
                    <FileSpreadsheet size={18} /> Get Curriculum
                 </button>
              </div>
              <div className="absolute -right-4 -bottom-4 text-white/10 w-40 h-40">
                 <FileSpreadsheet size={160} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
