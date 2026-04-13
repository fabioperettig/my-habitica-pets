package com.fabioperettig.mhp;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@CrossOrigin(origins = "*") // IntelliJ and VSCode communication
public class CardController {

    private final HabiticaService habiticaService;

    public CardController(HabiticaService habiticaService){
        this.habiticaService = habiticaService;
    }

    @GetMapping("/cards") // fusion between server images and manual
    public List<Card> getFullAlbum() {

        List<Card> fullAlbum = new ArrayList<>();

        try{
            ObjectMapper mapper = new ObjectMapper();
            File jsonFile = new File("../frontend/cards.json");
            List<Card> manualCards = mapper.readValue(jsonFile, new TypeReference<List<Card>>(){});
            fullAlbum.addAll(manualCards);

            List<Card> habiticaCards = habiticaService.getFormattedPets();
            fullAlbum.addAll(habiticaCards);
        } catch (IOException e) {
            System.out.println("Reading manual cards is not possible." + e.getMessage());
        }

        return fullAlbum;

    }
}
