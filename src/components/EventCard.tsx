
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  attendees: number;
  maxAttendees: number;
  featured?: boolean;
}

const EventCard = ({
  id,
  title,
  date,
  time,
  location,
  image,
  attendees,
  maxAttendees,
  featured = false
}: EventCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const availability = (attendees / maxAttendees) * 100;
  const availabilityText = 
    availability >= 90 ? 'Almost Full' : 
    availability >= 70 ? 'Filling Fast' : 
    'Available';

  return (
    <Link to={`/book?eventId=${id}`}>
      <div 
        className={cn(
          'relative group overflow-hidden rounded-xl bg-white transition-all duration-300',
          'border border-border shadow-sm hover:shadow-lg',
          featured ? 'md:col-span-2' : '',
          isHovered ? 'scale-[1.01]' : 'scale-100'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-[16/9] overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className={cn(
              'object-cover w-full h-full transition-all duration-500',
              isHovered ? 'scale-105 blur-[1px]' : 'scale-100'
            )}
          />
          <div className={cn(
            'absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-70'
          )} />
        </div>
        
        <div className="absolute top-4 right-4">
          <span className={cn(
            'px-3 py-1 text-xs font-medium rounded-full',
            availability >= 90 ? 'bg-red-500 text-white' : 
            availability >= 70 ? 'bg-yellow-500 text-white' : 
            'bg-green-500 text-white'
          )}>
            {availabilityText}
          </span>
        </div>
        
        <div className="p-5">
          <h3 className="text-xl font-display font-medium mb-2 tracking-tight">{title}</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{date}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>{time}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{location}</span>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{attendees} / {maxAttendees}</span>
            </div>
            
            <div className="text-primary font-medium text-sm">
              Book Now →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
