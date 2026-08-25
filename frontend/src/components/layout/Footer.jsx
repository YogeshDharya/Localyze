import React from 'react';
import { MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass border-t-0 border-x-0 rounded-none py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <MapPin className="w-5 h-5" />
          <span className="font-medium">Localyze &copy; {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
          <a href="#" className="hover:text-primary-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary-500 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary-500 transition-colors">Contact Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
