
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import EventCard from '@/components/EventCard';
import { sampleEvents } from '@/utils/ticketUtils';
import { ChevronRight, Ticket, QrCode, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  // Preload any necessary data
  useEffect(() => {
    // In a real app, we might fetch events from an API
    // For this demo, we're using the sample data from ticketUtils
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero section */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 px-4 animate-fade-in">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center mx-auto max-w-3xl">
            <div className="mb-6 py-1 px-3 bg-blue-50 text-blue-600 text-sm font-medium rounded-full inline-flex items-center">
              <span className="animate-pulse bg-blue-600 h-2 w-2 rounded-full mr-2"></span>
              Now accepting bookings
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-medium tracking-tight mb-6">
              Book and scan tickets with <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">simplicity</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              A seamless platform for event organizers to manage tickets and track attendance in real-time through elegant QR code scanning.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/book" 
                className={cn(
                  "px-8 py-3 rounded-lg bg-primary text-white font-medium",
                  "hover:bg-primary/90 transition-all",
                  "flex items-center justify-center gap-2"
                )}
              >
                Book a Ticket
                <ChevronRight size={18} />
              </Link>
              
              <Link 
                to="/admin" 
                className={cn(
                  "px-8 py-3 rounded-lg bg-white text-gray-800 font-medium",
                  "hover:bg-gray-100 transition-all border border-gray-200",
                  "flex items-center justify-center gap-2"
                )}
              >
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-border shadow-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg inline-block mb-4">
                <Ticket size={24} />
              </div>
              <h3 className="text-xl font-display font-medium mb-3">Book Tickets</h3>
              <p className="text-gray-600">Easily book tickets for any event with just a few clicks and receive your QR code instantly.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl border border-border shadow-sm animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="p-3 bg-green-50 text-green-600 rounded-lg inline-block mb-4">
                <QrCode size={24} />
              </div>
              <h3 className="text-xl font-display font-medium mb-3">Scan QR Codes</h3>
              <p className="text-gray-600">Quickly verify attendees at the entrance with a simple scan of their unique QR code.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl border border-border shadow-sm animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg inline-block mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-display font-medium mb-3">Track Attendance</h3>
              <p className="text-gray-600">Monitor attendance in real-time with detailed analytics on your event dashboard.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Events section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl font-display font-medium mb-2">Upcoming Events</h2>
              <p className="text-gray-600">Discover and book your next experience</p>
            </div>
            
            <Link 
              to="/book" 
              className="mt-4 md:mt-0 text-primary font-medium flex items-center hover:underline"
            >
              View all events
              <ChevronRight size={18} />
            </Link>
          </div>
          
          {/* Events grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleEvents.map((event, index) => (
              <EventCard 
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.date}
                time={event.time}
                location={event.location}
                image={event.image}
                attendees={event.attendees}
                maxAttendees={event.maxAttendees}
                featured={event.featured}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="text-xl font-display font-medium">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                  TicketScan
                </span>
              </span>
              <p className="text-gray-500 mt-2">Seamless ticket booking and scanning</p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-800 transition-colors">Terms</a>
              <a href="#" className="text-gray-500 hover:text-gray-800 transition-colors">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-gray-800 transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} TicketScan. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
