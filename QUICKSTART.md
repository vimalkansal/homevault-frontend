# HomeVault Frontend - Quick Start Guide

## Prerequisites
- Backend API running at `http://localhost:3000`
- Node.js installed

## Installation & Running

1. **Install dependencies** (if not already done):
```bash
npm install
```

2. **Start the development server**:
```bash
npm run dev
```

3. **Open your browser**:
Navigate to `http://localhost:5173` (or the port shown in the terminal)

## Getting Started

1. **Register a new account**:
   - Click "Register" in the navigation
   - Fill in your full name, email, and password
   - Submit the form

2. **Add your first item**:
   - Click "Add New Item" or "Add Item" in navigation
   - Fill in item details (name and location are required)
   - Optionally add categories (comma-separated)
   - Upload photos (multiple allowed)
   - Submit the form

3. **Browse your items**:
   - View all items on the Dashboard
   - Use the search bar to filter items by name, location, or description
   - Click "View Details" to see full item information
   - Click "Delete" to remove an item

## Features

- **Authentication**: Secure login/register with JWT tokens
- **Item Management**: Create, view, and delete items
- **Photo Upload**: Upload multiple photos per item
- **Search**: Filter items by keywords
- **Protected Routes**: Automatic redirect to login for unauthenticated users
- **Responsive Design**: Works on desktop and mobile devices

## API Configuration

The API URL is configured in `.env`:
```
VITE_API_URL=http://localhost:3000/api/v1
```

Change this if your backend runs on a different port.

## Tech Stack

- **React 19** with TypeScript
- **React Router** for routing
- **TanStack Query** for data fetching and caching
- **Axios** for HTTP requests
- **Tailwind CSS** for styling
- **React Hot Toast** for notifications
- **Vite** for fast development

## Troubleshooting

**Q: I see "Failed to load items" or authentication errors**
- Make sure the backend API is running at `http://localhost:3000`
- Check the browser console for detailed error messages

**Q: Photos aren't uploading**
- Ensure the backend has proper file upload configuration
- Check file size limits (if any) in backend configuration

**Q: Build fails**
- Run `npm install` to ensure all dependencies are installed
- Clear the build cache: `rm -rf dist node_modules/.vite`
