const Agent = require("../../bdi/Agent");
const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");

///CREARE SENSING AGENT + RAPPRESENTAZIONE DELL'ENVIRONMENT INTERNA ALL'AGENTE
///+ NELLA DELIBERATION , L'AGENTE DECIDE SE REAGIRE E CHIAMARE METODI
///SEPARAZIONE STRUTTURE DATI + COMUNICAZIONE (LATO SENSING)
//SEPARARE AGENT E DEVICE/SENSING (KEYPOINT!)
///+(4+VACUUM CLEANER)AZIONI (E.G. AGENT) + PLANNING (REASONING)

///(AGENTE CHIAMA DEVICE) + AGISCE DIRETTAMENTE SUL DEVICE
///DEVICE NON OSSERVA BELIEFS DELL'AGENT 

///BASIC IDEA: AGENT TO SOLVE A PROBLEM RESORT TO PLANNING OR CALL A METHOD FROM A DEVICE

///MY REMIND: PROMISE - YIELD - ASYNC/AWAIT
class ThermostatAgent extends Agent {
    constructor(name, house, cooling_systems, heating_systems, desidered_temperature=20) {
        super(name);
        this.cooling_systems = cooling_systems
        this.heating_systems = heating_systems
        
        for (const [key, room] of Object.entries(house.rooms)){
            this.beliefs.undeclare("turn_on_heating " + room.name)
            this.beliefs.undeclare("turn_on_cooling " + room.name)
        }

        this.actual_avg_temperature = "middle"
        this.desidered_temperature = desidered_temperature//desidered_temperature
        this.house = house
    }
}


class ThermostatGoal extends Goal {}
class ThermostatIntention extends Intention {
    static applicable(goal) {
        return goal instanceof ThermostatGoal;
    }

    *exec() {
        let thermometers= this.goal.parameters.thermometers;
        let thermoPromises = []
        let temperatures = {}
        let prev_temperatures = {}
        for (let thermo of Object.values(thermometers)) {
            let thermoPromise = new Promise(async (res) => {
                let i = 0

                while (true) {
                    await thermo.notifyChange("degree", "degree_change_in" + thermo.room);
                    if (thermo.degree < this.agent.desidered_temperature-3){
                        temperatures[thermo.room] = "cold"
                        for (let hs of this.agent.heating_systems){
                            if (hs.room == thermo.room){
                                if (hs.status != "on"){
                                    let res = hs.switchOn()
                                    res.then((val2) => {
                                        if (val2){
                                           this.agent.beliefs.declare("turn_on_heating " + thermo.name)
                                        }
                                    })
                                 }
                            }
                        }
                    }
                    else if (thermo.degree > this.agent.desidered_temperature+3){
                        temperatures[thermo.room] = "hot"
                        for (let cs of this.agent.cooling_systems){
                            if (cs.room == thermo.room){
                                if (cs.status != "on"){
                                   let res = cs.switchOn()
                                   res.then((val2) => {
                                      if (val2){
                                         this.agent.beliefs.declare("turn_on_cooling " + thermo.name)
                                      }
                                   })
                                }
                            }
                        }
                    }
                    else{
                        temperatures[thermo.room] = "middle"
                        for (let cs of this.agent.cooling_systems){
                            if (cs.room == thermo.room){
                                if (cs.status != "off"){
                                   let res = cs.switchOff()
                                   res.then((val2) => {
                                       if (val2){
                                          this.agent.beliefs.declare("turn_off_cooling " + thermo.name)
                                       }
                                    })
                                }
                            }
                        }
                        for (let hs of this.agent.heating_systems){
                            if (hs.room == thermo.room){
                                if (hs.status != "off"){
                                   let res = hs.switchOff()
                                   res.then((val2) => {
                                       if (val2){
                                          this.agent.beliefs.declare("turn_off_heating " + thermo.name)
                                       }
                                    })
                                }
                            }
                        }
                    }
                }
            });
            thermoPromises.push(thermoPromise);
        }
        yield Promise.all(thermoPromises);
    }
}

module.exports = { ThermostatAgent, ThermostatGoal, ThermostatIntention};
