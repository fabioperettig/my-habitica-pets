package com.fabioperettig.mhp;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class HabiticaService {

    private static final String USER_URL = "https://habitica.com/api/v3/user";
    private static final String CONTENT_URL = "https://habitica.com/api/v3/content";
    private static final String IMAGE_BASE = "https://raw.githubusercontent.com/HabitRPG/habitica-images/main/stable";
    private static final String CLIENT_ID = "fabioperettiguimaraes-MyHabiticaPets";

    @Value("${habitica.user-id}")
    private String userId;

    @Value("${habitica.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private volatile Catalog cachedCatalog;

    public List<Card> getFormattedPets() {
        JsonNode petsNode = getUserPets();
        Catalog catalog = getCatalog();
        List<Card> cards = new ArrayList<>();

        if (petsNode == null || !petsNode.isObject()) {
            return cards;
        }

        Iterator<Map.Entry<String, JsonNode>> fields = petsNode.fields();

        while (fields.hasNext()) {
            Map.Entry<String, JsonNode> entry = fields.next();
            String petKey = entry.getKey();
            PetMetadata metadata = catalog.pets().getOrDefault(petKey, fallbackMetadata(petKey));

            Card card = new Card();
            card.setLevel(entry.getValue().asInt());
            card.setKey(petKey);
            card.setName(metadata.name());
            card.setCategory(metadata.category());
            card.setEggKey(metadata.eggKey());
            card.setPotionKey(metadata.potionKey());
            card.setImgPet(IMAGE_BASE + "/pets/Pet-" + petKey + ".png");
            card.setImgPotion(metadata.potionKey().isBlank()
                    ? ""
                    : IMAGE_BASE + "/potions/Pet_HatchingPotion_" + metadata.potionKey() + ".png");
            card.setImgEgg(metadata.eggKey().isBlank()
                    ? ""
                    : IMAGE_BASE + "/eggs/Pet_Egg_" + metadata.eggKey() + ".png");
            cards.add(card);
        }

        cards.sort(Comparator
                .comparingInt((Card card) -> catalog.orderFor(card.getKey()))
                .thenComparing(Card::getName));

        for (int index = 0; index < cards.size(); index++) {
            cards.get(index).setId(index + 1);
        }

        return cards;
    }

    public List<String> getEggImages() {
        return getCatalog().eggImages();
    }

    private JsonNode getUserPets() {
        try {
            JsonNode data = requestData(USER_URL, true);
            return data.path("items").path("pets");
        } catch (Exception exception) {
            System.out.println("It was not possible to load the Habitica pets: " + exception.getMessage());
            return null;
        }
    }

    private Catalog getCatalog() {
        Catalog catalog = cachedCatalog;
        if (catalog != null) {
            return catalog;
        }

        synchronized (this) {
            if (cachedCatalog == null) {
                cachedCatalog = loadCatalog();
            }
            return cachedCatalog;
        }
    }

    private Catalog loadCatalog() {
        try {
            JsonNode content = requestData(CONTENT_URL, false);
            Map<String, Integer> dropEggOrder = createOrderMap(content.path("dropEggs"));
            Map<String, Integer> questEggOrder = createOrderMap(content.path("questEggs"));
            Map<String, Integer> dropPotionOrder = createOrderMap(content.path("dropHatchingPotions"));
            Map<String, Integer> premiumPotionOrder = createOrderMap(content.path("premiumHatchingPotions"));
            Map<String, Integer> wackyPotionOrder = createOrderMap(content.path("wackyHatchingPotions"));
            Map<String, PetMetadata> pets = new HashMap<>();

            content.path("petInfo").fields().forEachRemaining(entry -> {
                JsonNode info = entry.getValue();
                String type = info.path("type").asText("special");
                String category = categoryFor(type);
                String eggKey = info.path("egg").asText("");
                String potionKey = info.path("potion").asText("");
                String name = info.path("text").asText(entry.getKey().replace('-', ' '));

                int speciesOrder = type.equals("quest")
                        ? questEggOrder.getOrDefault(eggKey, 999)
                        : dropEggOrder.getOrDefault(eggKey, 999);
                int potionOrder = switch (type) {
                    case "premium" -> premiumPotionOrder.getOrDefault(potionKey, 999);
                    case "wacky" -> wackyPotionOrder.getOrDefault(potionKey, 999);
                    default -> dropPotionOrder.getOrDefault(potionKey, 999);
                };

                pets.put(entry.getKey(), new PetMetadata(
                        name,
                        category,
                        eggKey,
                        potionKey,
                        categoryOrder(category),
                        speciesOrder,
                        potionOrder
                ));
            });

            List<String> eggImages = new ArrayList<>();
            content.path("eggs").fieldNames().forEachRemaining(
                    eggKey -> eggImages.add(IMAGE_BASE + "/eggs/Pet_Egg_" + eggKey + ".png")
            );

            return new Catalog(pets, eggImages);
        } catch (Exception exception) {
            System.out.println("It was not possible to load Habitica's content catalog: " + exception.getMessage());
            return Catalog.empty();
        }
    }

    private JsonNode requestData(String url, boolean authenticated) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-client", CLIENT_ID);

        if (authenticated) {
            headers.set("x-api-user", userId);
            headers.set("x-api-key", apiKey);
        }

        HttpEntity<String> entity = new HttpEntity<>(headers);
        String response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class).getBody();
        return objectMapper.readTree(response).path("data");
    }

    private Map<String, Integer> createOrderMap(JsonNode node) {
        Map<String, Integer> order = new LinkedHashMap<>();
        int index = 0;
        Iterator<String> fields = node.fieldNames();

        while (fields.hasNext()) {
            order.put(fields.next(), index++);
        }

        return order;
    }

    private PetMetadata fallbackMetadata(String petKey) {
        return new PetMetadata(
                petKey.replace('-', ' '),
                "SPECIAL",
                "",
                "",
                categoryOrder("SPECIAL"),
                999,
                999
        );
    }

    private String categoryFor(String type) {
        return switch (type) {
            case "drop" -> "STANDARD";
            case "premium" -> "MAGIC_POTION";
            case "quest" -> "QUEST";
            case "wacky" -> "WACKY";
            default -> "SPECIAL";
        };
    }

    private int categoryOrder(String category) {
        return switch (category) {
            case "STANDARD" -> 0;
            case "MAGIC_POTION" -> 1;
            case "QUEST" -> 2;
            case "WACKY" -> 3;
            default -> 4;
        };
    }

    private record PetMetadata(
            String name,
            String category,
            String eggKey,
            String potionKey,
            int categoryOrder,
            int speciesOrder,
            int potionOrder
    ) {
    }

    private record Catalog(Map<String, PetMetadata> pets, List<String> eggImages) {

        private static Catalog empty() {
            return new Catalog(Map.of(), List.of());
        }

        private int orderFor(String petKey) {
            PetMetadata metadata = pets.getOrDefault(
                    petKey,
                    new PetMetadata(petKey, "SPECIAL", "", "", 4, 999, 999)
            );

            return metadata.categoryOrder() * 1_000_000
                    + metadata.speciesOrder() * 1_000
                    + metadata.potionOrder();
        }
    }
}
