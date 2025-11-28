# 🎓 EduReach - Online Learning Platform

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
- JWT-based authentication (access + refresh tokens)
- Role-based access (Student, Tutor, Admin)
- Sessions handled via HTTP Authorization headers; tokens stored client-side

#### Tutor Accounts Policy
- Tutor accounts are created by the Admin.
- Credentials and account details are generated and shared securely with tutors.
- Tutors should change their password on first login and keep credentials confidential.

## 🛠️ Tech Stack

### Frontend
- **React** (Vite)
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
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
 

### 1. Clone the Repository
```bash
git clone https://github.com/kipkoec77/Edureach.git
cd Edureach
```

### 2. Backend Setup

```bash
cd server
npm install

# Create and configure `.env`
# Edit `.env` with your values
```

**Required environment variables** (`server/.env`):
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/Edureach
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
CLIENT_URL=http://localhost:5173
```

Start the server:
```bash
npm start
```

### 3. Frontend Setup

```bash
cd client
npm install

# Create and configure `.env.local`
# Edit `.env.local` with your values
```

**Required environment variables** (`client/.env.local`):
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

### 4. Configuration Notes

- Ensure CORS allows your frontend origin (no trailing slash):
   - `http://localhost:5173` (local)
   - Your Vercel domain in production
- Set `CLIENT_URL` on the server to the frontend origin.
- Set `VITE_API_URL` on the client to point to your backend `/api` base.

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

