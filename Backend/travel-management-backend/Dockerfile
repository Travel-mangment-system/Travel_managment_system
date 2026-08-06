# ===================================================================
# Stage 1: Build the Spring Boot application using Maven
# ===================================================================
# CHANGED: Now using Java 21 image
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and download dependencies first (cached if pom.xml doesn't change)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build the package (skipping tests for faster builds)
COPY src ./src
RUN mvn package -DskipTests

# ===================================================================
# Stage 2: Run the application with a lightweight Java 21 JRE
# ===================================================================
# CHANGED: Now using Java 21 JRE image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built jar file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080 (matching server.port in application.properties)
EXPOSE 8080

# Run the Java application
ENTRYPOINT ["java", "-jar", "app.jar"]