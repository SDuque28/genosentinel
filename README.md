# GenoSentinel Auth Gateway

Authentication and authorization microservice for the GenoSentinel system. Handles user registration, login, JWT token generation and validation for the clinical and genomic microservices.

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Error Codes](#error-codes)
- [Configuration](#configuration)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Auth Gateway serves as the authentication layer for GenoSentinel, providing:
- User registration and login
- JWT token generation and validation
- Single role-based access control (all users have "USER" role)
- Stateless authentication for microservices communication

**Key Features:**
- ✅ BCrypt password encryption
- ✅ JWT-based authentication (stateless)
- ✅ Token validation endpoint for other microservices
- ✅ CORS configuration for frontend integration
- ✅ MySQL persistence with JPA/Hibernate
- ✅ Health check endpoint for Kubernetes

---

## Architecture
```
┌─────────────┐
│   Client    │
│ (Frontend)  │
└──────┬──────┘
       │ HTTP Request
       ↓
┌────────────────────────────┐
│    Auth Gateway :3003      │
│                            │
│  ┌─────────────────────┐   │
│  │  AuthController     │   │
│  │  - /auth/login      │   │
│  │  - /auth/register   │   │
│  │  - /auth/validate   │   │
│  └──────────┬──────────┘   │
│             │              │
│  ┌──────────▼──────────┐   │
│  │   JwtService        │   │
│  │  - Generate Token   │   │
│  │  - Validate Token   │   │
│  └──────────┬──────────┘   │
│             │              │
│  ┌──────────▼──────────┐   │
│  │  SecurityFilter     │   │
│  │  - JWT Validation   │   │
│  │  - Role Extraction  │   │
│  └──────────┬──────────┘   │
│             │              │
│  ┌──────────▼──────────┐   │
│  │  UserRepository     │   │
│  └─────────────────────┘   │
└─────────────┬──────────────┘
              │
              ↓
      ┌──────────────┐
      │  MySQL :3308 │
      │  genosentinel│
      └──────────────┘
```

---

## Technologies

- **Java 17**
- **Spring Boot 3.2.x**
- **Spring Security** - Authentication & Authorization
- **JWT (jjwt 0.12.3)** - Token generation and validation
- **Spring Data JPA** - Database persistence
- **MySQL 8.4** - Database
- **Lombok** - Reduce boilerplate code
- **BCrypt** - Password hashing

---

## Getting Started

### Prerequisites
```bash
- Java 17 or higher
- Maven 3.8+
- Docker & Docker Compose (for MySQL)
- IDE (IntelliJ IDEA, VS Code, Eclipse)
```

### 1. Start MySQL Database
```bash
# From project root
docker-compose up -d mysql

# Verify it's running
docker-compose ps

# Check logs
docker-compose logs mysql
```

### 2. Configure Application

Edit `src/main/resources/application.properties`:
```properties
# Server Configuration
spring.application.name=auth-gateway
server.port=3003

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3308/genosentinel
spring.datasource.username=genosentinel_user
spring.datasource.password=abcd1234

# JWT Configuration
jwt.secret=genosentinel-super-secret-key-change-in-production-minimum-256-bits
jwt.expiration=86400000
```

### 3. Run the Application
```bash
# Using Maven wrapper
./mvnw spring-boot:run

# Or on Windows
mvnw.cmd spring-boot:run

# Using IDE
# Run AuthGatewayApplication.java main method
```

**Expected output:**
```
Started AuthGatewayApplication in 4.234 seconds (process running for 4.789)
Tomcat started on port(s): 3003 (http) with context path ''
```

---

## API Endpoints

### Base URL
```
http://localhost:3003
```

### Public Endpoints (No Authentication Required)

#### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "UP",
  "service": "auth-gateway",
  "timestamp": "2025-11-11T20:30:45.123"
}
```

---

#### 2. Register User
```http
POST /auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure123"
}
```

**Success Response (201 Created):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2huX2RvZSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzMxMzU0MDAwLCJleHAiOjE3MzE0NDA0MDB9.signature",
  "tokenType": "Bearer",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "USER"
}
```

**Validation Rules:**
- `username`: Required, 3-100 characters, unique
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters

---

#### 3. Login
```http
POST /auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "secure123"
}
```

