const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");
const Clock = require("../../utils/Clock");
const Observable = require("../../utils/Observable");


class BatterySensor extends Observable{
    /** @type {name} String */
    /** @type {room} String */
    /** @type {smoke} Boolean */
    /** @type {security_alarm} List <SecurityAlarm> */
    constructor(name, room){
        
        //super(name, room);
        super()
        this.name = name
        this.room = room

        ///The SmokeSensor instance capture from the environment
        ///the information related to the presence of smoke in a certain room
        //this.set("burglar", burglar)

        this.set("low_battery", false)

        ///Agents whose beliefs are updated by the SmokeSensor instance
        //this.security_alarm = security_alarm

        this.battery = 1000

        this.time_point_battery = 5

        ///Working or inactive
        this.battery_status = "working"
    }
};


class DetectBatteryGoal extends Goal {}

class DetectBatteryIntention extends Intention {
    static applicable(goal) {
        return goal instanceof DetectBatteryGoal;
    }
    *exec() {

        let sensorPromises = []
        let sensors = this.goal.parameters.battery_sensors
        for (let s of sensors){
            let sensorPromise = new Promise(async (res) =>{
                while (true) {
                    await Clock.global.notifyChange("mm", "val_"+Clock.global.mm+"_"+Clock.global.hh+"_"+s.name)
                    if (s.battery_status == "working"){
                        s.battery-=5;
                    }
                    else{
                        s.battery-=1;
                    }
                    ///We assume the basic level of Battery is 1000
                    if (s.battery < 25){
                        if (s.low_battery !== true){
                           s.low_battery = true
                        }
                    }
                }
            });
        sensorPromises.push(sensorPromise);
        }
    yield Promise.all(sensorPromises);
    }
}


module.exports = { BatterySensor, 
    DetectBatteryGoal, DetectBatteryIntention,
};
