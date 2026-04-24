import { useState, useEffect } from 'react';
import { ParkingMap } from './components/ParkingMap';
import { FilterPanel } from './components/FilterPanel';
import { UserStats } from './components/UserStats';
import { Legend } from './components/Legend';
import { ReservationModal } from './components/ReservationModal';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { SpotStatus, SpotType, Reservation } from './components/ParkingSpot';
import { Wifi, WifiOff } from 'lucide-react';

interface ParkingSpotData {
  id: string;
  status: SpotStatus;
  type: SpotType;
  zone: string;
  lastUpdated?: Date;
  updatedBy?: string;
  reservations?: Reservation[];
}

const generateInitialSpots = (): ParkingSpotData[] => {
  const zones = ['A', 'B', 'C', 'D'];
  const spots: ParkingSpotData[] = [];

  zones.forEach(zone => {
    const spotCount = 15;
    for (let i = 1; i <= spotCount; i++) {
      const types: SpotType[] = ['student', 'student', 'student', 'student', 'staff', 'accessible'];
      const statuses: SpotStatus[] = ['available', 'available', 'occupied', 'occupied', 'reserved'];

      spots.push({
        id: `${i}`,
        zone,
        type: types[Math.floor(Math.random() * types.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        lastUpdated: new Date(Date.now() - Math.random() * 3600000),
        updatedBy: `User${Math.floor(Math.random() * 100)}`,
        reservations: []
      });
    }
  });

  return spots;
};

export default function App() {
  const [spots, setSpots] = useState<ParkingSpotData[]>(generateInitialSpots);
  const [selectedTypes, setSelectedTypes] = useState<SpotType[]>([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [reputationScore, setReputationScore] = useState(42);
  const [accurateUpdates, setAccurateUpdates] = useState(28);
  const [totalUpdates, setTotalUpdates] = useState(35);
  const [isConnected, setIsConnected] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<{ id: string; zone: string } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpots(prevSpots => {
        const newSpots = [...prevSpots];
        const randomIndex = Math.floor(Math.random() * newSpots.length);
        const statuses: SpotStatus[] = ['available', 'occupied', 'reserved'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        if (newSpots[randomIndex].status !== randomStatus) {
          newSpots[randomIndex] = {
            ...newSpots[randomIndex],
            status: randomStatus,
            lastUpdated: new Date(),
            updatedBy: `User${Math.floor(Math.random() * 100)}`
          };

          const spot = newSpots[randomIndex];
          toast.info(`Zone ${spot.zone}-${spot.id} updated to ${randomStatus}`, {
            duration: 2000,
            position: 'bottom-right'
          });
        }

        return newSpots;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const connectionInterval = setInterval(() => {
      setIsConnected(prev => {
        const newState = Math.random() > 0.1;
        if (prev !== newState) {
          if (newState) {
            toast.success('Real-time connection restored', { duration: 2000 });
          } else {
            toast.error('Connection lost - updates paused', { duration: 2000 });
          }
        }
        return newState;
      });
    }, 15000);

    return () => clearInterval(connectionInterval);
  }, []);

  const handleSpotUpdate = (spotId: string, newStatus: SpotStatus) => {
    const spotIndex = spots.findIndex(s => s.id === spotId);
    if (spotIndex === -1) return;

    const updatedSpots = [...spots];
    const spot = updatedSpots.find(s => s.id === spotId);
    if (!spot) return;

    const zoneSpot = updatedSpots[spotIndex];
    updatedSpots[spotIndex] = {
      ...zoneSpot,
      status: newStatus,
      lastUpdated: new Date(),
      updatedBy: 'You'
    };

    setSpots(updatedSpots);
    setTotalUpdates(prev => prev + 1);

    const isLikelyAccurate = Math.random() > 0.3;
    if (isLikelyAccurate) {
      setAccurateUpdates(prev => prev + 1);
      setReputationScore(prev => prev + 3);
      toast.success(`Spot ${spot.zone}-${spotId} marked as ${newStatus}`, {
        description: '+3 reputation points',
        duration: 3000
      });
    } else {
      setReputationScore(prev => Math.max(0, prev - 1));
      toast.warning(`Update recorded for ${spot.zone}-${spotId}`, {
        description: 'Validation pending',
        duration: 3000
      });
    }
  };

  const handleTypeToggle = (type: SpotType) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleReservationClick = (spotId: string, zone: string) => {
    setSelectedSpot({ id: spotId, zone });
    setIsModalOpen(true);
  };

  const handleReserve = (date: string, time: string) => {
    if (!selectedSpot) return;

    setSpots(prevSpots => {
      const newSpots = prevSpots.map(spot => {
        if (spot.zone === selectedSpot.zone && spot.id === selectedSpot.id) {
          return {
            ...spot,
            reservations: [
              ...(spot.reservations || []),
              {
                date,
                time,
                userId: 'You'
              }
            ]
          };
        }
        return spot;
      });
      return newSpots;
    });

    setReputationScore(prev => prev + 5);
    setTotalUpdates(prev => prev + 1);
    setAccurateUpdates(prev => prev + 1);

    toast.success(`Reservation confirmed!`, {
      description: `Zone ${selectedSpot.zone}-${selectedSpot.id} on ${new Date(date).toLocaleDateString()} at ${time}`,
      duration: 4000
    });
  };

  const getSelectedSpotReservations = (): Reservation[] => {
    if (!selectedSpot) return [];
    const spot = spots.find(s => s.zone === selectedSpot.zone && s.id === selectedSpot.id);
    return spot?.reservations || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <Toaster />

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Campus Parking Finder</h1>
              <p className="text-gray-600 mt-1">Real-time parking availability • Crowdsourced updates</p>
            </div>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <Wifi className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-red-600 font-medium">Disconnected</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-3">
            <ParkingMap
              spots={spots}
              onSpotUpdate={handleSpotUpdate}
              onReservationClick={handleReservationClick}
              selectedTypes={selectedTypes}
              showAvailableOnly={showAvailableOnly}
            />
          </div>

          <div className="space-y-6">
            <FilterPanel
              selectedTypes={selectedTypes}
              onTypeToggle={handleTypeToggle}
              showAvailableOnly={showAvailableOnly}
              onToggleAvailableOnly={() => setShowAvailableOnly(prev => !prev)}
            />

            <UserStats
              reputationScore={reputationScore}
              accurateUpdates={accurateUpdates}
              totalUpdates={totalUpdates}
            />

            <Legend />
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Connect Supabase for Real-Time Sync</h3>
          <p className="text-sm text-blue-800 mb-2">
            Currently using simulated real-time updates. Connect Supabase from the <strong>Make settings page</strong> to enable:
          </p>
          <ul className="text-sm text-blue-800 list-disc list-inside space-y-1">
            <li>True real-time synchronization across all users</li>
            <li>Persistent parking data and update history</li>
            <li>User authentication and reputation tracking</li>
            <li>Automatic validation of crowdsourced updates</li>
            <li>Analytics and usage patterns</li>
          </ul>
          <p className="text-xs text-blue-700 mt-3">
            Note: Make is not intended for collecting PII or securing sensitive data.
          </p>
        </div>

        <ReservationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          spotId={selectedSpot?.id || ''}
          zone={selectedSpot?.zone || ''}
          existingReservations={getSelectedSpotReservations()}
          onReserve={handleReserve}
        />
      </div>
    </div>
  );
}
