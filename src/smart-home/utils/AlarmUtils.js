const { AlarmAgent } = require("../agents/AlarmAgent");
const { Alarm, AlarmIntention, 
    AlarmGoal} = require("../devices/Alarm");

class AlarmUtils{
    constructor(name){
        this.agent = new AlarmAgent(name)
        this.agent.intentions.push(AlarmIntention);
    }

    setup_alarms(alarm_devices){
        for (let i = 0; i < alarm_devices.length; i++){
            this.agent.postSubGoal(new AlarmGoal({alarm_device: alarm_devices[i]}));
        }
    }

    alarmScenario(house) {
        house.rooms.bedroom_0.addAlarm(new Alarm("marco_alarm", 20, "I wish you were here", 7,0));
        house.rooms.bedroom_1.addAlarm(new Alarm("sabrina_alarm_1", 30, "Can I call you tonight?", 6, 0));
        house.rooms.bedroom_1.addAlarm(new Alarm("sabrina_alarm_2", 25, "Hey Joe", 7, 10));
        house.rooms.bedroom_1.addAlarm(new Alarm("sabrina_alarm_3", 35, "AO Joe", 7, 20));
    }; 
}


module.exports = {AlarmUtils}