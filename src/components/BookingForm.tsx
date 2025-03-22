
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? Math.max(1, parseInt(value) || 1) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast("Please fill in all required fields", {
        description: "All fields are required to complete your booking.",
        action: {
          label: "OK",
          onClick: () => {}
        },
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Generate a ticket ID using a timestamp and random string
      const ticketId = `TKT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      
      // Here we'd normally store the booking in a database
      
      // For now, we'll store in localStorage for demo purposes
      const ticketData = {
        id: ticketId,
        eventId,
        eventTitle,
        ...formData,
        bookingDate: new Date().toISOString(),
        status: 'CONFIRMED',
        checkedIn: false
      };
      
      const existingTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
      localStorage.setItem('tickets', JSON.stringify([...existingTickets, ticketData]));
      
      toast("Booking successful!", {
        description: "Your ticket has been created. You can view it in My Ticket section.",
      });
      
      setIsSubmitting(false);
      
      // Redirect to ticket page
      navigate(`/ticket?id=${ticketId}`);
    }, 1500);
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
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all"
                placeholder="+1 (555) 555-5555"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Number of Tickets
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                max="10"
                required
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all"
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
