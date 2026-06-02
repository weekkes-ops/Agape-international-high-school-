import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings,
  Plus,
  ArrowUpRight,
  Shield,
  Search,
  Download,
  Filter,
  Check,
  X,
  BookOpen,
  Edit
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  getDocs,
  query,
  where
} from 'firebase/firestore';

export default function AdminDashboard() {
  const { userData } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [activeUsers] = useState([
    { id: 'student_1', name: 'John Doe', email: 'john@example.com', role: 'Student', status: 'Active' },
    { id: 'teacher_1', name: 'Sarah Smith', email: 'sarah@teacher.com', role: 'Teacher', status: 'Active' },
    { id: 'student_2', name: 'Michael Chen', email: 'mike@example.com', role: 'Student', status: 'Pending' },
    { id: 'admin_1', name: 'Emma Wilson', email: 'emma@admin.com', role: 'Admin', status: 'Active' },
    { id: 'student_3', name: 'Alice Brown', email: 'alice@example.com', role: 'Student', status: 'Active' },
    { id: 'student_4', name: 'Bob Wilson', email: 'bob@example.com', role: 'Student', status: 'Active' },
  ]);

  const [facultyAssignments] = useState([
    { id: 't1', name: 'Sarah Smith', subjects: ['Mathematics', 'Further Math'], department: 'Science', load: '12 hrs/wk' },
    { id: 't2', name: 'David Jones', subjects: ['Physics', 'Chemistry'], department: 'Science', load: '10 hrs/wk' },
    { id: 't3', name: 'Maria Garcia', subjects: ['English', 'Literature'], department: 'Arts', load: '14 hrs/wk' },
    { id: 't4', name: 'James Wilson', subjects: ['Economics', 'Government'], department: 'Social Science', load: '8 hrs/wk' },
  ]);

  const [assignmentsFromDB, setAssignmentsFromDB] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const fetchDBAssignments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'teacherAssignments'));
        const mapped: Record<string, string[]> = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.teacherId) {
            mapped[data.teacherId] = data.subjects || [];
          }
        });
        setAssignmentsFromDB(mapped);
      } catch (err) {
        console.error("Error fetching assignments:", err);
      }
    };
    fetchDBAssignments();
  }, []);

  const filteredUsers = activeUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    alert("Exporting system records as CSV...");
  };

  const handleAddStudent = () => {
    alert("Student registration modal would open here.");
  };

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [assignedSubjects, setAssignedSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const AVAILABLE_SUBJECTS = [
    'Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 
    'Economics', 'Geography', 'Literature', 'Government', 'Civic Education', 
    'Agricultural Science', 'Further Mathematics'
  ];

  const handleOpenAssignModal = async (teacher: any) => {
    setSelectedTeacher(teacher);
    setLoading(true);
    setIsAssignModalOpen(true);
    
    try {
      const docRef = doc(db, 'teacherAssignments', teacher.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAssignedSubjects(docSnap.data().subjects || []);
      } else {
        setAssignedSubjects(assignmentsFromDB[teacher.id] || teacher.subjects || []);
      }
    } catch (err) {
      console.error("Error fetching assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAssignments = async () => {
    if (!selectedTeacher) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'teacherAssignments', selectedTeacher.id), {
        teacherId: selectedTeacher.id,
        teacherName: selectedTeacher.name,
        subjects: assignedSubjects,
        updatedAt: serverTimestamp()
      });
      setAssignmentsFromDB(prev => ({
        ...prev,
        [selectedTeacher.id]: assignedSubjects
      }));
      setIsAssignModalOpen(false);
      alert("Assignments updated successfully!");
    } catch (err) {
      console.error("Error saving assignments:", err);
      alert("Failed to save assignments.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSubject = (subject: string) => {
    setAssignedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject) 
        : [...prev, subject]
    );
  };

  return (
    <div className="space-y-8">
      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: '1,240', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Revenue (Termly)', value: '₦4.2M', change: '+5%', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Teachers', value: '48', change: '0%', icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'System Health', value: 'Optimal', change: '100%', icon: Shield, color: 'text-brand-primary', bg: 'bg-slate-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center`}>
                   <stat.icon size={20} />
                </div>
                <span className="text-xs font-bold text-green-500 flex items-center">
                   <ArrowUpRight size={12} /> {stat.change}
                </span>
             </div>
             <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
             <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Management Actions */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                 <div>
                    <h3 className="text-xl font-bold text-brand-primary">Student Management</h3>
                    <p className="text-sm text-gray-400">Total {filteredUsers.length} active records</p>
                 </div>
                 <div className="flex gap-2 w-full md:w-auto">
                    <button 
                      onClick={handleAddStudent}
                      className="flex-grow md:flex-grow-0 text-xs bg-brand-primary text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-accent transition-all shadow-lg shadow-brand-primary/20"
                    >
                       <Plus size={16} /> Add Student
                    </button>
                    <button 
                      onClick={handleExport}
                      className="p-2.5 bg-slate-50 text-gray-400 border border-slate-100 rounded-xl hover:bg-slate-100 transition-all"
                    >
                       <Download size={18} />
                    </button>
                 </div>
              </div>

              {/* Search Bar */}
              <div className="relative mb-6">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Search students by name, ID or email..."
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-accent outline-none font-medium transition-all"
                 />
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button className="p-1.5 hover:bg-slate-200 rounded-lg text-gray-400">
                       <Filter size={16} />
                    </button>
                 </div>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-sm">
                    <thead className="bg-slate-50/50 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                       <tr>
                          <th className="px-4 py-4 text-left">User Details</th>
                          <th className="px-4 py-4 text-left">Enrollment</th>
                          <th className="px-4 py-4 text-left">Status</th>
                          <th className="px-4 py-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {filteredUsers.length > 0 ? filteredUsers.map((user, i) => (
                         <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-5">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-brand-primary font-bold">
                                     {user.name.charAt(0)}
                                  </div>
                                  <div>
                                     <div className="font-bold text-gray-800">{user.name}</div>
                                     <div className="text-[10px] text-gray-400 font-medium">{user.email}</div>
                                  </div>
                               </div>
                            </td>
                            <td className="px-4 py-5">
                               <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter ${
                                  user.role === 'Admin' ? 'bg-purple-50 text-purple-600' :
                                  user.role === 'Teacher' ? 'bg-blue-50 text-blue-600' :
                                  'bg-slate-100 text-gray-600'
                               }`}>
                                  {user.role}
                               </span>
                            </td>
                            <td className="px-4 py-5">
                               <div className="flex items-center gap-1.5">
                                  <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                  <span className="text-[11px] font-medium text-gray-600">{user.status}</span>
                               </div>
                            </td>
                            <td className="px-4 py-5 text-right">
                               <Link 
                                 to={user.role === 'Student' ? `/portal/student/${user.id}` : '#'} 
                                 className="text-brand-accent hover:text-brand-primary font-bold text-xs bg-brand-accent/10 px-3 py-1.5 rounded-lg transition-colors"
                               >
                                 Manage
                               </Link>
                            </td>
                         </tr>
                       )) : (
                         <tr>
                            <td colSpan={4} className="py-20 text-center text-gray-400 font-medium">
                               <div className="flex flex-col items-center gap-2">
                                  <Search size={40} className="text-gray-200" />
                                  <p>No matches found for "{searchQuery}"</p>
                                  <button onClick={() => setSearchQuery('')} className="text-brand-accent text-xs hover:underline">Clear search</button>
                               </div>
                            </td>
                         </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Faculty Assignments Section */}
           <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                 <div>
                    <h3 className="text-xl font-bold text-brand-primary">Faculty Assignments</h3>
                    <p className="text-sm text-gray-400">Subject distribution by department</p>
                 </div>
                 <button 
                   onClick={() => alert("Assignment management page would open here.")}
                   className="text-xs font-bold text-brand-accent hover:underline"
                 >
                   Manage All Assignments
                 </button>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-sm">
                    <thead className="bg-slate-50/50 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                       <tr>
                          <th className="px-4 py-4 text-left">Teacher</th>
                          <th className="px-4 py-4 text-left">Department</th>
                          <th className="px-4 py-4 text-left">Subjects</th>
                          <th className="px-4 py-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {facultyAssignments.map((faculty) => {
                         const subjectsList = assignmentsFromDB[faculty.id] !== undefined 
                           ? assignmentsFromDB[faculty.id] 
                           : faculty.subjects;
                         return (
                           <tr key={faculty.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-5 font-bold text-gray-800">{faculty.name}</td>
                              <td className="px-4 py-5">
                                 <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-gray-500 rounded-md uppercase">
                                    {faculty.department}
                                 </span>
                              </td>
                              <td className="px-4 py-5">
                                 <div className="flex flex-wrap gap-1">
                                    {subjectsList.map(s => (
                                      <span key={s} className="text-[10px] bg-blue-50 text-brand-primary px-2 py-0.5 rounded-md font-medium border border-blue-100">
                                        {s}
                                      </span>
                                    ))}
                                 </div>
                              </td>
                              <td className="px-4 py-5 text-right font-medium text-gray-600">
                                 <button 
                                   onClick={() => handleOpenAssignModal(faculty)}
                                   className="text-brand-accent hover:text-brand-primary p-2 rounded-lg hover:bg-slate-100 transition-all"
                                 >
                                    <Edit size={16} />
                                 </button>
                              </td>
                           </tr>
                         );
                       })}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        {/* Assign Subjects Modal */}
        {isAssignModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
             <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                   <div>
                      <h3 className="text-xl font-bold text-brand-primary">Assign Subjects</h3>
                      <p className="text-sm text-gray-400">Managing {selectedTeacher?.name}</p>
                   </div>
                   <button 
                     onClick={() => setIsAssignModalOpen(false)}
                     className="p-2 hover:bg-slate-100 rounded-full text-gray-400"
                   >
                     <X size={20} />
                   </button>
                </div>
                
                <div className="p-8 overflow-y-auto max-h-[60vh]">
                   <div className="grid grid-cols-1 gap-2">
                      {AVAILABLE_SUBJECTS.map((subject) => (
                        <button
                          key={subject}
                          onClick={() => toggleSubject(subject)}
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                            assignedSubjects.includes(subject)
                              ? 'bg-brand-primary/5 border-brand-primary text-brand-primary'
                              : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200'
                          }`}
                        >
                           <span className="font-bold text-sm tracking-tight">{subject}</span>
                           {assignedSubjects.includes(subject) && (
                             <div className="w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center">
                                <Check size={14} strokeWidth={3} />
                             </div>
                           )}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="p-8 bg-slate-50 flex gap-3">
                   <button 
                     onClick={() => setIsAssignModalOpen(false)}
                     className="flex-grow py-3 rounded-xl font-bold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-all"
                   >
                      Cancel
                   </button>
                   <button 
                     disabled={loading}
                     onClick={handleSaveAssignments}
                     className="flex-grow py-3 rounded-xl font-bold text-white bg-brand-primary hover:bg-brand-accent transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"
                   >
                      {loading ? 'Saving...' : 'Save Changes'}
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* System Notifications / Logs */}
        <div className="space-y-6">
           <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-brand-primary mb-8">Recent Activity</h3>
              <div className="space-y-8">
                 {[
                   { user: 'Admin', action: 'Published results', time: '2h ago', color: 'bg-green-500' },
                   { user: 'Bursar', action: 'Confirmed 24 fee payments', time: '4h ago', color: 'bg-blue-500' },
                   { user: 'System', action: 'Automatic backup completed', time: '1d ago', color: 'bg-slate-300' },
                 ].map((log, i) => (
                   <div key={i} className="flex gap-4 group">
                      <div className="relative">
                         <div className={`w-1 h-full ${log.color} rounded-full transition-all group-hover:w-1.5`} />
                      </div>
                      <div>
                         <p className="text-sm text-gray-800 leading-relaxed"><span className="font-bold">{log.user}</span> {log.action}</p>
                         <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{log.time}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-brand-primary p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
              <Settings className="absolute -right-4 -top-4 w-24 h-24 text-white/10 rotate-12" />
              <h4 className="font-bold mb-4 relative z-10">System Configuration</h4>
              <p className="text-blue-100 text-sm mb-6 relative z-10">Manage database connections, backup policies and user permissions.</p>
              <button className="w-full bg-white text-brand-primary py-3 rounded-xl font-bold text-sm hover:bg-brand-secondary transition-all shadow-lg">
                 Configure Environment
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
