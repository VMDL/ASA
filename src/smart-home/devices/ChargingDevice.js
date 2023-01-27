const GenericDevice = require("./GenericDevice");
const Clock = require("../../utils/Clock");

class ChargingDevice extends GenericDevice{

    constructor(name, room, house, charging_minutes = 15){//power = 30){
        super(name, room, house)
        ///this.charging_power = charging_power
        this.charging_minutes = charging_minutes
        this.electricity_consumption = {on: 2, switch_on: 3, switch_off: 1, move: 8, charge: 14}
    }

    async move(from, to) {
        if (this.room == to) {
            return false;
        }
        if (this.room != from) {
            return false;
        }
        if (!this.house.rooms[from].doors_to.includes(to)) {
            return false;
        }

        let timeRemaining = 3

        while (timeRemaining) {
            await Clock.global.notifyChange("mm", "move_"+this.name);
            if (timeRemaining > 0) {
                timeRemaining = timeRemaining - Clock.TIME_STEP;
            }
         }

        this.room = to;

        this.house.metrics.electricity += this.electricity_consumption.move


        return true;
    }

    async charge(r1, name){
        if (this.room != r1){
            return false
        }
        let all_devices = this.house.rooms[this.room].getAllDevices()
        for (let cd of all_devices){
            if (cd.name == name){
                let timeRemaining = 15
                while (timeRemaining > 0) {
                    await Clock.global.notifyChange("mm", "charge_"+this.name);
                    timeRemaining = timeRemaining - Clock.TIME_STEP;
                 }
                cd.battery.battery = 1000
                cd.battery.low_battery = false
                this.log(" Charging action ends")
                this.house.metrics.electricity += this.electricity_consumption.charge
                return true
            }
        }
        return false
    }
}

module.exports={ChargingDevice}