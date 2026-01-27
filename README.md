# MERN Registration System

A beautiful and elegant registration portal built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- **Visitor Registration**: For attendees who want to explore exhibitions and events
- **Exhibitor Registration**: For companies wanting to showcase their products/services with multiple employee registration
- **Hall Management**: Exhibitors can select from Hall 1, 2, or 3
- **Admin Authentication**: JWT-based login/signup system with role-based permissions
- **Admin Dashboard**: Complete management system for viewing all registrations
- **Barcode Generation**: Automatic barcode generation for visitor and exhibitor cards
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful gradients, animations, and glassmorphism effects

### Admin Dashboard Features
- **JWT Authentication**: Secure login with token-based sessions
- **Role Management**: Support for super_admin, admin, and moderator roles
- **Overview Statistics**: Real-time stats for visitors and exhibitors
- **Visitor Management**: View all registered visitors with search functionality
- **Exhibitor Management**: View exhibitors by hall with filtering options
- **Hall Distribution**: See exhibitor distribution across halls 1, 2, and 3
- **Employee Tracking**: View all employees registered under each exhibitor
- **Protected Routes**: All admin endpoints secured with JWT middleware

## Project Structure

```
├── backend/                 # Node.js/Express server
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   ├── server.js           # Main server file
│   └── .env               # Environment variables
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main App component
│   │   └── App.css        # Styles
│   └── public/            # Static files
└── package.json           # Root package.json for scripts
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd registration-system
   ```

2. **Install dependencies for both frontend and backend**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   - The MongoDB URI is already configured in `backend/.env`
   - Update the JWT_SECRET in `backend/.env` for production

### Running the Application

1. **Development Mode (runs both frontend and backend)**
   ```bash
   npm run dev
   ```

2. **Run Backend Only**
   ```bash
   npm run server
   ```

3. **Run Frontend Only**
   ```bash
   npm run client
   ```

4. **Production Build**
   ```bash
   npm run build
   npm start
   ```

### Current Status
✅ **Backend**: Running on http://localhost:5000  
✅ **Frontend**: Running on http://localhost:3000  
✅ **MongoDB**: Connected successfully  
✅ **Visitor Registration**: Fully functional with barcode generation
✅ **Exhibitor Registration**: Multi-employee registration with hall selection
✅ **Admin Dashboard**: Complete management system with statistics

### Admin Access
- **URL**: http://localhost:3000 → Click "Administrator"
- **Default Admin Credentials**: 
  - Email: `admin@admin.com`
  - Password: `admin123`
- **Features**: 
  - JWT-based authentication
  - Admin signup and login
  - Role-based permissions (super_admin, admin, moderator)
  - Secure token-based session management
  - Protected admin routes

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Admin Routes (`/api/admin`)
- `POST /api/admin/signup` - Register new admin
- `POST /api/admin/login` - Admin login with JWT
- `GET /api/admin/verify` - Verify JWT token
- `GET /api/admin/profile` - Get admin profile (protected)
- `GET /api/admin/all` - Get all admins (super admin only)
- `POST /api/admin/logout` - Admin logout

### User Routes (`/api/users`)
- `GET /api/users` - Get all users (protected)
- `GET /api/users/profile` - Get user profile (protected)

### Visitor Routes (`/api/visitors`)
- `POST /api/visitors/register` - Register new visitor
- `GET /api/visitors` - Get all visitors (admin protected)
- `GET /api/visitors/:visitorNumber` - Get visitor by number
- `GET /api/visitors/stats/overview` - Get visitor statistics (admin protected)

### Exhibitor Routes (`/api/exhibitors`)
- `POST /api/exhibitors/register` - Register new exhibitor with employees
- `GET /api/exhibitors` - Get all exhibitors (admin protected)
- `GET /api/exhibitors/:exhibitorNumber` - Get exhibitor by number
- `GET /api/exhibitors/hall/:hallNumber` - Get exhibitors by hall (admin protected)
- `GET /api/exhibitors/stats/overview` - Get exhibitor statistics (admin protected)

## Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3** - Modern styling with gradients and animations

## Design Features

- **Glassmorphism UI** - Modern frosted glass effect
- **Gradient Backgrounds** - Beautiful color transitions
- **Smooth Animations** - Fade-in and hover effects
- **Responsive Design** - Mobile-first approach
- **Accessibility** - Proper form labels and keyboard navigation

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  timestamps: true
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.