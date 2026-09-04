import { useState, useEffect } from 'react';
import { Edit2, Plus } from 'lucide-react';
import categoryService from '../../services/categoryService';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { showToast } from '../../components/ui/Toast';

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', iconUrl: '' });
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getAll();
      setCategories(res.data || []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await categoryService.createCategory(form);
      showToast.success('Category created');
      setIsModalOpen(false);
      setForm({ name: '', description: '', iconUrl: '' });
      fetchCategories();
    } catch (error) {
      console.error('Failed to create category:', error);
      showToast.error('Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="xl" /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Categories</h1>
        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Add Category</Button>
      </div>

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/20 dark:border-slate-700/50 text-gray-500 dark:text-gray-400">
              <th className="pb-3 font-semibold">Name</th>
              <th className="pb-3 font-semibold">Description</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} className="border-b border-white/10 dark:border-slate-700/30">
                <td className="py-4 font-medium text-gray-900 dark:text-white">{cat.name}</td>
                <td className="py-4 text-gray-600 dark:text-gray-400">{cat.description}</td>
                <td className="py-4"><Badge variant={!cat.isActive ? 'success' : 'default'}>{!cat.isActive ? 'Active' : 'Inactive'}</Badge></td>
                <td className="py-4 text-right">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-400 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Category">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <textarea name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="glass-input resize-none" rows={3} />
          </div>
          <Input label="Icon URL (optional)" name="iconUrl" value={form.iconUrl} onChange={(e) => setForm({ ...form, iconUrl: e.target.value })} />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
