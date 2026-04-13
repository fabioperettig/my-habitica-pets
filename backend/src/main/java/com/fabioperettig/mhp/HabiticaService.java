package com.fabioperettig.mhp;

import java.util.List;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class HabiticaService {

    @Value("${habitica.user-id}")
    private String userId;

    @Value("${habitica.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public JsonNode getUserPets() {
        try {
            String url = "https://habitica.com/api/v3/user";
            HttpHeaders headers = new HttpHeaders();

            headers.set("x-api-user", userId);
            headers.set("x-api-key", apiKey);
            headers.set("x-client", "fabioperettiguimaraes-HabiticaSyncApp");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            String response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class).getBody();
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            return root.path("data").path("items").path("pets");

        } catch (Exception e) {
            System.out.println("ERRO DETECTADO: " + e.getMessage());
            return null;
        }
    }

    public List<Card> getFormattedPets() {

        JsonNode petsNode = getUserPets();
        List<Card> formattedCards = new ArrayList<>();

        if (petsNode != null && petsNode.isObject()) {
            Iterator<Map.Entry<String, JsonNode>> fields = petsNode.fields();

            int idCounter = 1000;

            while(fields.hasNext()){
                Map.Entry<String, JsonNode> entry = fields.next();
                String petKey = entry.getKey(); //ex 'Wolf-Base'

                /// petCatch
                Card card = new Card();
                card.setId(idCounter++);
                card.setName(petKey.replace("-", " ")); // 'Wolf-Base' >> 'Wolf Base'
                card.setImgPet("https://raw.githubusercontent.com/HabitRPG/habitica-images/32a4678c6b6fe12437c763ab7ed00d8d8ccea6c9/stable/pets/Pet-"+petKey+".png");

                /// potionCatch
                String potionKey = "Base"; ///defalut value
                if(petKey.contains("-")){
                    potionKey = petKey.substring(petKey.lastIndexOf("-")+1);
                }
                card.setImgPotion("https://raw.githubusercontent.com/HabitRPG/habitica-images/32a4678c6b6fe12437c763ab7ed00d8d8ccea6c9/stable/potions/Pet_HatchingPotion_"+potionKey+".png");


                card.setBgColor("#e0e0e0"); // improve it later
                card.setRate("Habitica Pet");

                formattedCards.add(card);
            }
        }
        return formattedCards;
    }

}
