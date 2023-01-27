
const {GarbageAgent, 
    ThrowGarbageGoal,
    ThrowGarbageIntention} = require("../agents/GarbageAgent");
const {MoveGarbage, MoveEmptyGarbage, MoveNoGarbage, PutOutGarbage, PickGarbage, LeaveEmptyGarbage } = require("../agents/pddlActions");
const { AskRoomLocationIntention, AskRoomLocationGoal, HouseServerAgent } = require("../agents/HouseServerAgent");
const{DetectFullGarbageGoal, DetectFullGarbageIntention} = require("../sensors/GarbageSensor")

const{OnlinePlanning: GarbagePlanning} = require("../../pddl/OnlinePlanner")([MoveGarbage, MoveNoGarbage, PutOutGarbage, MoveEmptyGarbage, PickGarbage, LeaveEmptyGarbage]);

class GarbageUtils{
    constructor(name, house, garbage_sensors, garbage_d, agent_room, server_agent){

        let garbage_device = garbage_d[0]
        this.garbage_sensors = garbage_sensors



        this.agent = new GarbageAgent(name, garbage_device, house, agent_room)
        this.agent.intentions.push(AskRoomLocationIntention)
        this.agent.postSubGoal(new AskRoomLocationGoal({
            queriedAgent: server_agent,
            recipientAgent: this.agent

        }))
    }

    run(){
        
        this.agent.intentions.push(GarbagePlanning)
        this.agent.intentions.push(ThrowGarbageIntention)
        this.agent.intentions.push(DetectFullGarbageIntention)
        this.agent.postSubGoal(
            new DetectFullGarbageGoal({
                garbage_sensors: this.garbage_sensors,
            })
        )
        this.agent.postSubGoal(
            new ThrowGarbageGoal({
                garbage_sensors: this.garbage_sensors,
            })
        )
    }
}

module.exports = {GarbageUtils};
