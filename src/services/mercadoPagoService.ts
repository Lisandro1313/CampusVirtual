interface MercadoPagoPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

interface PaymentData {
  courseId: string;
  userId: string;
  amount: number;
  title: string;
  description: string;
}

class MercadoPagoService {
  private publicKey: string;
  private isDemo: boolean;

  constructor() {
    this.publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || '';
    this.isDemo = !this.publicKey;
  }

  async createPreference(paymentData: PaymentData): Promise<MercadoPagoPreference> {
    if (this.isDemo) {
      // Demo mode - simulate MercadoPago response
      return {
        id: `demo-preference-${Date.now()}`,
        init_point: '#demo-payment',
        sandbox_init_point: '#demo-payment'
      };
    }

    try {
      const response = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              title: paymentData.title,
              description: paymentData.description,
              unit_price: paymentData.amount,
              quantity: 1,
              currency_id: 'ARS'
            }
          ],
          external_reference: `${paymentData.userId}-${paymentData.courseId}`,
          back_urls: {
            success: `${window.location.origin}/payment/success`,
            failure: `${window.location.origin}/payment/failure`,
            pending: `${window.location.origin}/payment/pending`
          },
          auto_return: 'approved',
          notification_url: `${window.location.origin}/api/mercadopago/webhook`
        })
      });

      if (!response.ok) {
        throw new Error('Error creating payment preference');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating MercadoPago preference:', error);
      throw error;
    }
  }

  async processPayment(preferenceId: string): Promise<void> {
    if (this.isDemo) {
      // Demo mode - simulate payment success
      setTimeout(() => {
        alert('¡Pago simulado exitoso! En la versión real se procesaría con MercadoPago.');
      }, 1000);
      return;
    }

    // In real implementation, this would redirect to MercadoPago
    window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;
  }

  initializeMercadoPago(): void {
    if (this.isDemo) return;

    // Load MercadoPago SDK
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.onload = () => {
      // @ts-ignore
      const mp = new MercadoPago(this.publicKey);
      // Store MP instance globally if needed
      (window as any).mercadoPago = mp;
    };
    document.head.appendChild(script);
  }
}

export const mercadoPagoService = new MercadoPagoService();