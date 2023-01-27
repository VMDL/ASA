const {
    SecurityAgent,
    FireGoal,
    FireIntention,
    BurglarGoal,
    BurglarIntention,
} = require("../agents/SecurityAgent");

const { DetectSmokeGoal, 
    DetectSmokeIntention} = require("../sensors/SmokeSensor")

const {DetectBurglarIntention,
        DetectBurglarGoal } = require("../sensors/BurglarSensor")

function argumentTypeCheck(smoke_device){
   if (Array.isArray(smoke_device) === false){
      smoke_device = [smoke_device]
   }
}

class SecurityUtils{
    constructor(name, people, smoke_device, house, audio_alarm_device, open_water_device, burglar_cameras, emergency_call_device){

        ///If the argument provided is a single variable, rather than a list
        ///it is transformed into a list of a single element
        argumentTypeCheck(smoke_device)
         
        this.house = house
        this.people = people
        this.agent = new SecurityAgent(name, house, emergency_call_device, audio_alarm_device, open_water_device) 
        this.smoke_device = smoke_device
        this.burglar_cameras = burglar_cameras
    }

    run(){
        this.agent.intentions.push(BurglarIntention);

        this.agent.intentions.push(FireIntention)

        this.agent.intentions.push(DetectBurglarIntention)

        this.agent.intentions.push(DetectSmokeIntention)
               
        this.agent.postSubGoal(
            new DetectSmokeGoal({
                smoke_device: this.smoke_device,
            })
        )

        this.agent.postSubGoal(
            new DetectBurglarGoal({
                burglar_cameras: this.burglar_cameras,
                })
        )


        this.agent.postSubGoal(
            new FireGoal({
                smoke_devices: this.smoke_device,
            }),
        )

        this.agent.postSubGoal(
            new BurglarGoal({
                burglar_cameras: this.burglar_cameras,
            })
        )
    }
}

module.exports = {SecurityUtils};
