# Deloitte PDI-Analyst Prep: LogicAuth Enterprise Strategy

This document provides high-level technical documentation and strategic logic to demonstrate enterprise-grade Java/Spring Boot expertise for the Deloitte PDI-Analyst role.

---

## 1. Architecture Migration Plan: Monolith to Microservices
**Goal**: Explain the transition from a Node.js/Spring Monolith to a scalable, distributed system.

### Evolution to Spring Cloud Microservices
To support enterprise scaling required by Deloitte's standards, we would migrate the "LogicAuth Resource Tracker" into a **Distributed Microservices Mesh**:

*   **Service Discovery (Netflix Eureka)**: Instead of hardcoded URLs, services (Inventory, Auth, Analytics) will register their heartbeats with a Eureka Server. This allows for dynamic scaling and load balancing.
*   **API Gateway (Spring Cloud Gateway)**: Acts as the single entry point. It handles cross-cutting concerns like global CORS, rate limiting, and routing requests to the appropriate microservice based on the URL path.
*   **Config Server (Spring Cloud Config)**: Centralizes configuration (DB URLs, JWT Secrets) using a Git-backed repository, allowing for horizontal parity across Dev, Staging, and Production environments without redeploying code.
*   **Circuit Breaker (Resilience4j)**: Protects the system from cascading failures. If the Analytics service is down, the Inventory service continues to function using cached data or fallback responses.

---

## 2. Spring Security: Enterprise Authentication Deep-Dive
**Goal**: Explain the internal workings of the security layer implemented in this project.

### The Security Filter Chain
"In LogicAuth, I implemented a **Non-Blocking Security Filter Chain** using Spring Security 6.x. The architecture follows a stateless JWT pattern:"

1.  **Stateless Session Management**: Configured `SessionCreationPolicy.STATELESS` to ensure the server doesn't store user state, enabling easy horizontal scaling across multiple instances.
2.  **JWT Authentication Filter**: Custom `AuthTokenFilter` intercepts every request, extracts the Bearer token from the header, and decrypts it using a 256-bit HMAC SHA key.
3.  **Authentication Provider**: Uses `DaoAuthenticationProvider` coupled with a custom `UserDetailsService` to fetch user credentials from MongoDB.
4.  **BCrypt Hashing**: All passwords are encrypted using the **BCrypt standard (with salting)** before persistence, neutralizing the risk of rainbow table attacks in the event of a database leak.
5.  **Role-Based Access Control (RBAC)**: Enforced via `authorizeHttpRequests`. For example, `DELETE` endpoints for assets are strictly bound to `ROLE_ADMIN` authority.

---

## 3. Enterprise Feature Logic (Deloitte-Ready Features)

### A. Resource Allocation Analytics (Predictive Java Logic)
**Logic**: A Java Service that calculates the "Mean Time To Depletion" (MTTD) using historical assignment rates.
```java
public ProjectionData predictDepletion(String categoryId) {
    List<AssignmentLog> logs = repository.findLast30Days(categoryId);
    double consumptionRate = logs.size() / 30.0; // Daily average
    long currentStock = repository.countAvailable(categoryId);
    
    // Logic: Current Stock / Consumption Rate = Days Remaining
    long daysLeft = (consumptionRate > 0) ? (long)(currentStock / consumptionRate) : 999;
    
    return new ProjectionData(categoryId, daysLeft, (daysLeft < 7) ? "CRITICAL" : "STABLE");
}
```

### B. Spring Batch: Bulk CSV Resource Processor
**Pattern**: Efficiently processing 100+ resource records without memory overflow.
*   **ItemReader**: Reads the CSV file line-by-line using `FlatFileItemReader`.
*   **ItemProcessor**: Validates the resource data and maps it to the `Resource` entity.
*   **ItemWriter**: Uses `MongoItemWriter` to perform batch inserts into the database within a single transaction.

### C. Reporting Service: Document Generation (iText/Apache POI)
**Strategy**: Generating a "Resource Status Report" in PDF/Excel format.
*   **Excel (Apache POI)**: Iterates through the Resource list and generates a workbook. Includes conditional formatting (e.g., Red cells for "Repair" status).
*   **PDF (iText/OpenPDF)**: Uses a template engine (like Thymeleaf) to render an HTML report, which is then converted into a pixel-perfect PDF document for stakeholders.

---

## 4. Tech Translation: Next.js/TS to Spring Boot
Interview talking points to bridge your existing frontend/fullstack knowledge:

1.  **Zod/Yup vs. Hibernate Validator**: "In Next.js, I used Zod for schema validation. In Java, I translate this to **JSR-380 (Bean Validation)** using annotations like `@NotNull` and `@Pattern` directly on the Entity/DTO."
2.  **Next.js API Routes vs. @RestControllers**: "Both provide the same 'Endpoint' logic, but Spring Boot's `@RestController` offers more robust dependency injection (IoC) and automatic serialization via Jackson."
3.  **Prisma/Mongoose vs. Spring Data JPA/MongoDB**: "Just as Prisma provides a typesafe abstraction over SQL, **Spring Data** provides the Repository pattern (inheritance of `MongoRepository`) to automate CRUD operations."
4.  **Typescript Interfaces vs. Java DTOs**: "I use Java **Records** or POJOs to define rigid contracts for my API, ensuring the same type safety I achieved with TypeScript in the React frontend."
5.  **Next-Auth vs. Spring Security**: "Both handle session/token management, but Spring Security is a full-featured security framework that handles Method-level security (`@PreAuthorize`) and more complex RBAC requirements."

---

## 5. Swagger / OpenAPI 3.0 Spec
**Goal**: Demonstrating Contract-First Development.

```yaml
openapi: 3.0.0
info:
  title: LogicAuth Resource API
  version: 1.0.0
paths:
  /api/resources:
    post:
      summary: Register a new secure resource
      security:
        - bearerAuth: []
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name: {type: string}
                category: {type: string}
      responses:
        '201': {description: Created}
  /api/analytics/depletion:
    get:
      summary: Get predictive resource depletion data
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    categoryId: {type: string}
                    daysRemaining: {type: integer}
                    status: {type: string}
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```
