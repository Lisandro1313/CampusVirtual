import React from 'react';
import { CheckCircle, Play, Download } from 'lucide-react';

interface PaymentSuccessProps {
  lessonTitle: string;
  onContinue: () => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ lessonTitle, onContinue }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h2>
        <p className="text-gray-600 mb-6">
          Has comprado exitosamente la lección: <strong>{lessonTitle}</strong>
        </p>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Ahora puedes:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li className="flex items-center">
              <Play className="h-4 w-4 mr-2" />
              Ver el video completo
            </li>
            <li className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Acceder a materiales adicionales
            </li>
          </ul>
        </div>

        <button
          onClick={onContinue}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
        >
          Continuar con la Lección
        </button>
      </div>
    </div>
  );
};