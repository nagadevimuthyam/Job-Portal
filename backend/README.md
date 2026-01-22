# Backend Setup (Django + DRF)

## Prerequisites
- Python 3.11+
- PostgreSQL (optional, SQLite works for dev)

## Setup
```
python -m venv venv
# activate venv
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py seed_master_admin
python manage.py runserver
```

## API Endpoints
Auth:
- POST /api/auth/login/
- GET /api/auth/me/
- POST /api/auth/refresh/

Master Admin:
- GET /api/master/dashboard/
- GET/POST /api/master/organizations/
- GET/POST /api/master/employers/

Employer:
- GET /api/employer/candidates/
- GET /api/employer/candidates/{id}/

Candidate:
- POST /api/candidate/register/
- GET/PUT /api/candidate/profile/

Docs:
- /api/docs/

## Roles
- MASTER_ADMIN: full access to /api/master/* endpoints
- EMPLOYER: access to /api/employer/* endpoints
- CANDIDATE: access to /api/candidate/* endpoints

## Tenant Isolation
- In this stage, employers can search across all candidates globally.

## Notes
- The master admin is seeded using env vars: MASTER_ADMIN_EMAIL, MASTER_ADMIN_PASSWORD, MASTER_ADMIN_NAME
- Organization name and code are validated for uniqueness
- Total Candidates in the master dashboard is the count of all candidate profiles
