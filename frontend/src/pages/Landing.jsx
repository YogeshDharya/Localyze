import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, MapPin, Calendar, CheckCircle, Star, Sparkles, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import { CATEGORY_ICONS } from '../utils/constants';

const STEPS = [
  {
    icon: Search,
    title: 'Search',
    description: 'Browse local services near your location. Filter by category, distance, and ratings.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Calendar,
    title: 'Book',
    description: 'Pick a time that works for you and book the service with a single click.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: CheckCircle,
    title: 'Done',
    description: 'Get the job done by trusted local professionals. Pay securely online.',
    gradient: 'from-emerald-500 to-teal-500',
  },
];

const TESTIMONIALS = [
  { name: 'Priya S.', text: 'Found an amazing plumber within minutes. Life saver!', rating: 5 },
  { name: 'Rahul M.', text: 'Booking a tutor for my daughter was so easy. Great platform.', rating: 5 },
  { name: 'Anita K.', text: 'The tiffin service I found here is absolutely fantastic.', rating: 4 },
];

export default function Landing() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleFindServices = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const categories = Object.entries(CATEGORY_ICONS);

  return (
    <div className="min-h-screen bg-mesh-light dark:bg-mesh-dark">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Trusted by 10,000+ locals
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
              Discover Local{' '}
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Services
              </span>
              <br />
              Near You
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Find trusted plumbers, electricians, tutors, and more — all within your neighborhood.
              Book instantly, pay securely.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button
                id="hero-find-services"
                variant="primary"
                size="lg"
                icon={Search}
                onClick={handleFindServices}
                className="text-lg px-8 py-4 shadow-2xl shadow-blue-500/30"
              >
                Find Services
              </Button>
              <Link to="/register">
                <button
                  id="hero-list-service"
                  className="btn-secondary text-lg px-8 py-4 flex items-center gap-2 group"
                >
                  List Your Service
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {[
                { value: '500+', label: 'Services' },
                { value: '15+', label: 'Categories' },
                { value: '4.8★', label: 'Avg Rating' },
              ].map((stat) => (
                <div key={stat.label} className="glass-card py-3 px-4 text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stat.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Categories
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Whatever you need, there's a trusted local professional ready to help.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map(([name, emoji], index) => (
              <button
                key={name}
                id={`category-${name.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => navigate(isAuthenticated ? `/dashboard?category=${encodeURIComponent(name)}` : '/login')}
                className="glass-card flex flex-col items-center gap-3 py-6 px-4 cursor-pointer
                  hover:scale-105 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10
                  transition-all duration-300 group animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  {emoji}
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                  {name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 lg:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/50 to-transparent dark:via-slate-800/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Getting help from local professionals is just three simple steps away.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative animate-slide-up" style={{ animationDelay: `${index * 150}ms` }}>
                  {/* Connector line */}
                  {index < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 dark:from-blue-700 dark:to-purple-700" />
                  )}
                  <div className="glass-card text-center relative">
                    {/* Step number */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="glass-card animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"{t.text}"</p>
                <p className="font-semibold text-gray-900 dark:text-white">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card py-12 px-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
              Join thousands of locals who trust Localyze for their everyday service needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                id="cta-find-services"
                variant="primary"
                size="lg"
                onClick={handleFindServices}
              >
                Find Services Now
              </Button>
              <Link to="/register">
                <button id="cta-become-seller" className="btn-secondary flex items-center gap-2">
                  Become a Service Provider
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
