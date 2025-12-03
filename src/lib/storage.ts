import { supabase } from './supabase'

// Storage bucket names
export const BUCKETS = {
  MEDIA: 'media',
  DOCUMENTS: 'documents',
  VIDEOS: 'videos'
} as const

export type BucketName = typeof BUCKETS[keyof typeof BUCKETS]

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  bucket: BucketName,
  file: File,
  folder?: string
): Promise<{ url: string; path: string }> {
  // Generate a unique file name
  const timestamp = Date.now()
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const fileName = `${timestamp}_${sanitizedName}`
  const filePath = folder ? `${folder}/${fileName}` : fileName

  // Upload the file
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Upload error:', error)
    throw new Error(`Failed to upload file: ${error.message}`)
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return {
    url: urlData.publicUrl,
    path: data.path
  }
}

/**
 * Upload an image with optional thumbnail generation
 */
export async function uploadImage(
  file: File,
  folder: string = 'photos'
): Promise<{ url: string; path: string; thumbnailUrl?: string }> {
  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload an image file (JPEG, PNG, GIF, WebP, or SVG)')
  }

  // Validate file size (10MB max)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 10MB')
  }

  const result = await uploadFile(BUCKETS.MEDIA, file, folder)
  
  return {
    url: result.url,
    path: result.path,
    thumbnailUrl: result.url // For now, use same URL - could add thumbnail generation later
  }
}

/**
 * Upload a document (PDF, Word, etc.)
 */
export async function uploadDocument(
  file: File,
  folder: string = 'documents'
): Promise<{ url: string; path: string; fileName: string }> {
  // Validate file type
  const validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a PDF or Word document')
  }

  // Validate file size (50MB max)
  const maxSize = 50 * 1024 * 1024 // 50MB
  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 50MB')
  }

  const result = await uploadFile(BUCKETS.DOCUMENTS, file, folder)
  
  return {
    url: result.url,
    path: result.path,
    fileName: file.name
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(bucket: BucketName, path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])

  if (error) {
    console.error('Delete error:', error)
    throw new Error(`Failed to delete file: ${error.message}`)
  }
}

/**
 * Get a signed URL for private files (documents)
 */
export async function getSignedUrl(
  bucket: BucketName,
  path: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn)

  if (error) {
    console.error('Signed URL error:', error)
    throw new Error(`Failed to get signed URL: ${error.message}`)
  }

  return data.signedUrl
}

/**
 * List files in a bucket/folder
 */
export async function listFiles(
  bucket: BucketName,
  folder?: string
): Promise<Array<{ name: string; url: string; path: string; createdAt: string }>> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder || '', {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' }
    })

  if (error) {
    console.error('List files error:', error)
    throw new Error(`Failed to list files: ${error.message}`)
  }

  return (data || [])
    .filter(item => !item.id.includes('.emptyFolderPlaceholder'))
    .map(item => {
      const path = folder ? `${folder}/${item.name}` : item.name
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
      
      return {
        name: item.name,
        url: urlData.publicUrl,
        path,
        createdAt: item.created_at || new Date().toISOString()
      }
    })
}

/**
 * Extract storage path from a full Supabase Storage URL
 */
export function extractPathFromUrl(url: string, bucket: BucketName): string | null {
  try {
    const urlObj = new URL(url)
    const pathMatch = urlObj.pathname.match(new RegExp(`/storage/v1/object/public/${bucket}/(.+)`))
    return pathMatch ? pathMatch[1] : null
  } catch {
    return null
  }
}

/**
 * Check if a URL is a Supabase Storage URL
 */
export function isSupabaseStorageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.pathname.includes('/storage/v1/object/')
  } catch {
    return false
  }
}

/**
 * Convert a File to base64 for preview purposes
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}
