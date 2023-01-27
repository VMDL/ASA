const GenericDevice = require("./GenericDevice");
const Clock = require("../../utils/Clock");


class LogisticDevice extends GenericDevice{
    /** @type {name} String */
    /** @type {room} String */
    /** @type {house} House */
    constructor(name, room, house){
        super(name, room, house)
        this.electricity_consumption = {on: 2, switch_on: 2, switch_off: 1, move_logistic_device: 4, move_grabbing_device: 6}


    }

    /** @type {from} String */
    /** @type {to} String */
    async move_logistic_device(from, to){
        if (this.room == to) {
            return false;
        }
        if (this.room != from) {
            return false;
        }
        if (!this.house.rooms[from].doors_to.includes(to)) {
            return false;
        }
        let timeRemaining = 5
        this.log(" Move Logistic device action begins: Move from " + from + " to " + to + " requires " + timeRemaining + " minutes")
        while (timeRemaining) {
            await Clock.global.notifyChange("mm", "move_logistic_device_"+this.name);
            if (timeRemaining > 0) {
                timeRemaining = timeRemaining - Clock.TIME_STEP;
            }
         }
        this.room = to;
        
        this.log(" Move Logistic device action ends")
        this.house.metrics.electricity += this.electricity_consumption.move_logistic_device

        return true;
    }


    /** @type {from} String */
    /** @type {to} String */
    async move_grabbing_logistic_device(from, to){
        if (this.room == to) {
            return false;
        }
        if (this.room != from) {
            return false;
        }
        if (!this.house.rooms[from].doors_to.includes(to)) {
            return false;
        }
        this.house.rooms[to].count_dirty_dresses = this.house.rooms[from].count_dirty_dresses
        this.house.rooms[to].grab_dresses = true
        this.house.rooms[from].count_dirty_dresses = 0
        this.house.rooms[from].grab_dresses = false
        let timeRemaining = 5
        this.log(" Move Grabbing Logistic Device action begins: Move while carrying some dresses from " + from + " to " + to + " requires " + timeRemaining + " minutes")
        while (timeRemaining) {
            await Clock.global.notifyChange("mm", "move_grabbing_logistic_device_"+this.name);
            if (timeRemaining > 0) {
                timeRemaining = timeRemaining - Clock.TIME_STEP;
            }
         }
        this.log(" Move Grabbing Logistic Device action ends")
        this.room = to;
        this.house.metrics.electricity += this.electricity_consumption.move_grabbing_device

        return true;
    }

}



module.exports = {LogisticDevice}