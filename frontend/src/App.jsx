import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LocationProvider } from './contexts/LocationContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import ServiceDetails from './pages/ServiceDetails';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Seller pages
import SellerDashboard from './pages/seller/SellerDashboard';
import AddService from './pages/seller/AddService';
import EditService from './pages/seller/EditService';
import MyServices from './pages/seller/MyServices';
import SellerBookings from './pages/seller/SellerBookings';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageServices from './pages/admin/ManageServices';
import ManageCategories from './pages/admin/ManageCategories';

function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-mesh-light dark:bg-mesh-dark">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <LocationProvider>
            <AppLayout>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* User routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/services/:id" element={<ServiceDetails />} />
                <Route path="/book/:serviceId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
                <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
                <Route path="/bookings/:bookingId/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

                {/* Seller routes */}
                <Route path="/seller/dashboard" element={<ProtectedRoute roles={['SELLER']}><SellerDashboard /></ProtectedRoute>} />
                <Route path="/seller/services" element={<ProtectedRoute roles={['SELLER']}><MyServices /></ProtectedRoute>} />
                <Route path="/seller/services/new" element={<ProtectedRoute roles={['SELLER']}><AddService /></ProtectedRoute>} />
                <Route path="/seller/services/:id/edit" element={<ProtectedRoute roles={['SELLER']}><EditService /></ProtectedRoute>} />
                <Route path="/seller/bookings" element={<ProtectedRoute roles={['SELLER']}><SellerBookings /></ProtectedRoute>} />

                {/* Admin routes */}
                <Route path="/admin/dashboard" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute roles={['ADMIN']}><ManageUsers /></ProtectedRoute>} />
                <Route path="/admin/services" element={<ProtectedRoute roles={['ADMIN']}><ManageServices /></ProtectedRoute>} />
                <Route path="/admin/categories" element={<ProtectedRoute roles={['ADMIN']}><ManageCategories /></ProtectedRoute>} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
            <Toaster position="top-right" />
          </LocationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
