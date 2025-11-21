# Admin Access Guide

## How to Access the Admin Portal

### Step 1: Navigate to Admin URL
Open your browser and go to:
```
http://localhost:5002/admin
```

### Step 2: Login
You'll see the Admin Login page with a form.

**Test Credentials:**
- **Username:** `admin`
- **Password:** `admin123`

### Step 3: Access Admin Dashboard
After successful login, you'll be redirected to the Admin Dashboard where you can manage:

- 📦 **Services** - Religious services and poojas
- 🖼️ **Photos** - Gallery images
- 🎥 **Videos** - Video content
- 📝 **Blogs** - Blog articles
- ❤️ **Charity** - Charity projects

### Important Notes

✅ **Admin link visibility:**
- Admin link is **NOT visible** in the header by default
- After login, the Admin link appears in the header
- After logout, the Admin link disappears

✅ **URL-based access:**
- You can always access admin by typing `/admin` in the URL
- Bookmarks work: Save `http://localhost:5002/admin` as a bookmark

✅ **Authentication persistence:**
- Your login session is saved in browser localStorage
- You'll remain logged in even after closing the browser
- Click "Logout" to end your session

✅ **Data storage:**
- All admin data (services, photos, videos, blogs, charity) is stored in browser localStorage
- Data persists across browser sessions
- Data is local to your browser

## Security Notes for Production

⚠️ **Before deploying to production:**

1. **Change the test credentials** in `src/services/auth.ts`
2. **Implement database authentication** (see MIGRATION_NOTES.md)
3. **Add proper backend API** for data persistence
4. **Use HTTPS** for all admin access
5. **Implement rate limiting** to prevent brute force attacks

## Troubleshooting

**Can't see the Admin page?**
- Make sure you typed the URL correctly: `http://localhost:5002/admin`
- Check that the dev server is running

**Login not working?**
- Verify credentials: `admin` / `admin123`
- Check browser console for errors (F12)
- Clear localStorage and try again

**Admin link not appearing after login?**
- Refresh the page
- Check that login was successful (should see "Login successful!" toast)