**Success Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "USER"
}
```

---

### Protected Endpoints (Authentication Required)

#### 4. Validate Token
```http
GET /auth/validate
Authorization: Bearer {token}
```

**Success Response (200 OK):**
```json
{
  "username": "john_doe",
  "role": "USER",
  "valid": "true"
}
```

**Usage:** Other microservices call this endpoint to verify JWT tokens.

---

## Authentication Flow

### Registration Flow
```
1. Client sends POST /auth/register with user data
2. Server validates input (username/email unique, password length)
3. Server hashes password with BCrypt
4. Server saves user to database (role = "USER" by default)
5. Server generates JWT token
6. Server returns token + user info
```

### Login Flow
```
1. Client sends POST /auth/login with credentials
2. Server validates username/password against database
3. Server generates JWT token with username and role
4. Server returns token + user info
```

### Token Validation Flow
```
1. Client/Microservice sends request with Authorization header
2. JwtAuthFilter intercepts request
3. Filter extracts token from "Bearer {token}" header
4. Filter validates token signature and expiration
5. Filter extracts username and role from token
6. Filter sets authentication in SecurityContext
7. Request proceeds to controller
```

### JWT Token Structure
```json
{
  "sub": "john_doe",          // Username
  "role": "USER",             // User role
  "iat": 1731354000,          // Issued at (timestamp)
  "exp": 1731440400           // Expiration (timestamp)
}
```

---

## Error Codes

### HTTP Status Codes

| Code | Meaning | When It Occurs |
|------|---------|----------------|
| 200 | OK | Successful request |
| 201 | Created | User registered successfully |
| 400 | Bad Request | Invalid input data (missing fields, invalid format) |
| 401 | Unauthorized | Invalid credentials or expired/invalid token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 409 | Conflict | Username or email already exists |
| 500 | Internal Server Error | Server-side error (database, unexpected exception) |

---

### Common Error Responses

#### 400 - Bad Request
**Cause:** Missing or invalid input fields
```json
{
  "timestamp": "2025-11-11T20:30:45.123",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed: username is required",
  "path": "/auth/register"
}
```

**How to fix:**
- Ensure all required fields are present
- Check field formats (email must be valid, password min 6 chars)
- Verify JSON syntax is correct

---

#### 401 - Unauthorized (Invalid Credentials)
**Cause:** Wrong username or password
```json
{
  "error": "Invalid credentials"
}
```

**How to fix:**
- Verify username is correct (case-sensitive)
- Verify password is correct
- Check if user exists in database
- Ensure user account is active

---

#### 401 - Unauthorized (Invalid Token)
**Cause:** Token is expired, malformed, or has invalid signature
```json
{
  "timestamp": "2025-11-11T20:30:45.123",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid token",
  "path": "/auth/validate"
}
```

**How to fix:**
- Request a new token via `/auth/login`
- Ensure token is sent in header: `Authorization: Bearer {token}`
- Check token hasn't expired (default: 24 hours)
- Verify JWT secret matches between services

---

#### 409 - Conflict (Duplicate User)
**Cause:** Username or email already registered
```json
{
  "timestamp": "2025-11-11T20:30:45.123",
  "status": 409,
  "error": "Conflict",
  "message": "Username already exists",
  "path": "/auth/register"
}
```

**How to fix:**
- Choose a different username
- Use a different email address
- Check if user already exists before registering

---

#### 500 - Internal Server Error
**Cause:** Database connection issue, unexpected exception
```json
{
  "timestamp": "2025-11-11T20:30:45.123",
  "status": 500,
  "error": "Internal Server Error",
  "message": "Could not open JPA EntityManager",
  "path": "/auth/login"
}
```

**How to fix:**
- Check MySQL is running: `docker-compose ps`
- Verify database credentials in `application.properties`
- Check application logs for stack trace
- Restart application and database

---

## Configuration

### Environment Variables

You can override properties using environment variables:
```bash
# Database
export DB_HOST=localhost
export DB_PORT=3308
export DB_NAME=genosentinel
export DB_USER=genosentinel_user
export DB_PASSWORD=abcd1234

# JWT
export JWT_SECRET=your-secret-key-here
export JWT_EXPIRATION=86400000

# Server
export SERVER_PORT=3003
```

### Application Properties Reference
```properties
# Server
server.port=3003

