// Device which actually do things in the house
const GenericDevice = require("./GenericDevice");
const Clock = require("../../utils/Clock");

class VacuumCleaner extends GenericDevice {
    static BATTERY_AUTONOMY = 200; // MINUTES
    /** @type {house} House */
    /** @type {name} String */
    /** @type {initialLocation} String*/
    constructor(house, name, initialLocation) {
        super(name, initialLocation);
        this.house = house;


        ///N.B. It would be better to pass initialLocation to the superclass as room object (String)
        this.set("room", initialLocation);

        this.electricity_consumption = {on: 2, switch_on: 2, switch_off: 1, move: 4, suck:5}

    }
    
    move(from, to) {

        if (this.room == to) {
            return false;
        }
        if (this.room != from) {
            return false;
        }
        if (!this.house.rooms[from].doors_to.includes(to)) {
            return false;
        }
        this.room = to;

        this.house.metrics.electricity += this.electricity_consumption.move


        return true;
    }
    async suck(r) {
        if (this.room != r) {
            return false;
        }
        //if (this.house.rooms[r].status != "dirty") {
        //    return false;
        //}
        let room = this.house.rooms[r]
        // check if there is a person in room.
        this.log("suck", r);

        let timeRemaining = 5
        while (timeRemaining > 0) {
            await Clock.global.notifyChange("mm", "waitForSucking");
                timeRemaining = timeRemaining - Clock.TIME_STEP;
        }
        this.house.rooms[r].status = "sucked";
        this.house.metrics.electricity += this.electricity_consumption.suck

        return true;
    }
}

module.exports = { VacuumCleaner };
