import React, { useState } from 'react';
import { Calendar, Clock, Video } from 'lucide-react';
import type { Appointment } from '../types';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onSchedule: (appointment: Omit<Appointment, 'id'>) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ appointments, onSchedule }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<Appointment['type']>('consultation');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && selectedTime) {
      onSchedule({
        userId: '1', // Replace with actual user ID
        doctorId: '1', // Replace with selected doctor ID
        date: selectedDate,
        time: selectedTime,
        status: 'pending',
        type: appointmentType
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Appointment</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <div className="mt-1 relative">
            <input
              type="date"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            <Calendar className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Time</label>
          <div className="mt-1 relative">
            <input
              type="time"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
            <Clock className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={appointmentType}
            onChange={(e) => setAppointmentType(e.target.value as Appointment['type'])}
          >
            <option value="consultation">Consultation</option>
            <option value="followup">Follow-up</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Video className="h-5 w-5 mr-2" />
          Schedule Video Consultation
        </button>
      </form>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Upcoming Appointments</h4>
        <div className="space-y-2">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border rounded-md p-3 flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(appointment.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">{appointment.time}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  appointment.status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : appointment.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {appointment.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};