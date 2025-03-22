
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Lock } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      toast.error("Missing credentials", {
        description: "Please enter both username and password",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate authentication (in a real app, this would call an API)
    setTimeout(() => {
      // For demo purposes, accept any login with admin or Admin in the username
      if (credentials.username.toLowerCase().includes('admin')) {
        // Store auth state in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        
        toast.success("Login successful", {
          description: "Welcome to the admin dashboard",
        });
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      } else {
        toast.error("Authentication failed", {
          description: "Invalid username or password",
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-medium mb-2">Admin Login</h1>
          <p className="text-gray-600">Access the event management dashboard</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={credentials.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all"
                  placeholder="admin"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  For demo: Use "admin" as username and any password
                </div>
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "w-full flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium",
                    "bg-primary hover:bg-primary/90 transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-primary/40",
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  )}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Lock size={18} className="mr-2" />
                      Sign In
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <a href="/" className="text-primary hover:underline">
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
