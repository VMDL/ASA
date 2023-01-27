const{DetectTemperatureGoal, DetectTemperatureIntention} = require("../sensors/ThermometerSensor");
const { ThermostatAgent, ThermostatIntention, ThermostatGoal } = require("../agents/ThermostatAgent");

class TemperatureUtils{
    constructor(name, thermometers, coolingSystems, heatingSystems, house){
         
        this.house = house
        this.agent = new ThermostatAgent(name, house, coolingSystems, heatingSystems)
        this.thermometers = thermometers

   }

   run(){
    this.agent.intentions.push(ThermostatIntention)

    this.agent.intentions.push(DetectTemperatureIntention)

    
    this.agent.postSubGoal(
        new ThermostatGoal({
            thermometers: this.thermometers,
        })
    )

    this.agent.postSubGoal(
        new DetectTemperatureGoal({
            thermometers: this.thermometers,
        })
    )
   }
}

module.exports = {
    TemperatureUtils
}