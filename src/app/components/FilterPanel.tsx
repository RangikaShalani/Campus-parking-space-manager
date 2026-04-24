import { Filter, Accessibility, Shield, Users } from 'lucide-react';
import { SpotType } from './ParkingSpot';

interface FilterPanelProps {
  selectedTypes: SpotType[];
  onTypeToggle: (type: SpotType) => void;
  showAvailableOnly: boolean;
  onToggleAvailableOnly: () => void;
}

export function FilterPanel({
  selectedTypes,
  onTypeToggle,
  showAvailableOnly,
  onToggleAvailableOnly
}: FilterPanelProps) {
  const isTypeSelected = (type: SpotType) => selectedTypes.includes(type);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-gray-700" />
        <h3 className="font-semibold text-gray-800">Filters</h3>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Parking Type</label>

        <button
          onClick={() => onTypeToggle('student')}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
            isTypeSelected('student')
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Parking</span>
        </button>

        <button
          onClick={() => onTypeToggle('staff')}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
            isTypeSelected('staff')
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Staff Only</span>
        </button>

        <button
          onClick={() => onTypeToggle('accessible')}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
            isTypeSelected('accessible')
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Accessibility className="w-4 h-4" />
          <span>Accessible Spots</span>
        </button>
      </div>

      <div className="pt-2 border-t border-gray-200">
        <button
          onClick={onToggleAvailableOnly}
          className={`w-full px-3 py-2 rounded-md transition-colors ${
            showAvailableOnly
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {showAvailableOnly ? '✓ ' : ''}Show Available Only
        </button>
      </div>
    </div>
  );
}
