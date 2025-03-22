
import { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  ArrowUpRight, 
  BarChart4, 
  UserCheck, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';

interface DashboardProps {
  eventId?: string;
}

interface TicketData {
  id: string;
  eventId: string;
  eventTitle: string;
  fullName: string;
  email: string;
  phone: string;
  quantity: number;
  bookingDate: string;
  status: string;
  checkedIn: boolean;
  checkInTime?: string;
}

const Dashboard = ({ eventId }: DashboardProps) => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'overview' | 'attendees'>('overview');

  useEffect(() => {
    // Load tickets from localStorage
    const loadTickets = () => {
      setIsLoading(true);
      setTimeout(() => {
        try {
          const storedTickets = JSON.parse(localStorage.getItem('tickets') || '[]') as TicketData[];
          
          // Filter by eventId if provided
          const filteredTickets = eventId 
            ? storedTickets.filter(ticket => ticket.eventId === eventId)
            : storedTickets;
            
          setTickets(filteredTickets);
        } catch (error) {
          console.error("Error loading tickets:", error);
          setTickets([]);
        } finally {
          setIsLoading(false);
        }
      }, 800); // Simulate loading delay
    };
    
    loadTickets();
  }, [eventId]);

  // Calculate stats
  const totalTickets = tickets.reduce((sum, ticket) => sum + (ticket.quantity || 1), 0);
  const checkedInTickets = tickets.filter(ticket => ticket.checkedIn).length;
  const checkedInPercentage = totalTickets > 0 ? Math.round((checkedInTickets / totalTickets) * 100) : 0;
  
  // Dummy data for check-in times (in a real app, this would come from actual check-in times)
  const timeData = [
    { time: '9 AM', count: 3 },
    { time: '10 AM', count: 7 },
    { time: '11 AM', count: 12 },
    { time: '12 PM', count: 8 },
    { time: '1 PM', count: 5 },
    { time: '2 PM', count: 9 },
    { time: '3 PM', count: 6 },
  ];
  
  // Data for pie chart
  const statusData = [
    { name: 'Checked In', value: checkedInTickets, color: '#3B82F6' },
    { name: 'Not Checked In', value: totalTickets - checkedInTickets, color: '#E5E7EB' },
  ];

  return (
    <div className="w-full animate-fade-in">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-gray-500">Loading dashboard data...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Dashboard tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setSelectedView('overview')}
              className={cn(
                "px-4 py-2 font-medium text-sm transition-colors",
                selectedView === 'overview' 
                  ? "border-b-2 border-primary text-primary" 
                  : "text-gray-500 hover:text-gray-800"
              )}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedView('attendees')}
              className={cn(
                "px-4 py-2 font-medium text-sm transition-colors",
                selectedView === 'attendees' 
                  ? "border-b-2 border-primary text-primary" 
                  : "text-gray-500 hover:text-gray-800"
              )}
            >
              Attendees
            </button>
          </div>
          
          {selectedView === 'overview' ? (
            <>
              {/* Stats row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Attendees</p>
                      <p className="text-3xl font-display font-medium">{totalTickets}</p>
                    </div>
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Users className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Checked In</p>
                      <p className="text-3xl font-display font-medium">{checkedInTickets}</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded-lg">
                      <UserCheck className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${checkedInPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{checkedInPercentage}% checked in</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Not Checked In</p>
                      <p className="text-3xl font-display font-medium">{totalTickets - checkedInTickets}</p>
                    </div>
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <Clock className="h-6 w-6 text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Check-in by time */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-medium text-gray-800">Check-ins by Time</h3>
                    <div className="text-xs text-gray-500">Today</div>
                  </div>
                  
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={timeData}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="time" 
                          axisLine={false}
                          tickLine={false}
                          fontSize={12}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          fontSize={12}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Attendance status */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-medium text-gray-800">Attendance Status</h3>
                  </div>
                  
                  <div className="h-[300px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={110}
                          paddingAngle={4}
                          dataKey="value"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Attendees list
            <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {tickets.length > 0 ? (
                      tickets.map((ticket, index) => (
                        <tr key={ticket.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{ticket.fullName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{ticket.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span 
                              className={cn(
                                "px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                                ticket.checkedIn 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-gray-100 text-gray-800"
                              )}
                            >
                              {ticket.checkedIn ? 'Checked In' : 'Not Checked In'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {ticket.checkInTime || '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <AlertCircle className="h-12 w-12 text-gray-300 mb-4" />
                            <p className="text-lg font-medium">No attendees found</p>
                            <p className="text-sm mt-1">There are no tickets booked yet.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
