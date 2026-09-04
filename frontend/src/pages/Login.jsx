import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { showToast } from '../components/ui/Toast';
import logo from '../assets/logo.png';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      const userData = await login(form.email, form.password);
      showToast.success(`Welcome back, ${userData.fullName}!`);
      if (userData.role === 'SELLER') navigate('/seller/dashboard');
      else if (userData.role === 'ADMIN') navigate('/admin/dashboard');
      else navigate(from);
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      showToast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="glass-card bg-white/80 dark:bg-slate-800/80 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            {/* <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <MapPin className="w-7 h-7 text-white" />
            </div> */}
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center">
                          <img
                            src={logo}
                            alt="Localyze Logo"
                            className="w-20 h-20 rounded-xl object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Sign in to your Localyze account</p>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-500">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Email" name="email" type="email" icon={Mail} placeholder="you@example.com"
              value={form.email} onChange={handleChange} error={errors.email} />
            <Input label="Password" name="password" type="password" icon={Lock} placeholder="••••••••"
              value={form.password} onChange={handleChange} error={errors.password} />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input type="checkbox" className="rounded border-gray-300" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-600 font-medium">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-600 font-semibold">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
