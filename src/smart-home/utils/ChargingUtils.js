
const {ChargingAgent, ChargingIntention, ChargingGoal} = require("../agents/ChargingAgent");
const { DetectBatteryIntention, DetectBatteryGoal } = require("../sensors/BatterySensor");
const { AskRoomLocationIntention, AskRoomLocationGoal, HouseServerAgent } = require("../agents/HouseServerAgent");
const {MoveCharging, ChargeDevice} = require("../agents/pddlActions");
const{OnlinePlanning: ChargePlanning} = require("../../pddl/OnlinePlanner")([MoveCharging, ChargeDevice]);

class ChargingUtils{
    /** @type {String} name */
    /** @type {String} room */
    /** @type {List <GenericSensor>} devices */
    /** @type {List <ChargingDevice>} charging_device */
    /** @type {HouseServerAgent} server_agent */
    constructor(name, room, devices, charging_device, server_agent){

        let battery_list = []
        for (let it of devices){
            battery_list.push(it.battery)
        }

        this.battery_list = battery_list
        this.devices = devices
        this.agent = new ChargingAgent(name, room, charging_device[0]);

        this.agent.intentions.push(AskRoomLocationIntention)
        this.agent.postSubGoal(new AskRoomLocationGoal({
                                        queriedAgent: server_agent,
                                        recipientAgent: this.agent
                                    }))

    }
    run(){
        this.agent.intentions.push(ChargePlanning)
        this.agent.intentions.push(ChargingIntention)
        this.agent.intentions.push(DetectBatteryIntention)
        this.agent.postSubGoal(new DetectBatteryGoal(
                                        {battery_sensors: this.battery_list}
                                      ))
        this.agent.postSubGoal(new ChargingGoal({
                                        device: this.devices
                                      }))
    }

}

module.exports = {ChargingUtils}