# Database
spring.datasource.url=jdbc:mysql://${DB_HOST:localhost}:${DB_PORT:3308}/${DB_NAME:genosentinel}
spring.datasource.username=${DB_USER:genosentinel_user}
spring.datasource.password=${DB_PASSWORD:abcd1234}

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# JWT
jwt.secret=${JWT_SECRET:genosentinel-super-secret-key-change-in-production-minimum-256-bits}
jwt.expiration=${JWT_EXPIRATION:86400000}

# Logging
logging.level.com.breaze.genosentinel=DEBUG
```

### Security Notes

⚠️ **IMPORTANT for Production:**
1. Change `jwt.secret` to a strong, randomly generated key (minimum 256 bits)
2. Use environment variables for sensitive data
3. Enable HTTPS/TLS
4. Set `spring.jpa.hibernate.ddl-auto=validate` (not `update`)
5. Use strong database passwords
6. Implement rate limiting
7. Add request/response logging for audit

---

## Testing

### Manual Testing with cURL

#### Register:
```bash
curl -X POST http://localhost:3003/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:3003/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

#### Validate Token:
```bash
curl -X GET http://localhost:3003/auth/validate \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### PowerShell Testing
```powershell
# Register
$body = @{username="testuser"; email="test@test.com"; password="pass123"} | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:3003/auth/register -Method Post -ContentType "application/json" -Body $body

# Login
$body = @{username="testuser"; password="pass123"} | ConvertTo-Json
$response = Invoke-RestMethod -Uri http://localhost:3003/auth/login -Method Post -ContentType "application/json" -Body $body
$token = $response.accessToken

# Validate
$headers = @{Authorization = "Bearer $token"}
Invoke-RestMethod -Uri http://localhost:3003/auth/validate -Method Get -Headers $headers
```

### Postman Collection

Import this collection for easy testing:
```json
{
  "info": {
    "name": "GenoSentinel Auth Gateway",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:3003/health"
      }
    },
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "url": "http://localhost:3003/auth/register",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"testuser\",\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}"
        }
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "url": "http://localhost:3003/auth/login",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"testuser\",\n  \"password\": \"password123\"\n}"
        }
      }
    },
    {
      "name": "Validate Token",
      "request": {
        "method": "GET",
        "url": "http://localhost:3003/auth/validate",
        "header": [{"key": "Authorization", "value": "Bearer {{token}}"}]
      }
    }
  ]
}
```

---

## Troubleshooting

### Problem: Application won't start

**Symptoms:**
```
Error starting ApplicationContext
Could not open JPA EntityManager for transaction
```

**Solutions:**
1. Check MySQL is running: `docker-compose ps`
2. Verify database credentials in `application.properties`
3. Check port 3308 is accessible: `telnet localhost 3308`
4. Check MySQL logs: `docker-compose logs mysql`

---

### Problem: Port 3003 already in use

**Symptoms:**
```
Web server failed to start. Port 3003 was already in use.
```

**Solutions:**
```powershell
# Windows - Find and kill process
netstat -ano | findstr :3003
taskkill /PID <PID> /F

# Or change port in application.properties
server.port=3004
```

---

### Problem: JWT Token Invalid

**Symptoms:**
```
401 Unauthorized - Invalid token
```

**Solutions:**
1. Check token format: `Authorization: Bearer {token}` (note the space)
2. Verify token hasn't expired (default: 24 hours)
3. Ensure JWT secret is the same across restarts
4. Check for extra spaces or line breaks in token
5. Use `/auth/login` to get a fresh token

---

### Problem: User Already Exists

**Symptoms:**
```
409 Conflict - Username already exists
```

**Solutions:**
1. Choose a different username
2. Check database: `SELECT * FROM users WHERE username = 'yourname';`
3. Delete test user if needed:
```sql
   DELETE FROM users WHERE username = 'testuser';
