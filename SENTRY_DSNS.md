# Sentry DSNs Reference

This file contains both frontend and backend Sentry DSNs for easy reference.

## Frontend Sentry DSN
**File:** `frontend/.env.local`
```
NEXT_PUBLIC_SENTRY_DSN=https://5778093c96824eefaa5fda7f93dbbed8@o4510727256997888.ingest.us.sentry.io/4510727920877568
NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0.1
NEXT_PUBLIC_SENTRY_TRACE_PROPAGATION_TARGETS=http://localhost:8000
SENTRY_ORG=torrey-liu
SENTRY_PROJECT=speaklabs-frontend
```

## Backend Sentry DSN
**File:** `backend/.env`
```
SENTRY_DSN=https://23c9889f0be45aa954f1b463cc51ac29@o4510727256997888.ingest.us.sentry.io/4510728544518144
SENTRY_TRACES_SAMPLE_RATE=0.1
SENTRY_PROFILES_SAMPLE_RATE=0.1
```

## Note
Each application loads from its own `.env` file:
- **Frontend** automatically loads `frontend/.env.local` (Next.js convention)
- **Backend** loads `backend/.env` via `load_dotenv()` (Python convention)

This separation is recommended for:
- ✅ Security (each app only sees its own config)
- ✅ Clarity (clear separation of concerns)
- ✅ Standard practice (follows framework conventions)
