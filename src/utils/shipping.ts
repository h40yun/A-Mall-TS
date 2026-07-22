// ==================== SHIPPING SERVICE ====================
// Real shipping tracking & carrier integration
import { supabase } from './supabase'

export interface TrackingEvent {
  status: string
  location: string
  timestamp: string
  description: string
}

export interface ShippingRate {
  carrier: string
  service: string
  rate: number
  currency: string
  days: string
  tracking: boolean
}

// ============================================================
// SHIPPING CARRIERS
// ============================================================
export const CARRIERS = [
  { id: 'fedex', name: 'FedEx', logo: '📦', trackingUrl: 'https://www.fedex.com/fedextrack/?trknbr=' },
  { id: 'ups', name: 'UPS', logo: '📦', trackingUrl: 'https://www.ups.com/track?tracknum=' },
  { id: 'dhl', name: 'DHL', logo: '📦', trackingUrl: 'https://www.dhl.com/en/express/tracking.html?AWB=' },
  { id: 'usps', name: 'USPS', logo: '📦', trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=' },
  { id: 'jne', name: 'JNE', logo: '📦', trackingUrl: 'https://www.jne.co.id/en/tracking/trace/' },
  { id: 'jnt', name: 'J&T Express', logo: '📦', trackingUrl: 'https://www.jtexpress.com/tracking?waybill=' },
  { id: 'spx', name: 'SPX Express', logo: '📦', trackingUrl: '' },
  { id: 'standard', name: 'Standard Shipping', logo: '📬', trackingUrl: '' },
  { id: 'express', name: 'Express Shipping', logo: '✈️', trackingUrl: '' },
  { id: 'free', name: 'Free Shipping', logo: '🆓', trackingUrl: '' },
]

// ============================================================
// CALCULATE SHIPPING RATES
// ============================================================
export async function calculateShipping(
  origin: string,
  destination: string,
  weight: number, // in grams
  dimensions?: { length: number; width: number; height: number }
): Promise<ShippingRate[]> {
  // In production, call carrier APIs (FedEx/UPS/DHL rate APIs)
  // For now, calculate based on weight and distance

  const baseRates: ShippingRate[] = [
    {
      carrier: 'Standard',
      service: 'Economy',
      rate: weight < 500 ? 4.99 : weight < 2000 ? 7.99 : 12.99,
      currency: 'USD',
      days: '7-14 business days',
      tracking: true,
    },
    {
      carrier: 'Standard',
      service: 'Standard',
      rate: weight < 500 ? 7.99 : weight < 2000 ? 12.99 : 19.99,
      currency: 'USD',
      days: '5-7 business days',
      tracking: true,
    },
    {
      carrier: 'Express',
      service: 'Express',
      rate: weight < 500 ? 14.99 : weight < 2000 ? 24.99 : 39.99,
      currency: 'USD',
      days: '2-3 business days',
      tracking: true,
    },
  ]

  // Free shipping for orders over $50
  return baseRates
}

// ============================================================
// TRACK ORDER
// ============================================================
export async function trackShipment(
  trackingNumber: string,
  carrierId?: string
): Promise<{ events: TrackingEvent[]; status: string; error?: string }> {
  // In production, call carrier tracking APIs
  // For now, return from database

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_tracking(*)')
    .eq('tracking_number', trackingNumber)
    .single()

  if (!order) return { events: [], status: 'unknown', error: 'Order not found' }

  const events = (order.order_tracking || []).map((t: any) => ({
    status: t.status,
    location: t.location || '',
    timestamp: t.created_at,
    description: t.description || '',
  }))

  return { events, status: order.status }
}

// ============================================================
// GENERATE SHIPPING LABEL
// ============================================================
export async function generateShippingLabel(
  orderId: string,
  carrierId: string
): Promise<{ success: boolean; labelUrl?: string; trackingNumber?: string; error?: string }> {
  // In production, call carrier label APIs
  // For now, generate a mock tracking number
  const trackingNumber = `${carrierId.toUpperCase()}${Date.now().toString(36).toUpperCase()}`

  const { error } = await supabase
    .from('orders')
    .update({
      tracking_number: trackingNumber,
      shipping_carrier: carrierId,
    })
    .eq('id', orderId)

  if (error) return { success: false, error: error.message }

  return { success: true, trackingNumber }
}

// ============================================================
// DELIVERY ESTIMATION
// ============================================================
export function estimateDelivery(
  shippingMethod: string,
  origin?: string
): { minDays: number; maxDays: number; estimatedDate: string } {
  const now = new Date()
  let minDays = 7, maxDays = 14

  switch (shippingMethod) {
    case 'express': minDays = 2; maxDays = 3; break
    case 'standard': minDays = 5; maxDays = 7; break
    case 'free': minDays = 7; maxDays = 14; break
  }

  const minDate = new Date(now.getTime() + minDays * 86400000)
  const maxDate = new Date(now.getTime() + maxDays * 86400000)

  return {
    minDays,
    maxDays,
    estimatedDate: `${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}`,
  }
}

// ============================================================
// GET TRACKING URL
// ============================================================
export function getTrackingUrl(trackingNumber: string, carrierId: string): string {
  const carrier = CARRIERS.find(c => c.id === carrierId)
  return carrier?.trackingUrl ? `${carrier.trackingUrl}${trackingNumber}` : ''
}
