import { useState } from 'react';
import { User, Mail, Phone, MapPin, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { showToast } from '../components/ui/Toast';

// ✅ NEW IMPORT
import LocationPicker from '../components/location/LocationPicker';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  // ✅ NEW STATE
  const [location, setLocation] = useState(null);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await userService.updateProfile({
        ...form,
        location, // ✅ send location
      });
      updateUser(res.data);
      showToast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        My Profile
      </h1>

      {/* Profile card */}
      <div className="glass-card text-center mb-6">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto">
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-white">
                {user?.fullName?.charAt(0)?.toUpperCase()}
              </span>
            )}
          </div>

          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {user?.fullName}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          {user?.email}
        </p>
        <Badge variant="info" className="mt-2">
          {user?.role}
        </Badge>
      </div>

      {/* Edit form */}
      <div className="glass-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Personal Information
          </h3>

          {!editing ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
              <Button size="sm" loading={loading} onClick={handleSave}>
                Save
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Input
            label="Full Name"
            icon={User}
            value={form.fullName}
            onChange={(e) =>
              setForm({ ...form, fullName: e.target.value })
            }
            disabled={!editing}
          />

          <Input
            label="Email"
            icon={Mail}
            value={user?.email}
            disabled
          />

          <Input
            label="Phone"
            icon={Phone}
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
            disabled={!editing}
          />

          <Input
            label="Address"
            icon={MapPin}
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
            disabled={!editing}
          />

          {/* ✅ NEW MAP SECTION */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              Select Location on Map
            </label>

            <LocationPicker
              onSelect={(coords) => {
                setLocation({
                  lat: coords[0],
                  lng: coords[1],
                });
              }}
            />

            {location && (
              <p className="text-sm text-gray-500 mt-2">
                Selected: {location.lat}, {location.lng}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}