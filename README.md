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

## Login Credentials

📋 Sample Login Credentials:

```
Admin:
Email: admin@gym.com
Pass: admin123
```

```
Trainer:
Email: trainer1@gym.com
Pass: trainer123
```

```
Trainee:
Email: trainee1@gym.com
Pass:trainee123
```

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
   ```

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

````http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Admin vai",
  "email": "admin@gym.com",
  "password": "admin123",
  "role": "TRAINEE", // Optional: ADMIN, TRAINER, TRAINEE
  "phone": "+1234567890",
  "address": "123 Main St"
}
````
**Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "TRAINEE",
      "phone": "+1234567890",
      "address": "123 Main St, City, State",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
#### Login User

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@gym.com",
  "password": "admin123",
}
````
**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "Admin User",
      "email": "admin@gym.com",
      "role": "ADMIN",
      "phone": "+1234567890",
      "address": "123 Admin Street, City, State"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 👥 User Management Endpoints

### 3. Get My Profile

**API Endpoint:** `GET /api/v1/users/profile`

**Headers:**
```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "TRAINEE",
    "phone": "+1234567890",
    "address": "123 Main St, City, State",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Update My Profile

**API Endpoint:** `PUT /api/v1/users/profile`

**Headers:**
```
Authorization:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:**
```json
{
  "name": "John Updated",
  "phone": "+1234567899",
  "address": "456 New Address, City, State"
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile updated successfully",
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Updated",
    "email": "john@example.com",
    "role": "TRAINEE",
    "phone": "+1234567899",
    "address": "456 New Address, City, State",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  }
}
```

### 5. Create Trainer (Admin Only)

**API Endpoint:** `POST /api/v1/users/trainers`

**Headers:**
```
Authorization:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:**
```json
{
  "name": "Jane Trainer",
  "email": "jane.trainer@gym.com",
  "password": "trainer123",
  "phone": "+1234567891",
  "address": "789 Trainer Ave, City, State"
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Trainer created successfully",
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b4",
    "name": "Jane Trainer",
    "email": "jane.trainer@gym.com",
    "role": "TRAINER",
    "phone": "+1234567891",
    "address": "789 Trainer Ave, City, State",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 6. Get All Users (Admin Only)

**API Endpoint:** `GET /api/v1/users?page=1&limit=10&role=TRAINER`

**Headers:**
```
Authorization:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users retrieved successfully",
  "data": {
    "data": [
      {
        "id": "60f7b3b3b3b3b3b3b3b3b3b4",
        "name": "Jane Trainer",
        "email": "jane.trainer@gym.com",
        "role": "TRAINER",
        "phone": "+1234567891",
        "address": "789 Trainer Ave, City, State",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### 7. Get User by ID (Admin Only)

**API Endpoint:** `GET /api/v1/users/60f7b3b3b3b3b3b3b3b3b3b4`

**Headers:**
```
Authorization:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User retrieved successfully",
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b4",
    "name": "Jane Trainer",
    "email": "jane.trainer@gym.com",
    "role": "TRAINER",
    "phone": "+1234567891",
    "address": "789 Trainer Ave, City, State",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 8. Update User (Admin Only)

**API Endpoint:** `PUT /api/v1/users/60f7b3b3b3b3b3b3b3b3b3b4`

**Headers:**
```
Authorization:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:**
```json
{
  "name": "Jane Updated Trainer",
  "phone": "+1234567899"
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User updated successfully",
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b4",
    "name": "Jane Updated Trainer",
    "email": "jane.trainer@gym.com",
    "role": "TRAINER",
    "phone": "+1234567899",
    "address": "789 Trainer Ave, City, State",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  }
}
```

### 9. Delete User (Admin Only)

**API Endpoint:** `DELETE /api/v1/users/60f7b3b3b3b3b3b3b3b3b3b4`

**Headers:**
```
Authorization:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User deleted successfully"
}
```

### 10. Get Trainer Schedule

**API Endpoint:** `GET /api/v1/users/60f7b3b3b3b3b3b3b3b3b3b4/schedule?page=1&limit=10`

**Headers:**
```
Authorization:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Trainer schedule retrieved successfully",
  "data": {
    "data": [
      {
        "id": "60f7b3b3b3b3b3b3b3b3b3b5",
        "title": "Morning Yoga",
        "description": "Relaxing yoga session",
        "date": "2024-01-16T00:00:00.000Z",
        "startTime": "2024-01-16T09:00:00.000Z",
        "endTime": "2024-01-16T11:00:00.000Z",
        "maxTrainees": 10,
        "trainerId": "60f7b3b3b3b3b3b3b3b3b3b4",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "_count": {
          "bookings": 3
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

---

## 🏋️ Class Management Endpoints

### 11. Create Class Schedule (Admin Only)

**API Endpoint:** `POST /api/v1/classes`

**Headers:**
```
Authorization:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:**
```json
{
  "title": "High-Intensity Interval Training",
  "description": "Burn calories with this intense workout",
  "date": "2024-01-16T00:00:00.000Z",
  "startTime": "2024-01-16T14:00:00.000Z",
  "endTime": "2024-01-16T16:00:00.000Z",
  "trainerId": "60f7b3b3b3b3b3b3b3b3b3b4",
  "maxTrainees": 10
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Class scheduled successfully",
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b6",
    "title": "High-Intensity Interval Training",
    "description": "Burn calories with this intense workout",
    "date": "2024-01-16T00:00:00.000Z",
    "startTime": "2024-01-16T14:00:00.000Z",
    "endTime": "2024-01-16T16:00:00.000Z",
    "maxTrainees": 10,
    "trainerId": "60f7b3b3b3b3b3b3b3b3b3b4",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "trainer": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b4",
      "name": "Jane Trainer",
      "email": "jane.trainer@gym.com"
    },
    "_count": {
      "bookings": 0
    }
  }
}
```

### 12. Get All Classes

**API Endpoint:** `GET /api/v1/classes?page=1&limit=10`

**Headers:**
```
Authorization:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Classes retrieved successfully",
  "data": {
    "data": [
      {
        "id": "60f7b3b3b3b3b3b3b3b3b3b6",
        "title": "High-Intensity Interval Training",
        "description": "Burn calories with this intense workout",
        "date": "2024-01-16T00:00:00.000Z",
        "startTime": "2024-01-16T14:00:00.000Z",
        "endTime": "2024-01-16T16:00:00.000Z",
        "maxTrainees": 10,
        "trainerId": "60f7b3b3b3b3b3b3b3b3b3b4",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "trainer": {
          "id": "60f7b3b3b3b3b3b3b3b3b3b4",
          "name": "Jane Trainer",
          "email": "jane.trainer@gym.com"
        },
        "_count": {
          "bookings": 3
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### 13. Get Class by ID

**API Endpoint:** `GET /api/v1/classes/60f7b3b3b3b3b3b3b3b3b3b6`

**Headers:**
```
Authorization:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Class retrieved successfully",
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b6",
    "title": "High-Intensity Interval Training",
    "description": "Burn calories with this intense workout",
    "date": "2024-01-16T00:00:00.000Z",
    "startTime": "2024-01-16T14:00:00.000Z",
    "endTime": "2024-01-16T16:00:00.000Z",
    "maxTrainees": 10,
    "trainerId": "60f7b3b3b3b3b3b3b3b3b3b4",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "trainer": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b4",
      "name": "Jane Trainer",
      "email": "jane.trainer@gym.com"
    },
    "bookings": [
      {
        "id": "60f7b3b3b3b3b3b3b3b3b3b7",
        "traineeId": "60f7b3b3b3b3b3b3b3b3b3b3",
        "classScheduleId": "60f7b3b3b3b3b3b3b3b3b3b6",
        "status": "CONFIRMED",
        "bookedAt": "2024-01-15T10:30:00.000Z",
        "cancelledAt": null,
        "trainee": {
          "id": "60f7b3b3b3b3b3b3b3b3b3b3",
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    ],
    "_count": {
      "bookings": 1
    }
  }
}
```

### 14. Update Class (Admin Only)

**API Endpoint:** `PUT /api/v1/classes/60f7b3b3b3b3b3b3b3b3b3b6`

**Headers:**
```
Authorization:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:**
```json
{
  "title": "Updated HIIT Training",
  "description": "Updated description for the workout"
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Class updated successfully",
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b6",
    "title": "Updated HIIT Training",
    "description": "Updated description for the workout",
    "date": "2024-01-16T00:00:00.000Z",
    "startTime": "2024-01-16T14:00:00.000Z",
    "endTime": "2024-01-16T16:00:00.000Z",
    "maxTrainees": 10,
    "trainerId": "60f7b3b3b3b3b3b3b3b3b3b4",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:30:00.000Z",
    "trainer": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b4",
      "name": "Jane Trainer",
      "email": "jane.trainer@gym.com"
    },
    "_count": {
      "bookings": 1
    }
  }
}
```

### 15. Delete Class (Admin Only)

**API Endpoint:** `DELETE /api/v1/classes/60f7b3b3b3b3b3b3b3b3b3b6`

**Headers:**
```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Class schedule deleted successfully"
}
```

---

## 📅 Booking Management Endpoints

### 16. Book a Class (Trainee Only)

**API Endpoint:** `POST /api/v1/bookings`

**Headers:**
```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:**
```json
{
  "classScheduleId": "60f7b3b3b3b3b3b3b3b3b3b6"
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Class booked successfully",
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b7",
    "traineeId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "classScheduleId": "60f7b3b3b3b3b3b3b3b3b3b6",
    "status": "CONFIRMED",
    "bookedAt": "2024-01-15T10:30:00.000Z",
    "cancelledAt": null,
    "classSchedule": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b6",
      "title": "High-Intensity Interval Training",
      "description": "Burn calories with this intense workout",
      "date": "2024-01-16T00:00:00.000Z",
      "startTime": "2024-01-16T14:00:00.000Z",
      "endTime": "2024-01-16T16:00:00.000Z",
      "maxTrainees": 10,
      "trainerId": "60f7b3b3b3b3b3b3b3b3b3b4",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "trainer": {
        "id": "60f7b3b3b3b3b3b3b3b3b3b4",
        "name": "Jane Trainer",
        "email": "jane.trainer@gym.com"
      }
    },
    "trainee": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### 17. Get My Bookings (Trainee Only)

**API Endpoint:** `GET /api/v1/bookings/my-bookings?page=1&limit=10`

**Headers:**
```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Bookings retrieved successfully",
  "data": {
    "data": [
      {
        "id": "60f7b3b3b3b3b3b3b3b3b3b7",
        "traineeId": "60f7b3b3b3b3b3b3b3b3b3b3",
        "classScheduleId": "60f7b3b3b3b3b3b3b3b3b3b6",
        "status": "CONFIRMED",
        "bookedAt": "2024-01-15T10:30:00.000Z",
        "cancelledAt": null,
        "classSchedule": {
          "id": "60f7b3b3b3b3b3b3b3b3b3b6",
          "title": "High-Intensity Interval Training",
          "description": "Burn calories with this intense workout",
          "date": "2024-01-16T00:00:00.000Z",
          "startTime": "2024-01-16T14:00:00.000Z",
          "endTime": "2024-01-16T16:00:00.000Z",
          "maxTrainees": 10,
          "trainerId": "60f7b3b3b3b3b3b3b3b3b3b4",
          "createdAt": "2024-01-15T10:30:00.000Z",
          "updatedAt": "2024-01-15T10:30:00.000Z",
          "trainer": {
            "id": "60f7b3b3b3b3b3b3b3b3b3b4",
            "name": "Jane Trainer",
            "email": "jane.trainer@gym.com"
          }
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### 18. Get All Bookings (Admin Only)

**API Endpoint:** `GET /api/v1/bookings?page=1&limit=10`

**Headers:**
```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "All bookings retrieved successfully",
  "data": {
    "data": [
      {
        "id": "60f7b3b3b3b3b3b3b3b3b3b7",
        "traineeId": "60f7b3b3b3b3b3b3b3b3b3b3",
        "classScheduleId": "60f7b3b3b3b3b3b3b3b3b3b6",
        "status": "CONFIRMED",
        "bookedAt": "2024-01-15T10:30:00.000Z",
        "cancelledAt": null,
        "classSchedule": {
          "id": "60f7b3b3b3b3b3b3b3b3b3b6",
          "title": "High-Intensity Interval Training",
          "description": "Burn calories with this intense workout",
          "date": "2024-01-16T00:00:00.000Z",
          "startTime": "2024-01-16T14:00:00.000Z",
          "endTime": "2024-01-16T16:00:00.000Z",
          "maxTrainees": 10,
          "trainerId": "60f7b3b3b3b3b3b3b3b3b3b4",
          "createdAt": "2024-01-15T10:30:00.000Z",
          "updatedAt": "2024-01-15T10:30:00.000Z",
          "trainer": {
            "id": "60f7b3b3b3b3b3b3b3b3b3b4",
            "name": "Jane Trainer",
            "email": "jane.trainer@gym.com"
          }
        },
        "trainee": {
          "id": "60f7b3b3b3b3b3b3b3b3b3b3",
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### 19. Cancel Booking

**API Endpoint:** `PATCH /api/v1/bookings/60f7b3b3b3b3b3b3b3b3b3b7/cancel`

**Headers:**
```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Booking cancelled successfully",
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b7",
    "traineeId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "classScheduleId": "60f7b3b3b3b3b3b3b3b3b3b6",
    "status": "CANCELLED",
    "bookedAt": "2024-01-15T10:30:00.000Z",
    "cancelledAt": "2024-01-15T11:30:00.000Z",
    "classSchedule": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b6",
      "title": "High-Intensity Interval Training",
      "description": "Burn calories with this intense workout",
      "date": "2024-01-16T00:00:00.000Z",
      "startTime": "2024-01-16T14:00:00.000Z",
      "endTime": "2024-01-16T16:00:00.000Z",
      "maxTrainees": 10,
      "trainerId": "60f7b3b3b3b3b3b3b3b3b3b4",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "trainer": {
        "id": "60f7b3b3b3b3b3b3b3b3b3b4",
        "name": "Jane Trainer",
        "email": "jane.trainer@gym.com"
      }
    },
    "trainee": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

## ❌ Error Response Examples

### Validation Error
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error occurred.",
  "errorDetails": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Unauthorized Access
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized access.",
  "errorDetails": "Access token is required."
}
```

### Forbidden Access
```json
{
  "success": false,
  "statusCode": 403,
  "message": "Unauthorized access.",
  "errorDetails": "You must be ADMIN to perform this action."
}
```

### Resource Not Found
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Class schedule not found"
}
```

### Business Logic Error
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Class schedule is full. Maximum 10 trainees allowed per schedule."
}
```

### Duplicate Entry Error
```json
{
  "success": false,
  "statusCode": 409,
  "message": "User with this email already exists"
}
```

---

## 🧪 Sample Login Credentials

Use these credentials to test different user roles:

**Admin Account:**
- Email: `admin@gym.com`
- Password: `admin123`

**Trainer Accounts:**
- Email: `trainer1@gym.com` / Password: `trainer123`
- Email: `trainer2@gym.com` / Password: `trainer123`

**Trainee Accounts:**
- Email: `trainee1@gym.com` / Password: `trainee123`
- Email: `trainee2@gym.com` / Password: `trainee123`
- Email: `trainee3@gym.com` / Password: `trainee123`

---
## 🔒 Authentication Flow

1. **Register/Login** to get JWT token
2. **Include token** in Authorization header: ` <token>`
3. **Access protected routes** based on user role

## 🛡 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation with Zod schemas