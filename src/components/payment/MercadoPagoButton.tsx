
import React, { useState } from 'react';
import { CreditCard, Loader, CheckCircle } from 'lucide-react';
import { apiService } from '../../services/api';

interface MercadoPagoButtonProps {
  claseId: string;
  precio: number;
  titulo: string;
  onSuccess?: () => void;
  disabled?: boolean;
}

export const MercadoPagoButton: React.FC<MercadoPagoButtonProps> = ({
  claseId,
  precio,
  titulo,
  onSuccess,
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePago = async () => {
    if (disabled) return;
    
    setIsLoading(true);
    setError('');

    try {
      const response = await apiService.crearPreferenciaPago(claseId);
      
      // Redirigir a MercadoPago
      if (response.init_point) {
        // En producción usarías init_point, en desarrollo sandbox_init_point
        const redirectUrl = import.meta.env.DEV 
          ? response.sandbox_init_point 
          : response.init_point;
        
        window.location.href = redirectUrl;
      } else {
        throw new Error('No se pudo crear la preferencia de pago');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pago');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center bg-green-50 text-green-700 py-3 px-4 rounded-lg">
        <CheckCircle className="h-5 w-5 mr-2" />
        <span>Pago procesado exitosamente</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      <button
        onClick={handlePago}
        disabled={isLoading || disabled}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
          disabled 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isLoading
            ? 'bg-blue-400 text-white cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
        }`}
      >
        {isLoading ? (
          <>
            <Loader className="h-5 w-5 mr-2 animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            Pagar ${precio} con MercadoPago
          </>
        )}
      </button>
      
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Pago seguro procesado por MercadoPago
        </p>
      </div>
    </div>
  );
};
