
class KennelHandler{
    name = "";
    location = "";
    skinName = "";
    dogs = [];


    constructor(name, location, skinName, dogs) {
        this.name = name;
        this.location = location;
        this.skinName = skinName;
        this.dogs = dogs;
    }
}

module.exports = {
    KennelHandler: KennelHandler
}