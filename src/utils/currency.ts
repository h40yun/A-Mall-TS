// ==================== CURRENCY SERVICE ====================
// Multi-currency support
export interface Currency {
  code: string
  name: string
  symbol: string
  rate: number // Rate relative to USD
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 149.5 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.24 },
  { code: 'KRW', name: 'Korean Won', symbol: '₩', rate: 1320 },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', rate: 15750 },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', rate: 4.65 },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', rate: 35.2 },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', rate: 24300 },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', rate: 56.5 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.34 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.53 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.36 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.2 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 4.97 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', rate: 17.1 },
  { code: 'TWD', name: 'Taiwan Dollar', symbol: 'NT$', rate: 31.5 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', rate: 7.82 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', rate: 3.75 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate: 3.67 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', rate: 91.5 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', rate: 27.3 },
]

const STORAGE_KEY = 'am_currency'

// ============================================================
// GET/SET CURRENCY
// ============================================================
export function getCurrency(): Currency {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    const found = CURRENCIES.find(c => c.code === saved)
    if (found) return found
  }
  // Auto-detect from locale
  const locale = navigator.language
  const region = locale.split('-')[1]?.toUpperCase()
  const regionMap: Record<string, string> = {
    US: 'USD', GB: 'GBP', JP: 'JPY', CN: 'CNY', KR: 'KRW',
    ID: 'IDR', MY: 'MYR', TH: 'THB', VN: 'VND', PH: 'PHP',
    SG: 'SGD', AU: 'AUD', CA: 'CAD', IN: 'INR', BR: 'BRL',
    MX: 'MXN', TW: 'TWD', HK: 'HKD', SA: 'SAR', AE: 'AED',
    RU: 'RUB', TR: 'TRY', DE: 'EUR', FR: 'EUR', IT: 'EUR',
    ES: 'EUR', NL: 'EUR',
  }
  const detected = regionMap[region || ''] || 'USD'
  return CURRENCIES.find(c => c.code === detected) || CURRENCIES[0]
}

export function setCurrency(code: string): void {
  localStorage.setItem(STORAGE_KEY, code)
}

// ============================================================
// CONVERT & FORMAT
// ============================================================
export function convertPrice(usdPrice: number, currency?: Currency): number {
  const curr = currency || getCurrency()
  return Math.round(usdPrice * curr.rate * 100) / 100
}

export function formatCurrency(usdPrice: number, currency?: Currency): string {
  const curr = currency || getCurrency()
  const converted = convertPrice(usdPrice, curr)

  // Format based on currency
  if (['JPY', 'KRW', 'VND'].includes(curr.code)) {
    return `${curr.symbol}${Math.round(converted).toLocaleString()}`
  }
  return `${curr.symbol}${converted.toFixed(2)}`
}

// ============================================================
// FETCH LIVE RATES (optional)
// ============================================================
export async function fetchLiveRates(): Promise<boolean> {
  try {
    const resp = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
    const data = await resp.json()
    if (data.rates) {
      CURRENCIES.forEach(c => {
        if (data.rates[c.code]) c.rate = data.rates[c.code]
      })
      return true
    }
  } catch {}
  return false
}
