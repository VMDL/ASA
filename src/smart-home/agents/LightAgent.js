const Agent = require("../../bdi/Agent");
const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");
const Clock = require("../../utils/Clock");

class LightAgent extends Agent {
    constructor(name, house, camera_sensors, lights) {
        super(name);
        this.house = house;
        this.camera_sensors = camera_sensors
        this.lights = lights

        for (let i = 0; i < camera_sensors.length; i++){
            this.beliefs.declare("switch_off "+camera_sensors[i].room)
            this.beliefs.undeclare("switch_on "+camera_sensors[i].room)
        }       
    }
}


class LightGoal extends Goal{}

///Modulare
class LightIntention extends Intention{
    static applicable(goal) {
        return goal instanceof LightGoal;
    }
    *exec() {
        let camera_sensors = this.goal.parameters.camera_sensors
        let house = this.goal.parameters.house

        let camera_in_goal = {}
        let idx = 0

        let lightPromises = []

        for (let camera_sensor of Object.values(camera_sensors)) {
            camera_in_goal[idx] = false
            let lightPromise = new Promise(async (res) => {
                while (true) {
                    await camera_sensor.notifyChange("people_len", "light_agent_people_len" + camera_sensor.room)
                    if (camera_sensor.people_len == 0){
                        if (!(this.agent.beliefs.literals.includes('switch_off '+ camera_sensor.room)) && !(camera_in_goal[camera_sensor.room])){
                           this.agent.beliefs.undeclare("person_in "+camera_sensor.room)
                           if (Clock.global.hh < 18 || Clock.global.hh > 7){
                              for (let l of this.agent.lights){
                                  if (l.room == camera_sensor.room){
                                      let res = l.switchOff(camera_sensor.room)
                                      res.then((val) => {
                                         if (val){
                                            this.agent.beliefs.undeclare("switch_on ", + camera_sensor.room)
                                         }
                                      })
                                  }
                              }
                              camera_in_goal[camera_sensor.room] = true
                           }
                        }
                           else{
                              camera_in_goal[camera_sensor.room] = false
                            } 
                    }
                    else{                        
                        if (!(this.agent.beliefs.literals.includes('switch_on '+ camera_sensor.room)) && !(camera_in_goal[camera_sensor.room])){
                            this.agent.beliefs.declare("person_in "+camera_sensor.room)
                            if (Clock.global.hh < 18 || Clock.global.hh > 7){
                                for (let l of this.agent.lights){
                                    if (l.room == camera_sensor.room){
                                       let res = l.switchOn(camera_sensor.room)
                                       res.then((val) => {
                                        if (val){
                                           this.agent.beliefs.declare("switch_on ", + camera_sensor.room)
                                        }
                                     })
                                    }
                                }
                            }
                            camera_in_goal[camera_sensor.room] = true
                        }
                        else{
                            camera_in_goal[camera_sensor.room] = false
                        }
                    }
                }
            });
            lightPromises.push(lightPromise);
        }
            yield Promise.all(lightPromises);
    }
}

module.exports = {LightAgent, LightGoal, LightIntention}
