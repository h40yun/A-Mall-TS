// ==================== REFERRAL SERVICE ====================
// Affiliate/referral tracking system
import { supabase } from './supabase'
import { getCurrentProfile } from './auth'

// ============================================================
// GENERATE REFERRAL CODE
// ============================================================
export async function generateReferralCode(): Promise<string | null> {
  const profile = getCurrentProfile()
  if (!profile) return null

  // Check if user already has a code
  const { data: existing } = await supabase
    .from('referrals')
    .select('code')
    .eq('user_id', profile.id)
    .single()

  if (existing) return existing.code

  // Generate new code
  const code = profile.name.substring(0, 4).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase()

  const { error } = await supabase.from('referrals').insert({
    user_id: profile.id,
    code,
    type: 'referral',
  })

  if (error) return null
  return code
}

// ============================================================
// APPLY REFERRAL CODE
// ============================================================
export async function applyReferralCode(
  code: string
): Promise<{ success: boolean; referrerName?: string; error?: string }> {
  const profile = getCurrentProfile()
  if (!profile) return { success: false, error: 'Not authenticated' }

  // Find the referral
  const { data: referral } = await supabase
    .from('referrals')
    .select('user_id, profiles(name)')
    .eq('code', code.toUpperCase())
    .single()

  if (!referral) return { success: false, error: 'Invalid referral code' }
  if (referral.user_id === profile.id) return { success: false, error: 'Cannot use your own code' }

  // Check if already applied
  const { data: existing } = await supabase
    .from('referral_uses')
    .select('id')
    .eq('referred_id', profile.id)
    .single()

  if (existing) return { success: false, error: 'You have already used a referral code' }

  // Record the referral use
  const { error } = await supabase.from('referral_uses').insert({
    referrer_id: referral.user_id,
    referred_id: profile.id,
    code: code.toUpperCase(),
    status: 'pending',
  })

  if (error) return { success: false, error: error.message }

  return {
    success: true,
    referrerName: (referral.profiles as any)?.name || 'A friend',
  }
}

// ============================================================
// GET REFERRAL STATS
// ============================================================
export async function getReferralStats() {
  const profile = getCurrentProfile()
  if (!profile) return null

  const [codeResult, usesResult, earningsResult] = await Promise.all([
    supabase
      .from('referrals')
      .select('code')
      .eq('user_id', profile.id)
      .single(),
    supabase
      .from('referral_uses')
      .select('id', { count: 'exact' })
      .eq('referrer_id', profile.id),
    supabase
      .from('referral_uses')
      .select('reward_amount')
      .eq('referrer_id', profile.id)
      .eq('status', 'completed'),
  ])

  const totalEarnings = (earningsResult.data || []).reduce(
    (sum: number, r: any) => sum + (r.reward_amount || 0),
    0
  )

  return {
    code: codeResult.data?.code || null,
    totalReferrals: usesResult.count || 0,
    totalEarnings,
    pendingEarnings: 0,
  }
}

// ============================================================
// GET REFERRAL LINK
// ============================================================
export function getReferralLink(code: string): string {
  return `${window.location.origin}/auth?ref=${code}`
}

// ============================================================
// COMMISSION SYSTEM (for sellers)
// ============================================================
export async function getSellerCommission(sellerId: string) {
  const { data } = await supabase
    .from('orders')
    .select('total, commission_rate, commission_amount')
    .eq('seller_id', sellerId)
    .eq('status', 'completed')

  if (!data) return { totalSales: 0, totalCommission: 0, netEarnings: 0 }

  const totalSales = data.reduce((sum: number, o: any) => sum + o.total, 0)
  const totalCommission = data.reduce((sum: number, o: any) => sum + (o.commission_amount || 0), 0)

  return {
    totalSales,
    totalCommission,
    netEarnings: totalSales - totalCommission,
    orderCount: data.length,
  }
}
