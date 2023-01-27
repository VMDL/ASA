const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");
const { MessageDispatcher } = require("../helpers/Communication");
const {SuckHouseGoal} = require("./pddlGoals");
const {AskRoomStatusGoal} = require("./HouseServerAgent")


class AskToCleanGoal extends Goal {}
class AskToCleanIntention extends Intention {
    static applicable(goal) {
        return goal instanceof AskToCleanGoal;
    }
    *exec() {
        let queriedAgent = this.goal.parameters.queriedAgent;
        let request = yield new MopCleaningProcedureGoal({
            vacuumCleanerAgent: this.agent,
            times: 2,
        });
        yield MessageDispatcher.authenticate(this.agent).sendTo(queriedAgent.name, request);
    }
}


class VacuumCleaningProcedureGoal extends Goal {}
class VacuumCleaningProcedureIntention extends Intention {
    static applicable(goal) {
        return goal instanceof VacuumCleaningProcedureGoal;
    }
    *exec({ houseAgent, times }) {
        let askRoomStatusGoal = new AskRoomStatusGoal({
            queriedAgent: houseAgent,
        });
        let suckHouseGoal = new SuckHouseGoal(this.agent.device.house, true);
        for (let i = 0; i < times; i++) {
            let goalAchieved = yield this.agent.postSubGoal(askRoomStatusGoal);
            if (i > 0) {
                suckHouseGoal = new SuckHouseGoal(this.agent.device.house, true);
            }
            if (goalAchieved) goalAchieved = yield this.agent.postSubGoal(suckHouseGoal, true);
        }
    }
}

module.exports = {
    VacuumCleaningProcedureGoal,
    VacuumCleaningProcedureIntention,
    AskToCleanGoal,
    AskToCleanIntention,
};