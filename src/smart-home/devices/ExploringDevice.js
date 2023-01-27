const GenericDevice = require("./GenericDevice");
const Clock = require("../../utils/Clock");


class ExploringDevice extends GenericDevice{
    /** @type {name} String */
    /** @type {room} String */
    /** @type {house} House */
    constructor(name, room, house){
        super(name, room, house)
        this.electricity_consumption = {on: 2, switch_on: 3, move: 4}

    }

    /** @type {from} String */
    /** @type {to} String */
    async move(from, to){
        if (this.room == to) {
            return false;
        }
        if (this.room != from) {
            return false;
        }
        if (!this.house.rooms[from].doors_to.includes(to)) {
            return false;
        }
        let timeRemaining = 2

        this.log(" Exploring device: Move from " + from + " to " + to + " requires " + timeRemaining + " minutes")
        ///Really fast action
        while (timeRemaining > 0) {
            await Clock.global.notifyChange("mm", "exploring_"+this.name+from);
                timeRemaining = timeRemaining - Clock.TIME_STEP;
         }
        this.room = to;
        
        this.house.metrics.electricity += this.electricity_consumption.move


        return true;
    }

}



module.exports = {ExploringDevice}