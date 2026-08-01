package com.fabioperettig.mhp;

public class Card {
    private int id;
    private int level;
    private String key;
    private String name;
    private String imgPet;
    private String imgPotion;
    private String imgEgg;
    private String category;
    private String eggKey;
    private String potionKey;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImgPet() {
        return imgPet;
    }

    public void setImgPet(String imgPet) {
        this.imgPet = imgPet;
    }

    public String getImgPotion() {
        return imgPotion;
    }

    public void setImgPotion(String imgPotion) {
        this.imgPotion = imgPotion;
    }

    public String getImgEgg() {
        return imgEgg;
    }

    public void setImgEgg(String imgEgg) {
        this.imgEgg = imgEgg;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getEggKey() {
        return eggKey;
    }

    public void setEggKey(String eggKey) {
        this.eggKey = eggKey;
    }

    public String getPotionKey() {
        return potionKey;
    }

    public void setPotionKey(String potionKey) {
        this.potionKey = potionKey;
    }
}
