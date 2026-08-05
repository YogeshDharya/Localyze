import { useState } from 'react';
import paymentService from '../../services/paymentService';
import { showToast } from './Toast';

async function loadRazorpayScript() {
  if (window.Razorpay) return true;
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function RazorpayButton({ bookingId, label = 'Pay Now', className = '' }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const payload = { bookingId: parseInt(bookingId, 10) };
      console.log('Creating order with payload:', payload);
      const res = await paymentService.createOrder(payload.bookingId ? payload.bookingId : bookingId);
      const data = res.data || {};

      const orderId = data.orderId || data.id || data.razorpay_order_id;
      const amount = data.amount || data.totalAmount;
      const currency = data.currency || 'INR';
      const key = data.key || data.razorpayKey || import.meta.env.VITE_RAZORPAY_KEY || import.meta.env.VITE_RAZORPAY_KEY_ID;
      console.debug('Using razorpay key from', data.key ? 'response.key' : data.razorpayKey ? 'response.razorpayKey' : import.meta.env.VITE_RAZORPAY_KEY ? 'VITE_RAZORPAY_KEY' : import.meta.env.VITE_RAZORPAY_KEY_ID ? 'VITE_RAZORPAY_KEY_ID' : 'none');

      // Validate required fields before opening checkout
      if (!key) {
        console.error('Razorpay key missing', { data });
        showToast.error('Payment key not configured');
        setLoading(false);
        return;
      }

      if (!orderId && !amount) {
        console.error('OrderId and amount missing', { data });
        showToast.error('Invalid payment details from server');
        setLoading(false);
        return;
      }

      // Ensure amount is an integer in paise
      const amountInt = parseInt(amount, 10);
      if (Number.isNaN(amountInt) || amountInt <= 0) {
        console.warn('Amount invalid, using server order without amount', { amount });
      }
      const ok = await loadRazorpayScript();
      if (!ok) { showToast.error('Failed to load payment gateway'); setLoading(false); return; }

      const options = {
        key,
        amount: amountInt || undefined, // in paise
        currency,
        name: data.name || 'Payment',
        description: data.description || `Booking #${bookingId}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            await paymentService.verifyPayment({ ...response, bookingId });
            showToast.success('Payment successful');
            // reload to reflect payment status
            window.location.reload();
          } catch (err) {
            console.error(err);
            showToast.error('Payment verification failed');
          }
        },
        prefill: {
          name: (window.__USER__ && window.__USER__.name) || '',
          email: (window.__USER__ && window.__USER__.email) || '',
        },
        theme: { color: '#2b6cb0' },
      };

      try {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error('Razorpay open error:', err, { options });
        showToast.error('Failed to open payment window');
      }
    } catch (err) {
      console.error('Create order error:', err);
      // Show detailed error when available
      const resp = err.response;
      if (resp) {
        console.error('Response data:', resp.data);
        console.error('Response status:', resp.status);
        showToast.error(resp.data?.message || `Error ${resp.status}: ${JSON.stringify(resp.data)}`);
      } else {
        showToast.error(err.message || 'Failed to initiate payment');
      }
    } finally { setLoading(false); }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`px-3 py-2 rounded-md text-sm bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors ${className}`}
    >
      {loading ? 'Processing...' : label}
    </button>
  );
}
