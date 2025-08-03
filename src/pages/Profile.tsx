import React, { useState } from 'react';
import { User, Mail, MapPin, Calendar, Edit3, Save, X, Camera, Phone, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { auth, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: auth.user?.name || auth.profile?.name || '',
    bio: auth.user?.bio || auth.profile?.bio || '',
    location: auth.user?.location || auth.profile?.location || '',
    phone: auth.user?.phone || auth.profile?.phone || ''
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(editForm);
      setIsEditing(false);
      alert('✅ Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: auth.user?.name || auth.profile?.name || '',
      bio: auth.user?.bio || auth.profile?.bio || '',
      location: auth.user?.location || auth.profile?.location || '',
      phone: auth.user?.phone || auth.profile?.phone || ''
    });
    setIsEditing(false);
  };

  const currentUser = auth.user || auth.profile;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Dashboard
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
            <button className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="px-8 pb-8">
            <div className="flex items-start justify-between -mt-16 mb-6">
              <div className="flex items-end space-x-6">
                <div className="relative">
                  <img
                    src={currentUser?.avatar_url || currentUser?.avatar || 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'}
                    alt={currentUser?.name || 'Usuario'}
                    className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg object-cover"
                  />
                  <button className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div className="pb-4">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {currentUser?.name || 'Usuario'}
                  </h1>
                  <p className="text-gray-600 mb-2">{currentUser?.email}</p>
                  <div className="flex items-center space-x-4 text-gray-500 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Miembro desde {new Date(currentUser?.created_at || currentUser?.joinedAt || '').toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {currentUser?.role === 'teacher' ? 'Instructor' : 
                       currentUser?.role === 'admin' ? 'Administrador' : 'Estudiante'}
                    </div>
                  </div>
                </div>
              </div>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Editar Perfil
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Guardar
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            {/* Profile Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu nombre completo"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {currentUser?.name || 'No especificado'}
                  </p>
                )}
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {currentUser?.email}
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu número de teléfono"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {currentUser?.phone || 'No especificado'}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu ubicación"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {currentUser?.location || 'No especificado'}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Biografía</label>
                {isEditing ? (
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Cuéntanos sobre ti..."
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg min-h-[100px]">
                    {currentUser?.bio || 'No has agregado una biografía aún.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Información de la Cuenta</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {currentUser?.role === 'teacher' ? '0' : '0'}
              </div>
              <div className="text-sm text-blue-800">
                {currentUser?.role === 'teacher' ? 'Cursos Creados' : 'Cursos Completados'}
              </div>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600 mb-1">0</div>
              <div className="text-sm text-green-800">
                {currentUser?.role === 'teacher' ? 'Estudiantes' : 'Certificados'}
              </div>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600 mb-1">0</div>
              <div className="text-sm text-purple-800">
                {currentUser?.role === 'teacher' ? 'Ingresos' : 'Horas de Estudio'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};