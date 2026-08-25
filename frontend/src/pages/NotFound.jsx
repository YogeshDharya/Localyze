import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <GlassCard className="max-w-md w-full p-12 text-center">
        <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-white mb-6">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary" fullWidth>
            Return Home
          </Button>
        </Link>
      </GlassCard>
    </div>
  );
};

export default NotFound;
