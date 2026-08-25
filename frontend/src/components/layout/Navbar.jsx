import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Moon, Sun, LogOut, MapPin, User, LayoutDashboard,
  Menu, X, BookOpen, Settings, ChevronDown, Store
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'SELLER') return '/seller/dashboard';
    return '/dashboard';
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors flex items-center gap-1.5 py-1 border-b-2 ${
      isActive
        ? 'text-primary-600 dark:text-primary-400 border-primary-500'
        : 'text-slate-600 dark:text-slate-300 border-transparent hover:text-primary-500 dark:hover:text-primary-400'
    }`;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20 dark:border-slate-700/50 rounded-none px-4 md:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="p-1.5 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg">
            <MapPin className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
            Localyze
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/dashboard" className={navLinkClass}>
            <LayoutDashboard className="w-4 h-4" /> Browse
          </NavLink>

          {user?.role === 'SELLER' && (
            <>
              <NavLink to="/seller/services" className={navLinkClass}>
                <Store className="w-4 h-4" /> My Services
              </NavLink>
              <NavLink to="/seller/bookings" className={navLinkClass}>
                <BookOpen className="w-4 h-4" /> Bookings
              </NavLink>
            </>
          )}

          {user?.role === 'USER' && (
            <NavLink to="/my-bookings" className={navLinkClass}>
              <BookOpen className="w-4 h-4" /> My Bookings
            </NavLink>
          )}

          {user?.role === 'ADMIN' && (
            <>
              <NavLink to="/admin/users" className={navLinkClass}>
                <User className="w-4 h-4" /> Users
              </NavLink>
              <NavLink to="/admin/services" className={navLinkClass}>
                <Settings className="w-4 h-4" /> Services
              </NavLink>
            </>
          )}
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-700/70 transition-colors"
            title="Toggle theme"
          >
            {darkMode
              ? <Sun className="w-5 h-5 text-amber-400" />
              : <Moon className="w-5 h-5 text-slate-600" />
            }
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-700/70 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-sm font-medium max-w-[100px] truncate">
                  {user.name || user.email}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-500 hidden md:block" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 glass rounded-xl shadow-xl overflow-hidden"
                  onBlur={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-200/70 dark:border-slate-700/50">
                    <p className="text-xs text-slate-500">Signed in as</p>
                    <p className="text-sm font-semibold truncate">{user.email}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                      user.role === 'ADMIN' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      user.role === 'SELLER' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>{user.role}</span>
                  </div>
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <button
                    onClick={() => { setDropdownOpen(false); logout(); }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors px-3 py-1.5"
              >
                Log in
              </Link>
              <button
                onClick={() => navigate('/register')}
                className="btn-primary text-sm py-1.5 px-4"
              >
                Sign up
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-700/70 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden pt-4 pb-2 border-t border-slate-200/50 dark:border-slate-700/50 mt-3 flex flex-col gap-1">
          <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Browse Services</Link>
          {user?.role === 'USER' && <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">My Bookings</Link>}
          {user?.role === 'SELLER' && <Link to="/seller/services" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">My Services</Link>}
          {user?.role === 'SELLER' && <Link to="/seller/bookings" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Bookings</Link>}
          {user?.role === 'ADMIN' && <Link to="/admin/users" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Manage Users</Link>}
          {user?.role === 'ADMIN' && <Link to="/admin/services" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Manage Services</Link>}
          {user && <Link to="/profile" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Profile</Link>}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
