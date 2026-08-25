import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

import ServiceDetails from './pages/ServiceDetails';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';

import SellerDashboard from './pages/seller/SellerDashboard';
import MyServices from './pages/seller/MyServices';
import AddService from './pages/seller/AddService';
import EditService from './pages/seller/EditService';
import SellerBookings from './pages/seller/SellerBookings';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageServices from './pages/admin/ManageServices';

function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 animate-fade-in">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/services/:id" element={<ServiceDetails />} />

              {/* Protected Shared Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute roles={['USER', 'SELLER', 'ADMIN']}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute roles={['USER', 'SELLER', 'ADMIN']}>
                  <Profile />
                </ProtectedRoute>
              } />

              {/* Protected User Routes */}
              <Route path="/book/:serviceId" element={
                <ProtectedRoute roles={['USER']}>
                  <BookingPage />
                </ProtectedRoute>
              } />
              <Route path="/my-bookings" element={
                <ProtectedRoute roles={['USER']}>
                  <MyBookings />
                </ProtectedRoute>
              } />

              {/* Protected Seller Routes */}
              <Route path="/seller/dashboard" element={
                <ProtectedRoute roles={['SELLER']}>
                  <SellerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/seller/services" element={
                <ProtectedRoute roles={['SELLER']}>
                  <MyServices />
                </ProtectedRoute>
              } />
              <Route path="/seller/services/new" element={
                <ProtectedRoute roles={['SELLER']}>
                  <AddService />
                </ProtectedRoute>
              } />
              <Route path="/seller/services/:id/edit" element={
                <ProtectedRoute roles={['SELLER']}>
                  <EditService />
                </ProtectedRoute>
              } />
              <Route path="/seller/bookings" element={
                <ProtectedRoute roles={['SELLER']}>
                  <SellerBookings />
                </ProtectedRoute>
              } />

              {/* Protected Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute roles={['ADMIN']}>
                  <ManageUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/services" element={
                <ProtectedRoute roles={['ADMIN']}>
                  <ManageServices />
                </ProtectedRoute>
              } />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              className: 'glass dark:text-white',
              style: {
                background: 'var(--tw-bg-opacity)',
                color: 'inherit'
              }
            }} 
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
