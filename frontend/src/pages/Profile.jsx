import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    avatarUrl: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/me');
      const data = response.data || response;
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        city: data.city || '',
        avatarUrl: data.avatarUrl || ''
      });
    } catch (err) {
      console.error('Failed to load profile', err);
      toast.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/users/me', {
        name: formData.name,
        phone: formData.phone,
        city: formData.city
        // Assuming avatarUrl update might be handled separately or similarly if supported
      });
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Failed to update profile', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>
      
      <GlassCard className="p-8">
        <div className="flex flex-col items-center mb-8">
          {formData.avatarUrl ? (
            <img 
              src={formData.avatarUrl} 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover border-4 border-white/10"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center border-4 border-white/10">
              <span className="text-3xl text-blue-400 font-semibold">
                {formData.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="mt-4 text-center">
            <span className="inline-block bg-blue-500/20 text-blue-300 text-xs px-3 py-1 rounded-full font-medium tracking-wide">
              {authUser?.role || 'USER'}
            </span>
            <p className="text-gray-400 text-sm mt-1">{authUser?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
          />
          
          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 234 567 890"
          />
          
          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="New York"
          />

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={saving}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default Profile;
