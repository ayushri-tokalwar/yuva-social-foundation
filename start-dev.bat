@echo off
echo ===================================================
echo  Starting Yuva Social Foundation Full-Stack Servers
echo ===================================================
echo Backend API : http://localhost:8000
echo Frontend UI : http://localhost:5173
echo.
start "YSF Backend (Django 8000)" cmd /k "cd backend && ..\venv\Scripts\activate && python manage.py runserver"
start "YSF Frontend (Vite 5173)" cmd /k "cd frontend && npm run dev"
