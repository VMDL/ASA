const SimpleOnOffDevice = require("./SimpleOnOffDevice");
const Clock = require("../../utils/Clock");

//N.B. this class simplifies a lot the food process
//In the case of some drink it is quite common to imagine a button to click to get some "Water"
//Whereas in the case of some food (e.g. pasta con la salsa), it should be required a more complex mechanism
//Furthermore, it should be required a more granular approach (since it makes no sense to maintain as information the amount of pasta con la salsa available)
//but it should be required to account for "recipe" (since pasta con la salsa and pasta con il pesto have some common ingredients)


class MealDevice extends SimpleOnOffDevice {
    /** @type {house} House */
    /** @type {name} String */
    /** @type {room} String */
    constructor(house, name, room = "kitchen"){

        super(house, name, room);
        this.gas_consumption = {on: 3, switch_on: 2, switch_off: 1, prepare_meal: 4}


        //two possible status: full (no refill needed), refill (refill required for some type of (drink/food))
        //this.set("buffer", "full")
        //this.empty_resources = {};
        //this.set("update", false)        

        }


    async prepareMeal(room){
       if (room!= this.room){
           return false
       }
       let timeRemaining = 20
       this.log(" prepareMeal begins: in " + room + " requires " + timeRemaining + " minutes")
       while (timeRemaining) {
          await Clock.global.notifyChange("mm", "prepare_meal_"+this.name);
          if (timeRemaining > 0) {
              timeRemaining = timeRemaining - Clock.TIME_STEP;
          }
       }
       this.log(" prepareMeal ends")
       this.house.metrics.gas += this.gas_consumption.prepare_meal
       return true
    }

    async deliverMeal(name){

        let people = this.house.getPeopleDict()
        for (let p of Object.values(people)){
            if (p.name.toLowerCase() == name.toLowerCase()){
                let timeRemaining = 5
                this.log(" deliverMeal " + " to " + name + " requires " + timeRemaining + " minutes")
                while (timeRemaining) {
                    await Clock.global.notifyChange("mm", "prepare_meal_"+this.name);
                    if (timeRemaining > 0) {
                        timeRemaining = timeRemaining - Clock.TIME_STEP;
                    }
                 }
                p.want_meal = false
                this.log(" deliverMeal ends")
                return true
           }
        }
        return false
    }
}

module.exports = {MealDevice};
