const Agent = require("../../bdi/Agent");
const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");
const Clock = require("../../utils/Clock");

const {ThrowGarbage} = require("./pddlGoals");


///Associate a calendar to the days when he can throw the garbage (week calendar)
///Controllare se il bidone dove gettare l'immondizia è pieno o meno

class GarbageAgent extends Agent {
    /** @type {String} name */

    ///Model garbage from discrete perspective
    constructor(name, device, house, room) {
        super(name);
        this.device = device
        this.house = house
        this.room = room


        ///Extremely simplified version
        ///N.B. "in" refers to the device room, not the agent room as it is the garbage device that grabs the garbage
        this.beliefs.declare('in ' + device.room)
    }
}

class ThrowGarbageGoal extends Goal{}

class ThrowGarbageIntention extends Intention{
    static applicable(goal){
        return goal instanceof ThrowGarbageGoal
    }
    *exec(){
        let garbage_sensors = this.goal.parameters.garbage_sensors
        let followPeoplePromises = []
       for (let garbage_sensor of Object.values(garbage_sensors)){
           this.agent.beliefs.declare('in-garbage ' + garbage_sensor.room)
           let followPersonPromise = new Promise(async (res) => {
               while(true){
                  await garbage_sensor.notifyChange("full", "need_to_empty" + garbage_sensor.name);
                  if (garbage_sensor.full === true){
                     if (!this.agent.beliefs.literals.includes('full') &&  !this.agent.beliefs.literals.includes('grab')){
                        this.agent.beliefs.declare('has-garbage ' + garbage_sensor.room)
                        this.agent.beliefs.declare('full')
                        this.agent.postSubGoal(
                       new ThrowGarbage(this.agent.device.room, garbage_sensor.room))
                        }
                    }
                }
           });
           followPeoplePromises.push(followPersonPromise);
       }
       yield Promise.all(followPeoplePromises);
    }
}


module.exports = { GarbageAgent, ThrowGarbageGoal, ThrowGarbageIntention};