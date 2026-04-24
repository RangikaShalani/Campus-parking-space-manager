import { MapPin, Accessibility, Shield, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export type SpotStatus = 'available' | 'occupied' | 'reserved';
export type SpotType = 'accessible' | 'staff' | 'student';

export interface Reservation {
  date: string;
  time: string;
  userId: string;
}

interface ParkingSpotProps {
  id: string;
  status: SpotStatus;
  type: SpotType;
  zone: string;
  onStatusUpdate: (id: string, newStatus: SpotStatus) => void;
  onReservationClick: (spotId: string, zone: string) => void;
  lastUpdated?: Date;
  updatedBy?: string;
  reservations?: Reservation[];
}

export function ParkingSpot({
  id,
  status,
  type,
  zone,
  onStatusUpdate,
  onReservationClick,
  lastUpdated,
  updatedBy,
  reservations = []
}: ParkingSpotProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'available': return 'bg-green-500 hover:bg-green-600';
      case 'occupied': return 'bg-red-500 hover:bg-red-600';
      case 'reserved': return 'bg-amber-500 hover:bg-amber-600';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'accessible': return <Accessibility className="w-3 h-3" />;
      case 'staff': return <Shield className="w-3 h-3" />;
      default: return <MapPin className="w-3 h-3" />;
    }
  };

  const getUpcomingReservation = () => {
    if (reservations.length === 0) return null;

    const now = new Date();
    const upcoming = reservations
      .map(res => ({
        ...res,
        dateTime: new Date(`${res.date}T${res.time}`)
      }))
      .filter(res => res.dateTime >= now)
      .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

    return upcoming[0] || null;
  };

  const upcomingReservation = getUpcomingReservation();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onReservationClick(id, zone);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`relative w-16 h-20 ${getStatusColor()} rounded-md shadow-md transition-all duration-200 flex flex-col items-center justify-center text-white group`}
      title={`${zone}-${id}\nType: ${type}\nStatus: ${status}\n${lastUpdated ? `Updated: ${lastUpdated.toLocaleTimeString()}\nBy: ${updatedBy}` : ''}\n${upcomingReservation ? `Next: ${upcomingReservation.time} ${new Date(upcomingReservation.date).toLocaleDateString()}` : ''}`}
    >
      <div className="absolute top-1 left-1 opacity-80">
        {getTypeIcon()}
      </div>
      <div className="text-xs font-bold">{zone}</div>
      <div className="text-[10px]">{id}</div>

      {upcomingReservation && (
        <div className="absolute top-1 right-1">
          <div className="bg-white bg-opacity-90 text-blue-600 rounded-full p-0.5">
            <Clock className="w-3 h-3" />
          </div>
        </div>
      )}

      {upcomingReservation && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-[8px] px-1 rounded-b-md text-center">
          {upcomingReservation.time}
        </div>
      )}

      {!upcomingReservation && lastUpdated && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-[8px] px-1 rounded-b-md opacity-0 group-hover:opacity-100 transition-opacity">
          {new Date().getTime() - lastUpdated.getTime() < 60000
            ? 'Just now'
            : `${Math.floor((new Date().getTime() - lastUpdated.getTime()) / 60000)}m ago`}
        </div>
      )}

      {reservations.length > 1 && (
        <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
          {reservations.length}
        </div>
      )}
    </motion.button>
  );
}
