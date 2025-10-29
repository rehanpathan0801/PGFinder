# PGFinder - MERN Stack PG Accommodation Platform

A complete web application for finding and managing Paying Guest accommodations. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js) with a modern, responsive UI.

## 🚀 Features

### For PG Owners
- **Dashboard**: Manage all your PG listings in one place
- **Add/Edit PGs**: Create detailed listings with multiple photos
- **Inquiry Management**: View and respond to inquiries from potential tenants
- **Analytics**: Track views and engagement for your listings
- **Image Upload**: Upload multiple photos with Cloudinary integration

### For Clients (Tenants)
- **Advanced Search**: Filter PGs by location, price, amenities, and more
- **Detailed Listings**: View comprehensive information with photos
- **Favorites**: Save and manage your preferred PGs
- **Direct Contact**: Contact PG owners through the platform
- **Responsive Design**: Works perfectly on all devices

### General Features
- **Secure Authentication**: JWT-based authentication with role-based access
- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Real-time Updates**: Instant feedback and notifications
- **Mobile Responsive**: Optimized for all screen sizes
- **Search & Filter**: Advanced filtering capabilities
- **Image Gallery**: Beautiful image display for PG listings

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Image storage
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **React Query** - Data fetching
- **React Hook Form** - Form handling
- **Lucide React** - Icons
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pgfinder
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   Create `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pgfinder
   JWT_SECRET=your_jwt_secret_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

## 🗂️ Project Structure

```
pgfinder/
├── frontend/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   └── index.js        # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── backend/                # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── server.js           # Entry point
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### PG Listings
- `GET /api/pg` - Get all PG listings with filters
- `GET /api/pg/:id` - Get single PG listing
- `POST /api/pg` - Create new PG listing (Owner only)
- `PUT /api/pg/:id` - Update PG listing (Owner only)
- `DELETE /api/pg/:id` - Delete PG listing (Owner only)
- `GET /api/pg/owner/my-listings` - Get owner's listings
- `POST /api/pg/:id/inquiry` - Send inquiry for PG
- `GET /api/pg/cities` - Get all available cities

### User Management
- `POST /api/user/favorites/:pgId` - Add PG to favorites
- `DELETE /api/user/favorites/:pgId` - Remove PG from favorites
- `GET /api/user/favorites` - Get user's favorites
- `GET /api/user/dashboard` - Get user dashboard data
- `PUT /api/user/profile-image` - Update profile image

## 🚀 Deployment

### Backend Deployment (Render/Heroku)

1. **Set up environment variables** in your deployment platform
2. **Build the application**:
   ```bash
   cd backend
   npm install
   npm start
   ```

### Frontend Deployment (Vercel/Netlify)

1. **Build the React app**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy the `build` folder** to your preferred platform

### Environment Variables for Production

Make sure to set these environment variables in your production environment:

```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcryptjs
- **Input Validation** with express-validator
- **CORS Protection** for cross-origin requests
- **Helmet.js** for security headers
- **Rate Limiting** to prevent abuse
- **File Upload Validation** for images

## 🎨 UI/UX Features

- **Responsive Design** - Works on all devices
- **Modern Interface** - Clean and intuitive design
- **Loading States** - Smooth user experience
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Real-time feedback
- **Image Gallery** - Beautiful photo display
- **Search & Filter** - Advanced filtering options

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/pgfinder/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Lucide React](https://lucide.dev/) for the beautiful icons
- [React Query](https://react-query.tanstack.com/) for data fetching
- [Cloudinary](https://cloudinary.com/) for image storage
- [MongoDB Atlas](https://www.mongodb.com/atlas) for database hosting

---

**PGFinder** - Making PG accommodation search simple and efficient! 🏠✨ 