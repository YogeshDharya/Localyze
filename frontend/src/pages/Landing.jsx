import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Shield, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import GlassCard from '../components/ui/GlassCard';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-12 animate-slide-up">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white">
          Discover Local. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
            Support Local.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8">
          The easiest way to find and book home-operated businesses and local services near you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate('/register')} className="text-lg px-8 py-3">
            Find Services Near Me
          </Button>
          <Button onClick={() => navigate('/register?role=seller')} variant="secondary" className="text-lg px-8 py-3">
            List My Business
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12">
        <GlassCard className="flex flex-col items-center text-center gap-4">
          <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-600 dark:text-primary-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">Discover</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Find exactly what you need, from plumbers to tiffin services, all within a 1km radius.
          </p>
        </GlassCard>

        <GlassCard className="flex flex-col items-center text-center gap-4">
          <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-600 dark:text-primary-400">
            <Zap className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">Book Instantly</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Book services with a single tap. Manage your appointments effortlessly.
          </p>
        </GlassCard>

        <GlassCard className="flex flex-col items-center text-center gap-4">
          <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-600 dark:text-primary-400">
            <Shield className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">Secure Payments</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Pay safely through Razorpay. Your transactions are fully protected and verified.
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

export default Landing;
