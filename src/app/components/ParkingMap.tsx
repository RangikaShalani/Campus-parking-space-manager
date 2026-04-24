import { useState, useEffect } from 'react';
import { ParkingSpot, SpotStatus, SpotType, Reservation } from './ParkingSpot';
import { Building2 } from 'lucide-react';

interface ParkingSpotData {
  id: string;
  status: SpotStatus;
  type: SpotType;
  zone: string;
  lastUpdated?: Date;
  updatedBy?: string;
  reservations?: Reservation[];
}

interface ParkingMapProps {
  spots: ParkingSpotData[];
  onSpotUpdate: (id: string, newStatus: SpotStatus) => void;
  onReservationClick: (spotId: string, zone: string) => void;
  selectedTypes: SpotType[];
  showAvailableOnly: boolean;
}

export function ParkingMap({ spots, onSpotUpdate, onReservationClick, selectedTypes, showAvailableOnly }: ParkingMapProps) {
  const filteredSpots = spots.filter(spot => {
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(spot.type);
    const availabilityMatch = !showAvailableOnly || spot.status === 'available';
    return typeMatch && availabilityMatch;
  });

  const zones = ['A', 'B', 'C', 'D'];
  const spotsByZone = zones.map(zone => ({
    zone,
    spots: filteredSpots.filter(spot => spot.zone === zone)
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-gray-700" />
          <h2 className="text-xl font-bold text-gray-800">Campus Parking Map</h2>
        </div>
        <div className="text-sm text-gray-600">
          {filteredSpots.filter(s => s.status === 'available').length} available spots
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {spotsByZone.map(({ zone, spots }) => (
          <div key={zone} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-700">Zone {zone}</h3>
              <div className="text-xs text-gray-500">
                {spots.filter(s => s.status === 'available').length}/{spots.length} available
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {spots.map(spot => (
                <ParkingSpot
                  key={`${spot.zone}-${spot.id}`}
                  id={spot.id}
                  status={spot.status}
                  type={spot.type}
                  zone={spot.zone}
                  onStatusUpdate={onSpotUpdate}
                  onReservationClick={onReservationClick}
                  lastUpdated={spot.lastUpdated}
                  updatedBy={spot.updatedBy}
                  reservations={spot.reservations}
                />
              ))}
            </div>

            {spots.length === 0 && (
              <div className="text-center text-gray-400 text-sm py-8">
                No spots match filters
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
