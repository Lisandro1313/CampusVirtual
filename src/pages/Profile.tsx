import React, { useState } from 'react';
import { User, Mail, MapPin, Calendar, Edit3, Save, X, Camera, Award, BookOpen, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Profile: React.FC = () => {
  const { auth, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: auth.user?.name || '',
    bio: auth.user?.bio || '',
    location: auth.user?.location || '',
    phone: auth.user?.phone || ''
  });

  const handleSave = async () => {
    try {
      await updateProfile({
        name: editForm.name,
        bio: editForm.bio,
        location: editForm.location,
        phone: editForm.phone
      });
      setIsEditing(false);
      alert('✅ Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error al actualizar el perfil');
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: auth.user?.name || '',
      bio: auth.user?.bio || '',
      location: auth.user?.location || '',
      phone: auth.user?.phone || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
          </div>

          {/* Profile Info */}
          <div className="px-8 pb-8">
            <div className="flex items-start justify-between -mt-16 mb-6">
              <div className="flex items-end space-x-6">
                <div className="relative">
                  <img
                    src={auth.user?.avatar || 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'}
                    alt={auth.user?.name || 'Usuario'}
                    className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg object-cover"
                  />
                </div>
                <div className="pb-4">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {auth.user?.name || 'Usuario'}
                  </h1>
                  <p className="text-gray-600 mb-2">{auth.user?.email}</p>
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {auth.user?.location || 'No especificado'}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancelar' : 'Editar Perfil'}
              </button>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Biografía</label>
              {isEditing ? (
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Cuéntanos sobre ti..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {auth.user?.bio || 'No has agregado una biografía aún.'}
                </p>
              )}
            </div>

            {/* Editable Fields */}
            {isEditing && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu número de teléfono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu ubicación"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};