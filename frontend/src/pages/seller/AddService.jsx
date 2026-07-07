import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft } from 'lucide-react';
import serviceService from '../../services/serviceService';
import categoryService from '../../services/categoryService';
import uploadService from '../../services/uploadService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { showToast } from '../../components/ui/Toast';
import { useLocationContext as useLocationCtx } from '../../contexts/LocationContext';
import { PRICE_UNITS } from '../../utils/constants';

export default function AddService() {
  const navigate = useNavigate();
  const { latitude, longitude } = useLocationCtx();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', categoryId: '', price: '', priceUnit: 'fixed',
    address: '', latitude: latitude || '', longitude: longitude || '', availability: '',
    imageUrls: [],
  });

  useEffect(() => {
    categoryService.getAll().then(res => setCategories(res.data || [])).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + form.imageUrls.length > 5) { showToast.error('Max 5 images'); return; }
    setUploading(true);
    try {
      for (const file of files) {
        const res = await uploadService.uploadImage(file);
        setForm(prev => ({ ...prev, imageUrls: [...prev.imageUrls, res.data.url] }));
      }
      showToast.success('Images uploaded!');
    } catch { showToast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showToast.error("Geolocation is not supported by your browser");
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
        showToast.success("Location updated!");
        setGettingLocation(false);
      },
      (error) => {
        showToast.error("Unable to retrieve your location. Please check permissions.");
        setGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.categoryId || !form.price || !form.address) {
      showToast.error('Please fill all required fields');
      return;
    }
    if (form.description.length < 50) { showToast.error('Description must be at least 50 characters'); return; }
    setLoading(true);
    try {
      await serviceService.create({
        ...form,
        categoryId: parseInt(form.categoryId),
        price: parseFloat(form.price),
        latitude: parseFloat(form.latitude) || latitude || 18.5204,
        longitude: parseFloat(form.longitude) || longitude || 73.8567,
      });
      showToast.success('Service created!');
      navigate('/seller/services');
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to create service');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-blue-500 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Service</h1>

      <form onSubmit={handleSubmit} className="glass-card space-y-5">
        <Input label="Service Title *" name="title" placeholder="e.g., Professional Plumbing Service"
          value={form.title} onChange={handleChange} />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description * (min 50 chars)</label>
          <textarea name="description" rows={5} placeholder="Describe your service in detail..."
            value={form.description} onChange={handleChange} className="glass-input resize-none" />
          <p className="text-xs text-gray-400 mt-1">{form.description.length}/50 characters minimum</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category *</label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange} className="glass-input">
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <Input label="Price (₹) *" name="price" type="number" placeholder="500" value={form.price} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Price Unit</label>
            <select name="priceUnit" value={form.priceUnit} onChange={handleChange} className="glass-input">
              {PRICE_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
          <Input label="Availability" name="availability" placeholder="Mon-Sat, 9 AM - 6 PM"
            value={form.availability} onChange={handleChange} />
        </div>

        <Input label="Address *" name="address" placeholder="Your business address"
          value={form.address} onChange={handleChange} />

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Latitude" name="latitude" type="number" step="any" value={form.latitude} onChange={handleChange} />
            <Input label="Longitude" name="longitude" type="number" step="any" value={form.longitude} onChange={handleChange} />
          </div>
          <button 
            type="button" 
            onClick={handleGetLocation} 
            disabled={gettingLocation}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
          >
            {gettingLocation ? 'Getting location...' : 'Use Current Location'}
          </button>
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Images (max 5)</label>
          <div className="border-2 border-dashed border-white/30 dark:border-slate-600/50 rounded-xl p-6 text-center">
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop</p>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload}
              className="hidden" id="image-upload" />
            <label htmlFor="image-upload" className="btn-secondary text-sm cursor-pointer inline-block">
              {uploading ? 'Uploading...' : 'Choose Files'}
            </label>
          </div>
          {form.imageUrls.length > 0 && (
            <div className="flex gap-2 mt-3">
              {form.imageUrls.map((url, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setForm(prev => ({ ...prev, imageUrls: prev.imageUrls.filter((_, j) => j !== i) }))}
                    className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-bl-lg">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" loading={loading} className="w-full">Publish Service</Button>
      </form>
    </div>
  );
}
