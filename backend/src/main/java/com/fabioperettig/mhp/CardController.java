package com.fabioperettig.mhp;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
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

    @GetMapping("/habitica")
    public String testHabitica() {
        try {
            // Tenta buscar os dados
            return habiticaService.getUserPets();
        } catch (Exception e) {
            // Se der erro, ele vai cuspir o motivo na tela (ex: 401 Unauthorized)
            return "ERRO NO HABITICA: " + e.getMessage();
        }
    }
}
