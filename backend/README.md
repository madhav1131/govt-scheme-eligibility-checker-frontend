# Government Eligibility Checker API

Java 17+, Spring Boot, Spring Data JPA, and MySQL implementation of the existing `/api` backend.

## Requirements

- Java 17 or newer
- Maven 3.8+

## Local development

By default, the API uses an in-memory H2 database, so it can start without MySQL. The built-in schemes and demo accounts are loaded at startup; local database data resets when the API process restarts.

```powershell
mvn spring-boot:run
```

## MySQL

To persist data in MySQL, create a MySQL user with permission to create/use the `gov_eligibility` database, then activate the `mysql` profile:

```powershell
$env:SPRING_PROFILES_ACTIVE = "mysql"
$env:DB_PASSWORD = "your-local-mysql-password"
mvn spring-boot:run
```

The MySQL profile defaults to `localhost:3306/gov_eligibility` with username `root` and no password. Configure these environment variables as needed:

| Variable | Default |
| --- | --- |
| `DB_URL` | `jdbc:mysql://localhost:3306/gov_eligibility?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC` |
| `DB_USERNAME` | `root` |
| `DB_PASSWORD` | empty |
| `JWT_SECRET` | Development-only secret; set a unique secret of at least 32 characters |
| `JWT_EXPIRATION_MS` | `2592000000` (30 days) |
| `PORT` | `5000` |
| `CORS_ALLOWED_ORIGIN` | `http://localhost:3000` |

The frontend's Vite development proxy forwards `/api` to `http://localhost:5000`. Existing routes and response structures are preserved. On startup the service creates its tables, inserts the eight built-in schemes, and creates demo accounts:

- Admin: `admin@janseva.local` / `admin123`
- User: `rahul@example.com` / `user123`

Change or remove demo credentials before deploying outside local development. Public registration always creates a regular user; scheme management requires an administrator JWT.
