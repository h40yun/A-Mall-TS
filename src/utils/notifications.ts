// ==================== NOTIFICATION SERVICE ====================
// Push notifications + in-app notifications
import { supabase } from './supabase'
import { getCurrentProfile } from './auth'

// ============================================================
// PUSH NOTIFICATIONS (Service Worker)
// ============================================================
export async function requestPushPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true

  const result = await Notification.requestPermission()
  return result === 'granted'
}

export async function subscribePush(): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY || undefined,
    })

    // Save subscription to Supabase
    const profile = getCurrentProfile()
    if (profile) {
      await supabase.from('push_subscriptions').upsert({
        user_id: profile.id,
        subscription: JSON.parse(JSON.stringify(subscription)),
      })
    }

    return true
  } catch (err) {
    console.error('[Push] Subscribe failed:', err)
    return false
  }
}

// ============================================================
// IN-APP NOTIFICATIONS
// ============================================================
export async function fetchNotifications(limit = 50) {
  const profile = getCurrentProfile()
  if (!profile) return []

  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  return data || []
}

export async function markNotificationRead(id: string) {
  await supabase.from('notifications').update({ is_read: true }).eq('id', id)
}

export async function markAllNotificationsRead() {
  const profile = getCurrentProfile()
  if (!profile) return

  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', profile.id)
    .eq('is_read', false)
}

export async function getUnreadCount(): Promise<number> {
  const profile = getCurrentProfile()
  if (!profile) return 0

  const { count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', profile.id)
    .eq('is_read', false)

  return count || 0
}

// ============================================================
// CREATE NOTIFICATION (server-side helper)
// ============================================================
export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  link?: string
) {
  await supabase.from('notifications').insert({
    user_id: userId,
    type,
    title,
    message,
    link,
  })
}
