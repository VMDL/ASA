const Agent = require("../../bdi/Agent");
const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");
const{
    ManageWeights
} = require("../agents/pddlGoals")



class GymAgent extends Agent{
    constructor(name, house, room = 'bedroom_0', smart_weights = []){//, num_available_objects = 3) {
            super(name, room);
            this.house = house
            ///To simplify move assumptions
            this.device = smart_weights[0]
            ///Agent initialize its knowledge about where the weights are, N.B. We assume a single weight in the house
            for (let room of Object.values(house.rooms)){    
                if (room.name != smart_weights[0].room){
                    this.beliefs.undeclare("in " + room.name)
                }
                else{
                    this.beliefs.declare("in "+ smart_weights[0].room)
                }
            }
            this.beliefs.undeclare("zero_battery")
        }
};




class HandleGymObjectsGoal extends Goal {}

class HandleGymObjectsIntention extends Intention {
    static applicable(goal) {
        return goal instanceof HandleGymObjectsGoal;
    }

    *exec(){
       let followPeoplePromises = []

       let workout_sensors = this.goal.parameters.workout_sensors

       for (let workout of Object.values(workout_sensors)){
           let followPersonPromise = new Promise(async (res) => {
               while(true){
                  await workout.notifyChange("requested_action", "workout_change" + workout.name);
                  if (workout.requested_action === true){
                     /*
                     if (workout.weights.requested_action == "deliver"){
                        //this.agent.beliefs.declare("deliver "+workout.weights.room)
                        this.agent.postSubGoal(
                            new ManageWeights(workout.room)
                        )
                     }
                     else if (workout.weights.requested_action == "to_take"){
                    */
                        //this.agent.beliefs.declare("deliver "+workout.weights.room)
                        this.agent.postSubGoal(
                            new ManageWeights(workout.room)
                        )
                  }
               }
           });
           followPeoplePromises.push(followPersonPromise);
       }
       yield Promise.all(followPeoplePromises);
    }
}


module.exports = { GymAgent, 
    HandleGymObjectsGoal, HandleGymObjectsIntention};
