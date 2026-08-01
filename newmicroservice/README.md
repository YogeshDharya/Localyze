# Localyze Microservices

A full decomposition of the Localyze platform from a Spring Boot monolith into independent microservices.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser / App)                       │
└────────────────────────────┬────────────────────────────────────────┘
                             │ HTTP (port 8080)
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  API Gateway  (:8080)                               │
│  • JWT validation (injects X-User-Id, X-User-Email, X-User-Role)   │
│  • Load-balanced routing (lb://) via Eureka                         │
│  • Aggregated Swagger UI at /swagger-ui.html                        │
└──┬──────┬──────┬──────┬──────┬──────┬──────────────────────────────┘
   │      │      │      │      │      │
   ▼      ▼      ▼      ▼      ▼      ▼
 auth  user  search  chat  media  payment
 :8081 :8082  :8083  :8084  :8085   :8087
                              
            ▲ Internal Kafka events
            │ localyze.user.registered
            │ localyze.booking.confirmed
            │ localyze.booking.cancelled  
            │ localyze.payment.captured
            ▼
       notification-service :8086

All services register with:
       discovery-server (Eureka) :8761
```

## Services

| Service | Port | Database | Description |
|---|---|---|---|
| `discovery-server` | 8761 | — | Eureka service registry |
| `api-gateway` | 8080 | — | JWT auth, routing, Swagger aggregation |
| `auth-service` | 8081 | `auth_db` | Registration, login, password reset |
| `user-service` | 8082 | `user_db` | Profiles, bookings, reviews |
| `search-service` | 8083 | `search_db` | Service listings, categories, geo-search |
| `chat-service` | 8084 | `chat_db` | REST-based messaging |
| `media-service` | 8085 | — | Cloudinary file uploads |
| `notification-service` | 8086 | — | Email notifications (Kafka consumer) |
| `payment-service` | 8087 | `payment_db` | Razorpay payment processing |

## Prerequisites

- Java 17+
- Maven 3.8+
- Docker & Docker Compose

## Quick Start

### 1. Configure Environment Variables

```bash
cp .env.example .env
# Edit .env with your credentials:
# - JWT_SECRET (256-bit base64 string)
# - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
# - SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD
# - RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
```

### 2. Start Infrastructure (Kafka + Databases)

```bash
docker-compose up -d
```

This starts:
- **Zookeeper** on port 2181
- **Kafka** on port 9092
- **Kafka UI** on port 8090 (at http://localhost:8090)
- **MySQL** instances: auth_db (3307), user_db (3308), search_db (3309), chat_db (3310), payment_db (3311)

Wait ~30 seconds for all containers to be healthy.

### 3. Build common-lib

```bash
mvn clean install -pl common-lib
```

### 4. Build All Services

```bash
mvn clean package -DskipTests
```

### 5. Start Services (in order)

Start each in a separate terminal:

```bash
# Terminal 1 — Discovery Server (must be first)
java -jar discovery-server/target/discovery-server-1.0.0-SNAPSHOT.jar

# Terminal 2 — API Gateway (after Eureka is up)
java -jar api-gateway/target/api-gateway-1.0.0-SNAPSHOT.jar

# Terminals 3-10 — Other services (any order after gateway)
java -jar auth-service/target/auth-service-1.0.0-SNAPSHOT.jar
java -jar notification-service/target/notification-service-1.0.0-SNAPSHOT.jar
java -jar media-service/target/media-service-1.0.0-SNAPSHOT.jar
java -jar search-service/target/search-service-1.0.0-SNAPSHOT.jar
java -jar user-service/target/user-service-1.0.0-SNAPSHOT.jar
java -jar payment-service/target/payment-service-1.0.0-SNAPSHOT.jar
java -jar chat-service/target/chat-service-1.0.0-SNAPSHOT.jar
```

### 6. Verify

| URL | Description |
|---|---|
| http://localhost:8761 | Eureka Dashboard (all services should be UP) |
| http://localhost:8080/swagger-ui.html | Aggregated Swagger UI |
| http://localhost:8090 | Kafka UI |

## Inter-Service Communication

### Synchronous (REST)
| Caller | Callee | Endpoint | Purpose |
|---|---|---|---|
| `user-service` | `search-service` | `GET /internal/services/{id}/exists` | Validate service before booking |
| `user-service` | `search-service` | `PATCH /internal/services/{id}/rating` | Update avg rating after review |
| `payment-service` | `user-service` | `PATCH /internal/users/{id}/booking-paid` | Mark booking as PAID |
| `auth-service` | `notification-service` | `POST /internal/notify/email` | Send password reset email |

### Asynchronous (Kafka)
| Producer | Topic | Consumer | Trigger |
|---|---|---|---|
| `auth-service` | `localyze.user.registered` | `notification-service` | New user registration (welcome email) |
| `user-service` | `localyze.booking.confirmed` | `notification-service` | Booking confirmed (confirmation email) |
| `user-service` | `localyze.booking.cancelled` | `notification-service` | Booking cancelled (cancellation email) |
| `payment-service` | `localyze.payment.captured` | `notification-service` | Payment captured (receipt email) |

## API Reference

All requests go through the gateway at `http://localhost:8080`.

### Authentication
```
POST /api/auth/register    — Register new user
POST /api/auth/login       — Login and get JWT
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Services (Search)
```
GET    /api/services?page=0&size=20    — List services
GET    /api/services/{id}              — Get service
POST   /api/services                   — Create listing (PROVIDER)
PUT    /api/services/{id}              — Update listing
DELETE /api/services/{id}              — Delete listing
GET    /api/services/nearby?lat=&lng=&radius=5&categoryId=
GET    /api/services/search?q=keyword
GET    /api/categories
POST   /api/categories                 — Create category (ADMIN)
```

### Bookings
```
POST   /api/bookings
GET    /api/bookings/{id}
GET    /api/bookings/my/customer
GET    /api/bookings/my/provider
PATCH  /api/bookings/{id}/status
POST   /api/bookings/{id}/cancel
```

### Reviews
```
POST   /api/reviews
GET    /api/reviews/service/{serviceId}
GET    /api/reviews/user/{userId}
DELETE /api/reviews/{id}
```

### Messages
```
POST   /api/messages
GET    /api/messages/conversation/{otherUserId}
GET    /api/messages/partners
GET    /api/messages/unread-count
PUT    /api/messages/{id}/read
```

### Payments
```
POST   /api/payments/create-order
POST   /api/payments/verify
GET    /api/payments/my
GET    /api/payments/booking/{bookingId}
```

### Media
```
POST   /api/upload
POST   /api/upload/avatar
POST   /api/upload/service-image
DELETE /api/upload?publicId=
```

## JWT Security Model

The API Gateway:
1. Validates the `Authorization: Bearer <token>` header for all routes except `/api/auth/**`
2. Injects downstream headers: `X-User-Id`, `X-User-Email`, `X-User-Role`
3. All downstream services **trust these headers** without re-validating the JWT

Whitelisted paths (no JWT required):
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

## Database Schema

Each service owns its database (Database-per-Service pattern):

| Database | Tables |
|---|---|
| `auth_db` | `auth_users` |
| `user_db` | `user_profiles`, `bookings`, `reviews` |
| `search_db` | `services`, `service_images`, `categories` |
| `chat_db` | `messages` |
| `payment_db` | `payments` |

Tables are created automatically via Hibernate `ddl-auto: update`.

## Development Tips

### Run individual service in dev
```bash
mvn spring-boot:run -pl auth-service -Dspring-boot.run.profiles=dev
```

### Build single service
```bash
mvn clean package -pl common-lib,auth-service -am -DskipTests
```

### View Kafka messages
Access Kafka UI at http://localhost:8090

### Health checks
```bash
curl http://localhost:8081/actuator/health  # auth-service
curl http://localhost:8082/actuator/health  # user-service
# ... etc.
```

## Kafka Topics

Topics are auto-created with default settings. For production, pre-create with replication:
```bash
docker exec -it localyze-kafka kafka-topics --create \
  --bootstrap-server localhost:9092 \
  --replication-factor 1 --partitions 3 \
  --topic localyze.user.registered
```

Topics:
- `localyze.user.registered`
- `localyze.booking.confirmed`
- `localyze.booking.cancelled`
- `localyze.payment.captured`

## Module Structure

```
localyze-microservices/
├── pom.xml                     ← Root multi-module POM
├── docker-compose.yml          ← Infrastructure
├── .env.example                ← Environment variables template
├── README.md                   ← This file
├── common-lib/                 ← Shared library (DTOs, enums, security, events)
├── discovery-server/           ← Eureka Server (:8761)
├── api-gateway/                ← Spring Cloud Gateway (:8080)
├── auth-service/               ← Authentication (:8081)
├── user-service/               ← Users, Bookings, Reviews (:8082)
├── search-service/             ← Listings, Categories, Geo (:8083)
├── chat-service/               ← Messaging (:8084)
├── media-service/              ← File Uploads (:8085)
├── notification-service/       ← Emails via Kafka (:8086)
└── payment-service/            ← Razorpay Payments (:8087)
```
