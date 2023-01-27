///There is at least one SecurityAlarm per room
///It aims at the management of critical situation
///in which it is required to activate critical procedure

const GenericDevice = require("./GenericDevice");
const Clock = require("../../utils/Clock");


class EmergencyCall extends GenericDevice{
    
    constructor(name, room, house){

        super(name, room)

        this.house = house
        this.electricity_consumption = {on: 1, switch_on: 1, switch_off: 1, call_police: 1, call_firemen: 1}

    }

    ///Hint: To be implemented: record the presence of the burglar until he escape o the police arrives at home

    //N.B. R is passed only to know in which rooom there are the burglar
    async call_police(r){
        let timeRemaining = 10
        this.log(" CallPolice action in " + r + " requires " + timeRemaining + " minutes")
        ///Instantaneous action
        while (timeRemaining > 0) {
            await Clock.global.notifyChange("mm", "call_police_"+this.name);
                timeRemaining = timeRemaining - Clock.TIME_STEP;
         }
        this.house.rooms[r].burglar = false
        this.log(" CallPolice action ends")
        this.house.metrics.electricity += this.electricity_consumption.call_police


        return true
    }

    //N.B. r is passed only to know in which room there is a fire
    async call_firemen(r){
        let timeRemaining = 15
        this.log(" CallFiremen action in " + r + " requires " + timeRemaining + " minutes")
        ///Instantaneous action
        while (timeRemaining > 0) {
            await Clock.global.notifyChange("mm", "call_firemen_"+this.name);
                timeRemaining = timeRemaining - Clock.TIME_STEP;
         }
        this.house.rooms[r].smoke = false
        this.house.rooms[r].smoke_device.smoke = false
        this.house.metrics.electricity += this.electricity_consumption.call_firemen


        return true
    }
}



module.exports = {
    EmergencyCall 
}