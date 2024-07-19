class Dog{
    name = "";
    sex = "";
    sire = "";
    dam = "";
    ear = "";
    color = "";
    win = 0;
    losses = 0;
    bite = 0.0;
    stamina = 0.0;
    gameness =  0.0;
    seed = 0

    constructor(name, sex, sire, dam, ear, color, win, losses, bite, stamina, gameness, seed) {
        this.name = name;
        this.sex = sex;
        this.sire = sire;
        this.dam = dam;
        this.ear = ear;
        this.color = color;
        this.win = win;
        this.losses = losses;
        this.bite = bite;
        this.stamina = stamina;
        this.gameness = gameness;
        this.seed = seed;
    }
}

module.exports = {
    Dog: Dog
}