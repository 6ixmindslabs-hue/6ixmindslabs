# Admin Panel Backend API Documentation

## Overview
This document describes the RESTful API endpoints needed for the 6ixminds Labs Admin Panel.

**Base URL (Production):** `https://api.6ixmindslabs.com`  
**Base URL (Development):** `http://localhost:3000/api`

**Authentication:** JWT Bearer Token  
**Content-Type:** `application/json`

---

## Authentication Endpoints

### 1. Admin Login
**POST** `/admin/login`

**Request Body:**
```json
{
  "username": "6ixmindslabs",
  "password": "your_secure_password"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "6ixmindslabs",
    "email": "admin@6ixmindslabs.com",
    "role": "super-admin",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

### 2. Refresh Token
**POST** `/admin/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. Logout
**POST** `/admin/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 4. Change Password
**POST** `/admin/change-password`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "current_password",
  "newPassword": "new_secure_password"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## Internships Endpoints

### 1. Get All Internships
**GET** `/internships`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `domain` (optional): Filter by domain
- `search` (optional): Search query

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "slug": "web-development",
      "title": "Web Development Internship",
      "domain": "Web & App Development",
      "duration": "2 Weeks / 1 Month",
      "price": 2000,
      "description": "Build real-world web applications...",
      "skills": ["React", "Node.js", "MongoDB"],
      "projects": ["E-commerce website", "Social media dashboard"],
      "durationOptions": { ... },
      "certificate": true,
      "featured": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25,
    "itemsPerPage": 10
  }
}
```

---

### 2. Get Single Internship
**GET** `/internships/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "slug": "web-development",
    ...
  }
}
```

---

### 3. Create Internship
**POST** `/admin/internships`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Web Development Internship",
  "domain": "Web & App Development",
  "duration": "2 Weeks / 1 Month",
  "price": 2000,
  "description": "Build real-world web applications...",
  "skills": ["React", "Node.js", "MongoDB"],
  "projects": ["E-commerce website"],
  "featured": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 4,
    "slug": "web-development",
    ...
  },
  "message": "Internship created successfully"
}
```

---

### 4. Update Internship
**PATCH** `/admin/internships/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** (Partial update supported)
```json
{
  "price": 2500,
  "featured": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Internship updated successfully"
}
```

---

### 5. Delete Internship
**DELETE** `/admin/internships/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Internship deleted successfully"
}
```

---

## Projects Endpoints

### 1. Get All Projects
**GET** `/projects`

**Query Parameters:**
- `page`, `limit`, `category`, `search`

**Response:** Similar structure to internships

---

### 2. Create Project
**POST** `/admin/projects`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
title: "Billing Management System"
category: "Web"
description: "A streamlined billing platform..."
image: <File>
tags: ["Typescript", "Node.js"]
github: "https://github.com/..."
liveDemo: "https://..."
featured: true
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 4,
    "slug": "billing-management-system",
    "image": "https://storage.example.com/uploads/project-123.jpg",
    ...
  }
}
```

---

## Certificates Endpoints

### 1. Get All Certificates
**GET** `/certificates`

**Query Parameters:**
- `page`, `limit`, `search`

---

### 2. Verify Certificate
**GET** `/certificates/verify/:certId`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "cert_id": "6ML-IN-2025-00001",
    "student_name": "Rahul Kumar",
    "internship_title": "Web Development Internship",
    "project_title": "E-commerce Platform",
    "issue_date": "2025-01-15",
    "skills": ["React", "Node.js"],
    "qr_code": "https://verify.6ixmindslabs.com/6ML-IN-2025-00001"
  }
}
```

**Error (404 Not Found):**
```json
{
  "success": false,
  "error": "Certificate not found"
}
```

---

### 3. Issue Certificate
**POST** `/admin/certificates`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "student_name": "Rahul Kumar",
  "internship_title": "Web Development Internship",
  "project_title": "E-commerce Platform",
  "issue_date": "2025-01-15",
  "skills": ["React", "Node.js", "MongoDB"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "cert_id": "6ML-IN-2025-00003",
    "qr_code": "https://verify.6ixmindslabs.com/6ML-IN-2025-00003",
    ...
  }
}
```

---

## Team Endpoints

### 1. Get All Team Members
**GET** `/team`

---

### 2. Create Team Member
**POST** `/admin/team`

**Request Body (FormData):**
```
name: "John Doe"
role: "Senior Developer"
bio: "Expert in full-stack development..."
photo: <File>
email: "john@6ixmindslabs.com"
linkedin: "https://linkedin.com/..."
github: "https://github.com/..."
order: 1
```

---

## Contact Messages Endpoints

### 1. Get All Messages
**GET** `/admin/messages`

**Query Parameters:**
- `status`: `unread`, `read`, `archived`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "1234567890",
      "subject": "Internship Inquiry",
      "message": "I'm interested in...",
      "status": "unread",
      "createdAt": "2025-01-10T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Mark Message as Read
**PATCH** `/admin/messages/:id/read`

---

### 3. Archive Message
**PATCH** `/admin/messages/:id/archive`

---

## Pages/Content Endpoints

### 1. Get Page Content
**GET** `/pages/:pageName`

**Example:** `/pages/about`

**Response:**
```json
{
  "success": true,
  "data": {
    "pageName": "about",
    "sections": {
      "hero": {
        "title": "About Us",
        "subtitle": "Welcome to 6ixminds Labs"
      },
      "mission": {
        "title": "Our Mission",
        "content": "<p>We empower students...</p>"
      }
    },
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### 2. Update Page Content
**PATCH** `/admin/pages/:pageName`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "sections": {
    "hero": {
      "title": "About 6ixminds Labs",
      "subtitle": "Innovation in Education"
    }
  }
}
```

---

## Admin Users Endpoints

### 1. Get All Admin Users
**GET** `/admin/users`

**Headers:**
```
Authorization: Bearer <token> (super-admin only)
```

---

### 2. Create Admin User
**POST** `/admin/users`

**Request Body:**
```json
{
  "username": "newadmin",
  "email": "newadmin@6ixmindslabs.com",
  "password": "secure_password",
  "role": "editor"
}
```

---

## Audit Logs Endpoints

### 1. Get Audit Logs
**GET** `/admin/logs`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`, `limit`, `userId`, `action`, `startDate`, `endDate`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "username": "6ixmindslabs",
      "action": "CREATE_INTERNSHIP",
      "resource": "internships",
      "resourceId": 4,
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "timestamp": "2025-01-10T15:30:00.000Z"
    }
  ]
}
```

---

## File Upload Endpoint

### Upload File
**POST** `/admin/upload`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
file: <File>
type: "image" | "document"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://storage.example.com/uploads/image-123.jpg",
    "filename": "image-123.jpg",
    "size": 524288,
    "mimetype": "image/jpeg"
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation error",
  "details": {
    "title": "Title is required",
    "price": "Price must be a positive number"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "error": "Rate limit exceeded. Try again in 60 seconds"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Security Headers

All API responses should include:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
```

---

## Rate Limiting

- **Login attempts:** 5 per 15 minutes per IP
- **API calls (authenticated):** 100 per minute per user
- **API calls (public):** 60 per hour per IP

---

## CORS Configuration

**Allowed Origins (Production):**
- `https://www.6ixmindslabs.com`
- `https://6ixmindslabs.com`

**Allowed Methods:**
- GET, POST, PATCH, DELETE, OPTIONS

**Allowed Headers:**
- Authorization, Content-Type
