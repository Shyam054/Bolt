# MLShelf - ML Repository Platform

A modern platform for uploading, sharing, and managing machine learning models and datasets.

## 🚀 Features

### Upload System
- **Drag & Drop Interface**: GitHub-like file upload experience
- **File Type Validation**: Supports ML models (.pkl, .onnx, .h5, .pt, .pth) and datasets (.csv, .json, .zip, .parquet)
- **Progress Tracking**: Real-time upload progress with visual feedback
- **Metadata Management**: Automatic file metadata extraction and storage

### File Management
- **List View**: Clean, searchable table of all uploaded files
- **Search & Filter**: Find files by name, type, or upload date
- **Download**: One-click file downloads with public URLs
- **Delete**: Remove files from both storage and database

### Backend (Supabase)
- **Storage Buckets**: Separate buckets for models and datasets
- **Database**: PostgreSQL with RLS policies for security
- **Real-time**: Instant updates when files are uploaded/deleted

## 🛠 Tech Stack

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Storage)
- **UI**: shadcn/ui components with Framer Motion animations
- **Styling**: Dark theme with glassmorphism effects

## 📦 Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Setup**
   Run the migration in `supabase/migrations/create_uploads_table.sql`

4. **Storage Setup**
   Create buckets in Supabase:
   - `ml-models` (for ML model files)
   - `datasets` (for dataset files)

5. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🏗 Architecture

### Database Schema
```sql
uploads (
  id: UUID (Primary Key)
  file_name: TEXT
  file_type: TEXT ('model' | 'dataset')
  bucket: TEXT
  size: BIGINT
  uploaded_at: TIMESTAMPTZ
)
```

### File Structure
```
├── lib/supabase.ts          # Supabase client & utilities
├── components/
│   ├── upload-form.tsx      # Drag & drop upload component
│   └── file-list.tsx        # File management component
├── supabase/migrations/     # Database migrations
└── app/upload/page.tsx      # Main upload page
```

## 🎨 UI/UX Features

- **GitHub-like Interface**: Familiar file management experience
- **Dark Theme**: Modern glassmorphism design
- **Responsive**: Works on desktop and mobile
- **Animations**: Smooth Framer Motion transitions
- **Toast Notifications**: Success/error feedback
- **Loading States**: Progress indicators and skeletons

## 🔒 Security

- **Row Level Security**: Supabase RLS policies
- **File Validation**: Client and server-side type checking
- **Public Access**: No authentication required (as requested)
- **Safe Deletion**: Removes from both storage and database

## 🚀 Deployment

The app is ready for deployment on Vercel, Netlify, or any Next.js hosting platform. Make sure to:

1. Set environment variables in your hosting platform
2. Configure Supabase buckets and database
3. Run database migrations
4. Test file upload/download functionality

## 📈 Future Enhancements

- User authentication and private repositories
- File versioning and history
- Collaborative features and sharing
- API endpoints for programmatic access
- Advanced search and filtering
- File preview and metadata extraction