# Setup Instructions

## Prerequisites Check

Before proceeding, ensure you have the following installed:

### 1. Node.js and npm

Check if Node.js is installed:
```bash
node --version
```

Should output: v20.x.x or higher

Check if npm is installed:
```bash
npm --version
```

Should output: 9.x.x or higher

**If not installed**, download and install from: https://nodejs.org/

### 2. MongoDB

You have two options:

#### Option A: Use Docker (Recommended)
```bash
docker --version
docker-compose --version
```

#### Option B: Install MongoDB locally
Download from: https://www.mongodb.com/try/download/community

### 3. Git

```bash
git --version
```

Download from: https://git-scm.com/downloads if needed

## Installation Steps

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages from package.json.

### Step 2: Set Up Git Hooks

After npm install completes, initialize Husky:

```bash
npm run prepare
```

This creates pre-commit hooks for code quality.

### Step 3: Start MongoDB

#### Using Docker Compose (Recommended):
```bash
docker-compose up -d mongodb
```

This starts:
- MongoDB on port 27017
- Mongo Express (web UI) on port 8081

Access Mongo Express at: http://localhost:8081
- Username: admin
- Password: admin

#### Using local MongoDB:
Make sure MongoDB service is running on port 27017

### Step 4: Verify Environment Configuration

Check your `.env` file:
```bash
# The .env file has been created with default values
# Update JWT secrets for production use
```

### Step 5: Build the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### Step 6: Start the Application

#### Development mode (with hot reload):
```bash
npm run start:dev
```

#### Production mode:
```bash
npm run start:prod
```

### Step 7: Verify Installation

Once the application starts, you should see:
```
✅ MongoDB connected successfully
🚀 Application is running on: http://localhost:3000/api/v1
Swagger documentation available at http://localhost:3000/api/docs
```

Visit these URLs to verify:
- API: http://localhost:3000/api/v1/health
- Swagger UI: http://localhost:3000/api/docs

## Quick Start Commands

```bash
# Install dependencies
npm install

# Start MongoDB (Docker)
docker-compose up -d

# Run in development mode
npm run start:dev

# Run tests
npm test
npm run test:e2e

# Check code quality
npm run lint
npm run format

# Build for production
npm run build

# Run production build
npm run start:prod
```

## Testing the API

### 1. Check Health
```bash
curl http://localhost:3000/api/v1/health
```

### 2. Register a User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

Save the `accessToken` from the response.

### 4. Access Protected Endpoint
```bash
curl -X GET http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Troubleshooting

### Port Already in Use
```bash
# Change the PORT in .env file
PORT=3001
```

### MongoDB Connection Error
```bash
# Check if MongoDB is running
docker-compose ps

# Or check local MongoDB service
# Windows: Check Services
# Linux/Mac: sudo systemctl status mongod
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Compilation Errors
```bash
# Clean and rebuild
npm run build
```

## Development Workflow

### 1. Create a New Feature
```bash
# Create a new branch
git checkout -b feature/my-feature

# Make changes

# Run tests
npm test

# Commit changes
git add .
git commit -m "feat: add my feature"
```

### 2. Before Pushing
```bash
# Format code
npm run format

# Lint code
npm run lint:fix

# Run all tests
npm test && npm run test:e2e
```

### 3. Push Changes
```bash
git push origin feature/my-feature
```

## Next Steps

1. **Read the Documentation**
   - [README.md](./README.md) - Project overview
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture details
   - [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines

2. **Explore the API**
   - Visit Swagger UI: http://localhost:3000/api/docs
   - Try out the endpoints
   - Review the response formats

3. **Customize for Your Needs**
   - Update environment variables
   - Add new modules
   - Extend functionality

4. **Deploy to Production**
   - Build Docker image: `docker build -t my-app .`
   - Deploy to your preferred platform
   - Set production environment variables

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the error logs in `logs/` directory
3. Check MongoDB logs: `docker-compose logs mongodb`
4. Open an issue on the repository

---

Happy coding! 🚀
