const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");
const SimpleOnOffDevice = require("./SimpleOnOffDevice");
const Clock = require("../../utils/Clock");


///Complete this class by integrating the attributes!
class Light extends SimpleOnOffDevice {
    static POWER = 4; // Watts

    /** @type {house} House */
    /** @type {name} String */
    /** @type {room} String */
    constructor(house, room, name){
        super(house, name, room)
    }

}

module.exports = {
    Light
};