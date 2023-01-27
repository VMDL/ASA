///This sensor by means of some intelligent Computer Vision technique
///attempts to find if someone in the house wants to eat

const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");
const GenericDevice = require("../devices/GenericDevice");


class SmartMealSensor extends GenericDevice{
    /** @type {name} String */
    /** @type {room} String */
    /** @type {smoke} Boolean */
    /** @type {security_alarm} List <SecurityAlarm> */
    constructor(name, room){
        super(name, room);

        this.person_meal_info = []

        this.set("someone_wants_meal", 0)
    }
};

class PersonMealGoal extends Goal{}

class PersonMealIntention extends Intention{
    static applicable(goal) {
        return goal instanceof PersonMealGoal;
    }

    *exec() {
        let cameraPromises = []
        let smart_meal_sensors = this.goal.parameters.smart_meal_sensors

        ///Ogni camera è addetta ad osservare le persone in una specifica stanza
        for (let camera of smart_meal_sensors){

            for (let person of Object.values(this.agent.house.rooms[camera.room].people)){
                let cameraPromise = new Promise(async (res) =>{
                    while (true) {
                        await person.notifyChange("want_meal", "people_wants_eat_"+camera.room+"_"+person.name)
                        if (person.want_meal === true){
                            ///The person was not included in the list
                            ///thus it was never observed its interest for a meal
                            if (!camera.person_meal_info.includes(person.name)){
                                camera.person_meal_info.push(person.name.toLowerCase())
                                ///Increase the number of people that are interested into eating in the room observed by the camera
                                camera.someone_wants_meal+=1
                            }
                        }
                        else{
                            ///Reduce the number of people that are interested into eating in the room observed by the camera
                            if (camera.person_meal_info.includes(person.name)){
                               ///Remove the person from the people that are interested into have meal
                               camera.person_meal_info = camera.person_meal_info.filter(people=>people!=person.name)
                               camera.someone_wants_meal-=1
                            }
                        }

                }
            });
        cameraPromises.push(cameraPromise);
        }
    }
    yield Promise.all(cameraPromises);
    }
}


module.exports = { SmartMealSensor,
    PersonMealGoal, PersonMealIntention
};
