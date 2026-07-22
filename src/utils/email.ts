// ==================== EMAIL SERVICE ====================
// Transactional email via Supabase Edge Functions
import { supabase } from './supabase'
import { getCurrentProfile } from './auth'

// ============================================================
// SEND EMAIL (via Edge Function)
// ============================================================
async function sendEmail(
  to: string,
  template: string,
  data: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.functions.invoke('send-email', {
      body: { to, template, data },
    })

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// ============================================================
// ORDER CONFIRMATION
// ============================================================
export async function sendOrderConfirmation(orderId: string) {
  const profile = getCurrentProfile()
  if (!profile) return

  await sendEmail(profile.email, 'order_confirmation', {
    name: profile.name,
    order_id: orderId,
    order_url: `${window.location.origin}/track-order?id=${orderId}`,
  })
}

// ============================================================
// SHIPPING NOTIFICATION
// ============================================================
export async function sendShippingNotification(
  orderId: string,
  trackingNumber: string,
  carrier: string
) {
  const profile = getCurrentProfile()
  if (!profile) return

  await sendEmail(profile.email, 'shipping_notification', {
    name: profile.name,
    order_id: orderId,
    tracking_number: trackingNumber,
    carrier,
    track_url: `${window.location.origin}/track-order?id=${orderId}`,
  })
}

// ============================================================
// DELIVERY CONFIRMATION
// ============================================================
export async function sendDeliveryConfirmation(orderId: string) {
  const profile = getCurrentProfile()
  if (!profile) return

  await sendEmail(profile.email, 'delivery_confirmation', {
    name: profile.name,
    order_id: orderId,
    review_url: `${window.location.origin}/product/`,
  })
}

// ============================================================
// WELCOME EMAIL
// ============================================================
export async function sendWelcomeEmail(email: string, name: string) {
  await sendEmail(email, 'welcome', {
    name,
    shop_url: window.location.origin,
  })
}

// ============================================================
// PASSWORD RESET
// ============================================================
export async function sendPasswordResetEmail(email: string, resetToken: string) {
  await sendEmail(email, 'password_reset', {
    reset_url: `${window.location.origin}/auth?tab=reset&token=${resetToken}`,
  })
}

// ============================================================
// NEWSLETTER SUBSCRIBE
// ============================================================
export async function subscribeNewsletter(email: string): Promise<boolean> {
  const { error } = await supabase.from('newsletter_subscribers').upsert({
    email,
    subscribed_at: new Date().toISOString(),
  })

  return !error
}
