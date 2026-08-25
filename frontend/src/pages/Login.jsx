import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GlassCard from '../components/ui/GlassCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const success = await login(email, password);

    if (success) {
      // Small delay to ensure user state is set before reading it for navigation
      setTimeout(() => {
        const role = localStorage.getItem('token') ? 
          JSON.parse(atob(localStorage.getItem('token').split('.')[1])).role : 'USER';
        if (role === 'ADMIN') navigate('/admin/dashboard');
        else if (role === 'SELLER') navigate('/seller/dashboard');
        else navigate('/dashboard');
      }, 100);
    } else {
      setError('Invalid email or password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <GlassCard className="w-full max-w-md animate-slide-up">
        <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-white">
          Welcome Back
        </h2>
        
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-600 text-sm border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-end mb-4">
            <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
              Forgot Password?
            </Link>
          </div>

          <Button type="submit" isLoading={loading} className="w-full py-2.5">
            Log In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 font-medium hover:underline dark:text-primary-400">
            Sign up
          </Link>
        </p>
      </GlassCard>
    </div>
  );
};

export default Login;
