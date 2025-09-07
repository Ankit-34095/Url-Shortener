
# --- Build Stage ---
FROM eclipse-temurin:20-jdk-focal as builder

WORKDIR /app

# Copy Gradle wrapper and build files first to leverage Docker cache
COPY gradlew .
COPY gradle ./gradle
COPY build.gradle .
# Optionally copy settings.gradle if you have one
# COPY settings.gradle .

# Copy the rest of the source code
COPY src ./src

# Make gradlew executable
RUN chmod +x gradlew

# Build the Spring Boot application
RUN ./gradlew bootJar

# --- Run Stage ---
FROM eclipse-temurin:20-jre-focal

WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=builder /app/build/libs/*.jar app.jar

# Expose the port the Spring Boot app runs on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
