# Task Manager App 📝

A full-stack task management application built with Django REST API and React.

## Features
- ✅ Add, complete, and delete tasks
- ✅ Pending and completed task tracking
- ✅ REST API backend with Django
- ✅ Modern React frontend with Vite

## Tech Stack
**Backend:** Python, Django, Django REST Framework
**Frontend:** React, Vite, Axios
**Database:** SQLite

## How to Run

### Backend
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/tasks/ | Get all tasks |
| POST | /api/tasks/ | Create new task |
| PATCH | /api/tasks/{id}/toggle_status/ | Toggle task status |
| DELETE | /api/tasks/{id}/ | Delete task |

## Built By
Shakil Ahmed Shawon — Full Stack Developer
