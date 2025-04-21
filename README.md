# Patient Data Analysis System

A comprehensive hospital management system for handling patient data, medical records, appointments, and billing.

## Features

- Role-based access control (Admin, Doctor, Patient)
- Patient portal for viewing medical records and appointments
- Doctor portal for managing patients and prescriptions
- Admin portal for managing hospital operations
- Secure authentication system
- Appointment scheduling
- Medical history tracking
- Billing management

## Tech Stack

- Frontend: React.js
- Backend: FastAPI (Python)
- Database: MySQL
- Authentication: JWT

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 14+
- MySQL 8.0+
- MySQL Workbench

### Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
- Copy `.env.example` to `.env`
- Update the database credentials and secret key

4. Initialize the database:
```bash
python -m backend.db.init_db
```

5. Run the backend server:
```bash
uvicorn backend.app:app --reload
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

## API Documentation

Once the backend server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Database Schema

The system uses the following main tables:
- users
- patients
- doctors
- appointments
- medical_history
- prescriptions
- reports
- billing

## Security

- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Role-based access control for all endpoints
- CORS protection enabled

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 