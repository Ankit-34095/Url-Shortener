FROM openjdk:17-jdk-slim AS build

WORKDIR /app

COPY gradlew .
COPY gradle gradle
COPY backend/build.gradle ./build.gradle
COPY backend/src src

# Make gradlew executable
RUN chmod +x gradlew

RUN ./gradlew bootJar

FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
