import React from 'react';
import { X, Lock } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration_minutes: number;
  price: number;
}

interface PaymentModalProps {
  lesson: Lesson;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ lesson, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Funcionalidad de Pago</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="text-center py-8">
            <Lock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Funcionalidad Temporalmente Deshabilitada
            </h3>
            <p className="text-gray-600 mb-6">
              La funcionalidad de pagos está siendo desarrollada y estará disponible próximamente.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">{lesson.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{lesson.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Duración: {lesson.duration_minutes} minutos
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  ${lesson.price}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};