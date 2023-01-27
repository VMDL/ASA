const GenericDevice = require("./GenericDevice");
const Clock = require("../../utils/Clock");


class WashingMachine extends GenericDevice {

    /** @type {house} House */
    /** @type {name} String */
    /** @type {room} String */
    constructor(name, room, house) {
        super(name, room, house)
        this.working = false
        this.electricity_consumption = {wash_dresses: 5}

    }

    /** @type {room} String */
    async wash_dresses(room){

        if (this.working === true){
            return false
        }

        if (this.room != room){
            return false
        }
        if (typeof(this.house.rooms[room]) === 'undefined' || this.house.rooms[room] === null){
            return false
        }
        if (this.house.rooms[room].count_dirty_dresses <= 0){
            return false
        }

        if (this.house.rooms[room].grab_dresses !== true){
            return false
        }
        
        this.working = true
        let timeRemaining = 30
        while (timeRemaining > 0) {
            await Clock.global.notifyChange("mm", "dress_to_wash_"+this.name);
            timeRemaining = timeRemaining - Clock.TIME_STEP;
        }
        ///We assume that the washing machine has infinite capacity
        this.house.rooms[room].count_dirty_dresses = 0//-= this.house.rooms[room].dress_camera_sensor.update_dirty_dresses
        this.house.rooms[room].dress_camera_sensor.update_dirty_dress = 0
        this.house.rooms[room].grab_dresses = false
        this.log(" Wash dresses action ends")
        this.working = false
        this.house.metrics.electricity += this.electricity_consumption.wash_dresses

        return true
    }
}

module.exports = { WashingMachine};
