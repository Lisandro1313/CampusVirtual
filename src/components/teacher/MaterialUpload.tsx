
import React, { useState } from 'react';
import { Upload, File, Video, Image, FileText, X, Plus } from 'lucide-react';
import { apiService } from '../../services/api';

interface MaterialUploadProps {
  claseId: string;
  onMaterialAdded: () => void;
}

export const MaterialUpload: React.FC<MaterialUploadProps> = ({ claseId, onMaterialAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'video',
    contenido: '',
    orden: 0
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData(prev => ({ ...prev, nombre: file.name }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('tipo', formData.tipo);
      formDataToSend.append('contenido', formData.contenido);
      formDataToSend.append('orden', formData.orden.toString());
      
      if (selectedFile) {
        formDataToSend.append('archivo', selectedFile);
      }

      await apiService.subirMaterial(claseId, formDataToSend);
      
      // Resetear formulario
      setFormData({ nombre: '', tipo: 'video', contenido: '', orden: 0 });
      setSelectedFile(null);
      setShowForm(false);
      onMaterialAdded();
      
    } catch (error) {
      console.error('Error al subir material:', error);
      alert('Error al subir el material');
    } finally {
      setIsUploading(false);
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'video': return <Video className="h-5 w-5" />;
      case 'imagen': return <Image className="h-5 w-5" />;
      case 'pdf': return <File className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
      >
        <Plus className="h-5 w-5 mr-2" />
        Agregar Material
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Subir Material</h3>
        <button
          onClick={() => setShowForm(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Material
          </label>
          <input
            type="text"
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Material
          </label>
          <select
            id="tipo"
            value={formData.tipo}
            onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="video">Video</option>
            <option value="pdf">PDF</option>
            <option value="imagen">Imagen</option>
            <option value="texto">Texto</option>
          </select>
        </div>

        <div>
          <label htmlFor="archivo" className="block text-sm font-medium text-gray-700 mb-2">
            Archivo (opcional)
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="archivo"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click para subir</span> o arrastra y suelta
                </p>
                <p className="text-xs text-gray-500">Video, PDF, Imagen o Documento</p>
                {selectedFile && (
                  <p className="text-xs text-blue-600 mt-2">{selectedFile.name}</p>
                )}
              </div>
              <input
                id="archivo"
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept="video/*,image/*,.pdf,.doc,.docx,.txt"
              />
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="contenido" className="block text-sm font-medium text-gray-700 mb-2">
            Contenido/Descripción
          </label>
          <textarea
            id="contenido"
            value={formData.contenido}
            onChange={(e) => setFormData(prev => ({ ...prev, contenido: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Descripción del material o contenido de texto..."
          />
        </div>

        <div>
          <label htmlFor="orden" className="block text-sm font-medium text-gray-700 mb-2">
            Orden
          </label>
          <input
            type="number"
            id="orden"
            value={formData.orden}
            onChange={(e) => setFormData(prev => ({ ...prev, orden: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isUploading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Subiendo...
              </>
            ) : (
              <>
                {getTipoIcon(formData.tipo)}
                <span className="ml-2">Subir Material</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
