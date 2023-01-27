
const {LightAgent, 
    LightGoal,
    LightIntention} = require("../agents/LightAgent")

const {PersonRoomGoal, PersonRoomIntention} = require("../sensors/CameraSensor")


 class LightUtils{
        constructor(name, house, camera_sensors, lights){

            this.agent = new LightAgent(name, house, camera_sensors, lights)
            this.camera_sensors = camera_sensors
            this.house = house
        }

        run(){

            this.agent.intentions.push(LightIntention)
    
            this.agent.intentions.push(PersonRoomIntention)

            this.agent.postSubGoal(
                new PersonRoomGoal({camera_sensors: this.camera_sensors})
            )

            this.agent.postSubGoal(
                new LightGoal({camera_sensors: this.camera_sensors, house: this.house})
            )
        }
    }
    
    
module.exports = {LightUtils}