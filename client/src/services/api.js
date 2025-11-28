import axios from 'axios'

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
export const API_ORIGIN = API_BASE.replace(/\/+api\/?$/, '')

const API = axios.create({ 
  baseURL: API_BASE,
  withCredentials: true
})

// Interceptor to attach JWT token
API.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
})

// Response interceptor to handle 401
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response && err.response.status === 401) {
      // Try to refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE}/auth/refresh-token`, { refreshToken });
          localStorage.setItem('accessToken', res.data.accessToken);
          // Retry original request
          err.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return axios(err.config);
        } catch (refreshErr) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
)

export default API

// Student-specific helpers
export async function getEnrolledCourses(userId){
  const res = await API.get(`/users/${userId}/enrolled-courses`)
  return res.data || []
}

export async function getAnnouncements(userId){
  const res = await API.get(`/users/${userId}/announcements`)
  return res.data || []
}

export async function getAttendance(userId){
  const res = await API.get(`/users/${userId}/attendance`)
  return res.data || []
}

export async function enrollCourse(courseId){
  const res = await API.post(`/courses/${courseId}/enroll`)
  return res.data
}

// Assignment submission APIs
export async function submitAssignment(courseId, assignmentId, file, onProgress){
  const fd = new FormData();
  fd.append('file', file);
  const res = await API.post(`/submissions/${courseId}/${assignmentId}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (!progressEvent.total) return
      const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      try { onProgress && onProgress(pct) } catch(e){ }
    }
  });
  return res.data
}

export async function getMySubmission(courseId, assignmentId){
  const res = await API.get(`/submissions/${courseId}/${assignmentId}/me`);
  return res.data
}

export async function listSubmissions(courseId, assignmentId){
  const res = await API.get(`/submissions/${courseId}/${assignmentId}`);
  return res.data
}

export async function gradeSubmission(submissionId, { grade, feedback }){
  const res = await API.patch(`/submissions/${submissionId}/grade`, { grade, feedback });
  return res.data
}

// Student dashboard APIs
export async function getStudentCourses(){
  const res = await API.get('/student/courses');
  return res.data
}

export async function getStudentAssignments(){
  const res = await API.get('/student/assignments');
  return res.data
}

export async function getStudentNotes(){
  const res = await API.get('/student/notes');
  return res.data
}

export async function getStudentAttendance(){
  const res = await API.get('/student/attendance');
  return res.data
}

export async function getStudentProgress(){
  const res = await API.get('/student/progress');
  return res.data
}

// Attendance APIs
export async function createAttendance(courseId){
  const res = await API.post(`/attendance/create/${courseId}`);
  return res.data
}

export async function markAttendance(attendanceId){
  const res = await API.post(`/attendance/mark/${attendanceId}`);
  return res.data
}

export async function getCourseAttendance(courseId){
  const res = await API.get(`/attendance/course/${courseId}`);
  return res.data
}

export async function closeAttendance(attendanceId){
  const res = await API.patch(`/attendance/close/${attendanceId}`);
  return res.data
}

// Course management APIs
export async function deleteCourse(courseId){
  const res = await API.delete(`/courses/${courseId}`);
  return res.data
}

export async function updateCourse(courseId, data){
  const res = await API.put(`/courses/${courseId}`, data);
  return res.data
}

export async function uploadNote(courseId, file){
  const fd = new FormData();
  fd.append('file', file);
  const res = await API.post(`/courses/${courseId}/upload-note`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data
}

export async function uploadAssignment(courseId, { file, title, description, dueDate }){
  const fd = new FormData();
  fd.append('file', file);
  fd.append('title', title);
  if (description) fd.append('description', description);
  if (dueDate) fd.append('dueDate', dueDate);
  const res = await API.post(`/courses/${courseId}/upload-assignment`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data
}

// ===== ANNOUNCEMENTS API =====
export const createAnnouncement = async (courseId, title, message) => {
  const res = await API.post(`/courses/${courseId}/announcements`, { title, message });
  return res.data;
}

export const updateAnnouncement = async (courseId, announcementId, title, message) => {
  const res = await API.put(`/courses/${courseId}/announcements/${announcementId}`, { title, message });
  return res.data;
}

export const deleteAnnouncement = async (courseId, announcementId) => {
  const res = await API.delete(`/courses/${courseId}/announcements/${announcementId}`);
  return res.data;
}

// ===== DISCUSSIONS API =====
export async function getCourseDiscussions(courseId){
  const res = await API.get(`/courses/${courseId}/discussions`)
  return res.data
}

export async function postCourseDiscussion(courseId, message){
  const res = await API.post(`/courses/${courseId}/discussions`, { message })
  return res.data
}
