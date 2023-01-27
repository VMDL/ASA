///There is at least one SecurityAlarm per room
///It aims at the management of critical situation
///in which it is required to activate critical procedure

const SimpleOnOffDevice = require("./SimpleOnOffDevice");
const Clock = require("../../utils/Clock");


class HeatingSystem extends SimpleOnOffDevice{
    
    constructor(name, room, house){
        super(house, name, room)
        this.electricity_consumption = {on: 2, switch_on: 3, switch_off: 1}
    }

    ///Counts the time to turn on and the time to set the temperature again to switch on
    async switchOn() {

        if (this.status == "on") {
            return false;
        }


        //let timeRemaining = 100
        ///Progressive temperature update
        //let step = (this.house.rooms[this.room].thermometer.degree - 20)/timeRemaining*Clock.TIME_STEP

        let timeRemaining = 30
        ///Instantaneous action
        while (timeRemaining > 0) {
            await Clock.global.notifyChange("mm", "prepare_meal_"+this.name);
            timeRemaining = timeRemaining - Clock.TIME_STEP;
         }
         this.status = "on";
         this.house.metrics.electricity += this.electricity_consumption.switch_on
         console.log(this.name + ": switched on");
         this.charge-=10
        this.house.rooms[this.room].thermometer.degree = 20
        return true;
    }

    async switchOff() {
        if (this.status == "off") {
            return false;
        }
        let timeRemaining = 1
        ///Instantaneous action
        while (timeRemaining > 0) {
            await Clock.global.notifyChange("mm", "prepare_meal_"+this.name);
            timeRemaining = timeRemaining - Clock.TIME_STEP;
         }
        this.status = "off";
        this.house.metrics.electricity += this.electricity_consumption.switch_off
        console.log(this.name + ": switched off");
        return true;
    }
}



module.exports = {
     HeatingSystem
}