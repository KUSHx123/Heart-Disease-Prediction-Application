import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Heart, 
  History, 
  User, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-screen bg-white shadow-lg transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-full flex flex-col">
          <div className="p-4 flex items-center justify-between">
            <Link to="/dashboard" className={`flex items-center ${!isSidebarOpen && 'hidden'}`}>
              <Heart className="h-8 w-8 text-red-500" />
              <span className="ml-2 font-bold text-gray-800">HeartGuard</span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              {isSidebarOpen ? (
                <ChevronLeft className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dashboard"
                  className={`flex items-center p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 ${
                    isActive('/dashboard') ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <Home className="h-5 w-5" />
                  {isSidebarOpen && <span className="ml-3">Dashboard</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/predict"
                  className={`flex items-center p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 ${
                    isActive('/predict') ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <Heart className="h-5 w-5" />
                  {isSidebarOpen && <span className="ml-3">Predict</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/history"
                  className={`flex items-center p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 ${
                    isActive('/dashboard/history') ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <History className="h-5 w-5" />
                  {isSidebarOpen && <span className="ml-3">History</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className={`flex items-center p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 ${
                    isActive('/profile') ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <User className="h-5 w-5" />
                  {isSidebarOpen && <span className="ml-3">Profile</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className={`flex items-center p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 ${
                    isActive('/settings') ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  {isSidebarOpen && <span className="ml-3">Settings</span>}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="p-4">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full p-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;