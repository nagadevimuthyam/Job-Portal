# Frontend Setup (React + Vite)

## Prerequisites
- Node 18+

## Setup
```
npm install
cp .env.example .env
npm run dev
```

## Portals & Routes
Candidate (Public):
- /
- /candidate/login
- /candidate/register
- /candidate/dashboard

Master Admin:
- /master/login
- /master/dashboard
- /master/create-client
- /master/organizations
- /master/employers
- /master/profile

Employer:
- /employer/login
- /employer/search
- /employer/candidates/:id

## Notes
- API base URL is configured via VITE_API_BASE_URL
- Access is restricted by role-based guards in routes
- Premium toast notifications use sonner
