import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { showToast } from '../components/ui/Toast';
import authService from '../services/authService';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword.length < 8) { showToast.error('Password must be at least 8 characters'); return; }
    if (form.newPassword !== form.confirmPassword) { showToast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await authService.resetPassword({ token, newPassword: form.newPassword });
      showToast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to reset password');
    } finally { setLoading(false); }
  };

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="glass-card bg-white/80 dark:bg-slate-800/80 p-8 text-center max-w-md">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Invalid Link</h1>
          <p className="text-gray-500 mb-4">This reset link is invalid or has expired.</p>
          <Link to="/forgot-password" className="text-blue-500 font-medium">Request a new link</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="glass-card bg-white/80 dark:bg-slate-800/80 p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Reset Password</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">Choose a new password for your account</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="New Password" name="newPassword" type="password" icon={Lock} placeholder="Min 8 characters"
              value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
            <Input label="Confirm Password" name="confirmPassword" type="password" icon={Lock} placeholder="Repeat password"
              value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
            <Button type="submit" loading={loading} className="w-full">Reset Password</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
