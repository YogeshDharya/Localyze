import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';
import messageService from '../services/messageService';
import bookingService from '../services/bookingService';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/ui/Spinner';
import { showToast } from '../components/ui/Toast';
import { timeAgo } from '../utils/formatters';

export default function Messages() {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [booking, setBooking] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  const fetchMessages = async () => {
    try {
      const res = await messageService.getByBooking(bookingId);
      setMessages(res.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const [bRes] = await Promise.all([bookingService.getById(bookingId)]);
        setBooking(bRes.data);
        await fetchMessages();
      } catch { showToast.error('Failed to load messages'); }
      finally { setLoading(false); }
    };
    init();
  }, [bookingId]);

  // Poll for new messages
  useEffect(() => {
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [bookingId]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      await messageService.send({ bookingId: parseInt(bookingId), content: newMessage.trim() });
      setNewMessage('');
      await fetchMessages();
    } catch (err) {
      showToast.error('Failed to send message');
    } finally { setSending(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="xl" /></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="glass-card mb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">{booking?.serviceTitle}</h2>
          <p className="text-xs text-gray-500">Booking #{bookingId}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto glass-card space-y-3 mb-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No messages yet. Start the conversation!</p>
        ) : (
          messages.map(msg => {
            const isMine = msg.senderId === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                  isMine
                    ? 'bg-blue-500 text-white rounded-br-md'
                    : 'bg-white/30 dark:bg-slate-700/40 text-gray-800 dark:text-gray-200 rounded-bl-md'
                }`}>
                  {!isMine && <p className="text-xs font-medium text-blue-400 mb-0.5">{msg.senderName}</p>}
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${isMine ? 'text-blue-200' : 'text-gray-400'}`}>{timeAgo(msg.createdAt)}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="glass-card flex gap-3 items-center py-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 glass-input"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="p-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
