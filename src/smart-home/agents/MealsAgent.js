const Agent = require("../../bdi/Agent");
const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");
const { MealDevice } = require("../devices/MealDevice");
const { PrepareFood } = require("./pddlGoals");



class MealsAgent extends Agent{
    /**@type {String} name */
    /**@type {House} house */
    /**@type {MealDevice} device */
    constructor(name, house, device) {
            super(name);
            this.house = house;
            this.device = device;
    }
};

class PrepareMealGoal extends Goal{}

class PrepareMealIntention extends Intention{
    static applicable(goal){
        return goal instanceof PrepareMealGoal
    }
    *exec(){
        let smart_meal_sensors = this.goal.parameters.smart_meal_sensors
        let followPeoplePromises = []
 
        for (let smart_meal_sensor of Object.values(smart_meal_sensors)){
            let followPersonPromise = new Promise(async (res) => {
                while(true){
                   await smart_meal_sensor.notifyChange("someone_wants_meal", "meal_change" + smart_meal_sensor.name);

                   if (smart_meal_sensor.person_meal_info.length > 0){

                      let person_name = smart_meal_sensor.person_meal_info[smart_meal_sensor.person_meal_info.length-1].toLowerCase()

                      ///Tells that exists a person who wants to eat
                      this.agent.beliefs.declare('waiting ' + person_name)
                      /*this.agent.postSubGoal(
                        new PrepareFood(smart_meal_sensor.person_meal_info[smart_meal_sensor.person_meal_info.length-1], smart_meal_sensor.room)
                      )*/
                      let res = this.agent.device[0].prepareMeal("kitchen")
                      res.then((val)=> {
                        if (val){
                          this.agent.beliefs.declare("ready_meal " + person_name)
                          let res2 = this.agent.device[0].deliverMeal(smart_meal_sensor.person_meal_info[smart_meal_sensor.person_meal_info.length-1].toLowerCase())
                          res.then((val2) => {
                            if (val2){
                               this.agent.beliefs.undeclare("waiting " + person_name)
                               ///At the next iteration, food will be kitchened again
                               this.agent.beliefs.undeclare("ready_meal " + person_name)
                            }
                          })
                        }
                      })
                      
                      
                      //this.agent.beliefs.declare("ready_meal " + person_name)
                      //this.agent.device[0].deliverMeal(smart_meal_sensor.person_meal_info[smart_meal_sensor.person_meal_info.length-1].toLowerCase())
                      //this.agent.beliefs.undeclare("waiting " + person_name)
                      ///At the next iteration, food will be kitchened again
                      //this.agent.beliefs.undeclare("ready_meal " + person_name)

                   }
                   /*else{
                      console.log("No one is waiting in "+ smart_meal_sensor.room)
                   }*/
                }
            });
            followPeoplePromises.push(followPersonPromise);
        }
        yield Promise.all(followPeoplePromises);
     }
}


module.exports = { MealsAgent, PrepareMealGoal, PrepareMealIntention};
