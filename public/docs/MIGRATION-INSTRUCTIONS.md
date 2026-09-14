# Image Migration Instructions

## Overview

This guide will help you migrate all images from `/public/images` to Supabase Storage and the Admin Panel's Media/Photos tab.

## Step 1: Verify Supabase Setup

Make sure you have a Supabase project set up with:

1. **Storage Bucket**: A bucket named `media` should exist
   - If not, create it at: Supabase Dashboard → Storage → Create bucket → Name: `media`
   - Make the bucket public if you want direct image access

2. **Database Table**: The `media_files` table should exist (created by migrations)

3. **Environment Variables**: Check your `.env` file has:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   ```

## Step 2: Run the Migration

Execute the migration script:

```bash
npm run migrate:images
```

## What Happens During Migration

The script will:

1. ✅ Check if the Supabase `media` bucket exists
2. 📁 Scan all images in `/public/images` folder
3. 📤 Upload each image to Supabase Storage
4. 💾 Create database entries in `media_files` table
5. 🏷️ Auto-categorize images:
   - **books** → Images in `/books/` folder
   - **logos** → Images in `/Logo/` folder
   - **pooja** → Images with "Pooja" in filename
   - **profile** → Images with "Raj" in filename
   - **gallery** → Temple/Altar images
   - **general** → Other images

## Expected Output

```
🚀 Starting image migration...

✓ Storage bucket "media" found

Found 19 images to migrate

Uploading hinduism-basics-for-all.jpeg to books/1733240123-hinduism-basics-for-all.jpeg...
✓ Uploaded: hinduism-basics-for-all.jpeg
✓ Added to database: hinduism-basics-for-all.jpeg
...

📊 Migration Summary:
✓ Success: 19
✗ Failed: 0
📁 Total: 19

📂 Images by category:
  - books: 6
  - logos: 3
  - pooja: 3
  - profile: 3
  - gallery: 4

✅ Migration complete!
```

## Step 3: Verify in Admin Panel

1. Log in to your Admin Panel
2. Go to **Media** → **Photos** tab
3. You should see all 19 images
4. Use the category filter to view images by type
5. Search for specific images by name

## Step 4: Update References (Optional)

If you want to replace hardcoded image paths with the new Supabase URLs:

1. Find all references to `/images/` in your code
2. Replace them with the image URLs from the database
3. Or create a helper function to fetch images dynamically

Example:
```typescript
// Before
<img src="/images/books/hinduism-basics.jpeg" />

// After (using dynamic data)
<img src={book.coverImageUrl} />
```

## Troubleshooting

### Error: "media storage bucket not found"
- Create the bucket in Supabase Dashboard → Storage
- Name it exactly `media`

### Error: "Missing Supabase credentials"
- Check your `.env` file exists
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are set

### Error: "Permission denied"
- Make sure your Supabase anon key has permission to upload to storage
- Check Row Level Security (RLS) policies on `media_files` table

### Some images failed to upload
- Check file size (Supabase free tier has limits)
- Verify file formats are supported
- Re-run the script (it won't duplicate successful uploads)

## Cleanup (Optional)

After successful migration and verification:

1. You can delete the `/public/images` folder
2. Or keep it as a backup until you're confident everything works

## Notes

- Original files are NOT deleted automatically
- The script uses timestamps to prevent duplicates
- You can re-run the migration safely
- A 500ms delay between uploads prevents rate limiting
