const {VacuumCleaningProcedureGoal} = require("../agents/AgentIntentions")
const Clock = require("../../utils/Clock")

class Utils{
    constructor(house){
        this.house = house
    }
MarcoRoutine(time, person){
    /*if (time.hh == 7 && time.mm == 0) {
        person.moveTo("hallway_upstairs", this.house);
        /*person.moveTo("stairs", this.house);
        person.moveTo("hallway", this.house);
        person.moveTo("living_room", this.house);
        person.moveTo("kitchen", this.house);
        person.changeMood("party");
        person.want_meal(["Water", "Coffee", "Milk", "Rusks"]);
        person.train_desire(true)
        }*/
    /*if (time.hh == 7 && time.mm == 30){
        let a= person.moveTo("kitchen", this.house)
    }*/
    //let person = p["Marco"]
    if (time.hh == 8 && time.mm == 5){
        person.wants_to_meal()
    }
        
    /*if (time.hh == 8 && time.mm == 0) {
        //person.train_desire(false)
        //person.moveTo("living_room", this.house);
        //person.moveTo("hallway", this.house);
        //person.moveTo("garage", this.house);
        //person.moveTo("out", this.house, true);
    }*/
    if (time.hh == 13 && time.mm == 0){
        person.moveTo("master_bedroom", this.house);
    }
    /*
    if (time.hh == 14 && time.mm == 0){
        person.goBackHome();
        person.want_meal(["Pasta with sauce", "Salad", "Water", "Coffee"]);
    }
    //if (time.dd % 2 == 0 && time.hh == 17 && time.mm == 45) house.people.bob.doShopping();
    if (time.hh == 18 && time.mm == 0) {
        person.moveTo("garage", this.house);
    }
    if (time.hh == 18 && time.mm == 5) {
        person.moveTo("hallway", this.house);
        person.moveTo("living_room", this.house);
        person.moveTo("kitchen", this.house);
    }
    /*if (time.hh == 18 && time.mm == 10) {
        house.people.bob.setHot();
    }*/
    /*if (time.hh == 20 && time.mm == 15){
        person.want_meal(["Pasta with sauce", "Wine", "Salad"])
    }
    if (time.hh == 21 && time.mm == 0) {
        person.moveTo("living_room", this.house);
    }
    if (time.hh == 22 && time.mm == 0) {
        person.moveTo("hallway", this.house);
        person.moveTo("stairs", this.house);
        person.moveTo("hallway_upstairs", this.house);
        person.moveTo("master_bedroom", this.house);

        //Bob wants to train
    }*/
}

DirtyDress(time, house){
    if (time.hh % 2 == 0){
        for (let room of Object.values(house.rooms)){
            let random = Math.random()*1500
            if (random < 1){
                room.count_dirty_dresses += Math.round(Math.random()*4)
            }
        }
    }
}

AlarmRoutine(time, house, new_day, alarm_utils){
    
    if (new_day === true && time.dd >= 0 && time.dd < 6) {

       ///This mechanism is repeated 
       function AlarmGoalSchedule(){
          for (const [key, value] of Object.entries(house.rooms)){
              alarm_utils.setup_alarms(value.alarms)
          }
       }

    AlarmGoalSchedule()
    return true
    }
    return false
}

NeedToRefill(time, house){
    if (time.hh == 2 && time.mm == 0){
        for (let room of Object.values(house.rooms)){
            let random = Math.random()*4
            if (random < 1){
                room.need_to_refill+= Math.round(Math.random()*4)
            }
        }
    }
}

RandomTrainDesire(time, people){
    if (time.mm % 10 == 0){
        for (let p of Object.values(people)){
            let change_train_value = Math.random()*10
            if (change_train_value < 1){
                if (p.wants_to_train === false){
                    p.want_train()
                }
            }
        }
    }
}

RandomSmokeGeneration(time, house){
    if (time.mm % 10 == 0){
        for (let room of Object.values(house.rooms)){
            ///Since a fire in a house is an exceptional condition
            ///it has been set smoke as a case having 0.1% every 10 minutes
            ///N.B. it is still a quite high probability (but it is just for validation objectives)
            let change_smoke_value = Math.random()*1000//000
            ///Even if this cascade of if-else, may seem misleading
            ///it is necessary to prevent the update of the smoke value
            ///if was already set to a certain value
            if (change_smoke_value < 1){
               if (room.smoke === false){
                  room.smoke = true
               }       
            }
        }
    }
}

RandomBurglarGeneration(time, house){
    if (time.mm % 10 == 0){
        for (let room of Object.values(house.rooms)){
            ///Since a fire in a house is an exceptional condition
            ///it has been set smoke as a case having 0.1% every 10 minutes
            ///N.B. it is still a quite high probability (but it is just for validation objectives)
            let change_burglar_value = Math.random()*1000//000
            ///Even if this cascade of if-else, may seem misleading
            ///it is necessary to prevent the update of the smoke value
            ///if was already set to a certain value
            if (change_burglar_value < 1){
               if (room.burglar === false){
                  room.burglar = true
               }       
            }
        }
    }
}

RandomGarbageGeneration(time, house){
    if (time.mm % 10 == 0){
       for (let room of Object.values(house.rooms)){
           if (typeof(room.garbage_full) !== undefined && room.garbage_full !== null && room.garbage_full !== undefined){
              let full = Math.random()*250
              if (full < 1 && room.garbage_full !== true && room.garbage_available === true){
                 room.garbage_full = true
              }      
            }
        } 
    }
}

LorenzoRoutine(time, person){
    if (time.hh == 8 && time.mm == 0) {      
        person.moveTo("hallway_upstairs", this.house);
        person.moveTo("stairs", this.house);
        person.moveTo("hallway", this.house);
        person.moveTo("living_room", this.house);
        person.moveTo("kitchen", this.house);
    }
    if (time.hh == 8 && time.mm == 30) {
        person.moveTo("living_room", this.house);
        person.moveTo("out", this.house);
    }
    if (time.hh == 14 && time.mm == 0){
        person.moveTo("living_room", this.house)
        person.moveTo("hallway", this.house)
        person.moveTo("stairs", this.house)
        person.moveTo("hallway_upstairs", this.house)
        person.moveTo("bedroom_0", this.house)
    }
    if (time.hh == 20 && time.mm == 0) {
        person.moveTo("hallway_upstairs", this.house)
        person.moveTo("stairs", this.house)
        person.moveTo("hallway", this.house)
        person.moveTo("living_room", this.house)
        person.moveTo("kitchen", this.house)
    }

    if (time.hh == 23 && time.mm == 0){
        person.moveTo("living_room", this.house)
        person.moveTo("hallway", this.house)
        person.moveTo("stairs", this.house)
        person.moveTo("hallway_upstairs", this.house)
        person.moveTo("bedroom_0", this.house)
    }
}


SoleiraRoutine(time, person){
    if (time.hh == 8 && time.mm == 0) {      
        person.moveTo("hallway_upstairs", this.house);
        person.moveTo("stairs", this.house);
        person.moveTo("hallway", this.house);
        person.moveTo("living_room", this.house);
        person.moveTo("kitchen", this.house);
    }
    if (time.hh == 8 && time.mm == 30) {
        person.moveTo("living_room", this.house);
        person.moveTo("out", this.house);
    }
    if (time.hh == 14 && time.mm == 0){
        person.moveTo("living_room", this.house)
        person.moveTo("hallway", this.house)
        person.moveTo("stairs", this.house)
        person.moveTo("hallway_upstairs", this.house)
        person.moveTo("bedroom_0", this.house)
    }
    if (time.hh == 20 && time.mm == 0) {
        person.moveTo("hallway_upstairs", this.house)
        person.moveTo("stairs", this.house)
        person.moveTo("hallway", this.house)
        person.moveTo("living_room", this.house)
        person.moveTo("kitchen", this.house)
    }

    if (time.hh == 23 && time.mm == 0){
        person.moveTo("living_room", this.house)
        person.moveTo("hallway", this.house)
        person.moveTo("stairs", this.house)
        person.moveTo("hallway_upstairs", this.house)
        person.moveTo("bedroom_0", this.house)
    }
}

SabrinaRoutine(time, person){
    if (time.hh == 6 && time.mm == 0){
        person.changeMood("party")  
    }
    if (time.hh == 8 && time.mm == 0) {      
        person.moveTo("hallway_upstairs", this.house);
        person.moveTo("stairs", this.house);
        person.moveTo("hallway", this.house);
        person.moveTo("living_room", this.house);
        person.moveTo("kitchen", this.house);
    }
    if (time.hh == 9 && time.mm == 0) {
        person.moveTo("living_room", this.house);
        person.moveTo("out", this.house);
    }
    if (time.hh == 19 && time.mm == 0) {
        person.moveTo("living_room", this.house);
        person.moveTo("kitchen", this.house);
    }
    if (time.hh == 21 && time.mm == 0) {
        person.moveTo("living_room", this.house);
    }
    if (time.hh == 22 && time.mm == 0) {
        person.moveTo("living_room", this.house);
    }
    if (time.hh == 22 && time.mm == 30) {
        person.moveTo("hallway", this.house);
        person.moveTo("stairs", this.house);
        person.moveTo("hallway_upstairs", this.house);
        person.moveTo("bedroom_0", this.house);
    }
}

BurglarMovement(burglar, time, move_out){
        // Burglar comes in the house
        if ("living_room" != burglar.room){
           if (time.hh == move_out.hh && time.mm == move_out.mm){
               burglar.moveTo("living_room", this.house);
            }
        }
        /*if (time.dd == 0 && time.hh == 12 && time.mm == 5){
            burglar.moveTo("out", this.house);
        }*/
    }

CleaningSchedule(vacuumCleanerAgent, houseGoal, houseAgent){

    if (Clock.global.hh == 0 && Clock.global.mm == 0) {
        this.house.setRandomRoomsDirty();
    }
    if (houseGoal.achieved) {
            vacuumCleanerAgent.postSubGoal(
                new VacuumCleaningProcedureGoal({ houseAgent, times: 2 }),
            );
    }
}

}


module.exports = {Utils};