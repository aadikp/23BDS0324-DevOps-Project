# ═══════════════════════════════════════════════════════════════════════════════
# TravelSphere Backend — Multi-Stage Dockerfile
# ═══════════════════════════════════════════════════════════════════════════════
#
# Stage 1 │ BUILD   — Compile the Spring Boot application with Maven
# Stage 2 │ RUNTIME — Copy only the compiled JAR into a lean JRE image
#
# Usage:
#   docker build -t travelsphere-backend .
#   docker run -p 8080:8080 \
#     -e SPRING_DATA_MONGODB_URI="mongodb+srv://..." \
#     travelsphere-backend
# ═══════════════════════════════════════════════════════════════════════════════


# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM maven:3.8.5-openjdk-17 AS build

LABEL stage="build"

WORKDIR /app

# Copy the Maven project descriptor first — this layer is cached as long as
# pom.xml doesn't change, so subsequent builds that only touch source files
# will skip the dependency-download step entirely.
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Now copy the full source tree and compile.
# -DskipTests: unit tests are run in CI before this image is built.
COPY src ./src
RUN mvn clean package -DskipTests -B


# ─── Stage 2: Production Runtime ──────────────────────────────────────────────
FROM eclipse-temurin:17-jre-focal AS runtime

LABEL maintainer="TravelSphere DevOps <devops@travelsphere.io>"
LABEL version="1.0.0"
LABEL description="TravelSphere Spring Boot API"

WORKDIR /app

# ── Fix: Lower OpenSSL security level to allow MongoDB Atlas TLS handshake ────
# Ubuntu 20.04 (Focal) uses OpenSSL 1.1.x. This sed command lowers SECLEVEL
# from 2 → 1 to permit cipher suites required by MongoDB Atlas.
RUN sed -i 's/DEFAULT@SECLEVEL=2/DEFAULT@SECLEVEL=1/g' /etc/ssl/openssl.cnf 2>/dev/null || true

# Install curl for HEALTHCHECK (not present in the slim JRE image by default).
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Create a dedicated non-root user for security best practice.
RUN groupadd --system appgroup && useradd --system --gid appgroup appuser

# Copy the fat JAR produced by Stage 1.
COPY --from=build /app/target/*.jar app.jar

# Transfer ownership to the non-root user.
RUN chown appuser:appgroup app.jar

USER appuser

# ── Runtime environment variables ─────────────────────────────────────────────
# SPRING_DATA_MONGODB_URI must be injected at runtime via:
#   docker run -e SPRING_DATA_MONGODB_URI="mongodb+srv://..."
# or a Kubernetes Secret / docker-compose environment block.
ENV SPRING_DATA_MONGODB_URI=""

# Spring Boot honours SPRING_DATA_MONGODB_URI automatically because Spring
# maps environment variables to properties using relaxed binding:
#   SPRING_DATA_MONGODB_URI  →  spring.data.mongodb.uri
#
# Any value supplied at runtime will override the default in
# application.properties without modifying the image.

# ── Port ──────────────────────────────────────────────────────────────────────
EXPOSE 8080

# ── Healthcheck ───────────────────────────────────────────────────────────────
# Docker will mark the container as healthy once the recommendation-engine
# health endpoint returns HTTP 200.
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/api/auth/health || exit 1

# ── Entrypoint ────────────────────────────────────────────────────────────────
ENTRYPOINT ["java", \
  "-Djdk.tls.client.protocols=TLSv1.2", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "/app/app.jar"]
