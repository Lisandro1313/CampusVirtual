
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { apiService } from '../services/api';

export const PaymentStatus: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failure' | 'pending'>('loading');
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const collection_status = searchParams.get('collection_status');
      const payment_id = searchParams.get('payment_id');
      const external_reference = searchParams.get('external_reference');

      if (collection_status) {
        switch (collection_status) {
          case 'approved':
            setStatus('success');
            break;
          case 'pending':
            setStatus('pending');
            break;
          case 'rejected':
          case 'cancelled':
            setStatus('failure');
            break;
          default:
            setStatus('failure');
        }
      }

      if (external_reference) {
        try {
          const response = await apiService.getEstadoPago(external_reference);
          setPaymentData(response);
        } catch (err) {
          setError('Error al verificar el estado del pago');
        }
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'failure':
        return <XCircle className="h-16 w-16 text-red-500" />;
      case 'pending':
        return <Clock className="h-16 w-16 text-yellow-500" />;
      default:
        return <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'success':
        return {
          title: '¡Pago Exitoso!',
          message: 'Tu pago ha sido procesado correctamente. Ya puedes acceder a la clase.',
          color: 'text-green-600'
        };
      case 'failure':
        return {
          title: 'Pago Rechazado',
          message: 'No se pudo procesar tu pago. Puedes intentar nuevamente.',
          color: 'text-red-600'
        };
      case 'pending':
        return {
          title: 'Pago Pendiente',
          message: 'Tu pago está siendo procesado. Te notificaremos cuando se complete.',
          color: 'text-yellow-600'
        };
      default:
        return {
          title: 'Verificando Pago...',
          message: 'Estamos verificando el estado de tu pago.',
          color: 'text-blue-600'
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            {getStatusIcon()}
          </div>

          <h1 className={`text-2xl font-bold mb-4 ${statusInfo.color}`}>
            {statusInfo.title}
          </h1>

          <p className="text-gray-600 mb-6">
            {statusInfo.message}
          </p>

          {paymentData && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Detalles del Pago</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Clase:</span>
                  <span className="font-medium">{paymentData.claseId?.titulo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monto:</span>
                  <span className="font-medium">${paymentData.monto}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="font-medium capitalize">{paymentData.estado}</span>
                </div>
                {paymentData.fechaPago && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha:</span>
                    <span className="font-medium">
                      {new Date(paymentData.fechaPago).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            {status === 'success' && paymentData?.claseId && (
              <Link
                to={`/course/${paymentData.claseId._id}`}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors inline-block"
              >
                Ir a la Clase
              </Link>
            )}
            
            <Link
              to="/dashboard"
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors inline-block flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
