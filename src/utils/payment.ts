// ==================== PAYMENT SERVICE ====================
// Stripe integration for production payments
import { supabase } from './supabase'
import { getCurrentProfile } from './auth'

// Stripe publishable key from env
const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''

export interface PaymentIntent {
  id: string
  client_secret: string
  amount: number
  currency: string
  status: string
}

// ============================================================
// CREATE PAYMENT INTENT (calls Supabase Edge Function)
// ============================================================
export async function createPaymentIntent(
  orderId: string,
  amount: number,
  currency = 'usd'
): Promise<{ success: boolean; clientSecret?: string; error?: string }> {
  const profile = getCurrentProfile()
  if (!profile) return { success: false, error: 'Not authenticated' }

  try {
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: {
        order_id: orderId,
        amount: Math.round(amount * 100), // Stripe uses cents
        currency,
        customer_email: profile.email,
        customer_name: profile.name,
      },
    })

    if (error) return { success: false, error: error.message }
    return { success: true, clientSecret: data.client_secret }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// ============================================================
// CONFIRM PAYMENT
// ============================================================
export async function confirmPayment(
  orderId: string,
  paymentIntentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.functions.invoke('confirm-payment', {
      body: { order_id: orderId, payment_intent_id: paymentIntentId },
    })

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// ============================================================
// PROCESS REFUND
// ============================================================
export async function processRefund(
  orderId: string,
  amount?: number,
  reason?: string
): Promise<{ success: boolean; refundId?: string; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('process-refund', {
      body: { order_id: orderId, amount, reason },
    })

    if (error) return { success: false, error: error.message }
    return { success: true, refundId: data.refund_id }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// ============================================================
// GET PAYMENT METHODS (saved cards)
// ============================================================
export async function getSavedPaymentMethods() {
  const profile = getCurrentProfile()
  if (!profile) return []

  const { data } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', profile.id)
    .order('is_default', { ascending: false })

  return data || []
}

// ============================================================
// ESCROW SYSTEM
// ============================================================
export async function holdPayment(orderId: string): Promise<boolean> {
  // Mark order payment as held (released on delivery confirmation)
  const { error } = await supabase
    .from('orders')
    .update({ payment_status: 'held' })
    .eq('id', orderId)

  return !error
}

export async function releasePayment(orderId: string): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .update({ payment_status: 'released' })
    .eq('id', orderId)

  return !error
}

export { STRIPE_PK }
