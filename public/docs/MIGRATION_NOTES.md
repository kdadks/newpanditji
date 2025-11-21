# Migration from GitHub Spark

This document outlines the changes made to migrate from GitHub Spark to a standalone application.

## Changes Made

### 1. Removed GitHub Spark Signatures
- Updated error messages in `src/ErrorFallback.tsx` to remove Spark branding
- Changed project name from "spark-template" to "pandit-rajesh-joshi" in `package.json`
- Updated CSS selectors from `#spark-app` to `#app` in `src/styles/theme.css`

### 2. Replaced Spark's useKV Hook
Created a custom localStorage hook (`src/hooks/useLocalStorage.ts`) that provides the same API as Spark's `useKV` hook but stores data in browser localStorage instead of Spark's cloud storage.

**Files updated:**
- `src/App.tsx`
- `src/components/pages/ServicesPage.tsx`
- `src/components/pages/GalleryPage.tsx`
- `src/components/pages/CharityPage.tsx`
- `src/components/pages/BlogPage.tsx`
- `src/components/admin/AdminServices.tsx`
- `src/components/admin/AdminPhotos.tsx`
- `src/components/admin/AdminVideos.tsx`
- `src/components/admin/AdminBlogs.tsx`
- `src/components/admin/AdminCharity.tsx`

### 3. Replaced GitHub Authentication
Created a simple authentication service (`src/services/auth.ts`) to replace Spark's GitHub OAuth authentication.

**Current Test Credentials:**
- Username: `admin`
- Password: `admin123`

**Features:**
- Login/logout functionality
- Session persistence using localStorage
- Admin access control
- Test account authentication (to be replaced with database authentication later)

**Files updated:**
- `src/components/pages/AdminPage.tsx` - Added login form and logout button
- `src/components/Header.tsx` - Uses new auth service to show/hide admin link

### 4. Removed Spark Dependencies
- Removed `import "@github/spark/spark"` from `src/main.tsx`
- Removed all imports of `useKV` from `@github/spark/hooks`

**Note:** The `@github/spark` package is still in `package.json` dependencies. Once you verify everything works correctly, you can remove it by running:
```bash
npm uninstall @github/spark
```

## Testing the Application

### Development Mode
```bash
npm run dev
```

The application will be available at `http://localhost:5002/` (or another port if 5002 is in use)

### Production Build
```bash
npm run build
npm run preview
```

### Testing Admin Portal

#### Accessing the Admin Page
The admin page is accessible via URL only:
- Navigate to: `http://localhost:5002/admin` (in development)
- Or: `https://yourdomain.com/admin` (in production)

The Admin link will appear in the header **only after** you successfully login.

#### Login Steps
1. Go to `http://localhost:5002/admin`
2. You'll see the Admin Login page
3. Use test credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
4. After successful login, you'll see the Admin Dashboard

#### Testing Admin Features
Test CRUD operations for:
- **Services** - Add/Edit/Delete religious services
- **Photos** - Upload and manage gallery photos
- **Videos** - Add and organize video content
- **Blogs** - Create/Edit/Delete blog articles
- **Charity** - Manage charity projects

#### Logout
Click the "Logout" button in the top-right of the Admin Dashboard. The Admin link will disappear from the header after logout.

## Future Improvements

### Database Authentication (Recommended Next Steps)
The current authentication uses hardcoded test credentials stored in `src/services/auth.ts`. For production use, you should:

1. Set up a backend API with a database (e.g., Node.js + MongoDB/PostgreSQL)
2. Implement proper user authentication with hashed passwords
3. Add JWT token-based authentication
4. Update `src/services/auth.ts` to call your backend API
5. Add user management features (create users, reset password, etc.)

### Data Storage
Currently, all admin data is stored in browser localStorage. For production:

1. Create a backend API for data persistence
2. Replace localStorage calls with API calls
3. Add proper error handling and loading states
4. Implement data synchronization

## Notes

- All functionality remains intact after migration
- Admin data is now stored locally in browser localStorage
- Users will need to login with the test account to access admin features
- The application is now independent of GitHub Spark infrastructure
