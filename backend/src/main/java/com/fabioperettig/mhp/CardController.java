package com.fabioperettig.mhp;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/cards")
@CrossOrigin(origins = "*") // backend and frontend communication
public class CardController {

    private final HabiticaService habiticaService;

    public CardController(HabiticaService habiticaService){
        this.habiticaService = habiticaService;
    }

    @GetMapping
    public List<Card> getFullAlbum() {
        return habiticaService.getFormattedPets();
    }

    @GetMapping("/eggs")
    public List<String> getEggImages() {
        return habiticaService.getEggImages();
    }
}
