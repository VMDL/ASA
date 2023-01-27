const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");
const Clock = require("../../utils/Clock");
const GenericDevice = require("../devices/GenericDevice");


class GarbageSensor extends GenericDevice{
    /** @type {name} String */
    /** @type {room} String */
    constructor(name, room){
        super(name, room);

        ///The SmokeSensor instance capture from the environment
        ///the information related to the presence of smoke in a certain room
        this.set("full", false)
        //this.garbage_real_world_component = garbage_real_world_component

    }
}


class DetectFullGarbageGoal extends Goal {}

class DetectFullGarbageIntention extends Intention {
    static applicable(goal) {
        return goal instanceof DetectFullGarbageGoal;
    }
    


    *exec() {
        while (true) {
            let garbagePromises = []
            let garbage_sensors = this.goal.parameters.garbage_sensors
            for (let gs of garbage_sensors){
            //let security_agent = this.goal.parameters.security_agent
                let garbagePromise = new Promise(async (res) =>{
                    while (true) {
                        ///Gestire il fatto che più dispotivi potrebbero cercare di caricarlo
                        await this.agent.house.rooms[gs.room].notifyChange("garbage_full", "charge_status" + gs.name);
                        if (this.agent.house.rooms[gs.room].garbage_full === false){
                            if (gs.full === true){
                               gs.full = false
                            }
                        }
                        else{
                            if (gs.full === false){
                                gs.full = true
                            }
                        }
                    }
                });
                garbagePromises.push(garbagePromise)
            }
            yield Promise.all(garbagePromises);
            ///PREVIOUSLY KEY FUNCTION
            //this.generateRandomFullGarbage(garbage_sensors)
        }
    }
}


module.exports = { 
    GarbageSensor, 
    DetectFullGarbageGoal, 
    DetectFullGarbageIntention
};
