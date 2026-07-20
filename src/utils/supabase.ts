// ==================== SUPABASE CLIENT ====================
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://toyehtrxtlaajudaxedk.supabase.co'
const SUPABASE_ANON_KEY = '***'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
