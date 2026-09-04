import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { showToast } from '../components/ui/Toast';
import authService from '../services/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await authService.forgotPassword({ email });
      setSent(true);
      showToast.success('Password reset link sent to your email');
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="glass-card bg-white/80 dark:bg-slate-800/80 p-8 text-center">
          {sent ? (
            <>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Mail className="w-8 h-8 text-emerald-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check Your Email</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-6">We've sent a password reset link to <strong>{email}</strong></p>
              <Link to="/login" className="text-blue-500 font-medium hover:text-blue-600">Back to Login</Link>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Forgot Password?</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Enter your email and we'll send you a reset link</p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input name="email" type="email" icon={Mail} placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} />
                <Button type="submit" loading={loading} className="w-full">Send Reset Link</Button>
              </form>
              <Link to="/login" className="mt-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
