# Deployment Guide

## Complete System Flow

### 1. Data Entry Operator Setup
- Login with `data_entry` role
- Navigate to `/setup`
- Add degrees and institutes
- System is now ready for student registrations

### 2. Student Registration & Application Flow
1. **Registration**: Student visits `/auth/register`
2. **Onboarding**: Redirected to `/onboarding` to complete profile
3. **Profile Completion**:
   - Personal Information (`/profile/personal`)
   - Contact Information (`/profile/contact`) 
   - Educational Background (`/profile/education`)
   - Medical Information (`/profile/medical`)
4. **Application Submission**: Navigate to `/applications` and submit
5. **Payment**: Make payment for application fee
6. **Tracking**: Monitor application status

### 3. Staff Review Process
1. **Admission Officer/Reviewer**: Login and go to `/review`
2. **Review Applications**: Select application and update status
3. **Accountant**: Verify payments in `/payments`
4. **Admin**: Monitor everything in `/admin` dashboard

### 4. Complete API Integration
- All backend APIs are integrated
- Role-based access control implemented
- File uploads for documents
- Real-time status tracking
- Payment processing workflow

## Environment Setup

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend (ensure running on localhost:8000)
cd backend
python manage.py runserver
```

## Test Flow

1. **Setup Data** (as data_entry user)
2. **Register Student** (new user)
3. **Complete Profile** (student)
4. **Submit Application** (student)
5. **Review Application** (staff)
6. **Process Payment** (student/accountant)
7. **Track Status** (student)

The system now provides complete admission management from data entry to application approval with proper role-based workflows.