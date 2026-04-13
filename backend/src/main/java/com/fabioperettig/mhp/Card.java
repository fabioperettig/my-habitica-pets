package com.fabioperettig.mhp;

import lombok.Data;

@Data // automatic Getters and Setters
public class Card {
    private int id;
    private int level;
    private String name;
    private String imgPet;
    private String imgPotion;
    private String rate;
    private String bgColor;
}

