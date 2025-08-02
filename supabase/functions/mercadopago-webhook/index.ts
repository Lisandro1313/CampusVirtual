import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    
    // Verify webhook signature (in production)
    // const signature = req.headers.get('x-signature')
    // if (!verifySignature(body, signature)) {
    //   throw new Error('Invalid signature')
    // }

    const { type, data } = body

    if (type === 'payment') {
      const paymentId = data.id
      
      // Get payment details from MercadoPago API
      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')}`
        }
      })

      if (!mpResponse.ok) {
        throw new Error('Failed to fetch payment from MercadoPago')
      }

      const paymentData = await mpResponse.json()
      
      // Update payment in database
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: paymentData.status === 'approved' ? 'approved' : 
                 paymentData.status === 'rejected' ? 'rejected' : 'pending',
          mercadopago_payment_id: paymentId,
          updated_at: new Date().toISOString()
        })
        .eq('mercadopago_preference_id', paymentData.external_reference)

      if (updateError) {
        throw updateError
      }

      // If payment approved, update enrollment
      if (paymentData.status === 'approved') {
        const { error: enrollmentError } = await supabase
          .from('enrollments')
          .update({
            payment_status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', paymentData.payer.id)
          .eq('course_id', paymentData.additional_info.items[0].id)

        if (enrollmentError) {
          console.error('Error updating enrollment:', enrollmentError)
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})