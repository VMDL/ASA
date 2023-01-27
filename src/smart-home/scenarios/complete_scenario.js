const Clock = require("../../utils/Clock");
const { Utils } = require("./Utils")
const {LearnHouseGoal, SendRoomStateIntention} = require("../agents/HouseServerAgent")
const {HouseServerAgent} = require("../agents/HouseServerAgent")
const {Postman, PostmanAcceptAllRequest } = require("../helpers/Communication");
const { VacuumCleanerUtils } = require("../utils/VacuumCleanerUtils")
const {VacuumCleaner} = require("../devices/VacuumCleaner")
const {Scenario} = require("./initialization")

let scenario = new Scenario()

scenario.house_server_utils.run()

scenario.charging_utils.run()

scenario.meals_utils.run()

scenario.light_utils.run()

scenario.music_utils.run()
                                
scenario.garbage_utils.run()

scenario.refill_utils.run()

scenario.security_utils.run()

scenario.gym_utils.run()

scenario.temp_utils.run()

scenario.washing_machine_utils.run()

let vacuum_cleaner_device = new VacuumCleaner(scenario.house, 
    "vacuum", "living_room");

const learn_house_Goal = new LearnHouseGoal({
    house: scenario.house,
    start:vacuum_cleaner_device.room
})

let vacuum_cleaner_utils = new VacuumCleanerUtils(scenario.house, "vacuum_cleaner", vacuum_cleaner_device, learn_house_Goal)

///curr_day is set to 8 since any day of the week will be different from eight,
///then it guarantees us that at the first iteration, new_day will be set to true 
let curr_day = 8;
let new_day = true;

///This section has been created at the aim of claryfing
///the complete scenario
///since with no functions could be difficult to be red by other coders


let houseAgent = new HouseServerAgent("house_agent", scenario.house);

houseAgent.intentions.push(PostmanAcceptAllRequest);
houseAgent.intentions.push(SendRoomStateIntention);

// add goals
houseAgent.postSubGoal(new Postman());

//let num = 0
scenario.alarm_utils.alarmScenario(scenario.house)

// Simulated Daily/Weekly schedule
Clock.global.observe("mm", () => {
    var time = Clock.global;
    
    let schedule = new Utils(scenario.house, time)
    
    ///This variable new_day enables us to add certain goal only once at a day
    if (curr_day != time.dd){
        new_day = true
    }
    else{
        new_day = false
    } 

    schedule.MarcoRoutine(time, scenario.house.getPeopleDict()["Marco"])
    schedule.SabrinaRoutine(time, scenario.house.getPeopleDict()["Sabrina"])
    schedule.SoleiraRoutine(time, scenario.house.getPeopleDict()["Soleira"])
    schedule.LorenzoRoutine(time, scenario.house.getPeopleDict()["Lorenzo"])

    schedule.RandomGarbageGeneration(time, scenario.house)
    schedule.RandomSmokeGeneration(time, scenario.house)
    schedule.RandomBurglarGeneration(time, scenario.house)
    schedule.RandomTrainDesire(time, scenario.house.getPeopleDict())
    schedule.DirtyDress(time, scenario.house)
    schedule.NeedToRefill(time, scenario.house)
    if (schedule.AlarmRoutine(time, scenario.house, new_day, scenario.alarm_utils) === true){
        ///this variable is used to update the current day everytime it will change
        curr_day = time.dd
    }
    

    //schedule.SabrinaRoutine(time, house_people["Sabrina"])
    if (new_day){
       schedule.CleaningSchedule( 
            vacuum_cleaner_utils.vacuum_cleaner_agent, 
            learn_house_Goal,
            houseAgent)
    }
    
    /*if (time.mm == 30){
        schedule.TemperatureSetting(house_utils.agent)
    }*/
});

// Start clock
Clock.startTimer();
