const { refillAgent, 
    refillIntention, 
    refillGoal} = require("../agents/refillAgent");

const {DetectRefillGoal, 
    DetectRefillIntention} = require("../sensors/RefillSensor")

const Intention = require("../../bdi/Intention");

const { AskRoomLocationIntention, AskRoomLocationGoal} = require("../agents/HouseServerAgent");

const {Move, 
    MoveRefill,
    BuyRefill,
    DeliverRefill} = require("../agents/pddlActions");
const{OnlinePlanning: RefillPlanning} = require("../../pddl/OnlinePlanner")([Move, MoveRefill, BuyRefill, DeliverRefill]);

class RefillUtils{
    constructor(name, house, refill_sensors, server_agent, refill_device){


        this.agent = new refillAgent(name, house, "kitchen", refill_device)

        this.agent.intentions.push(AskRoomLocationIntention)

        this.refill_sensors = refill_sensors

        this.agent.postSubGoal(new AskRoomLocationGoal({
            queriedAgent: server_agent,
            recipientAgent: this.agent, 
        }))
    
    }

    run(){
        this.agent.intentions.push(RefillPlanning)
        this.agent.intentions.push(refillIntention)

        this.agent.intentions.push(DetectRefillIntention)
        this.agent.postSubGoal(
            new DetectRefillGoal({
                refill_sensors: this.refill_sensors,
            })
        )
        this.agent.postSubGoal(
            new refillGoal({
                refill_sensors: this.refill_sensors,
            })
        )
    }
}

module.exports = {RefillUtils}