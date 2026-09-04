import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import serviceService from '../../services/serviceService';
import categoryService from '../../services/categoryService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { showToast } from '../../components/ui/Toast';
import { PRICE_UNITS } from '../../utils/constants';

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', categoryId: '', price: '', priceUnit: 'fixed',
    address: '', latitude: '', longitude: '', availability: '', imageUrls: [],
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const [svcRes, catRes] = await Promise.all([serviceService.getById(id), categoryService.getAll()]);
        const svc = svcRes.data;
        setForm({
          title: svc.title, description: svc.description, categoryId: svc.categoryId,
          price: svc.price, priceUnit: svc.priceUnit || 'fixed', address: svc.address,
          latitude: svc.latitude, longitude: svc.longitude, availability: svc.availability || '',
          imageUrls: svc.imageUrls || [],
        });
        setCategories(catRes.data || []);
      } catch { showToast.error('Service not found'); navigate(-1); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await serviceService.update(id, {
        ...form, categoryId: parseInt(form.categoryId), price: parseFloat(form.price),
        latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude),
      });
      showToast.success('Service updated!');
      navigate('/seller/services');
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to update');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="xl" /></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-blue-500 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Service</h1>

      <form onSubmit={handleSubmit} className="glass-card space-y-5">
        <Input label="Service Title" name="title" value={form.title} onChange={handleChange} />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
          <textarea name="description" rows={5} value={form.description} onChange={handleChange} className="glass-input resize-none" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange} className="glass-input">
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <Input label="Price (₹)" name="price" type="number" value={form.price} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Price Unit</label>
            <select name="priceUnit" value={form.priceUnit} onChange={handleChange} className="glass-input">
              {PRICE_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
          <Input label="Availability" name="availability" value={form.availability} onChange={handleChange} />
        </div>
        <Input label="Address" name="address" value={form.address} onChange={handleChange} />
        <Button type="submit" loading={saving} className="w-full">Save Changes</Button>
      </form>
    </div>
  );
}
