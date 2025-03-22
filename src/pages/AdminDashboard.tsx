
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import { sampleEvents } from '@/utils/ticketUtils';
import { LayoutDashboard, Scan, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Check authentication status from localStorage
    const authStatus = localStorage.getItem('isAuthenticated');
    
    // Simulate loading
    setTimeout(() => {
      if (authStatus === 'true') {
        setIsAuthenticated(true);
      } else {
        navigate('/admin');
      }
      setIsLoading(false);
    }, 1000);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-t-2 border-b-2 border-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-display font-medium mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-6">
              You need to be logged in to access the admin dashboard.
            </p>
            <button
              onClick={() => navigate('/admin')}
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 px-4 animate-fade-in">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-64">
              <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="font-medium">Admin Panel</h2>
                </div>
                
                <div className="p-2">
                  <nav className="space-y-1">
                    <a 
                      href="/admin/dashboard" 
                      className="flex items-center px-4 py-2 text-gray-800 bg-gray-100 rounded-lg"
                    >
                      <LayoutDashboard size={18} className="mr-3" />
                      Dashboard
                    </a>
                    
                    <a 
                      href="/admin/scan" 
                      className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Scan size={18} className="mr-3" />
                      Scan Tickets
                    </a>
                  </nav>
                </div>
                
                <div className="p-4 mt-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
              
              {/* Events filter */}
              <div className="mt-6 bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="font-medium">Filter by Event</h2>
                </div>
                
                <div className="p-4">
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="event-filter"
                        checked={selectedEventId === undefined}
                        onChange={() => setSelectedEventId(undefined)}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-gray-700">All Events</span>
                    </label>
                    
                    {sampleEvents.map(event => (
                      <label key={event.id} className="inline-flex items-center">
                        <input
                          type="radio"
                          name="event-filter"
                          checked={selectedEventId === event.id}
                          onChange={() => setSelectedEventId(event.id)}
                          className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <span className="ml-2 text-gray-700">{event.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="flex-1">
              <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h1 className="text-xl font-display font-medium">Event Dashboard</h1>
                </div>
                
                <div className="p-6">
                  <Dashboard eventId={selectedEventId} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
