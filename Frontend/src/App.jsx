import './App.css'
import {BrowserRouter as Router, Routes, Route, BrowserRouter} from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AuthRequired from './components/AuthRequired'
import AdminRequired from './components/AdminRequired'
import CourseManagement from './pages/admin/CourseManagement'
import AddEditCourseForm from './pages/admin/CourseManagement/AddEditCourseForm'
import StudentManagement from './pages/admin/StudentManagement'
import AddEditStudentForm from './pages/admin/StudentManagement/AddEditStudentForm'
import EnrollmentManagemnnet from './pages/admin/EnrollmentManagement'
import AddEditEnrollmentForm from './pages/admin/EnrollmentManagement/AddEditEnrollmentForm'
import AdminDashboard from './pages/admin/AdminDashboard'
import StudentRequired from './components/StudentRequired'
import CourseList from './pages/student/CourseList'
import ProfileManagement from './pages/student/ProfileManagement'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='about' element={<About />} />
          <Route path='contact' element={<Contact />} />
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<Signup />} />
          <Route element={<AuthRequired />}>
            <Route path='admin' element={<AdminRequired />}>
              <Route index element={<AdminDashboard />} />
              <Route path='courses' element={<CourseManagement />}>
                <Route index element={<AddEditCourseForm />} />
                <Route path=':id' element={<AddEditCourseForm />} />
              </Route> 
              <Route path='students' element={<StudentManagement />}>
                <Route index element={<AddEditStudentForm />} />
                <Route path=':id' element={<AddEditStudentForm />} />      
              </Route>
              <Route path='enrollments' element={<EnrollmentManagemnnet />}>
                <Route index element={<AddEditEnrollmentForm />} />
                <Route path=':id' element={<AddEditEnrollmentForm />} />
              </Route>
            </Route>
            <Route path='student' element={<StudentRequired />}>
              <Route index element={<h1>Student Dashboard</h1>} />
              <Route path='courses' element={<CourseList />} />
              <Route path='profile' element={<ProfileManagement />} />
            </Route>
          </Route>
          <Route path='*' element={<h1>Page not found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
