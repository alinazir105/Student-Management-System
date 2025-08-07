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
import StudentsTable from './pages/admin/StudentManagement/StudentsTable'
import AddEditStudentForm from './pages/admin/StudentManagement/AddEditStudentForm'

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
              <Route index element={<h1>Admin Dashboard</h1>} />
              <Route path='courses' element={<CourseManagement />}>
                <Route index element={<AddEditCourseForm />} />
                <Route path=':id' element={<AddEditCourseForm />} />
              </Route> 
              <Route path='students' element={<StudentManagement />}>
                <Route index element={<AddEditStudentForm />} />
                <Route path=':id' element={<AddEditStudentForm />} />      
              </Route>
            </Route>
            <Route path='student' element={<h1>Student Dashboard</h1>} />
          </Route>
          <Route path='*' element={<h1>Page not found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
