import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GlassCard from '../components/ui/GlassCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    role: 'USER'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam && roleParam.toUpperCase() === 'SELLER') {
      setFormData(prev => ({ ...prev, role: 'SELLER' }));
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    
    const success = await register(formData);

    if (success) {
      toast.success('Account created! Redirecting...');
      // Read role from JWT for redirect
      const token = localStorage.getItem('token');
      let role = 'USER';
      if (token) {
        try {
          role = JSON.parse(atob(token.split('.')[1])).role;
        } catch {}
      }

      if (role === 'SELLER') navigate('/seller/dashboard');
      else if (role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/dashboard');
    } else {
      setError('Registration failed. The email may already be in use.');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-8">
      <GlassCard className="w-full max-w-lg animate-slide-up">
        <h2 className="text-2xl font-bold text-center mb-2 text-slate-800 dark:text-white">
          Create an Account
        </h2>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">
          Join Localyze as a {formData.role === 'SELLER' ? 'Business Partner' : 'Customer'}
        </p>
        
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-600 text-sm border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-1">
          {/* Role Selector */}
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors border-2 ${
                formData.role === 'USER' 
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400 border-primary-500' 
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-transparent'
              }`}
              onClick={() => setFormData({...formData, role: 'USER'})}
            >
              Customer
            </button>
            <button
              type="button"
              className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors border-2 ${
                formData.role === 'SELLER' 
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400 border-primary-500' 
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-transparent'
              }`}
              onClick={() => setFormData({...formData, role: 'SELLER'})}
            >
              Business / Seller
            </button>
          </div>

          <Input 
            label="Full Name" 
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <Input 
            label="Email Address" 
            name="email"
            type="email" 
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Phone Number" 
              name="phone"
              placeholder="9876543210"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <Input 
              label="City" 
              name="city"
              placeholder="Mumbai"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          
          <Input 
            label="Password (min 6 characters)" 
            name="password"
            type="password" 
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button type="submit" isLoading={loading} className="w-full py-2.5 mt-4">
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:underline dark:text-primary-400">
            Log in
          </Link>
        </p>
      </GlassCard>
    </div>
  );
};

export default Register;
