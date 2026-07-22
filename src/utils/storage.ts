// ==================== STORAGE SERVICE ====================
// Image upload via Supabase Storage
import { supabase } from './supabase'
import { getCurrentProfile } from './auth'

const BUCKET = 'product-images'
const AVATAR_BUCKET = 'avatars'

// ============================================================
// UPLOAD PRODUCT IMAGE
// ============================================================
export async function uploadProductImage(
  file: File,
  productId?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  const profile = getCurrentProfile()
  if (!profile) return { success: false, error: 'Not authenticated' }

  // Validate file
  if (!file.type.startsWith('image/')) return { success: false, error: 'File must be an image' }
  if (file.size > 5 * 1024 * 1024) return { success: false, error: 'Max file size is 5MB' }

  // Generate unique filename
  const ext = file.name.split('.').pop()
  const path = `products/${productId || profile.id}/${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (error) return { success: false, error: error.message }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { success: true, url: urlData.publicUrl }
}

// ============================================================
// UPLOAD MULTIPLE IMAGES
// ============================================================
export async function uploadProductImages(
  files: File[],
  productId?: string
): Promise<{ success: boolean; urls?: string[]; errors?: string[] }> {
  const urls: string[] = []
  const errors: string[] = []

  for (const file of files) {
    const result = await uploadProductImage(file, productId)
    if (result.success && result.url) urls.push(result.url)
    else errors.push(result.error || 'Upload failed')
  }

  return { success: urls.length > 0, urls, errors }
}

// ============================================================
// UPLOAD AVATAR
// ============================================================
export async function uploadAvatar(
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  const profile = getCurrentProfile()
  if (!profile) return { success: false, error: 'Not authenticated' }

  if (!file.type.startsWith('image/')) return { success: false, error: 'File must be an image' }
  if (file.size > 2 * 1024 * 1024) return { success: false, error: 'Max file size is 2MB' }

  const ext = file.name.split('.').pop()
  const path = `${profile.id}/avatar.${ext}`

  const { error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: true })

  if (error) return { success: false, error: error.message }

  const { data: urlData } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path)
  return { success: true, url: urlData.publicUrl }
}

// ============================================================
// DELETE IMAGE
// ============================================================
export async function deleteImage(
  url: string
): Promise<{ success: boolean; error?: string }> {
  // Extract path from URL
  const match = url.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)/)
  if (!match) return { success: false, error: 'Invalid URL' }

  const { error } = await supabase.storage.from(BUCKET).remove([match[1]])
  if (error) return { success: false, error: error.message }
  return { success: true }
}
