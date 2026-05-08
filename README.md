This project is a backend system for managing tasks, assignments, and workflows. It is inspired by issue-tracking tools like Jira and is built using Django and Django REST Framework.
The system allows users to create tasks, assign them, update their status, and filter them based on different criteria. It is designed to be simple, extensible, and ready for future AI-based enhancements.
Tech Stack
Python
Django
Django REST Framework
SQLite (default database)
## Prerequisites
Before running this project, make sure you have the following installed:
1. Python (version 3.8 or higher)
   Check with:
   ```bash
   python --version
   ```
2. pip (Python package manager)
   Usually comes with Python:
   ```bash
   pip --version
   ```
3. Git
   Check with:
   ```bash
   git --version
   ```
---
## Installation
### Step 1: Clone the repository
```bash
git clone https://github.com/your-username/workflow-management-system.git
cd workflow-management-system
```
### Step 2: Create a virtual environment
```bash
python -m venv env
```
### Step 3: Activate the virtual environment
On macOS/Linux:
```bash
source env/bin/activate
```
On Windows:
```bash
env\Scripts\activate
```
### Step 4: Install dependencies
```bash
pip install -r requirements.txt
```
If `requirements.txt` is not present, install manually:
```bash
pip install django djangorestframework
```
## Database Setup

### Step 5: Apply migrations
```bash
python manage.py makemigrations
python manage.py migrate
```
### Step 6: Create a superuser (for admin access)

```bash
python manage.py createsuperuser
```

Follow the prompts to set username, email, and password.

## Running the Project

### Step 7: Start the development server

```bash
python manage.py runserver
```

## API Endpoints

### Tasks

* GET `/tasks/`
  Returns tasks assigned to the logged-in user

* POST `/tasks/`
  Creates a new task

* PUT `/tasks/<id>/`
  Updates a task

* DELETE `/tasks/<id>/`
  Deletes a task

## Authentication

This project uses Django authentication.

To access protected endpoints:

1. Log in via Django admin:

   ```
   http://127.0.0.1:8000/admin/
   ```

2. Or use an API tool like Postman with authentication enabled.
