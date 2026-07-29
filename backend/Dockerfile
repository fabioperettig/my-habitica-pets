# Etapa 1: Compilar o projeto Java com Maven
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Rodar a aplicação com um Java leve
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# O comando abaixo copia o arquivo .jar gerado na etapa anterior
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
