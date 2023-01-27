///There is at least one SecurityAlarm per room
///It aims at the management of critical situation
///in which it is required to activate critical procedure

const GenericDevice = require("./GenericDevice");
const Clock = require("../../utils/Clock");


class SecurityAlarm extends GenericDevice{
    
    constructor(name, room, house){
        super(name, room)

        this.house = house

        this.electricity_consumption = {fire: 4}

    }

    ///open water

    ///call fireman to shut down
    async fire(r){
        if (this.room!= r){
            return false
        }

        ///In minutes
        let timeRemaining = 15
        while (timeRemaining) {
            await Clock.global.notifyChange("mm", "fire_"+this.name);
            if (timeRemaining > 0) {
                timeRemaining = timeRemaining - Clock.TIME_STEP;
            }
        }
        this.house.rooms[r].smoke = false
        this.house.rooms[r].smoke_device.smoke = false
        this.log(" fire has been shut down")
        this.house.metrics.electricity += this.electricity_consumption.fire


        return true
    }

}



module.exports = {
    SecurityAlarm
}