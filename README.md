# 🎓 Edureach - Online Learning Platform

A full-stack educational platform connecting tutors and students with real-time course management, attendance tracking, assignments, and discussions.

## ✨ Features

### 👨‍🏫 For Tutors
- Create and manage courses with syllabus
- Upload notes and assignments
- Track student attendance (real-time marking)
- Post announcements
- Grade student submissions
- Monitor student progress

### 👨‍🎓 For Students
- Browse and enroll in courses
- Access course materials and notes
- Submit assignments
- Mark attendance when sessions are open
- View progress tracking
- Participate in course discussions
- Receive announcements

### 🔐 Authentication
- Powered by Clerk for secure authentication
- Role-based access (Student, Tutor, Admin)
- Session management

## 🛠️ Tech Stack

### Frontend
- **React** (Vite)
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Clerk React** for authentication
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **Clerk Express** for auth middleware
- **JWT** for token management
- **Multer** for file uploads

## 📁 Project Structure

```
Edureach/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── layouts/       # Layout wrappers
│   │   └── App.jsx        # Main app component
│   ├── .env.local         # Frontend environment variables
│   └── package.json
│
├── server/                # Backend Node.js API
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── models/        # MongoDB schemas
│   │   ├── config/        # Configuration files
│   │   └── index.js       # Server entry point
│   ├── uploads/           # File upload storage
│   ├── .env               # Backend environment variables
│   └── package.json
│
└── DEPLOYMENT.md          # Deployment guide
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Clerk account

### 1. Clone the Repository
```bash
git clone https://github.com/kipkoec77/Edureach.git
cd Edureach
```

### 2. Backend Setup

```bash
cd server
npm install

# Copy environment template and configure
cp .env.example .env
# Edit .env with your values
```

**Required environment variables** (`.env`):
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/Edureach
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
CLIENT_URL=http://localhost:5173

CLERK_SECRET_KEY=sk_test_your_key_here
CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_API_KEY=sk_test_your_key_here
```

Start the server:
```bash
npm start
```

### 3. Frontend Setup

```bash
cd client
npm install

# Copy environment template and configure
cp .env.example .env.local
# Edit .env.local with your values
```

**Required environment variables** (`.env.local`):
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

### 4. Clerk Configuration

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy your keys to the `.env` files
4. Set up allowed origins:
   - `http://localhost:5173` (frontend)
   - `http://localhost:5000` (backend)
5. Configure redirect URLs for sign-in/sign-up

## 📱 Responsive Design

The platform is fully responsive with:
- Mobile-first design approach
- Hamburger menu for mobile navigation
- Adaptive grids and layouts
- Touch-friendly UI elements

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to:
- **Backend**: Render
- **Frontend**: Vercel

Quick deployment:
```bash
# Frontend (from client/ directory)
vercel --prod

# Backend (connect GitHub to Render)
# See DEPLOYMENT.md for step-by-step guide
```

## 📚 API Endpoints

### Courses
- `GET /api/courses` - List all courses
- `POST /api/courses` - Create course (Tutor)
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `POST /api/courses/:id/enroll` - Enroll in course (Student)

### Student
- `GET /api/student/courses` - Get enrolled courses
- `GET /api/student/assignments` - Get assignments
- `GET /api/student/notes` - Get course notes
- `GET /api/student/attendance` - Get attendance records
- `GET /api/student/progress` - Get progress stats

### Attendance
- `POST /api/attendance/create/:courseId` - Create session (Tutor)
- `POST /api/attendance/mark/:attendanceId` - Mark present (Student)
- `GET /api/attendance/course/:courseId` - Get course attendance
- `PATCH /api/attendance/close/:attendanceId` - Close session (Tutor)

### Submissions
- `POST /api/submissions/:courseId/:assignmentId` - Submit assignment
- `GET /api/submissions/:courseId/:assignmentId/me` - Get my submission
- `PATCH /api/submissions/:id/grade` - Grade submission (Tutor)

## 🔒 Security

- Environment variables for sensitive data
- Clerk authentication with secure sessions
- JWT tokens for API authorization
- CORS configured for allowed origins
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Kipkoec77** - [GitHub](https://github.com/kipkoec77)

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Review [Clerk Docs](https://clerk.com/docs) for auth issues

## 🎯 Roadmap

- [ ] Video conferencing integration
- [ ] Quiz/test functionality
- [ ] Certificate generation
- [ ] Payment integration
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard

---

Built with ❤️ for education

