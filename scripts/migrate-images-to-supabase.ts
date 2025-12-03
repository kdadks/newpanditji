import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'

// Load environment variables
config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface ImageFile {
  localPath: string
  fileName: string
  category: string
  title: string
}

// Get MIME type from file extension
function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
  }
  return mimeTypes[ext] || 'application/octet-stream'
}

// Determine category from file path
function getCategoryFromPath(filePath: string): string {
  if (filePath.includes('/books/')) return 'books'
  if (filePath.includes('/Logo/')) return 'logos'
  if (filePath.includes('Pooja')) return 'pooja'
  if (filePath.includes('Raj ')) return 'profile'
  if (filePath.includes('Temple') || filePath.includes('Altar')) return 'gallery'
  return 'general'
}

// Generate title from filename
function generateTitle(filename: string): string {
  const nameWithoutExt = path.basename(filename, path.extname(filename))
  // Convert filename to readable title
  return nameWithoutExt
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

// Find all image files
function findImageFiles(dir: string, baseDir: string = dir): ImageFile[] {
  const files: ImageFile[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...findImageFiles(fullPath, baseDir))
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase()
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
        const relativePath = path.relative(baseDir, fullPath)
        files.push({
          localPath: fullPath,
          fileName: entry.name,
          category: getCategoryFromPath(relativePath),
          title: generateTitle(entry.name)
        })
      }
    }
  }

  return files
}

// Upload image to Supabase Storage
async function uploadImage(imageFile: ImageFile): Promise<string | null> {
  try {
    const fileBuffer = fs.readFileSync(imageFile.localPath)
    const fileExt = path.extname(imageFile.fileName)
    const timestamp = Date.now()
    const sanitizedName = imageFile.fileName
      .replace(/[^a-zA-Z0-9.-]/g, '-')
      .toLowerCase()
    const storagePath = `${imageFile.category}/${timestamp}-${sanitizedName}`

    console.log(`Uploading ${imageFile.fileName} to ${storagePath}...`)

    const { data, error } = await supabase.storage
      .from('media')
      .upload(storagePath, fileBuffer, {
        contentType: getMimeType(imageFile.fileName),
        upsert: false
      })

    if (error) {
      console.error(`Error uploading ${imageFile.fileName}:`, error.message)
      return null
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(data.path)

    console.log(`✓ Uploaded: ${imageFile.fileName}`)
    return urlData.publicUrl
  } catch (error) {
    console.error(`Error processing ${imageFile.fileName}:`, error)
    return null
  }
}

// Add entry to media_files table
async function addToMediaFiles(imageFile: ImageFile, fileUrl: string, fileSize: number) {
  try {
    const { error } = await supabase
      .from('media_files')
      .insert({
        file_name: imageFile.fileName.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase(),
        original_name: imageFile.fileName,
        file_type: 'image',
        mime_type: getMimeType(imageFile.fileName),
        file_size: fileSize,
        file_url: fileUrl,
        thumbnail_url: null,
        alt_text: imageFile.title,
        caption: null,
        description: null,
        folder: imageFile.category,
        tags: null
      })

    if (error) {
      console.error(`Error adding ${imageFile.fileName} to database:`, error.message)
      return false
    }

    console.log(`✓ Added to database: ${imageFile.fileName}`)
    return true
  } catch (error) {
    console.error(`Error adding ${imageFile.fileName} to database:`, error)
    return false
  }
}

// Check if storage bucket exists
async function checkStorageBucket(): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage.listBuckets()

    if (error) {
      console.error('Error checking storage buckets:', error.message)
      return false
    }

    const mediaBucket = data?.find(bucket => bucket.name === 'media')
    if (!mediaBucket) {
      console.error('❌ "media" storage bucket not found in Supabase.')
      console.error('Please create a storage bucket named "media" in your Supabase project.')
      console.error('Visit: https://supabase.com/dashboard/project/YOUR_PROJECT/storage/buckets')
      return false
    }

    console.log('✓ Storage bucket "media" found\n')
    return true
  } catch (error) {
    console.error('Error checking storage bucket:', error)
    return false
  }
}

// Main migration function
async function migrateImages() {
  console.log('🚀 Starting image migration...\n')

  // Check storage bucket
  const bucketExists = await checkStorageBucket()
  if (!bucketExists) {
    process.exit(1)
  }

  const imagesDir = path.join(__dirname, '..', 'public', 'images')

  if (!fs.existsSync(imagesDir)) {
    console.error(`Images directory not found: ${imagesDir}`)
    process.exit(1)
  }

  const imageFiles = findImageFiles(imagesDir)
  console.log(`Found ${imageFiles.length} images to migrate\n`)

  let successCount = 0
  let failCount = 0

  for (const imageFile of imageFiles) {
    const fileSize = fs.statSync(imageFile.localPath).size
    const fileUrl = await uploadImage(imageFile)

    if (fileUrl) {
      const added = await addToMediaFiles(imageFile, fileUrl, fileSize)
      if (added) {
        successCount++
      } else {
        failCount++
      }
    } else {
      failCount++
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log('\n📊 Migration Summary:')
  console.log(`✓ Success: ${successCount}`)
  console.log(`✗ Failed: ${failCount}`)
  console.log(`📁 Total: ${imageFiles.length}`)

  // Group by category
  const categories = imageFiles.reduce((acc, file) => {
    acc[file.category] = (acc[file.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  console.log('\n📂 Images by category:')
  Object.entries(categories).forEach(([category, count]) => {
    console.log(`  - ${category}: ${count}`)
  })

  console.log('\n✅ Migration complete!')
}

// Run migration
migrateImages().catch(console.error)
