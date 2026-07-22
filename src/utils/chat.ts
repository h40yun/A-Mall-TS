// ==================== REAL-TIME CHAT SERVICE ====================
// WebSocket-based real-time messaging using Supabase Realtime
import { supabase } from './supabase'
import { getCurrentProfile } from './auth'
import type { RealtimeChannel } from '@supabase/supabase-js'

let chatChannel: RealtimeChannel | null = null
let messageHandlers: ((msg: any) => void)[] = []

// ============================================================
// SUBSCRIBE TO REALTIME MESSAGES
// ============================================================
export function subscribeToMessages(onMessage: (msg: any) => void): () => void {
  const profile = getCurrentProfile()
  if (!profile) return () => {}

  messageHandlers.push(onMessage)

  if (!chatChannel) {
    chatChannel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `to_user_id=eq.${profile.id}`,
        },
        (payload) => {
          messageHandlers.forEach(fn => fn(payload.new))
        }
      )
      .subscribe()
  }

  return () => {
    messageHandlers = messageHandlers.filter(fn => fn !== onMessage)
    if (messageHandlers.length === 0 && chatChannel) {
      supabase.removeChannel(chatChannel)
      chatChannel = null
    }
  }
}

// ============================================================
// SEND MESSAGE
// ============================================================
export async function sendRealtimeMessage(
  toUserId: string,
  productId: string,
  text: string
): Promise<{ success: boolean; error?: string }> {
  const profile = getCurrentProfile()
  if (!profile) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase.from('messages').insert({
    from_user_id: profile.id,
    to_user_id: toUserId,
    product_id: productId,
    text,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ============================================================
// GET CONVERSATIONS
// ============================================================
export async function getChatConversations() {
  const profile = getCurrentProfile()
  if (!profile) return []

  // Get all messages where user is sender or receiver
  const { data: messages } = await supabase
    .from('messages')
    .select('*, product:products(name, images), from_profile:profiles!from_user_id(name, avatar), to_profile:profiles!to_user_id(name, avatar)')
    .or(`from_user_id.eq.${profile.id},to_user_id.eq.${profile.id}`)
    .order('created_at', { ascending: false })

  if (!messages) return []

  // Group by conversation (product + other user)
  const convMap = new Map<string, any>()
  messages.forEach((msg: any) => {
    const otherUserId = msg.from_user_id === profile.id ? msg.to_user_id : msg.from_user_id
    const key = `${msg.product_id}-${otherUserId}`

    if (!convMap.has(key)) {
      convMap.set(key, {
        productId: msg.product_id,
        productName: msg.product?.name || 'General',
        productImage: msg.product?.images?.[0],
        otherUserId,
        otherUserName: msg.from_user_id === profile.id
          ? msg.to_profile?.name
          : msg.from_profile?.name,
        lastMessage: msg.text,
        lastDate: msg.created_at,
        unread: 0,
      })
    }

    if (!msg.is_read && msg.to_user_id === profile.id) {
      convMap.get(key).unread++
    }
  })

  return Array.from(convMap.values()).sort(
    (a, b) => new Date(b.lastDate).getTime() - new Date(a.lastDate).getTime()
  )
}

// ============================================================
// MARK CONVERSATION AS READ
// ============================================================
export async function markConversationRead(otherUserId: string, productId: string) {
  const profile = getCurrentProfile()
  if (!profile) return

  await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('to_user_id', profile.id)
    .eq('from_user_id', otherUserId)
    .eq('product_id', productId)
    .eq('is_read', false)
}

// ============================================================
// TYPING INDICATOR (via Supabase Presence)
// ============================================================
export function sendTypingIndicator(otherUserId: string, productId: string) {
  if (!chatChannel) return
  chatChannel.send({
    type: 'broadcast',
    event: 'typing',
    payload: { user_id: getCurrentProfile()?.id, product_id: productId },
  })
}

// ============================================================
// UNREAD COUNT
// ============================================================
export async function getUnreadMessageCount(): Promise<number> {
  const profile = getCurrentProfile()
  if (!profile) return 0

  const { count } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('to_user_id', profile.id)
    .eq('is_read', false)

  return count || 0
}
