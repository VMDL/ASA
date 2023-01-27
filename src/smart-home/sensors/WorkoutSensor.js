///Non solo programmato in automatico
///Dovrebbe anche osservare persone (in base ai loro desideri)

const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");
const GenericDevice = require("../devices/GenericDevice");


class WorkoutSensor extends GenericDevice{
    /** @type {String} name */
    /** @type {String} room */
    /** @type {List<Dictionary>} List <SecurityAlarm> */
    constructor(name, room, workout_schedule = []){
        super(name, room);
        this.set("requested_action", false)
    }
};

class DetectWorkoutGoal extends Goal{}

class DetectWorkoutIntention extends Intention{
    static applicable(goal) {
        return goal instanceof DetectWorkoutGoal;
    }

    *exec() {
        //Here we assume that exists just one workout sensor (it is not a list as we implement it)
        let workout_sensors = this.goal.parameters.workout_sensors
        let house = this.goal.parameters.house
    
        let workoutPromises = []
        
        for (let workout_sensor of workout_sensors){
            let room_people = house.rooms[workout_sensor.room].people
            for (let room_person of Object.values(room_people)){

                let workoutPromise = new Promise(async (res) =>{
                    while (true) {
                        await room_person.notifyChange("wants_to_train", room_person.name + "wants_to_train" +workout_sensor.name)
                        if (room_person.wants_to_train === true){
                            if (workout_sensor.requested_action === false){
                                workout_sensor.requested_action = true
                            }
                        }
                        else{
                            if (workout_sensor.requested_action === true){
                                workout_sensor.requested_action = false
                            }
                        }

                    }
                });
            workoutPromises.push(workoutPromise);
            }
        }
        yield Promise.all(workoutPromises)
        }
    }

module.exports={ WorkoutSensor, 
    DetectWorkoutGoal, DetectWorkoutIntention
};
