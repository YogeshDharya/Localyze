import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  PlusCircle, 
  CalendarCheck, 
  Users, 
  Settings,
  Menu,
  X
} from 'lucide-react';

const Sidebar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sellerLinks = [
    { to: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/seller/services', label: 'My Services', icon: Briefcase },
    { to: '/seller/services/new', label: 'Add Service', icon: PlusCircle },
    { to: '/seller/bookings', label: 'Bookings', icon: CalendarCheck },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users Management', icon: Users },
    { to: '/admin/services', label: 'Services Directory', icon: Briefcase },
  ];

  const links = role === 'ADMIN' ? adminLinks : sellerLinks;

  const toggleSidebar = () => setIsOpen(!isOpen);

  const NavItem = ({ to, label, icon: Icon, onClick }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center px-4 py-3 rounded-lg transition-colors mb-2
        ${isActive 
          ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium' 
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 font-normal'
        }
      `}
    >
      <Icon size={20} className="mr-3 shrink-0" />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="md:hidden fixed top-20 left-4 z-40 p-2 glass rounded-lg"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} className="text-gray-700 dark:text-gray-300" /> : <Menu size={24} className="text-gray-700 dark:text-gray-300" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        glass fixed md:sticky top-[73px] md:top-24 left-0 z-40
        w-64 h-[calc(100vh-73px)] md:h-[calc(100vh-120px)]
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col py-6 px-4 md:rounded-2xl md:ml-6
      `}>
        <div className="mb-8 px-4 mt-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            {role === 'ADMIN' ? 'Admin Panel' : 'Seller Portal'}
          </h2>
        </div>

        <nav className="flex-1 overflow-y-auto">
          {links.map((link) => (
            <NavItem 
              key={link.to} 
              {...link} 
              onClick={() => setIsOpen(false)}
            />
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-white/10">
          <NavItem 
            to={`/${role ? role.toLowerCase() : 'user'}/settings`} 
            label="Settings" 
            icon={Settings} 
            onClick={() => setIsOpen(false)}
          />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
