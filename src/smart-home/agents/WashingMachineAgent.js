///Agente che osserva altri agenti e devices se si stanno scaricando (su tutta la casa)
///Per ora semplificato, ricarica solo devices
///Collegato a dei charging devices
///Planning, scelta device più vicino

const Agent = require("../../bdi/Agent");
const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");
const { TIME_STEP } = require("../../utils/Clock");
const{
    WashDirtyDresses
} = require("./pddlGoals")


///KeyPoint: When a failure is revealed, it is due to the way how an action is implemented
///it is assumed that a carrying agent, when crosses a room
///takes also all the dirty dresses in that room
///Moreover they have been implemented no limits about the capacity of the dishwasher

class WashingMachineAgent extends Agent {
    /** @type {name} String*/
    /** @type {dishwasher_device} List <WashingMachine> */
    /** @type {logistic_device} List <LogisticDevice> */
    /** @type {house} House */
    constructor(name, washing_machine_device, logistic_device, house) {
        super(name);
        this.dishwasher_device = washing_machine_device
        this.logistic_device = logistic_device
        this.house = house

        ///N.B. Kitchen is an arbitrary choice
        this.beliefs.declare("in-dishwasher " + washing_machine_device[0].room)
        this.beliefs.declare("in-logistic-device " + logistic_device[0].room)
    }
}


class WashingMachineGoal extends Goal {}
class WashingMachineIntention extends Intention {
    static applicable(goal) {
        return goal instanceof WashingMachineGoal;
    }

    *exec() {
        let dress_camera_sensors = this.goal.parameters.dress_camera_sensors
        let dressPromises = [];
        let times = 5

        for (let dress_camera of dress_camera_sensors) {
            let dressPromise = new Promise(async (res) => {
                while (true) {
                    await dress_camera.notifyChange("update_dirty_dresses", dress_camera.room)

                    if (dress_camera.update_dirty_dresses > 0){
                        this.agent.beliefs.undeclare("dress_washed")
                        this.agent.beliefs.declare("dress_to_wash " + dress_camera.room)
                        ///Otherwise it means that there is already another plan working
                        if (this.agent.house.rooms[dress_camera.room].grab_dresses === false){
                            let goal_achieved = false
                            let step = times
                            console.log("Sono in Wash")
                            while(goal_achieved!== true && step > 0){
                                this.agent.postSubGoal(new WashDirtyDresses(dress_camera.room, this.agent.logistic_device[0].room, this.agent.dishwasher_device[0].room)
                                )
                                step = step-1

                            }
                        }
                    }
                    else{
                        this.agent.beliefs.undeclare("dress_to_wash " + dress_camera.room)   
                        if (this.agent.house.rooms[dress_camera.room].grab_dresses === false){
                            this.agent.beliefs.undeclare("dress_washed")
                        }                      

                    }
                }
            });
            dressPromises.push(dressPromise);
        }
    yield Promise.all(dressPromises);
    }
}


module.exports = {WashingMachineAgent, WashingMachineGoal, WashingMachineIntention}