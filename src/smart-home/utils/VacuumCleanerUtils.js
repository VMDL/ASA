
// Agents
const { VacuumCleanerAgent } = require("../agents/VacuumCleanerAgent");

// Devices
const { VacuumCleaner } = require("../devices/VacuumCleaner");
// Plannning
const { Move, Suck, Clean } = require("../agents/pddlActions");

const {
    VacuumCleaningProcedureIntention,
    AskToCleanIntention
} = require("../agents/AgentIntentions")

const {LearnHouseIntention, 
    AskRoomStatusIntention, 
    SendHouseConfigurationIntention,
    AskHouseConfigurationIntention
} = require("../agents/HouseServerAgent")
let { OnlinePlanning: VacuumCleanerPlanning } = require("../../pddl/OnlinePlanner")([
    Move,
    Suck,
]);

const {Postman, PostmanAcceptAllRequest } = require("../helpers/Communication");

class VacuumCleanerUtils{
    constructor(house, name, vacuum_cleaner_device, learn_house_goal){

        this.vacuum_cleaner_agent = new VacuumCleanerAgent(name, vacuum_cleaner_device)
        // initialize belief state of vacuum cleaner agent

        this.vacuum_cleaner_agent.intentions.push(LearnHouseIntention)
        this.vacuum_cleaner_agent.intentions.push(VacuumCleanerPlanning);
        this.vacuum_cleaner_agent.intentions.push(PostmanAcceptAllRequest);
        this.vacuum_cleaner_agent.intentions.push(VacuumCleaningProcedureIntention);
        this.vacuum_cleaner_agent.intentions.push(LearnHouseIntention);
        this.vacuum_cleaner_agent.intentions.push(AskRoomStatusIntention);
        this.vacuum_cleaner_agent.intentions.push(AskToCleanIntention);
        this.vacuum_cleaner_agent.intentions.push(SendHouseConfigurationIntention);
        this.vacuum_cleaner_agent.postSubGoal(new Postman());

        this.vacuum_cleaner_agent.postSubGoal(learn_house_goal)
        

    }
}

module.exports = {VacuumCleanerUtils}
