
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import TicketQRCode from '@/components/QRCode';
import { getTicketById } from '@/utils/ticketUtils';
import { ArrowLeft, Calendar, Clock, MapPin, Ticket, UserCheck, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

const MyTicket = () => {
  const [searchParams] = useSearchParams();
  const ticketId = searchParams.get('id');
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ticketId) {
      // In a real app, this would be an API call
      setTimeout(() => {
        const foundTicket = getTicketById(ticketId);
        setTicket(foundTicket);
        setLoading(false);
        
        if (!foundTicket) {
          toast.error("Ticket not found", {
            description: "The ticket you're looking for could not be found.",
          });
        }
      }, 800); // Simulate loading
    } else {
      setLoading(false);
    }
  }, [ticketId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-t-2 border-b-2 border-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your ticket...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!ticketId || !ticket) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-6">
              <AlertCircle className="h-16 w-16 text-gray-300" />
            </div>
            <h1 className="text-2xl font-display font-medium mb-4">No Ticket Found</h1>
            <p className="text-gray-600 mb-6">
              We couldn't find the ticket you're looking for. Please check your ticket ID or book a new ticket.
            </p>
            <Link
              to="/book"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Book a Ticket
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 px-4 animate-fade-in">
        <div className="container mx-auto max-w-5xl">
          {/* Back button */}
          <Link 
            to="/" 
            className="inline-flex items-center mb-6 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to events
          </Link>
          
          <div className="bg-white rounded-xl overflow-hidden border border-border shadow-sm">
            <div className="p-6 sm:p-8 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-display font-medium">Your Ticket</h1>
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  ticket.checkedIn 
                    ? "bg-green-100 text-green-800" 
                    : "bg-blue-100 text-blue-800"
                )}>
                  {ticket.checkedIn ? 'Used' : 'Valid'}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6 sm:p-8">
              {/* Ticket details */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium mb-4">Event Details</h2>
                  <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
                    <h3 className="text-xl font-medium mb-4">{ticket.eventTitle}</h3>
                    
                    <div className="space-y-3 text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-3" />
                        <span>Event date will appear here</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-3" />
                        <span>Event time will appear here</span>
                      </div>
                      
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-3" />
                        <span>Event location will appear here</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-medium mb-4">Attendee Information</h2>
                  <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Name</p>
                        <p className="font-medium">{ticket.fullName}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <p className="font-medium">{ticket.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Phone</p>
                        <p className="font-medium">{ticket.phone}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Number of Tickets</p>
                        <p className="font-medium">{ticket.quantity}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {ticket.checkedIn && (
                  <div className="p-5 bg-green-50 rounded-lg border border-green-100 flex items-center">
                    <UserCheck className="h-6 w-6 text-green-500 mr-3" />
                    <div>
                      <p className="font-medium text-green-800">Checked In</p>
                      <p className="text-sm text-green-600">
                        {ticket.checkInTime 
                          ? new Date(ticket.checkInTime).toLocaleString() 
                          : 'Successfully checked in'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* QR Code */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-full mb-4">
                    <Ticket className="h-6 w-6" />
                  </div>
                  <h2 className="text-lg font-medium">Scan this QR code at the event</h2>
                  <p className="text-gray-500 mt-1">Present this to the event staff for entry</p>
                </div>
                
                <TicketQRCode 
                  ticketId={ticket.id}
                  eventTitle={ticket.eventTitle}
                  userName={ticket.fullName}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyTicket;
