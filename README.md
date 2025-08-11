# Pakistani College Admission Management System - Frontend

A modern Next.js frontend for the Pakistani College Admission Management System with role-based access control and comprehensive student profile management.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (6 roles)
- Automatic token refresh
- Protected routes

### 👨‍🎓 Student Features
- Complete profile management (Personal, Contact, Educational, Medical)
- Application submission and tracking
- Payment processing
- Document uploads
- Application status monitoring

### 👨‍💼 Staff Features
- Application review and approval
- Payment verification
- Statistics and reports
- Program management
- Announcement system

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Form validation with React Hook Form
- Real-time notifications
- Loading states and error handling

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on http://localhost:8000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── profile/           # Profile management
│   ├── applications/      # Application pages
│   └── payments/          # Payment pages
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and services
│   ├── api.ts           # Axios configuration
│   ├── auth.ts          # Authentication service
│   └── services.ts      # API services
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## User Roles & Access

### Student/Applicant (`applicant`)
- Register and manage profile
- Submit applications
- Make payments
- Track application status

### Principal/Admin (`admin`)
- Full system access
- Manage all users and programs
- View all reports

### Admission Officer (`admission_officer`)
- Manage programs and sessions
- Review applications
- View statistics

### Application Reviewer (`reviewer`)
- Review applications
- Update application status

### Accountant (`accountant`)
- Manage fee structures
- Verify payments

### Data Entry Operator (`data_entry`)
- Add/edit lookup data
- Basic data management

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Student | student@example.com | student123 |
| Admin | admin@college.edu | admin123 |
| Admission Officer | admission@college.edu | admission123 |
| Accountant | accountant@college.edu | account123 |
| Reviewer | reviewer@college.edu | review123 |

## API Integration

The frontend integrates with the Django REST API backend:

- **Base URL**: `http://localhost:8000/api/v1/`
- **Authentication**: JWT tokens with automatic refresh
- **File Uploads**: Multipart form data for documents
- **Error Handling**: Comprehensive error responses

## Key Features Implementation

### Authentication Flow
1. User logs in → JWT tokens stored in cookies
2. API requests include Bearer token
3. Automatic token refresh on expiry
4. Logout clears tokens and redirects

### Profile Management
- Multi-step profile completion
- File upload for documents (CNIC, certificates)
- Form validation and error handling
- Progress tracking

### Application Process
1. Complete profile (required)
2. Select program and session
3. Submit application
4. Pay application fee
5. Track status updates

### Payment System
- Multiple payment methods
- Receipt upload
- Payment verification by staff
- Payment history tracking

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Tailwind CSS for styling

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.