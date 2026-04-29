import { useBookings } from '../context/BookingContext';
import { Settings, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Admin() {
  const { bookings, updateBookingStatus, deleteBooking } = useBookings();

  return (
    <div className="bg-zinc-950 min-h-screen pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-display uppercase tracking-tight text-white mb-2">
              Admin <span className="text-purple-500">Dashboard</span>
            </h1>
            <p className="text-zinc-400">Manage your bookings and services here.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-full flex gap-4 text-sm font-bold uppercase tracking-widest text-zinc-400">
            <span>Total Bookings: <strong className="text-white">{bookings.length}</strong></span>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800 font-display uppercase tracking-wider text-xs text-zinc-400">
                  <th className="p-4 pl-6 whitespace-nowrap">Order ID</th>
                  <th className="p-4 whitespace-nowrap">Date / Event</th>
                  <th className="p-4 whitespace-nowrap">Client info</th>
                  <th className="p-4 whitespace-nowrap">Status</th>
                  <th className="p-4 pr-6 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-light text-zinc-300">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                      <td className="p-4 pl-6 font-mono text-cyan-400 whitespace-nowrap">{booking.id}</td>
                      <td className="p-4">
                        <div className="font-semibold text-white mb-1">{booking.eventType}</div>
                        <div className="text-zinc-500 text-xs">Date: {booking.eventDate}</div>
                        <div className="text-zinc-500 text-xs">Loc: {booking.location}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-white mb-1">{booking.fullName}</div>
                        <div className="text-zinc-500 text-xs">{booking.phone}</div>
                        <div className="text-zinc-500 text-xs">{booking.email}</div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <select
                          value={booking.status}
                          onChange={(e) => updateBookingStatus(booking.id, e.target.value as any)}
                          className={cn(
                            "bg-zinc-950 border rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider outline-none appearance-none cursor-pointer",
                            booking.status === 'Pending' ? 'border-amber-500/50 text-amber-400' :
                            booking.status === 'Confirmed' ? 'border-cyan-500/50 text-cyan-400' :
                            booking.status === 'Completed' ? 'border-green-500/50 text-green-400' :
                            'border-red-500/50 text-red-400'
                          )}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 pr-6 text-right whitespace-nowrap">
                        <button 
                          onClick={() => deleteBooking(booking.id)}
                          className="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors ml-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
