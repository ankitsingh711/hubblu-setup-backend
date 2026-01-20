# Hubblu Backend - Industry-Level NestJS Application

[![NestJS](https://img.shields.io/badge/NestJS-10.x-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A production-ready, enterprise-grade NestJS backend application with MongoDB, featuring industry best practices, comprehensive security, and modern development standards.

## 🚀 Features

### Core Features
- ✅ **Modular Architecture** - Clean, scalable modular design
- ✅ **MongoDB Integration** - Mongoose ORM with schema validation
- ✅ **JWT Authentication** - Secure authentication with refresh tokens
- ✅ **Role-Based Access Control (RBAC)** - Fine-grained permissions
- ✅ **Input Validation** - Class-validator with detailed error messages
- ✅ **Global Error Handling** - Structured error responses
- ✅ **Logging System** - Winston with file rotation and multiple transports
- ✅ **Health Checks** - Database, memory, and disk monitoring
- ✅ **API Documentation** - Auto-generated Swagger/OpenAPI docs
- ✅ **Rate Limiting** - Throttling to prevent abuse
- ✅ **Security Headers** - Helmet.js integration
- ✅ **CORS Configuration** - Configurable cross-origin policies

### Development Features
- ✅ **TypeScript** - Strict mode with path aliases
- ✅ **ESLint & Prettier** - Code quality and formatting
- ✅ **Husky & Lint-Staged** - Pre-commit hooks
- ✅ **Conventional Commits** - Commit message linting
- ✅ **E2E Testing** - Comprehensive test coverage
- ✅ **Unit Testing** - Jest with mocking utilities

## 📋 Prerequisites

- **Node.js** >= 20.x
- **npm** >= 9.x
- **MongoDB** >= 7.x (install MongoDB Community Server)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd hubblu-setup-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment configuration

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/hubblu_db
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
```

### 4. Start MongoDB

**Install MongoDB Community Server:**
1. Download from https://www.mongodb.com/try/download/community
2. Run the installer and select "Install MongoDB as a Service"
3. Start the service:

```powershell
# Start MongoDB service
net start MongoDB

# Verify MongoDB is running
netstat -an | findstr :27017
```

### 5. Run the application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## 📚 API Documentation

Once the application is running, visit:

- **Swagger UI**: http://localhost:3000/api/docs
- **API Base URL**: http://localhost:3000/api/v1

### Quick API Overview

#### Authentication Endpoints
```http
POST /api/v1/auth/register     # Register new user
POST /api/v1/auth/login        # Login user
POST /api/v1/auth/logout       # Logout user
POST /api/v1/auth/refresh      # Refresh access token
POST /api/v1/auth/validate     # Validate current token
```

#### User Endpoints
```http
GET    /api/v1/users/me        # Get current user
GET    /api/v1/users           # Get all users (Admin/Moderator)
GET    /api/v1/users/:id       # Get user by ID (Admin/Moderator)
POST   /api/v1/users           # Create user (Admin)
PATCH  /api/v1/users/:id       # Update user
DELETE /api/v1/users/:id       # Delete user (Admin)
```

#### Health Endpoints
```http
GET /api/v1/health             # Comprehensive health check
GET /api/v1/health/live        # Liveness probe
GET /api/v1/health/ready       # Readiness probe
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 🏗️ Project Structure

```
src/
├── common/                     # Shared utilities
│   ├── decorators/            # Custom decorators (@Roles, @GetUser, @Public)
│   ├── filters/               # Exception filters
│   ├── guards/                # Auth & role guards
│   ├── interceptors/          # Logging & transform interceptors
│   ├── logger/                # Winston logger service
│   └── pipes/                 # Validation pipes
├── config/                    # Configuration management
│   └── configuration.ts       # Environment config with validation
├── database/                  # Database layer
│   ├── database.module.ts    # MongoDB connection
│   └── schemas/              # Mongoose schemas
│       ├── base.schema.ts    # Base schema with timestamps
│       └── user.schema.ts    # User schema
├── modules/                   # Feature modules
│   ├── auth/                 # Authentication module
│   │   ├── dto/             # Auth DTOs
│   │   ├── guards/          # JWT auth guard
│   │   ├── strategies/      # JWT strategy
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/               # Users module
│   │   ├── dto/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   └── health/              # Health check module
│       ├── health.controller.ts
│       └── health.module.ts
├── app.module.ts             # Root module
└── main.ts                   # Application entry point
```

## 🔐 Security Features

- **Password Hashing** - Bcrypt with configurable salt rounds
- **JWT Tokens** - Short-lived access tokens + long-lived refresh tokens
- **Security Headers** - Helmet.js for HTTP security
- **Rate Limiting** - Throttle requests to prevent abuse
- **Input Validation** - Class-validator with whitelist
- **CORS** - Configurable origin policies
- **Soft Delete** - User data preserved with soft delete

## 🔄 Development Workflow

### Git Hooks
The project uses Husky for git hooks:
- **pre-commit**: Runs linting and formatting on staged files
- **commit-msg**: Validates commit messages follow conventional commits

### Conventional Commits Format
```
type(scope): description

feat: add user profile endpoint
fix: resolve authentication bug
docs: update API documentation
```

### Code Quality Commands
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

##  Monitoring & Logging

### Logging
Logs are stored in the `logs/` directory:
- `application-YYYY-MM-DD.log` - All logs
- `error-YYYY-MM-DD.log` - Error logs only

Log levels: error, warn, info, http, verbose, debug, silly

### Health Monitoring
```bash
# Check application health
curl http://localhost:3000/api/v1/health

# Check if application is alive
curl http://localhost:3000/api/v1/health/live

# Check if application is ready
curl http://localhost:3000/api/v1/health/ready
```

## 🚀 Deployment

### Environment Variables
Ensure all production environment variables are set:
- Use strong `JWT_SECRET` and `JWT_REFRESH_SECRET`
- Set `NODE_ENV=production`
- Configure production database URI
- Set appropriate `CORS_ORIGINS`
- Disable Swagger in production (`SWAGGER_ENABLED=false`)

### Production Build
```bash
# Install dependencies
npm ci --only=production

# Build application
npm run build

# Start production server
npm run start:prod
```

## 📖 Additional Documentation

- [Architecture Documentation](./ARCHITECTURE.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## 🤝 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and development process.

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- MongoDB for the database
- All contributors and maintainers

---

**Built with ❤️ using NestJS and TypeScript**
