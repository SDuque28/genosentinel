Here's a comprehensive README.md for your project:


# GenoSentinel - Genomic Variant Management System

A microservices-based application for managing genetic variants, genes, and patient reports in oncological research. The system integrates clinical data with genomic information to provide comprehensive variant analysis and reporting.

##  Architecture

```
            ┌──────────────┐
            │   Angular    │  Frontend (Port 4200)
            │  (Frontend)  │
            └──────┬───────┘
                   │ HTTP + JWT Auth
                   ▼
┌─────────────────────────────────────┐
│      Spring Boot Gateway            │  Port 8080 (/genosentinel)
│  - Authentication & Authorization   │
│  - API Gateway                      │
│  - Request Routing                  │
└──────┬──────────────────┬───────────┘
       │                  │
       ▼                  ▼
┌──────────────┐   ┌─────────────────┐
│   Django     │   │    NestJS       │
│  (Port 8000) │◄──┤  (Port 3000)    │
│              │   │                 │
│  Genomic API │   │  Clinical API   │
│  - Genes     │   │  - Patients     │
│  - Variants  │   │  - Records      │
│  - Reports   │   │  - Tumor Types  │
└──────┬───────┘   └────────┬────────┘
       │                    │
       ▼                    ▼
┌──────────────┐   ┌─────────────────┐
│    MySQL     │   │     MySQL       │
│ genomic_db   │   │  clinical_db    │
└──────────────┘   └─────────────────┘
```

## Features

### Genomic Microservice (Django)
- **Gene Management**: Catalog genes of oncological interest with functions and descriptions
- **Genetic Variants**: Track specific mutations with chromosome positions, reference/alternate bases, and impact classification
- **Patient Reports**: Link variants to patients with detection dates and allele frequencies
- **Clinical Integration**: Validates patient information via the Clinical Microservice

### Clinical Microservice (NestJS)
- **Patient Management**: Store patient demographics and medical information
- **Clinical Records**: Maintain comprehensive medical histories
- **Tumor Types**: Classify and manage different tumor categories

### API Gateway (Spring Boot)
- **JWT Authentication**: Secure token-based authentication
- **Request Routing**: Routes requests to appropriate microservices
- **Swagger Documentation**: Interactive API documentation
- **CORS Management**: Handles cross-origin requests

### Frontend (Angular)
- **User Authentication**: Secure login system
- **Gene Management**: CRUD operations for genes
- **Variant Tracking**: Manage genetic variants
- **Patient Reports**: Create and view patient genomic reports
- **Material Design**: Modern, responsive UI

##  Prerequisites

- **Docker** (20.x or higher)
- **Kubernetes/Minikube** (1.28 or higher)
- **Java** 21
- **Node.js** 18.x or higher
- **Python** 3.11 or higher
- **MySQL** 8.x

## Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Gateway | Spring Boot | 3.x |
| Clinical Service | NestJS | 10.x |
| Genomic Service | Django | 5.x |
| Frontend | Angular | 18.x |
| Database | MySQL | 8.4 |
| Orchestration | Kubernetes | 1.28+ |
| Container | Docker | 20.x+ |

## Installation

### Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/genosentinel.git
cd genosentinel
```

#### 2. Setup Databases

Create three MySQL databases:

```sql
-- Auth Gateway Database
CREATE DATABASE genosentinel;
CREATE USER 'genosentinel_user'@'localhost' IDENTIFIED BY 'abcd1234';
GRANT ALL PRIVILEGES ON genosentinel.* TO 'genosentinel_user'@'localhost';

-- Clinical Database
CREATE DATABASE clinical_db;
CREATE USER 'clinical_user'@'localhost' IDENTIFIED BY 'clinic1234';
GRANT ALL PRIVILEGES ON clinical_db.* TO 'clinical_user'@'localhost';

-- Genomic Database
CREATE DATABASE genomic_db;
CREATE USER 'genomic_user'@'localhost' IDENTIFIED BY 'genomic1234';
GRANT ALL PRIVILEGES ON genomic_db.* TO 'genomic_user'@'localhost';

FLUSH PRIVILEGES;
```

#### 3. Configure Environment Variables

**Spring Boot** (`auth-gateway/src/main/resources/application.properties`):
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/genosentinel
spring.datasource.username=genosentinel_user
spring.datasource.password=abcd1234
nestjs.base-url=http://localhost:3000
django.genomic.base-url=http://localhost:8000
```

**NestJS** (`.env`):
```env
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=clinical_user
DATABASE_PASSWORD=clinic1234
DATABASE_NAME=clinical_db
```

**Django** (`genomic/.env`):
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=genomic_db
DB_USER=genomic_user
DB_PASSWORD=genomic1234
DB_HOST=localhost
DB_PORT=3306
CLINICAL_SERVICE_URL=http://localhost:3000/api
```

#### 4. Start Services

**Terminal 1 - Spring Boot:**
```bash
cd auth-gateway
./mvnw spring-boot:run
```

**Terminal 2 - NestJS:**
```bash
cd clinical-service
npm install
npm run start:dev
```

**Terminal 3 - Django:**
```bash
cd genomic
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Terminal 4 - Angular:**
```bash
cd frontend
npm install
ng serve
```

