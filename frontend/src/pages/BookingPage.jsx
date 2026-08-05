import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, FileText, CreditCard, ArrowLeft } from 'lucide-react';
import serviceService from '../services/serviceService';
import bookingService from '../services/bookingService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import { showToast } from '../components/ui/Toast';
import { formatPrice } from '../utils/formatters';

export default function BookingPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    bookingDate: '',
    timeSlot: '',
    notes: '',
  });

  useEffect(() => {
    serviceService.getById(serviceId)
      .then(res => setService(res.data))
      .catch(() => showToast.error('Service not found'))
      .finally(() => setLoading(false));
  }, [serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bookingDate) { showToast.error('Please select a booking date'); return; }
    setSubmitting(true);
    try {
      const res = await bookingService.create({
        serviceId: parseInt(serviceId),
        bookingDate: form.bookingDate,
        timeSlot: form.timeSlot,
        notes: form.notes,
      });
      showToast.success('Booking created successfully!');
      navigate('/bookings');
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="xl" /></div>;
  if (!service) return null;

  // Tomorrow's date as minimum
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-blue-500 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Book Service</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="glass-card space-y-5">
            <Input
              label="Booking Date"
              name="bookingDate"
              type="date"
              icon={Calendar}
              value={form.bookingDate}
              onChange={(e) => setForm({ ...form, bookingDate: e.target.value })}
              min={minDate}
            />

            <Input
              label="Preferred Time Slot"
              name="timeSlot"
              icon={Clock}
              placeholder="e.g., 10:00 AM - 12:00 PM"
              value={form.timeSlot}
              onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Additional Notes
              </label>
              <textarea
                name="notes"
                rows={4}
                placeholder="Describe what you need, any special requirements..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="glass-input resize-none"
              />
            </div>

            <Button type="submit" loading={submitting} icon={CreditCard} className="w-full">
              Confirm Booking
            </Button>
          </form>
        </div>

        {/* Service summary */}
        <div>
          <div className="glass-card">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Service Summary</h3>
            <div className="h-32 rounded-xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 mb-3 overflow-hidden">
              {service.imageUrls?.[0] ? (
                <img src={service.imageUrls[0]} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">🔧</div>
              )}
            </div>
            <p className="font-medium text-gray-900 dark:text-white mb-1">{service.title}</p>
            <p className="text-sm text-gray-500 mb-3">by {service.sellerName}</p>
            <div className="pt-3 border-t border-white/20 dark:border-slate-700/40">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Amount</span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatPrice(service.price)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
