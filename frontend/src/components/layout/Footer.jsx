import { Link } from "react-router-dom";
import { MapPin, Github, Twitter, Mail, Heart } from "lucide-react";
import logo from '../../assets/logo.png';
export default function Footer() {
  return (
    <footer className="glass border-t border-white/20 dark:border-slate-700/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 group">
              {/* <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                         <MapPin className="w-5 h-5 text-white" />
                       </div> */}
              <div>
                <img
                  src={logo}
                  alt="Localyze Logo"
                  className="w-9 h-9 rounded-xl object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Local<span className="text-gray-400 dark:text-white">yze</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Discover and book trusted local services near you. From plumbers
              to tutors — all within your neighborhood.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { to: "/dashboard", label: "Find Services" },
                { to: "/register", label: "List Your Business" },
                { to: "/login", label: "Sign In" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-4 uppercase tracking-wider">
              Categories
            </h4>
            <ul className="space-y-2">
              {[
                "Plumber",
                "Electrician",
                "Carpenter",
                "Tiffin Service",
                "House Help",
              ].map((cat) => (
                <li key={cat}>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {cat}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-4 uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex items-center gap-3 mb-4">
              <a
                href="#"
                className="p-2 rounded-xl bg-white/20 dark:bg-slate-700/30 hover:bg-blue-500/20 transition-colors"
              >
                <Twitter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </a>
              <a
                href="#"
                className="p-2 rounded-xl bg-white/20 dark:bg-slate-700/30 hover:bg-blue-500/20 transition-colors"
              >
                <Github className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </a>
              <a
                href="#"
                className="p-2 rounded-xl bg-white/20 dark:bg-slate-700/30 hover:bg-blue-500/20 transition-colors"
              >
                <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </a>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              support@localyze.in
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200/30 dark:border-slate-700/30 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Localyze. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> in
            India
          </p>
        </div>
      </div>
    </footer>
  );
}
