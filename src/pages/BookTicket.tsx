
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import BookingForm from '@/components/BookingForm';
import { getEventById, sampleEvents } from '@/utils/ticketUtils';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const BookTicket = () => {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('eventId');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  useEffect(() => {
    if (eventId) {
      const event = getEventById(eventId);
      setSelectedEvent(event);
    } else {
      // If no event ID is provided, default to the first event
      setSelectedEvent(sampleEvents[0]);
    }
  }, [eventId]);

  if (!selectedEvent) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">Loading event details...</p>
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
          {/* Back button */}
          <Link 
            to="/" 
            className="inline-flex items-center mb-6 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to events
          </Link>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Event details */}
            <div className="animate-slide-up">
              <div className="rounded-xl overflow-hidden mb-6">
                <img 
                  src={selectedEvent.image} 
                  alt={selectedEvent.title}
                  className="w-full h-64 object-cover"
                />
              </div>
              
              <h1 className="text-3xl font-display font-medium mb-4">{selectedEvent.title}</h1>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3" />
                  <span>{selectedEvent.date}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-3" />
                  <span>{selectedEvent.time}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>{selectedEvent.location}</span>
                </div>
              </div>
              
              <div className="p-6 bg-white rounded-xl border border-border mb-6">
                <h3 className="text-lg font-medium mb-3">About this event</h3>
                <p className="text-gray-600">{selectedEvent.description || 'Join us for this amazing event. Limited seats available, book your ticket now!'}</p>
              </div>
              
              <div className="p-6 bg-blue-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 mb-1">Attendees</p>
                    <p className="text-2xl font-medium">{selectedEvent.attendees} / {selectedEvent.maxAttendees}</p>
                  </div>
                  
                  <div className="text-blue-600 font-medium">
                    {Math.round((selectedEvent.attendees / selectedEvent.maxAttendees) * 100)}% booked
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(selectedEvent.attendees / selectedEvent.maxAttendees) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Booking form */}
            <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
              <BookingForm 
                eventId={selectedEvent.id} 
                eventTitle={selectedEvent.title} 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookTicket;
