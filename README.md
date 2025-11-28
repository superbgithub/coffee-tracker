# ☕ Coffee Tracker - Enterprise PoC

Enterprise-grade coffee consumption tracking application with AWS Blue/Green deployment.

## 🏗️ Architecture

- **Backend**: Spring Boot 3.2 (Java 17) with Maven
- **Database**: PostgreSQL with Flyway migrations
- **Frontend**: React with TypeScript
- **Infrastructure**: Terraform (AWS)
- **Deployment**: Blue/Green with ECS Fargate
- **CI/CD**: GitHub Actions
- **Monitoring**: CloudWatch + SNS

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.8+
- Docker Desktop
- PostgreSQL (or use Docker)
- AWS CLI configured

### Local Development

1. **Start PostgreSQL**:
   ```bash
   docker-compose up -d postgres
   ```

2. **Run Application**:
   ```bash
   mvn spring-boot:run
   ```

3. **Access**:
   - API: http://localhost:8080
   - Health: http://localhost:8080/actuator/health
   - API Docs: http://localhost:8080/swagger-ui.html

### Build & Test

```bash
# Build
mvn clean package

# Run tests
mvn test

# Build Docker image
docker build -t coffee-tracker:latest .
```

## 📁 Project Structure

```
coffee-tracker/
├── src/
│   ├── main/
│   │   ├── java/com/coffeetracker/
│   │   │   ├── CoffeeTrackerApplication.java
│   │   │   ├── model/           # JPA Entities
│   │   │   ├── repository/      # Spring Data JPA
│   │   │   ├── service/         # Business Logic
│   │   │   └── controller/      # REST APIs
│   │   └── resources/
│   │       ├── application.yml
│   │       └── db/migration/    # Flyway scripts
│   └── test/
├── terraform/                    # AWS Infrastructure
├── frontend/                     # React app
├── .github/workflows/           # CI/CD pipelines
└── docker-compose.yml

```

## 🔧 Configuration

See `src/main/resources/application.yml` for configuration options.

Environment variables:
- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port
- `DB_NAME`: Database name
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password

## 📊 API Endpoints

- `POST /api/v1/coffee` - Log coffee consumption
- `GET /api/v1/coffee` - Get all consumptions
- `GET /api/v1/coffee/stats` - Get statistics

## 🌐 AWS Deployment

See `terraform/` directory for infrastructure setup.

## 📝 License

MIT
