const GenericDevice = require("./GenericDevice");

class SimpleOnOffDevice extends GenericDevice {
    /** @type {House} house */
    /** @type {String} name */
    /** @type {String} room */
    constructor(house, name, room) {
        super(name, room, house);
        this.house = house; 
        this.set("status", "off"); 

    }
    async switchOn(room) {

        if (this.status == "on") {
            return false;
        }
        let milliseconds = 50
        await new Promise( res => setTimeout(res, milliseconds))
        this.status = "on";
        this.log(" switchOn action ends")
        return true;
    }

    async switchOff(room) {
        if (this.status == "off") {
            return false;
        }

        let milliseconds = 50
        this.log(" switchOff action begins in " + room + " and requires " + milliseconds + " milliseconds")
        await new Promise( res => setTimeout(res, milliseconds))
        this.status = "off";
        this.log(" switchOff action ends")

        return true;
    }
}

module.exports = SimpleOnOffDevice;
