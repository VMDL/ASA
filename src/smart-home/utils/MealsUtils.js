
const {MealsAgent, PrepareMealGoal, PrepareMealIntention} = require("../agents/MealsAgent");
const {PersonMealGoal, PersonMealIntention} = require("../sensors/SmartMealSensor");
const Intention = require("../../bdi/Intention");


//const {PrepareMeal, DeliverMeal} = require("../agents/pddlActions");
//let {OnlinePlanning: MealPlanning} = require("../../pddl/OnlinePlanner")([PrepareMeal, DeliverMeal]);

class MealsUtils{

    constructor(name, house, smart_meal_sensors, meal_device){

        this.meals_agent = new MealsAgent(name, house, meal_device)
        this.smart_meal_sensors  = smart_meal_sensors
    }

    run(){
        //this.meals_agent.intentions.push(MealPlanning)

        this.meals_agent.intentions.push(PrepareMealIntention)

        this.meals_agent.intentions.push(PersonMealIntention);


        this.meals_agent.postSubGoal(new PersonMealGoal(
                                 {smart_meal_sensors: this.smart_meal_sensors}
             ));

        this.meals_agent.postSubGoal(new PrepareMealGoal(
                                 {smart_meal_sensors: this.smart_meal_sensors}
              ));
    }
}

module.exports = {MealsUtils}