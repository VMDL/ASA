const Agent = require("../../bdi/Agent");
const Goal = require("../../bdi/Goal");
const PlanningGoal = require("../../pddl/PlanningGoal");
const Clock = require("../../utils/Clock");

class ChargeDevice extends PlanningGoal{
    ///room1 refers to the location where the charging device is
    constructor(room1,  name){
       let goal = []
       goal.push("in " + room1)
       goal.push("not (need_to_charge "+name+")")
       super({goal:goal})
    }
}

class RefillRoom extends PlanningGoal{
    ///Room1 is the room where the agent has to go back
    ///Room2 is the room where the agent has to deliver the refill
    constructor(room1, room2){
        let goal = []
        goal.push("in "+room1)
        goal.push("content_bought")
        goal.push("content_in " + room2)
        goal.push("not (need_to_refill " + room2 + ")")

        super({goal: goal })
    }
}

class WashDirtyDresses extends PlanningGoal{
    constructor(room1, room2, room3){
        let goal = []
        ///Issue: what if new dress get dirty in room1?
        goal.push("not (dress_to_wash "+ room1 + ")")
        ///Issue: what if new dresses get dirty in the house
        goal.push("dress_washed")

        //goal.push("in " + room2)
        super({goal: goal })
        
    }
}

///Per ora riferimento per stanza ma va gestito per lista di device in ogni stanza
class ThrowGarbage extends PlanningGoal{
    constructor(room1, room2){
        let goal = []
        //goal.push("not (full out)")//" + room + ")")
        goal.push("not (has-garbage " + room2 + ")")//" + room)
        goal.push("not (full)")
        goal.push("in "+room1)
        goal.push("in-garbage "+room2)
        goal.push("not (grab)")
        super({goal: goal})
    }
}

/*class PrepareFood extends PlanningGoal{
    constructor(name){
        let goal = []
        name = name.toLowerCase()
        /// (not (ready_meal)) is necessary to let the agent prepare later new meal for the person called "name"
        goal.push("not (ready_meal " + name +")")
        goal.push("not (waiting "+ name + ")")

        super({goal: goal})
    }
}*/

class ManageWeights extends PlanningGoal{
    constructor(room){
        let goal = []
        goal.push("in " + room)
        goal.push("leave-weights " + room)
        super({ goal: goal });
    }
}

class LetTheMusicBegin extends PlanningGoal{

    constructor(room1, room2, majority){
        let goal = [];

        if (room2!= "out"){
            if (majority === true){
                goal.push("turn_on_music " + room2);
                goal.push("in-music-device " + room2)
                goal.push("not (turn_on_music " + room1 + ")")
            }
            else{
                goal.push("not (turn_on_music " + room2+")")
                goal.push("in-music-device " + room2)
             }
        }
    super({ goal: goal });

    } 
}

class SuckHouseGoal extends PlanningGoal {
    constructor(house, ignoreRoomsWithPeople = true) {
        let goal = [];
        for (let r of Object.values(house.rooms)) {
            if (r.name != "out" && r.status != "clean") {
                goal.push("sucked " + r.name);
            }
        }
        super({ goal: goal });
    }
}


module.exports = {
    ChargeDevice,
    RefillRoom,
    WashDirtyDresses,
    ThrowGarbage,
    //PrepareFood,
    ManageWeights,
    LetTheMusicBegin,
    SuckHouseGoal,
};
