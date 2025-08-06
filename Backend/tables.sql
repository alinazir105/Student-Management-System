-- users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'student')) NOT NULL
);

-- courses table
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- enrollments table
CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from users;

-- Insert Admins
INSERT INTO users (name, email, password, role)
VALUES 
  ('Admin One', 'admin1@example.com', 'hashed_password1', 'admin'),
  ('Admin Two', 'admin2@example.com', 'hashed_password2', 'admin');

-- Insert Students
INSERT INTO users (name, email, password, role)
VALUES 
  ('Student One', 'student1@example.com', 'hashed_password3', 'student'),
  ('Student Two', 'student2@example.com', 'hashed_password4', 'student'),
  ('Student Three', 'student3@example.com', 'hashed_password5', 'student');

-- Insert Courses
INSERT INTO courses (title, description)
VALUES 
  ('Intro to Programming', 'Learn the basics of programming'),
  ('Database Systems', 'Understand relational databases and SQL'),
  ('Web Development', 'Build modern web apps with HTML, CSS, JS');

-- Insert Enrollments
INSERT INTO enrollments (student_id, course_id)
VALUES 
  (3, 1),  -- Student One enrolled in Intro to Programming
  (4, 2);  -- Student Two enrolled in Database Systems


select * from courses;