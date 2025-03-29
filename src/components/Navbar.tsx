import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Heart className="h-8 w-8 text-red-500" />
              <span className="ml-2 text-xl font-bold text-gray-800">HeartGuard</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">Home</Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">About Us</Link>
            <Link to="/predict" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">Prediction Tool</Link>
            <Link to="/faq" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">FAQ</Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">Contact Us</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md">Dashboard</Link>
                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="flex items-center">
                    <img
                      src={user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata.full_name)}&background=random`}
                      alt={user.user_metadata.full_name}
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="ml-2 text-gray-700">{user.user_metadata.full_name}</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md">Login</Link>
                <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute w-full bg-white shadow-lg z-50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">Home</Link>
            <Link to="/about" className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">About Us</Link>
            <Link to="/predict" className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">Prediction Tool</Link>
            <Link to="/faq" className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">FAQ</Link>
            <Link to="/contact" className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">Contact Us</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="block text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md">Dashboard</Link>
                <Link to="/profile" className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">Profile</Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md">Login</Link>
                <Link to="/signup" className="block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-center">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;