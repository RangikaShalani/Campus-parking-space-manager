import { Info } from 'lucide-react';

export function Legend() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Info className="w-5 h-5 text-gray-700" />
        <h3 className="font-semibold text-gray-800">Legend</h3>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-700">Available</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm text-gray-700">Occupied</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-amber-500 rounded"></div>
          <span className="text-sm text-gray-700">Reserved</span>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-200 text-xs text-gray-600">
        <p className="mb-2">💡 <strong>How to use:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Click any spot to update its status</li>
          <li>Hover to see details</li>
          <li>Accurate updates boost your reputation</li>
        </ul>
      </div>
    </div>
  );
}
