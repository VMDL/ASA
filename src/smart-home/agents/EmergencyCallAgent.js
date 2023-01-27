const Agent = require("../../bdi/Agent");
const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");
const{
    CallPoliceGoal
} = require("../agents/pddlGoals")

class EmergencyCallAgent extends Agent {
    constructor(name, house, emergency_call_device, audio_alarm_device) {
        super(name);
        this.house = house;
        this.emergency_call_device = emergency_call_device
        this.audio_alarm_device = audio_alarm_device
        this.activated = false
    }
}

class BurglarGoal extends Goal {}
class BurglarIntention extends Intention {
    static applicable(goal) {
        return goal instanceof BurglarGoal;
    }

    *exec() {
        let house = this.goal.parameters.house;
        let burglar_cameras = this.goal.parameters.burglar_cameras
        let burglarPromises = [];

        for (let burglar_camera of burglar_cameras) {
            let burglarPromise = new Promise(async (res) => {
                while (true) {
                    await burglar_camera.notifyChange("burglar", burglar_camera.name)
                    if (burglar_camera.burglar === true){
                        this.agent.beliefs.declare("burglar " + burglar_camera.room)
                        this.agent.beliefs.undeclare("police " + burglar_camera.room)

                        ///Audio alarm mechanism - Run over the entire house
                        for (let dev of this.agent.audio_alarm_device){
                            ///the room information is passed to inform the people about the fire location
                            dev.activate_burglar_alarm(burglar_camera.room)
                        }
                        if (this.agent.activated === false){
                            ///Call Fireman mechanism - Just one call
                            this.activated = true
                            let res = this.agent.emergency_call_device[0].call_police(burglar_camera.room)

                            ///Unlock our lock once the promise has been solved
                            res.then((val) => {
                               this.agent.activated = !val
                               });
                        }

                    }
                    else{
                        this.agent.beliefs.undeclare("burglar " + burglar_camera.room)   
                        this.agent.beliefs.declare("police " + burglar_camera.room)              
                    }
                }
            });
            burglarPromises.push(burglarPromise);
        }
    yield Promise.all(burglarPromises);
    }
}

module.exports = {EmergencyCallAgent, BurglarGoal, BurglarIntention}