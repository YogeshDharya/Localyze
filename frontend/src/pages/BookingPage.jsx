import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { serviceService } from '../services/serviceService';
import { bookingService } from '../services/bookingService';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const BookingPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    scheduledAt: '',
    notes: ''
  });

  useEffect(() => {
    fetchService();
  }, [serviceId]);

  const fetchService = async () => {
    try {
      const data = await serviceService.getById(serviceId);
      setService(data);
    } catch (err) {
      console.error('Failed to load service', err);
      toast.error('Service not found');
      navigate('/dashboard');
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
    if (!formData.scheduledAt) {
      toast.error('Please select a date and time');
      return;
    }

    setSubmitting(true);
    try {
      await bookingService.create({
        serviceId,
        scheduledAt: formData.scheduledAt,
        notes: formData.notes
      });
      toast.success('Booking confirmed successfully!');
      navigate('/my-bookings');
    } catch (err) {
      console.error('Booking failed', err);
      toast.error(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
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
      <h1 className="text-3xl font-bold text-white mb-8">Book Service</h1>
      
      <GlassCard className="p-6 mb-8">
        <div className="flex gap-4 items-center">
          {service.imageUrls && service.imageUrls.length > 0 ? (
            <img 
              src={service.imageUrls[0]} 
              alt={service.title} 
              className="w-20 h-20 rounded-lg object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="text-gray-500 text-xs text-center px-2">No image</span>
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-white">{service.title}</h2>
            <p className="text-gray-400 text-sm">Provider: {service.providerName}</p>
            <p className="text-blue-400 font-medium mt-1">
              ${service.price} / {service.priceUnit}
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Date and Time"
            type="datetime-local"
            name="scheduledAt"
            value={formData.scheduledAt}
            onChange={handleChange}
            required
            min={new Date().toISOString().slice(0, 16)}
          />
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300">
              Additional Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
              placeholder="Any specific requests or instructions for the provider..."
            />
          </div>

          <div className="pt-4 flex gap-4">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => navigate(`/services/${serviceId}`)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={submitting}
            >
              Confirm Booking
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default BookingPage;
