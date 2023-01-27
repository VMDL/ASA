///There is at least one SecurityAlarm per room
///It aims at the management of critical situation
///in which it is required to activate critical procedure

const GenericDevice = require("./GenericDevice");
const Clock = require("../../utils/Clock");


class AudioAlarmDevice extends GenericDevice{
    
    constructor(name, room, house){

        super(name, room)

        this.house = house

        this.electricity_consumption = {on: 2, switch_on: 3, switch_off: 1, burglar_alarm: 5, smoke_alarm: 5}

    }

    ///Hint: To be implemented: record the presence of the burglar until he escape o the police arrives at home

    async activate_burglar_alarm(r){

        ///this.log(" Audio Burglar alarm will run for " + milliseconds + " milliseconds")
        let timeRemaining = 0
        ///Instantaneous action
        while (timeRemaining >0) {
            await Clock.global.notifyChange("mm", "activate_smoke_alarm_"+this.name);
                timeRemaining = timeRemaining - Clock.TIME_STEP;
         }
        this.house.rooms[r].burglar = false
        this.log(" Audio Burglar alarm stops")
        this.house.metrics.electricity += this.electricity_consumption.burglar_alarm
        

        return true
    }

    ///N.b: room information is used just to inform people about fire location
    ///it is activated in all the rooms
    async activate_smoke_alarm(r){

        if (this.status == "on"){
            return false
        }

        this.status = "on"
        let timeRemaining = 0
        //this.log(" Audio Smoke alarm will run for a fire in "+ r + " this alarm will last " + milliseconds + " milliseconds")

        ///Instantaneous action
        while (timeRemaining > 0) {
            await Clock.global.notifyChange("mm", "activate_smoke_alarm_"+this.name);
           timeRemaining = timeRemaining - Clock.TIME_STEP;
         }
        this.house.rooms[r].burglar = false
        
        this.log(" Audio Smoke alarm stops")
        this.house.metrics.electricity += this.electricity_consumption.smoke_alarm
        this.status = "off"

        return true
    }
}



module.exports = {
    AudioAlarmDevice
}