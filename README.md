# Gym Class Scheduling and Membership Management System

A comprehensive backend system for managing gym operations with role-based access control, class scheduling, and membership management.

## 🚀 Features

- **Role-based Authentication**: Admin, Trainer, and Trainee roles with JWT authentication
- **Class Scheduling**: Admins can schedule up to 5 classes per day (2 hours each)
- **Booking System**: Trainees can book classes with capacity limits (max 10 per class)
- **Business Rules Enforcement**: Prevents double bookings and scheduling conflicts
- **Comprehensive Error Handling**: Global error handling with detailed error responses
- **Data Validation**: Zod schema validation for all endpoints
- **Modular Architecture**: Clean, maintainable code structure

## 🛠 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
src/
├── config/
│   └── database.ts 
├── modules/
│   ├── auth/               # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.routes.ts
│   │   └── auth.validation.ts
│   ├── users/              # User management module
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.routes.ts
│   │   └── user.validation.ts
│   ├── classes/            # Class scheduling module
│   │   ├── class.controller.ts
│   │   ├── class.service.ts
│   │   ├── class.routes.ts
│   │   └── class.validation.ts
│   └── bookings/           # Booking management module
│       ├── booking.controller.ts
│       ├── booking.service.ts
│       ├── booking.routes.ts
│       └── booking.validation.ts
├── shared/
│   ├── middleware/         # Global middleware
│   │   ├── auth.ts
│   │   ├── globalErrorHandler.ts
│   │   ├── notFoundHandler.ts
│   │   └── validation.ts
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   └── utils/             # Utility functions
│       ├── jwt.ts
│       └── response.ts
├── scripts/               # Database scripts
│   ├── seed-data.ts
│   └── seed-database.sql
└── server.ts             # Application entry point
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v4.2+ with replica set)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rana-arju/gym-management.git
   cd gym-management
   ```

2. **Install dependencies**
   ```
    yarn install
   ```

3. **Environment Setup**
   ```bash
    .env
  Update the `.env` file with your configuration:

```env
   DATABASE_URL="mongodb://localhost:27017/gym_management"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="7d"
   PORT=5000
   NODE_ENV="development"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   yarn run db:generate
   
   # Build
   yarn build
   
   ```

5. **Start the server**
   ```bash
   # Development mode
   yarn dev
   
   # Production mode
   yarn build
   yarn start
   ```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "TRAINEE", // Optional: ADMIN, TRAINER, TRAINEE
  "phone": "+1234567890",
  "address": "123 Main St"
}
