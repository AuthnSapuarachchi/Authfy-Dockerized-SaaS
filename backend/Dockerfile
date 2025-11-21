# --- STAGE 1: The "Builder" (The Factory) ---
# We use a Maven image with Java 21 to compile the code
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# 1. Copy the project configuration (pom.xml)
COPY pom.xml .

# 2. Download dependencies (so we don't re-download them if only code changes)
# RUN mvn dependency:go-offline

# 3. Copy the actual source code
COPY src ./src

# 4. Compile the code and package it into a .jar file
# We skip tests to make the build faster
RUN mvn clean package -DskipTests

# --- STAGE 2: The "Runner" (The Shipping Box) ---
# We use a tiny, secure Java 21 Runtime to run the app
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# 5. Copy ONLY the compiled JAR file from the Builder stage
COPY --from=build /app/target/*.jar app.jar

# 6. Open port 8080
EXPOSE 8080

# 7. The command to start the app
ENTRYPOINT ["java", "-jar", "app.jar"]