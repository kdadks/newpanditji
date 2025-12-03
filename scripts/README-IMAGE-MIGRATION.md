# Image Migration to Supabase

This script migrates all images from the `/public/images` folder to Supabase Storage and registers them in the `media_files` table.

## Prerequisites

1. Make sure your Supabase project is set up
2. Ensure you have the necessary environment variables in your `.env` file:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY` or `SUPABASE_SERVICE_ROLE_KEY` (recommended for migration)

## Running the Migration

```bash
npm run migrate:images
```

## What the Script Does

1. **Scans** all images in `/public/images` and subdirectories
2. **Uploads** each image to Supabase Storage bucket `media`
3. **Categorizes** images automatically:
   - `books` - Images in /books/ folder
   - `logos` - Images in /Logo/ folder
   - `pooja` - Images with "Pooja" in filename
   - `profile` - Images with "Raj" in filename
   - `gallery` - Temple and Altar images
   - `general` - All other images
4. **Creates entries** in the `media_files` table with:
   - File name and original name
   - MIME type and file size
   - Public URL from Supabase Storage
   - Category/folder for organization
   - Auto-generated title from filename

## After Migration

Once the migration is complete:

1. All images will be accessible through the Admin Panel > Media > Photos tab
2. You can search and filter images by category
3. Each image will have a category badge (books, gallery, pooja, etc.)
4. Images are stored in Supabase Storage for better performance and management

## Migration Summary

The script will output:
- Number of images found
- Upload progress for each image
- Success/failure count
- Breakdown by category

## Notes

- The script won't upload duplicate images (uses timestamp in filename)
- Original files in `/public/images` are NOT deleted (manual cleanup required)
- If migration fails for some images, you can re-run it (already uploaded images won't be duplicated)
- The script has a 500ms delay between uploads to avoid rate limiting

## Categories

Images will be automatically categorized as:
- **books**: Book cover images
- **logos**: Logo files
- **pooja**: Pooja ceremony images
- **profile**: Profile pictures
- **gallery**: Temple, altar, and general gallery images
- **general**: Miscellaneous images
