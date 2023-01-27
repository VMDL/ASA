///This sensor aims at detecting which are the missing resources in the house
///tramite l'osservazione delle stanze

const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");
const Clock = require("../../utils/Clock");
const GenericDevice = require("../devices/GenericDevice");


class RefillSensor extends GenericDevice{
    /** @type {name} String */
    /** @type {room} String */
    constructor(name, room){
        super(name, room);
        
        this.set("refill", false)

        ///Agents whose beliefs are updated by the SmokeSensor instance
    }
};

class DetectRefillGoal extends Goal {}

class DetectRefillIntention extends Intention {
    static applicable(goal) {
        return goal instanceof DetectRefillGoal;
    }

    *exec() {
        let refillPromises = []
        let refill_sensors = this.goal.parameters.refill_sensors

        ///Ogni camera è addetta ad osservare le persone in una specifica stanza
        for (let rs of refill_sensors){
                let room = this.agent.house.rooms[rs.room]
                let refillPromise = new Promise(async (res) =>{
                    while (true) {
                        await room.notifyChange("need_to_refill", "need_to_refill"+room.need_to_refill)
                        if (room.need_to_refill > 0){
                            rs.refill = true
                        }
                        else{
                            rs.refill = false
                        }

                }
            });
        refillPromises.push(refillPromise);
    }
    yield Promise.all(refillPromises);
    }
}


module.exports = { 
    RefillSensor,
    DetectRefillGoal, 
    DetectRefillIntention,
};
