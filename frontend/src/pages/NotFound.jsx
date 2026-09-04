import { Link } from 'react-router-dom';
import { MapPinOff, Home } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center animate-slide-up">
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
          <MapPinOff className="w-12 h-12 text-blue-400" />
        </div>
        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Looks like this page has wandered off the map. Let's get you back on track.
        </p>
        <Link to="/">
          <Button icon={Home} size="lg">Go Back Home</Button>
        </Link>
      </div>
    </div>
  );
}
