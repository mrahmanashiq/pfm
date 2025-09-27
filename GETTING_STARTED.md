# Getting Started with PFM

This guide will help you set up and run the PFM (Personal Finance Manager) application on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17** or higher ([Download](https://adoptium.net/))
- **Node.js 18** or higher ([Download](https://nodejs.org/))
- **MySQL 8.0** or higher ([Download](https://dev.mysql.com/downloads/))
- **Git** ([Download](https://git-scm.com/downloads))

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/mrahmanashiq/pfm.git
cd pfm
```

### 2. Database Setup

Create a MySQL database:

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE pfm;

-- Create user (optional, for better security)
CREATE USER 'pfm_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON pfm.* TO 'pfm_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### 3. Backend Configuration

Copy the example configuration file:

```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

Edit `application.properties` with your database credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3307/pfm
spring.datasource.username=pfm_user
spring.datasource.password=your_secure_password
```

### 4. Run the Backend

```bash
# Make gradlew executable (Unix/macOS)
chmod +x gradlew

# Run the Spring Boot application
./gradlew bootRun
```

The backend will start on `http://localhost:8090`

### 5. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd pfm-client

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend will start on `http://localhost:3000`

## Verify Installation

### Test Backend
Visit `http://localhost:8090/swagger-ui.html` to see the API documentation.

### Test Frontend
Visit `http://localhost:3000` to see the React application.

### Test API
You can test the authentication endpoint:

```bash
curl -X POST http://localhost:8090/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

## Docker Setup (Alternative)

If you prefer using Docker:

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

This will start:
- MySQL on port 3307
- Backend on port 8090
- Frontend on port 3000

## Troubleshooting

### Common Issues

**Database Connection Error**
- Ensure MySQL is running
- Check database credentials in `application.properties`
- Verify database exists

**Port Already in Use**
- Change the port in `application.properties` (backend) or `package.json` (frontend)
- Kill the process using the port: `sudo lsof -ti:8090 | xargs kill -9`

**Build Failures**
- Ensure Java 17 is being used: `java -version`
- Clear Gradle cache: `./gradlew clean`
- Refresh dependencies: `./gradlew --refresh-dependencies`

**Frontend Issues**
- Clear node modules: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

### Getting Help

- Check the [FAQ](FAQ.md)
- Search existing [Issues](https://github.com/mrahmanashiq/pfm/issues)
- Create a new [Issue](https://github.com/mrahmanashiq/pfm/issues/new)

## Next Steps

Once you have the application running:

1. **Create an Account**: Use the signup endpoint or frontend form
2. **Add Accounts**: Create bank accounts, credit cards, etc.
3. **Track Transactions**: Add income and expenses
4. **Set Budgets**: Create monthly budgets for different categories
5. **Set Goals**: Create savings goals and track progress

## Development Mode

For development with auto-reload:

### Backend (Spring Boot DevTools)
The backend automatically reloads when you make changes to the code.

### Frontend (React Hot Reload)
The frontend automatically reloads when you make changes to React components.

## Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment instructions.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

Happy budgeting! 💰