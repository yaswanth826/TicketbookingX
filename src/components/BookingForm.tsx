
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { createTicket } from '@/utils/ticketUtils';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BookingFormProps {
  eventId: string;
  eventTitle: string;
}

const BookingForm = ({ eventId, eventTitle }: BookingFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    quantity: 1
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the minimum allowed date (March 1st, 2025)
  const minDate = new Date(2025, 2, 1); // Month is 0-indexed in JavaScript

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? Math.max(1, parseInt(value) || 1) : value
    }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields", {
        description: "All fields are required to complete your booking.",
      });
      return;
    }

    if (!selectedDate) {
      toast.error("Please select a date", {
        description: "You must select a date for your booking.",
      });
      return;
    }

    if (!selectedTime) {
      toast.error("Please select a time", {
        description: "You must select a time for your booking.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format the date and time
      const dateTimeString = `${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}:00`;
      
      // Use the centralized ticket creation function
      const ticketData = {
        eventId,
        eventTitle,
        ...formData,
        eventDate: dateTimeString
      };
      
      const ticket = createTicket(ticketData);
      
      toast.success("Booking successful!", {
        description: "Your ticket has been created. You can view it in My Ticket section.",
      });
      
      // Redirect to ticket page
      navigate(`/ticket?id=${ticket.id}`);
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error("Booking failed", {
        description: "There was an error creating your ticket. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-display font-medium mb-4">Book Your Ticket</h3>
          <div className="mb-6 pb-6 border-b border-gray-100">
            <p className="text-sm text-gray-500 mb-4">Event</p>
            <div className="font-medium">{eventTitle}</div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full"
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full"
                placeholder="john@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full"
                placeholder="+1 (555) 555-5555"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < minDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="time"
                  name="time"
                  type="time"
                  required
                  value={selectedTime}
                  onChange={handleTimeChange}
                  className="w-full pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Number of Tickets
              </label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                max="10"
                required
                value={formData.quantity}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium",
                  "bg-primary hover:bg-primary/90 transition-all",
                  "focus:outline-none focus:ring-2 focus:ring-primary/40",
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                )}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Complete Booking"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
