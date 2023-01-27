const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");
const Clock = require("../../utils/Clock");
const GenericDevice = require("../devices/GenericDevice");


class SmokeDevice extends GenericDevice{
    /** @type {name} String */
    /** @type {room} String */
    /** @type {smoke} Boolean */
    /** @type {security_alarm} List <SecurityAlarm> */
    constructor(name, room, smoke = false, security_alarm = []){
        super(name, room);

        ///The SmokeSensor instance capture from the environment
        ///the information related to the presence of smoke in a certain room
        this.set("smoke", smoke)

        ///Agents whose beliefs are updated by the SmokeSensor instance
        this.security_alarm = security_alarm
    }
};

class DetectSmokeGoal extends Goal {}

class DetectSmokeIntention extends Intention {
    static applicable(goal) {
        return goal instanceof DetectSmokeGoal;
    }
    

    *exec() {
           
        let smokePromises = []
        let smoke_device = this.goal.parameters.smoke_device    
        for (let sd of smoke_device) {
            let smokePromise = new Promise(async (res) => {
                while (true) {
                    ///If one of the smoke devices within the house has detected the presence of smoke in a room
                    ///it will be actived the Planning procedure
                    await this.agent.house.rooms[sd.room].notifyChange("smoke", "securityAlarm"+sd.name);
                    if (sd.smoke === true){
                        if ( this.agent.house.rooms[sd.room].smoke === false){
                            sd.smoke = false
                        }
                    }
                    else{
                        if (this.agent.house.rooms[sd.room].smoke === true){
                            sd.smoke = true
                        }
                    }
                }
            });
            smokePromises.push(smokePromise);
        }
        yield Promise.all(smokePromises);
    }
}


module.exports = { SmokeDevice, 
    DetectSmokeGoal, DetectSmokeIntention
};
