import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { showToast } from '../components/ui/Toast';
import { validateEmail, validatePhone, validatePassword, validateFullName, validateConfirmPassword } from '../utils/validators';

export default function Register() {
  const [role, setRole] = useState('USER');
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    const name = validateFullName(form.fullName); if (!name.isValid) errs.fullName = name.message;
    const email = validateEmail(form.email); if (!email.isValid) errs.email = email.message;
    const phone = validatePhone(form.phone); if (!phone.isValid) errs.phone = phone.message;
    const pwd = validatePassword(form.password); if (!pwd.isValid) errs.password = pwd.message;
    const confirm = validateConfirmPassword(form.password, form.confirmPassword); if (!confirm.isValid) errs.confirmPassword = confirm.message;
    if (!agreed) errs.agreed = 'You must agree to the terms';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      await register({ ...form, role });
      showToast.success('Account created successfully!');
      if (role === 'SELLER') navigate('/seller/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      showToast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="glass-card bg-white/80 dark:bg-slate-800/80 p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Join Localyze today</p>
          </div>

          {/* Role selector */}
          <div className="flex gap-2 p-1 rounded-xl bg-gray-200/50 dark:bg-slate-700/50 mb-6">
            {[{ val: 'USER', label: "I'm a Customer" }, { val: 'SELLER', label: "I'm a Provider" }].map((r) => (
              <button key={r.val} type="button" onClick={() => setRole(r.val)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  role === r.val ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'
                }`}>
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" name="fullName" icon={User} placeholder="John Doe"
              value={form.fullName} onChange={handleChange} error={errors.fullName} />
            <Input label="Email" name="email" type="email" icon={Mail} placeholder="you@example.com"
              value={form.email} onChange={handleChange} error={errors.email} />
            <Input label="Phone" name="phone" icon={Phone} placeholder="9876543210"
              value={form.phone} onChange={handleChange} error={errors.phone} />
            <Input label="Password" name="password" type="password" icon={Lock} placeholder="Min 8 characters"
              value={form.password} onChange={handleChange} error={errors.password} />
            <Input label="Confirm Password" name="confirmPassword" type="password" icon={Lock} placeholder="Repeat password"
              value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />

            <label className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 rounded" />
              <span>I agree to the <a href="#" className="text-blue-500">Terms of Service</a> and <a href="#" className="text-blue-500">Privacy Policy</a></span>
            </label>
            {errors.agreed && <p className="text-xs text-red-500">{errors.agreed}</p>}

            <Button type="submit" loading={loading} className="w-full">Create Account</Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-600 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
