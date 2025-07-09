// Stripe functionality disabled for now
// This file is kept for future implementation

export const stripePromise = null;

export const createPaymentIntent = async (lessonId: string, amount: number) => {
  throw new Error('Payment functionality is currently disabled');
};