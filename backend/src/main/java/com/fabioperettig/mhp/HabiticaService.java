package com.fabioperettig.mhp;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class HabiticaService {

    @Value("${habitica.user-id}")
    private String userId;

    @Value("${habitica.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getUserPets() {
        try {
            String url = "https://habitica.com/api/v3/user";
            HttpHeaders headers = new HttpHeaders();

            headers.set("x-api-user", userId);
            headers.set("x-api-key", apiKey);

            headers.set("x-client", "fabioperettiguimaraes-HabiticaSyncApp");
            headers.set("Accept", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            System.out.println("Tentando conectar ao Habitica...");

            return restTemplate.exchange(url, HttpMethod.GET, entity, String.class).getBody();
        } catch (Exception e) {
            System.out.println("ERRO DETECTADO: " + e.getMessage());
            return "Erro de conexão: " + e.getMessage();
        }
    }

}
