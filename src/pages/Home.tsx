import { motion } from 'motion/react';
import { BookOpen, Award, Users, CreditCard, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section id="home" className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-brand-primary/95 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1523050853063-91500991802e?auto=format&fit=crop&q=80&w=2000" 
          alt="School Campus"
          className="absolute inset-0 object-cover w-full h-full"
        />
        
        <div className="relative z-20 text-center px-4 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl text-white font-serif mb-6"
          >
            Nurturing Excellence, <br />
            <span className="text-brand-secondary">Inspiring Futures</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100 mb-8"
          >
            Welcome to Agape Experemental High School. A place where character meets competence, 
            and where every student is empowered to lead and serve.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/login" className="bg-brand-secondary text-brand-primary px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-white transition-colors">
              School Portal <ArrowRight size={20} />
            </Link>
            <a href="/#admission" className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-brand-primary transition-colors flex items-center justify-center">
              Admissions 2026
            </a>
          </motion.div>
        </div>
      </section>

      {/* Quick Links / Features */}
      <section id="academics" className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 -mt-16 relative z-30">
        {[
          { icon: BookOpen, title: "Academic Portal", text: "Access learning resources and curriculum.", link: "/portal/academics" },
          { icon: Award, title: "Result Checker", text: "View and download termly performance reports.", link: "/portal/results" },
          { icon: CreditCard, title: "Fee Payments", text: "Secure online payment for school fees.", link: "/portal/payments" },
          { icon: Users, title: "Alumni Network", text: "Stay connected with Agape alumni worldwide.", link: "/alumni" },
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border-t-4 border-brand-secondary"
          >
            <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-4">
              <item.icon size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-brand-primary">{item.title}</h3>
            <p className="text-gray-600 mb-4">{item.text}</p>
            <Link to={item.link} className="text-brand-accent font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Go to Portal <ArrowRight size={16} />
            </Link>
          </motion.div>
        ))}
      </section>

      {/* About Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-brand-accent font-bold tracking-widest uppercase">Since 1995</span>
            <h2 className="text-4xl md:text-5xl font-serif text-brand-primary mt-4 mb-6">Built on Foundation of Love and Faith</h2>
            <p className="text-gray-600 text-lg mb-6">
              Agape Experemental High School is committed to providing a holistic education that balances academic 
              rigor with spiritual growth and character development. Our state-of-the-art facilities and 
              dedicated faculty create an environment where students can discover their true potential.
            </p>
            <div className="space-y-4">
              {["Global Standard Curriculum", "Vibrant Extracurricular Activities", "Safe & Serene Learning Environment"].map((point, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                  </div>
                  <span className="font-semibold text-gray-700">{point}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1544717297-fa15c390282f?auto=format&fit=crop&q=80&w=1200" 
              alt="Students in Library"
              className="rounded-3xl shadow-2xl relative z-10"
            />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-brand-secondary rounded-3xl -z-10 animate-pulse" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-brand-primary py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: "Students", value: "1,200+" },
            { label: "Alumni", value: "5,000+" },
            { label: "Graduation Rate", value: "99.8%" },
            { label: "Global Partners", value: "24" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-6xl font-serif text-brand-secondary mb-2">{stat.value}</div>
              <div className="text-blue-200 uppercase tracking-widest text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Admission Section */}
      <section id="admission" className="max-w-7xl mx-auto px-4 py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden relative">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 p-8 md:p-16">
           <div>
              <span className="text-brand-accent font-bold tracking-widest uppercase">Admission 2026/2027</span>
              <h2 className="text-4xl font-serif text-brand-primary mt-4 mb-6">Join Our Community of Learners</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                 We are looking for students who are curious, creative, and committed to making a difference. 
                 Enrollment for the next academic session is now open. Follow our simple process to begin your journey.
              </p>
              <div className="space-y-6">
                 {[
                   { step: "01", title: "Apply Online", description: "Complete the online application form on our portal." },
                   { step: "02", title: "Entrance Exam", description: "Schedule and sit for our comprehensive assessment." },
                   { step: "03", title: "Interview", description: "A brief session with our academic panel." },
                 ].map((s, i) => (
                   <div key={i} className="flex gap-4">
                      <div className="text-2xl font-serif font-bold text-brand-secondary/30">{s.step}</div>
                      <div>
                         <h4 className="font-bold text-brand-primary">{s.title}</h4>
                         <p className="text-sm text-gray-500">{s.description}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <Link to="/portal" className="inline-flex mt-10 bg-brand-primary text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-brand-primary/20 hover:bg-brand-accent transition-all items-center gap-2">
                 Start Application <ArrowRight size={20} />
              </Link>
           </div>
           <div className="hidden md:block bg-slate-50 rounded-[2rem] p-4">
              <img 
                src="https://images.unsplash.com/photo-1543269664-76bc3997d9ea?auto=format&fit=crop&q=80&w=800" 
                alt="Admission"
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
           </div>
        </div>
      </section>
    </div>
  );
}
