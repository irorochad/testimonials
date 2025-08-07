import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Upload image to Supabase storage
export async function uploadImage(file: File, fileName: string): Promise<string | null> {
  try {
    console.log('Starting image upload:', fileName)

    const { data, error } = await supabase.storage
      .from('reviewers-image')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Error uploading image:', error)
      return null
    }

    console.log('Upload successful, data:', data)

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('reviewers-image')
      .getPublicUrl(data.path)

    console.log('Generated public URL:', publicUrl)
    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

// Generate unique filename
export function generateImageFileName(originalName: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop()
  return `${timestamp}-${randomString}.${extension}`
}