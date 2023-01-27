const Agent = require("../../bdi/Agent");
const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");
const { RefillRoom } = require("./pddlGoals");


class refillAgent extends Agent {
    /** @type {String} name*/
    /** @type {House} house*/
    /** @type {String} room*/
    constructor(name, house, room, device) {
        super(name);
        this.house = house;
        this.room = room

        this.device = device

        ///This is an assumption to let the Refill agent go out to Take the content
        //this.beliefs.declare("refill_content out")
        this.beliefs.declare("in " + this.room)
    }  
}

class refillGoal extends Goal {}
class refillIntention extends Intention {
    static applicable(goal) {
        return  goal instanceof refillGoal
    }

    *exec() {
        let refill_sensors = this.goal.parameters.refill_sensors;
        let refillPromises = []
        for (let rs of Object.values(refill_sensors)) {
            let refillPromise = new Promise(async (res) => {
                while (true) {
                    await rs.notifyChange("refill","refill_in_"+rs)
                    if (rs.refill === true){
                        this.agent.beliefs.declare("need_to_refill " + rs.room)
                        this.agent.postSubGoal(
                            new RefillRoom(this.agent.room, rs.room)
                         )
                    }
                    else{
                        this.agent.beliefs.undeclare("need_to_refill "+ rs.room)
                    }
                }
            });
            refillPromises.push(refillPromise);
        }
        yield Promise.all(refillPromises);
   }
}

module.exports = {refillAgent, refillGoal, refillIntention};
