import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Clock, 
  User, 
  Edit3,
  Trash2,
  FileText
} from 'lucide-react';
import { HealthNote } from '../types';
import { useHealthData, type Appointment } from '../hooks/useHealthData';

export function Appointments() {
  const { healthData, updateHealthData } = useHealthData();
  const [healthNotes, setHealthNotes] = useState<HealthNote[]>(() => {
    const savedNotes = localStorage.getItem('health_notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editingNote, setEditingNote] = useState<HealthNote | null>(null);
  
  const appointments = healthData.appointments || [];
  
  const [appointmentForm, setAppointmentForm] = useState<Omit<Appointment, 'id'>>({
    date: '',
    time: '',
    doctor: '',
    type: '',
  });

  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    tags: ''
  });

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const appointment: Appointment = {
      id: editingAppointment?.id || Date.now().toString(),
      date: appointmentForm.date,
      time: appointmentForm.time,
      doctor: appointmentForm.doctor,
      type: appointmentForm.type,
    };

    if (editingAppointment) {
      updateHealthData({
        appointments: appointments.map(apt => apt.id === editingAppointment.id ? appointment : apt)
      });
      setEditingAppointment(null);
    } else {
      updateHealthData({
        appointments: [...appointments, appointment]
      });
    }

    setAppointmentForm({ date: '', time: '', doctor: '', type: '' });
    setShowAppointmentForm(false);
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const note: HealthNote = {
      id: editingNote?.id || Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      title: noteForm.title,
      content: noteForm.content,
      tags: noteForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    if (editingNote) {
      setHealthNotes(healthNotes.map(n => n.id === editingNote.id ? note : n));
      setEditingNote(null);
    } else {
      setHealthNotes([...healthNotes, note]);
    }

    setNoteForm({ title: '', content: '', tags: '' });
    setShowNoteForm(false);
  };

  const deleteAppointment = (id: string) => {
    updateHealthData({
      appointments: appointments.filter(apt => apt.id !== id)
    });
  };

  const deleteNote = (id: string) => {
    setHealthNotes(healthNotes.filter(note => note.id !== id));
  };

  const startEditAppointment = (appointment: Appointment) => {
    setAppointmentForm({
      date: appointment.date,
      time: appointment.time,
      doctor: appointment.doctor,
      type: appointment.type,
    });
    setEditingAppointment(appointment);
    setShowAppointmentForm(true);
  };

  const startEditNote = (note: HealthNote) => {
    setNoteForm({
      title: note.title,
      content: note.content,
      tags: note.tags.join(', ')
    });
    setEditingNote(note);
    setShowNoteForm(true);
  };

  const cancelEdit = () => {
    setEditingAppointment(null);
    setEditingNote(null);
    setShowAppointmentForm(false);
    setShowNoteForm(false);
    setAppointmentForm({ date: '', time: '', doctor: '', type: '' });
    setNoteForm({ title: '', content: '', tags: '' });
  };

  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastAppointments = appointments
    .filter(apt => new Date(apt.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const recentNotes = healthNotes
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Appointments & Notes</h1>
              <p className="text-purple-100">Manage your healthcare schedule and notes</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAppointmentForm(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Appointment</span>
            </button>
            <button
              onClick={() => setShowNoteForm(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Add Note</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <div className="text-sm text-purple-100">Upcoming</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{pastAppointments.length}</div>
            <div className="text-sm text-purple-100">Completed</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{healthNotes.length}</div>
            <div className="text-sm text-purple-100">Health Notes</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">
              {upcomingAppointments.length > 0 
                ? Math.ceil((new Date(upcomingAppointments[0].date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                : 0}
            </div>
            <div className="text-sm text-purple-100">Days to Next</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
          
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No upcoming appointments</p>
              <p className="text-sm">Schedule your next appointment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map(appointment => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{appointment.type}</h3>
                      <p className="text-gray-600 flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{appointment.doctor}</span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEditAppointment(appointment)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteAppointment(appointment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{appointment.doctor}</p>
                      <p className="text-gray-500">{appointment.type}</p>
                    </div>
                  </div>
                  

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Health Notes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Notes</h2>
          
          {recentNotes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No notes yet</p>
              <p className="text-sm">Start documenting your health journey</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentNotes.map(note => (
                <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 line-clamp-1">{note.title}</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEditNote(note)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{note.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {note.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                      {note.tags.length > 2 && (
                        <span className="text-gray-400 text-xs">+{note.tags.length - 2}</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(note.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Past Appointments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastAppointments.slice(0, 6).map(appointment => (
              <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 opacity-75">
                <div className="font-medium text-gray-900">{appointment.type}</div>
                <div className="text-sm text-gray-600">{appointment.doctor}</div>
                <p className="text-sm text-gray-500">
                  {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Appointment Form Modal */}
      {showAppointmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingAppointment ? 'Edit Appointment' : 'Add New Appointment'}
            </h2>
            
            <form onSubmit={handleAppointmentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Type
                </label>
                <input
                  type="text"
                  value={appointmentForm.type}
                  onChange={(e) => setAppointmentForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., General Checkup, Dental Cleaning"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor
                </label>
                <input
                  type="text"
                  id="doctor"
                  value={appointmentForm.doctor}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, doctor: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={appointmentForm.date}
                    onChange={(e) => setAppointmentForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={appointmentForm.time}
                    onChange={(e) => setAppointmentForm(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
              </div>
              

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {editingAppointment ? 'Update Appointment' : 'Add Appointment'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Health Note Form Modal */}
      {showNoteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingNote ? 'Edit Health Note' : 'Add Health Note'}
            </h2>
            
            <form onSubmit={handleNoteSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., Side effects from medication"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={noteForm.content}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  rows={4}
                  placeholder="Describe your symptoms, observations, or questions..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (Optional)
                </label>
                <input
                  type="text"
                  value={noteForm.tags}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., medication, symptoms, pain"
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {editingNote ? 'Update Note' : 'Add Note'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}