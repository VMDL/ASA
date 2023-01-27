///There is at least one SecurityAlarm per room
///It aims at the management of critical situation
///in which it is required to activate critical procedure

const Clock = require("../../utils/Clock");

const GenericDevice = require("./GenericDevice");

class OpenWaterDevice extends GenericDevice{
    
    constructor(name, room, house){

        super(name, room)

        this.house = house
        this.water_consumption = {open_water: 4}


    }

    ///Hint: To be implemented: record the presence of the burglar until he escape o the police arrives at home

    async open_water(r){
        if (this.room!= r){
            return false
        }
        if (this.status === "on"){
            return false
        }

        this.status = " on"
        let timeRemaining = 5
        while (timeRemaining) {
            await Clock.global.notifyChange("mm", "open_water_"+this.name);
            if (timeRemaining > 0) {
                timeRemaining = timeRemaining - Clock.TIME_STEP;
            }
        }
        this.status = "off"
        this.log(" Open Water action ends")
        this.house.metrics.water += this.water_consumption.open_water


        return true
    }
}



module.exports = {
    OpenWaterDevice 
}