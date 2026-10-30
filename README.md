# Student Assignment Manager

A full-stack web application that helps students manage their academic assignments. Students can create, view, edit, delete, and track assignments, including their deadlines and completion status.

## Features

- User registration
- User login and logout
- Create new assignments
- View all assignments
- Edit existing assignments
- Delete assignments
- Update assignment status
- Track assignment priorities
- View assignment statistics through a dashboard
- User-specific assignments

## Technologies Used

### Frontend
- React.js
- JavaScript
- CSS
- Vite

### Backend
- Python
- Django
- Django REST Framework

### Database
- MySQL

## Project Structure

```text
student-assignment/
│
├── backend/
│   ├── config/
│   ├── assignments/
│   └── manage.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .gitignore
└── README.md
```

## Getting Started

Follow these instructions to run the project on your computer.

### 1. Clone the Repository

```bash
https://github.com/mwendwak439/student-assignment-manager.git

```

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Create and activate a virtual environment, then install the required packages:

```bash
python -m venv venv
venv\Scripts\activate
pip install django djangorestframework django-cors-headers mysqlclient
```

Configure your MySQL database and environment variables.

Run migrations:

```bash
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

## Application Screenshots

Screenshots of the application can be added here.

## Future Improvements

- Search assignments by title
- Filter assignments by unit and status
- Sort assignments by due date
- Add assignment reminders
- Improve dashboard analytics

## Author

Developed as a personal full-stack web development project to improve my practical skills in React, Django, and MySQL.

## License

This project is open-source and available for learning and educational purposes.
