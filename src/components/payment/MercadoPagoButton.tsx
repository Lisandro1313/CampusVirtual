import React, { useState } from 'react';
import { CreditCard, Loader, CheckCircle, ExternalLink } from 'lucide-react';
import { mercadoPagoService } from '../../services/mercadoPagoService';

interface MercadoPagoButtonProps {
  courseId: string;
  userId: string;
  amount: number;
  title: string;
  description: string;
  onSuccess?: () => void;
  disabled?: boolean;
}

export const MercadoPagoButton: React.FC<MercadoPagoButtonProps> = ({
  courseId,
  userId,
  amount,
  title,
  description,
  onSuccess,
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    if (disabled) return;
    
    setIsLoading(true);
    setError('');

    try {
      const preference = await mercadoPagoService.createPreference({
        courseId,
        userId,
        amount,
        title,
        description
      });

      await mercadoPagoService.processPayment(preference.id);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pago');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      <button
        onClick={handlePayment}
        disabled={isLoading || disabled}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
          disabled 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isLoading
            ? 'bg-blue-400 text-white cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:scale-105'
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
            Pagar ${amount.toLocaleString()} con MercadoPago
          </>
        )}
      </button>
      
      <div className="text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center">
          <ExternalLink className="h-3 w-3 mr-1" />
          Pago seguro procesado por MercadoPago
        </p>
      </div>
    </div>
  );
};