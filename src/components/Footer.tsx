import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-secondary rounded-lg flex items-center justify-center text-brand-primary font-serif text-2xl font-bold">
              A
            </div>
            <h1 className="text-xl font-bold font-serif">Agape Experemental</h1>
          </div>
          <p className="text-slate-400">
            Dedicated to raising a generation of global leaders through faith-based excellence and holistic education.
          </p>
          <div className="flex gap-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-brand-secondary hover:text-brand-primary transition-all">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-6 text-brand-secondary">Quick Links</h3>
          <ul className="space-y-4 text-slate-400">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Admissions</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Curriculum</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Staff Directory</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-6 text-brand-secondary">Resources</h3>
          <ul className="space-y-4 text-slate-400">
            <li><Link to="/login" className="hover:text-white transition-colors">Student Portal</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors">Teacher Portal</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">E-Library</a></li>
            <li><a href="#" className="hover:text-white transition-colors">School Calendar</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Alumni Portal</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-6 text-brand-secondary">Contact</h3>
          <ul className="space-y-4 text-slate-400">
            <li className="flex items-center gap-3">
              <MapPin size={18} className="text-brand-secondary" />
              <span>Milton Magai College Junction, Freetown Sierra Leone</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-brand-secondary" />
              <span>076 127779</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-brand-secondary" />
              <span>info@agapeexperemental.edu.ng</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-10 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Agape Experemental High School. All rights reserved. Designed for Excellence.</p>
      </div>
    </footer>
  );
}