```

---

### Problem: BCrypt Password Mismatch

**Symptoms:**
```
401 Unauthorized - Invalid credentials
(but you're sure the password is correct)
```

**Solutions:**
1. Password is case-sensitive - check caps lock
2. Clear any trailing spaces in password
3. Re-register the user if database was reset
4. Check password encoding in UserDetailsService

---

### Problem: CORS Error (from Frontend)

**Symptoms:**
```
Access to fetch at 'http://localhost:3003/auth/login' 
from origin 'http://localhost:4200' has been blocked by CORS policy
```

**Solutions:**
1. Add your frontend URL to `SecurityConfig.corsConfigurationSource()`
2. Ensure preflight OPTIONS requests are allowed
3. Check `Access-Control-Allow-Origin` header in response
4. Verify CORS configuration:
```java
   cfg.setAllowedOrigins(List.of("http://localhost:4200"));
```

---

### Problem: Database Connection Timeout

**Symptoms:**
```
Communications link failure
The last packet sent successfully to the server was 0 milliseconds ago
```

**Solutions:**
1. Verify MySQL container is running: `docker ps`
2. Check MySQL is ready: `docker-compose logs mysql | grep "ready for connections"`
3. Wait 30 seconds after starting MySQL
4. Test connection manually:
```bash
   docker exec -it genosentinel-db mysql -u genosentinel_user -pabcd1234
```

---

### Debugging Tips

#### Enable Debug Logging
```properties
# application.properties
logging.level.com.breaze.genosentinel=DEBUG
logging.level.org.springframework.security=DEBUG
logging.level.org.hibernate.SQL=DEBUG
```

#### Check Application Logs
Look for these patterns:
- ✅ `Started AuthGatewayApplication` - App started successfully
- ✅ `Tomcat started on port(s): 3003` - Server listening
- ❌ `Communications link failure` - Database connection issue
- ❌ `Port 3003 was already in use` - Port conflict
- ❌ `Access denied for user` - Wrong database credentials

#### Database Health Check
```bash
# Check if database exists
docker exec -it genosentinel-db mysql -u genosentinel_user -pabcd1234 -e "SHOW DATABASES;"

# Check if users table exists
docker exec -it genosentinel-db mysql -u genosentinel_user -pabcd1234 -e "USE genosentinel; SHOW TABLES;"

# Check user records
docker exec -it genosentinel-db mysql -u genosentinel_user -pabcd1234 -e "USE genosentinel; SELECT * FROM users;"
```

---

## Project Structure
```
auth-gateway/
├── src/
│   ├── main/
│   │   ├── java/com/breaze/genosentinel/authgateway/
│   │   │   ├── config/
│   │   │   │   ├── AuthConfig.java          # UserDetailsService configuration
│   │   │   │   └── SecurityConfig.java      # Spring Security configuration
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java      # Login, Register, Validate endpoints
│   │   │   │   └── HealthController.java    # Health check endpoint
│   │   │   ├── dto/
│   │   │   │   ├── AuthResponse.java        # Response with token
│   │   │   │   ├── LoginRequest.java        # Login credentials
│   │   │   │   └── RegisterRequest.java     # Registration data
│   │   │   ├── entity/
│   │   │   │   └── User.java                # User entity (JPA)
│   │   │   ├── repository/
│   │   │   │   └── UserRepository.java      # JPA repository
│   │   │   ├── security/
│   │   │   │   ├── JwtAuthFilter.java       # JWT validation filter
│   │   │   │   └── JwtService.java          # JWT generation/parsing
│   │   │   └── AuthGatewayApplication.java  # Main application class
│   │   └── resources/
│   │       └── application.properties       # Configuration
│   └── test/                                # Unit tests (to be implemented)
├── pom.xml                                  # Maven dependencies
└── README.md                                # This file
```

---

## Next Steps

1. ✅ **Auth Gateway Complete** - User authentication working
2. 🔜 **Microservicio Clínica** (NestJS) - Patient & clinical records
3. 🔜 **Microservicio Genómica** (Django) - Genetic variants
4. 🔜 **Gateway Proxy** - Route requests to internal services
5. 🔜 **Kubernetes Deployment** - Deploy all services

---

## Contributing

This is an academic project for Universidad [Your University].

**Team:**
- Clinical Service (NestJS): [Teammate Name]
- Genomics Service (Django): [Your Name]
- Auth Gateway (Spring Boot): [Your Name]

---

## License

Academic project - Universidad [Your University] 2025

---

## Support

For issues or questions:
1. Check [Troubleshooting](#troubleshooting) section
2. Review application logs
3. Test with Postman collection
4. Contact team members

---

**Last Updated:** November 11, 2025  
**Version:** 1.0.0  
**Status:** ✅ Functional