const { HouseServerAgent } = require("../agents/HouseServerAgent");
const { AlarmIntention, 
    AlarmGoal} = require("../devices/Alarm.js");

class HouseUtils{
    constructor(name, house){
        this.agent = new HouseServerAgent(name, house)
        this.agent.intentions.push(AlarmIntention);

    }

    setup_alarms(alarm_devices){
        ///It has been used a for loop since there could be even multiple alarms in the same room
        ///furthermore it enables to handle 0-length list.
        for (let i = 0; i < alarm_devices.length; i++){
            this.agent.postSubGoal(new AlarmGoal({alarm_device: alarm_devices[i]}));
        }
    }

}


module.exports = {HouseUtils}