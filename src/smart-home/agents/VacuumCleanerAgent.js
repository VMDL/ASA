const Agent = require("../../bdi/Agent");

class VacuumCleanerAgent extends Agent {
    constructor(name, vacuumCleanerDevice, mopBotAgent) {
        super(name);
        this.device = vacuumCleanerDevice;
        this.mopBotAgent = mopBotAgent;
        this.beliefs.declare("in " + vacuumCleanerDevice.room);
        this.beliefs.undeclare("zero_battery");
    }
}

module.exports = {
    VacuumCleanerAgent,
};