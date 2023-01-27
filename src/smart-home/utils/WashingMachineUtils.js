
const {WashingMachineAgent, WashingMachineGoal, WashingMachineIntention} = require("../agents/WashingMachineAgent");
const { AskRoomLocationIntention, AskRoomLocationGoal} = require("../agents/HouseServerAgent");

const{ DetectDressCameraGoal,  DetectDressCameraIntention} = require("../sensors/DressCameraSensor")
const Intention = require("../../bdi/Intention");

const {MoveLogisticDevice, WashDresses, MoveGrabbingLogisticDevice} = require("../agents/pddlActions");
const{OnlinePlanning: WashingMachinePlanning} = require("../../pddl/OnlinePlanner")([MoveLogisticDevice, WashDresses, MoveGrabbingLogisticDevice]);


class WashingMachineUtils{

    /** @type {name} String */
    /** @type {dress_sensors} List<DressCameraSensor> */
    /** @type {house} House */
    /** @type {washing_machine_device} List <WashingMachine> */
    /** @type {logistic_device} List <LogisticDevice> */
    constructor(name, dress_sensors, house, washing_machine_device, logistic_device, server_agent){


        this.agent = new WashingMachineAgent(name, washing_machine_device, logistic_device, house)

        this.dress_sensors = dress_sensors

        this.agent.intentions.push(AskRoomLocationIntention)

        this.agent.postSubGoal(new AskRoomLocationGoal({
            queriedAgent: server_agent,
            recipientAgent: this.agent, 
        }))
    }

    run(){

        
        this.agent.intentions.push(WashingMachinePlanning)
        this.agent.intentions.push(WashingMachineIntention)
        this.agent.intentions.push(DetectDressCameraIntention)        
        this.agent.postSubGoal(
            new DetectDressCameraGoal({
                dress_camera_sensors: this.dress_sensors,
            })
        )
        this.agent.postSubGoal(
            new WashingMachineGoal({
                dress_camera_sensors: this.dress_sensors,
            })
        )

    }
}

module.exports = {WashingMachineUtils};
