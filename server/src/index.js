require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
// Robust CORS: allow configured origin and localhost for dev
const allowedOrigins = [
	process.env.CLIENT_URL,
	'http://localhost:5173',
	'http://localhost:5174',
].filter(Boolean);

app.use(cors({
	origin: (origin, callback) => {
		// Non-browser requests may have no origin
		if (!origin || allowedOrigins.includes(origin)) {
			return callback(null, true);
		}
		return callback(new Error('Not allowed by CORS'));
	},
	credentials: true
}));
app.use(express.json());

connectDB();

// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check / root route
app.get('/', (req, res) => {
  res.json({ message: 'Edureach API Server', status: 'running' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tutors', require('./routes/tutors'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/student', require('./routes/student'));
// user routes (student helpers)
app.use('/api/users', require('./routes/users'));

const PORT = parseInt(process.env.PORT, 10) || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.on('error', (err) => {
	if (err.code === 'EADDRINUSE') {
		const alt = PORT + 1;
		console.warn(`Port ${PORT} in use, trying ${alt}`);
		app.listen(alt, () => console.log(`Server running on port ${alt}`));
	} else {
		console.error('Server error:', err);
		process.exit(1);
	}
});

