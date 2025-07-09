import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { payment_intent_id, user_id } = await req.json();

    if (!payment_intent_id || !user_id) {
      throw new Error('Missing payment_intent_id or user_id');
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status !== 'succeeded') {
      throw new Error('Payment not successful');
    }

    const lesson_id = paymentIntent.metadata.lesson_id;
    const amount_paid = paymentIntent.amount / 100; // Convert from cents

    // Get lesson details
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lesson_id)
      .single();

    if (lessonError || !lesson) {
      throw new Error('Lesson not found');
    }

    // Record the purchase
    const { error: purchaseError } = await supabase
      .from('lesson_purchases')
      .insert({
        user_id,
        lesson_id,
        amount_paid,
        payment_method: 'stripe',
        stripe_payment_id: payment_intent_id,
      });

    if (purchaseError) {
      throw new Error('Failed to record purchase');
    }

    // Send confirmation email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, name')
      .eq('id', user_id)
      .single();

    if (profile) {
      await supabase
        .from('email_notifications')
        .insert({
          recipient_email: profile.email,
          subject: `Confirmación de compra: ${lesson.title}`,
          content: `Hola ${profile.name},\n\nHas comprado exitosamente la lección "${lesson.title}" por $${amount_paid}.\n\nYa puedes acceder al contenido completo.\n\n¡Disfruta tu aprendizaje!`,
          type: 'purchase_confirmation',
          lesson_id,
        });
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error confirming payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});