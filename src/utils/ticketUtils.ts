
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

// Get all tickets from localStorage
export const getAllTickets = (): TicketData[] => {
  try {
    return JSON.parse(localStorage.getItem('tickets') || '[]');
  } catch (error) {
    console.error('Error getting tickets:', error);
    return [];
  }
};

// Get a single ticket by ID
export const getTicketById = (ticketId: string): TicketData | null => {
  try {
    const tickets = getAllTickets();
    return tickets.find(ticket => ticket.id === ticketId) || null;
  } catch (error) {
    console.error('Error getting ticket:', error);
    return null;
  }
};

// Validate ticket (check if it exists and is not used)
export const validateTicket = (ticketId: string): { valid: boolean; message: string; ticket: TicketData | null } => {
  const ticket = getTicketById(ticketId);
  
  if (!ticket) {
    return { valid: false, message: 'Ticket not found', ticket: null };
  }
  
  if (ticket.checkedIn) {
    return { valid: false, message: 'Ticket already used', ticket };
  }
  
  return { valid: true, message: 'Valid ticket', ticket };
};

// Mark ticket as checked in
export const checkInTicket = (ticketId: string): boolean => {
  try {
    const tickets = getAllTickets();
    const ticketIndex = tickets.findIndex(ticket => ticket.id === ticketId);
    
    if (ticketIndex === -1) {
      return false;
    }
    
    // Update the ticket
    tickets[ticketIndex] = {
      ...tickets[ticketIndex],
      checkedIn: true,
      checkInTime: new Date().toISOString()
    };
    
    // Save back to localStorage
    localStorage.setItem('tickets', JSON.stringify(tickets));
    return true;
  } catch (error) {
    console.error('Error checking in ticket:', error);
    return false;
  }
};

// Sample event data for the demo
export const sampleEvents = [
  {
    id: 'event-1',
    title: 'Tech Conference 2023',
    date: 'Oct 15, 2023',
    time: '9:00 AM - 5:00 PM',
    location: 'San Francisco Convention Center',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Join the biggest tech conference of the year with speakers from leading tech companies.',
    attendees: 245,
    maxAttendees: 300,
    featured: true
  },
  {
    id: 'event-2',
    title: 'Design Workshop',
    date: 'Oct 22, 2023',
    time: '10:00 AM - 3:00 PM',
    location: 'Design Studio, New York',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Learn the latest design principles and tools in this hands-on workshop.',
    attendees: 32,
    maxAttendees: 50,
    featured: false
  },
  {
    id: 'event-3',
    title: 'Music Festival',
    date: 'Nov 5, 2023',
    time: '4:00 PM - 11:00 PM',
    location: 'Central Park, New York',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Enjoy live performances from top artists across multiple genres.',
    attendees: 890,
    maxAttendees: 1000,
    featured: false
  }
];

// Get event by ID
export const getEventById = (eventId: string) => {
  return sampleEvents.find(event => event.id === eventId) || null;
};
