# Smart Time Table Management System

A complete MERN stack BCA project with JWT login, role-based access, timetable clash detection, auto timetable generation, attendance, reports and teacher substitution.

## Tech Stack

- Frontend: React.js + Vite + Axios
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Authentication: JWT

## Folder Structure

```text
client/
server/
```

## Windows 11 Setup

Open PowerShell in the project folder:

```powershell
cd C:\Users\LENOVO\Documents\Codex\2026-05-01\you-are-an-expert-full-stack
```

Install backend packages:

```powershell
cd server
npm install
```

Create backend environment file:

```powershell
copy .env.example .env
```

Install frontend packages:

```powershell
cd ..\client
npm install
```

Start MongoDB on Windows. If MongoDB is installed as a service, open Services and start `MongoDB Server`, or run:

```powershell
net start MongoDB
```

Seed dummy data:

```powershell
cd ..\server
npm run seed
```

Run backend:

```powershell
npm run dev
```

Open a second PowerShell window and run frontend:

```powershell
cd C:\Users\LENOVO\Documents\Codex\2026-05-01\you-are-an-expert-full-stack\client
npm run dev
```

Open the shown Vite URL, usually:

```text
http://127.0.0.1:5173
```

## Dummy Logins

All seeded users use password:

```text
123456
```

Accounts:

```text
Admin:   admin@bca.com
Teacher: amit@bca.com
Student: student1@bca.com
```

## Main Features

- Admin can add classes and subjects.
- Admin can create timetable entries manually.
- Clash detection prevents:
  - Same teacher in multiple classes at the same day/time.
  - Same class having multiple subjects at the same day/time.
- Admin can auto-generate timetable by selecting classes, subjects, days and time slots.
- Teacher can mark attendance for a class and subject.
- Admin/teacher can generate attendance report.
- Admin can assign substitute teachers.
- Timetable page shows substitute teacher when a matching substitution exists for the selected date.

## Example API Requests

Login:

```powershell
curl.exe -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@bca.com\",\"password\":\"123456\"}"
```

Create class:

```powershell
curl.exe -X POST http://localhost:5000/api/classes -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d "{\"className\":\"BCA 3rd Year\"}"
```

Create manual timetable entry:

```powershell
curl.exe -X POST http://localhost:5000/api/timetable -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d "{\"classId\":\"CLASS_ID\",\"subjectId\":\"SUBJECT_ID\",\"teacherId\":\"TEACHER_ID\",\"day\":\"Monday\",\"timeSlot\":\"09:00-10:00\"}"
```

Auto-generate timetable:

```powershell
curl.exe -X POST http://localhost:5000/api/timetable/auto-generate -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d "{\"classIds\":[\"CLASS_ID\"],\"subjectIds\":[\"SUBJECT_ID_1\",\"SUBJECT_ID_2\"],\"days\":[\"Monday\",\"Tuesday\"],\"timeSlots\":[\"09:00-10:00\",\"10:00-11:00\"],\"clearExisting\":true}"
```

Attendance report:

```powershell
curl.exe http://localhost:5000/api/attendance/report -H "Authorization: Bearer YOUR_TOKEN"
```

## How To Test

1. Run MongoDB, backend and frontend.
2. Login as admin using `admin@bca.com`.
3. Go to Dashboard and confirm total classes, teachers and subjects.
4. Go to Admin Panel and try adding a timetable entry at an already occupied class/time. You should see a clash error.
5. Try assigning the same teacher to another class at the same day/time. You should see a teacher clash error.
6. Use Auto Timetable Generator with one or more classes, subjects and slots.
7. Login as teacher using `amit@bca.com`, open Attendance, select a class and mark students.
8. Open Report to see total marked students, present, absent and percentage.
9. Login as admin, create a substitution, then open Timetable for that date to see the substitute teacher badge.
