const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");
const Clock = require("../../utils/Clock");
const GenericDevice = require("../devices/GenericDevice");


class TemperatureSensor extends GenericDevice{
    /** @type {name} String */
    /** @type {room} String */
    /** @type {smoke} Boolean */
    /** @type {security_alarm} List <SecurityAlarm> */
    constructor(name, room, default_temperature = 20){
        super(name, room);

        ///The SmokeSensor instance capture from the environment
        ///the information related to the presence of smoke in a certain room
        this.set("degree", default_temperature)

        ///Agents whose beliefs are updated by the SmokeSensor instance
    }
};

class DetectTemperatureGoal extends Goal {}

class DetectTemperatureIntention extends Intention {
    static applicable(goal) {
        return goal instanceof DetectTemperatureGoal;
    }
    
    generateRandomTemperatureVariation(temperature){
        for (let temp of temperature){
            ///Since a fire in a house is an exceptional condition
            ///it has been set smoke as a case having 0.01% every 5 minutes
            ///N.B. it is still a quite high probability (but it is just for validation objectives)
            let variation = (Math.random()*6-Math.random()*6)//000
            ///Even if this cascade of if-else, may seem misleading
            ///it is necessary to prevent the update of the smoke value
            ///if was already set to a certain value
            temp.degree+=variation     

        }
    }

    *exec() {
        //while (true) 
        setInterval(() => {
            
            let thermometers = this.goal.parameters.thermometers   
            ///generateRandomSmoke generate a random value to simulate the Smoke mechanism
            ///N.B. it directly set the value of smoke_device
            ///the value of smoke is update iff it is different from the value previously declared
            this.generateRandomTemperatureVariation(thermometers)
            //yield Clock.global.notifyChange("mm", "alarm");
        }, 10000)
    }
}


module.exports = { 
    TemperatureSensor,
    DetectTemperatureGoal, 
    DetectTemperatureIntention,
};
