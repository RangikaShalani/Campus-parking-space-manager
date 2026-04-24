import { useState, useEffect } from 'react';
import { X, Clock, Calendar, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Reservation {
  date: string;
  time: string;
  userId: string;
}

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  spotId: string;
  zone: string;
  existingReservations: Reservation[];
  onReserve: (date: string, time: string) => void;
}

export function ReservationModal({
  isOpen,
  onClose,
  spotId,
  zone,
  existingReservations,
  onReserve
}: ReservationModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      setSelectedDate(today.toISOString().split('T')[0]);
      setSelectedTime('');
      setError('');
    }
  }, [isOpen]);

  const getAvailableDates = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return [
      { value: today.toISOString().split('T')[0], label: `Today (${today.toLocaleDateString()})` },
      { value: tomorrow.toISOString().split('T')[0], label: `Tomorrow (${tomorrow.toLocaleDateString()})` }
    ];
  };

  const getAvailableTimes = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const getFilteredTimes = () => {
    const allTimes = getAvailableTimes();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();

    return allTimes.filter(time => {
      // If selecting today, filter out past times
      if (selectedDate === todayStr) {
        const [hour, minute] = time.split(':').map(Number);
        if (hour < currentHour || (hour === currentHour && minute <= currentMinute)) {
          return false;
        }
      }

      // Check if time slot is already reserved
      const isReserved = existingReservations.some(
        res => res.date === selectedDate && res.time === time
      );

      return !isReserved;
    });
  };

  const handleReserve = () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select both date and time');
      return;
    }

    const isAlreadyReserved = existingReservations.some(
      res => res.date === selectedDate && res.time === selectedTime
    );

    if (isAlreadyReserved) {
      setError('This time slot is already reserved');
      return;
    }

    onReserve(selectedDate, selectedTime);
    onClose();
  };

  const availableTimes = getFilteredTimes();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Reserve Parking Spot</h2>
              <p className="text-sm opacity-90">Zone {zone} - Spot {spotId}</p>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-blue-700 rounded-full p-1 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Existing Reservations */}
            {existingReservations.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Current Reservations
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {existingReservations.map((res, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm bg-white p-2 rounded border border-gray-200">
                      <span className="text-gray-700">
                        {new Date(res.date).toLocaleDateString()} at {res.time}
                      </span>
                      <span className="text-xs text-gray-500">by {res.userId}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Select Date
              </label>
              <div className="grid grid-cols-2 gap-3">
                {getAvailableDates().map(date => (
                  <button
                    key={date.value}
                    onClick={() => {
                      setSelectedDate(date.value);
                      setSelectedTime('');
                      setError('');
                    }}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedDate === date.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {date.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Select Time
              </label>
              {availableTimes.length > 0 ? (
                <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                  {availableTimes.map(time => (
                    <button
                      key={time}
                      onClick={() => {
                        setSelectedTime(time);
                        setError('');
                      }}
                      className={`p-2 rounded border transition-all text-sm ${
                        selectedTime === time
                          ? 'border-blue-500 bg-blue-500 text-white font-semibold'
                          : 'border-gray-300 hover:border-blue-300 bg-white text-gray-700'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  No available time slots for this date
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Selected Summary */}
            {selectedDate && selectedTime && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-sm text-green-800">
                  <strong>You're reserving:</strong>
                  <div className="mt-1">
                    Zone {zone} - Spot {spotId} on{' '}
                    <strong>{new Date(selectedDate).toLocaleDateString()}</strong> at{' '}
                    <strong>{selectedTime}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleReserve}
              disabled={!selectedDate || !selectedTime}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Reserve Spot
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
