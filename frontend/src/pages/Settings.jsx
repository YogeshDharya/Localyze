import { useState } from 'react';
import { Lock, Sun, Moon, MapPin, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import userService from '../services/userService';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { showToast } from '../components/ui/Toast';

export default function Settings() {
  const { logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdLoading, setPwdLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword.length < 8) { showToast.error('Min 8 characters'); return; }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) { showToast.error('Passwords don\'t match'); return; }
    setPwdLoading(true);
    try {
      await userService.changePassword({ currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword });
      showToast.success('Password changed!');
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setPwdLoading(false); }
  };

  const handleDeactivate = async () => {
    if (!window.confirm('Are you sure? This will deactivate your account.')) return;
    try {
      await userService.deactivateAccount();
      showToast.success('Account deactivated');
      logout();
    } catch (err) {
      showToast.error('Failed to deactivate');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

      {/* Change Password */}
      <div className="glass-card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input label="Current Password" name="currentPassword" type="password" icon={Lock}
            value={pwdForm.currentPassword} onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })} />
          <Input label="New Password" name="newPassword" type="password" icon={Lock}
            value={pwdForm.newPassword} onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })} />
          <Input label="Confirm New Password" name="confirmPassword" type="password" icon={Lock}
            value={pwdForm.confirmPassword} onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })} />
          <Button type="submit" loading={pwdLoading}>Update Password</Button>
        </form>
      </div>

      {/* Appearance */}
      <div className="glass-card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDarkMode ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
            <div>
              <p className="font-medium text-gray-800 dark:text-white">Dark Mode</p>
              <p className="text-sm text-gray-500">Switch between light and dark themes</p>
            </div>
          </div>
          <button onClick={toggleTheme}
            className={`relative w-14 h-7 rounded-full transition-colors ${isDarkMode ? 'bg-blue-500' : 'bg-gray-300'}`}>
            <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${isDarkMode ? 'translate-x-7' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card border-red-500/30">
        <h3 className="text-lg font-semibold text-red-500 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Danger Zone
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Once you deactivate your account, you won't be able to log in.
        </p>
        <Button variant="danger" onClick={handleDeactivate}>Deactivate Account</Button>
      </div>
    </div>
  );
}
