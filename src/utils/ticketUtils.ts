
interface TicketData {
  id: string;
  eventId: string;
  eventTitle: string;
  fullName: string;
  email: string;
  phone: string;
  quantity: number;
  bookingDate: string;
  eventDate?: string;  // Added for selected date and time
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

// Create a new ticket
export const createTicket = (ticketData: Omit<TicketData, 'id' | 'bookingDate' | 'status' | 'checkedIn'>): TicketData => {
  try {
    // Generate a ticket ID using a timestamp and random string
    const ticketId = `TKT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    const newTicket: TicketData = {
      id: ticketId,
      ...ticketData,
      bookingDate: new Date().toISOString(),
      status: 'CONFIRMED',
      checkedIn: false
    };
    
    // Save to localStorage
    const existingTickets = getAllTickets();
    localStorage.setItem('tickets', JSON.stringify([...existingTickets, newTicket]));
    
    return newTicket;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw new Error('Failed to create ticket');
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

// Get tickets for an event
export const getTicketsByEventId = (eventId: string): TicketData[] => {
  try {
    const tickets = getAllTickets();
    return tickets.filter(ticket => ticket.eventId === eventId);
  } catch (error) {
    console.error('Error getting tickets by event:', error);
    return [];
  }
};

// Get check-in statistics
export const getCheckInStats = () => {
  try {
    const tickets = getAllTickets();
    const totalTickets = tickets.length;
    const checkedIn = tickets.filter(ticket => ticket.checkedIn).length;
    
    return {
      totalTickets,
      checkedIn,
      percentageCheckedIn: totalTickets ? Math.round((checkedIn / totalTickets) * 100) : 0
    };
  } catch (error) {
    console.error('Error getting check-in stats:', error);
    return { totalTickets: 0, checkedIn: 0, percentageCheckedIn: 0 };
  }
};

// Sample event data for the demo
export const sampleEvents = [
  {
    id: 'event-1',
    title: 'Tech Conference 2025',
    date: 'Apr 15, 2025',
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
    date: 'May 22, 2025',
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
    date: 'Jun 5, 2025',
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
