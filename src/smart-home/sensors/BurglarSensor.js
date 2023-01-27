const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");
const Clock = require("../../utils/Clock");
const GenericDevice = require("../devices/GenericDevice");


class BurglarSensor extends GenericDevice{
    /** @type {name} String */
    /** @type {room} String */
    /** @type {smoke} Boolean */
    /** @type {security_alarm} List <SecurityAlarm> */
    constructor(name, room, burglar = false, security_alarm = []){
        super(name, room);

        ///The SmokeSensor instance capture from the environment
        ///the information related to the presence of smoke in a certain room
        this.set("burglar", burglar)

        ///Agents whose beliefs are updated by the SmokeSensor instance
        this.security_alarm = security_alarm
    }
};


class DetectBurglarGoal extends Goal {}

class DetectBurglarIntention extends Intention {
    static applicable(goal) {
        return goal instanceof DetectBurglarGoal;
    }
    

    *exec() {
        let burglar_device = this.goal.parameters.burglar_cameras
        let burglarPromises = []

        for (let bd of burglar_device) {
            let burglarPromise = new Promise(async (res) => {
            while (true) {
                ///If one of the smoke devices within the house has detected the presence of smoke in a room
                ///it will be actived the Planning procedure
                await this.agent.house.rooms[bd.room].notifyChange("burglar", "burglarAlarm"+bd.name);
                if (bd.burglar === true){
                    if ( this.agent.house.rooms[bd.room].burglar === false){
                        bd.burglar = false
                    }
                }
                else{
                    if (this.agent.house.rooms[bd.room].burglar === true){
                        bd.burglar = true
                    }
                }
            }
        });
        burglarPromises.push(burglarPromise);
    }
    yield Promise.all(burglarPromises);    }
}


module.exports = { BurglarSensor, 
    DetectBurglarGoal, DetectBurglarIntention,
};