#### 5. Access the Application

- **Frontend**: http://localhost:4200
- **Spring Boot Gateway**: http://localhost:8080/genosentinel/swagger-ui.html
- **Django API Docs**: http://localhost:8000/api/docs/
- **NestJS**: http://localhost:3000

##  Docker Deployment

### Build Images

```bash
# Set Minikube Docker environment
eval $(minikube docker-env)

# Build Spring Boot
cd auth-gateway
docker build -t auth-gateway:1.0 .

# Build NestJS
cd ../clinical-service
docker build -t nestjs-clinical:1.0 .

# Build Django
cd ../genomic
docker build -t django-genomic:1.0 .
```

## Kubernetes Deployment

### Prerequisites
```bash
# Start Minikube
minikube start

# Verify cluster
kubectl cluster-info
```

### Deploy to Kubernetes

```bash
# Deploy all services
cd k8s
./apply-all.sh

# Check deployment status
kubectl get pods
kubectl get services

# Get Minikube IP
minikube ip
```

### Access Application in Kubernetes

```bash
# Get the URL
echo "http://$(minikube ip):30080/genosentinel/swagger-ui.html"
```

### Kubernetes Architecture

```
Minikube Cluster
├── Spring Boot Pod (NodePort 30080)
│   └── Auth MySQL Pod
├── NestJS Pod (ClusterIP)
│   └── NestJS MySQL Pod
└── Django Pod (ClusterIP)
    └── Django MySQL Pod
```

### Cleanup Kubernetes Resources

```bash
cd k8s
./cleanup.sh
```

##  API Documentation

### Spring Boot Gateway
- **Swagger UI**: `http://localhost:8080/genosentinel/swagger-ui.html`
- **OpenAPI Spec**: `http://localhost:8080/genosentinel/v3/api-docs`

### Django Genomic Service
- **Swagger UI**: `http://localhost:8000/api/docs/`
- **ReDoc**: `http://localhost:8000/api/redoc/`

##  Authentication

The system uses JWT (JSON Web Tokens) for authentication:

1. **Login**: `POST /genosentinel/auth/login`
   ```json
   {
     "username": "your-username",
     "password": "your-password"
   }
   ```

2. **Response**:
   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIs...",
     "username": "your-username"
   }
   ```

3. **Use Token**: Include in headers for all requests:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   ```

## Database Schema

### Genomic Service (Django)

**Genes Table:**
```sql
CREATE TABLE genes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    symbol VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    function_summary TEXT NOT NULL,
    created_at DATETIME,
    updated_at DATETIME
);
```

**Genetic Variants Table:**
```sql
CREATE TABLE genetic_variants (
    id UUID PRIMARY KEY,
    gene_id BIGINT FOREIGN KEY REFERENCES genes(id),
    chromosome VARCHAR(10) NOT NULL,
    position BIGINT NOT NULL,
    reference_base VARCHAR(500) NOT NULL,
    alternate_base VARCHAR(500) NOT NULL,
    impact VARCHAR(30) NOT NULL,
    created_at DATETIME,
    updated_at DATETIME
);
```

**Patient Variant Reports Table:**
```sql
CREATE TABLE patient_variant_reports (
    id UUID PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    variant_id UUID FOREIGN KEY REFERENCES genetic_variants(id),
    detection_date DATE NOT NULL,
    allele_frequency DECIMAL(5,4) NOT NULL,
    created_at DATETIME,
    updated_at DATETIME
);
```

##  Testing

### Run Tests

**Spring Boot:**
```bash
cd auth-gateway
./mvnw test
```

**NestJS:**
```bash
cd clinical-service
npm run test
```

**Django:**
```bash
cd genomic
python manage.py test
```

**Angular:**
```bash
cd frontend
ng test
```

## Troubleshooting

### Common Issues

**MySQL Connection Refused:**
```bash
# Check MySQL is running
mysql -u root -p

# Verify user permissions
SHOW GRANTS FOR 'genosentinel_user'@'localhost';
```

**Port Already in Use:**
```bash
# Find process using port
lsof -i :8080  # or :3000, :8000, :4200

# Kill process
kill -9 <PID>
```

**Kubernetes Pod Not Starting:**
```bash
# Check pod logs
kubectl logs <pod-name>

# Describe pod for events
kubectl describe pod <pod-name>

# Check if images are available
docker images | grep -E 'auth-gateway|nestjs-clinical|django-genomic'
```

**Django Migrations Error:**
```bash
# Reset migrations
cd genomic
python manage.py migrate --fake
python manage.py migrate --run-syncdb
```

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Authors

- **Santiago Duque Robledo** - *Initial work* - [MyGithub](https://github.com/SDuque28)
- **Cesar David Arias Posada** - *Initial work* - [MyGithub](https://github.com/elcesar172006)

## Acknowledgments

- Spring Boot Framework
- NestJS Framework
- Django REST Framework
- Angular Team
- Kubernetes Community
