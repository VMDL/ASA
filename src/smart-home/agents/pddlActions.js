const pddlActionIntention = require("../../pddl/actions/pddlActionIntention");


class ChargeDevice extends pddlActionIntention{
   static parameters = ["r1","r2","name"];

   ///The first two pair of precondition states the same thing
   ///as r1 should be equal to r2
   static precondition = [
      ["in", "r1"],
      ["request_in", "r1"],
      ["in","r2"],
      ["request_in","r2"],
      ["need_to_charge","name"]
   ];
   static effect = [
      ["not need_to_charge","name"],
      ["not request_in", "r1"]
   ];
   *exec({r1,r2,name}){
    if (this.checkPrecondition()) {
        let res = this.agent.device.charge(r1, name);
        yield res;
        if (res) {
            this.applyEffect();
        } else {
            throw new Error("ChargeDevice failed");
        }
    } else throw new Error("pddl precondition not valid in ChargeDevice");
    }
}

class MoveCharging extends pddlActionIntention{
    static parameters = ["r1", "r2"];
    static precondition = [
    ["in", "r1"], 
    ["door", "r1", "r2"],
    ];
    static effect = [
        ["in", "r2"],
        ["not in", "r1"],
    ];
    *exec({ r1, r2 }) {
        if (this.checkPrecondition()) {
            let res = this.agent.device.move(r1, r2);
            yield res;
            if (res) {
                this.applyEffect();
            } else {
                throw new Error("MoveCharging failed");
            }
        } else throw new Error("pddl precondition not valid in MoveCharging");
    }
}

///In Buy we assume that any kind of refill
///must be bought outside of the house by the agent
class BuyRefill extends pddlActionIntention{
    static parameters = []
    static precondition = [
        ["in", "out"],
        //["refill_content", "out"]
    ];
    ///Buy the content for which it is required the refill
    static effect = [
        ["content_bought"],
        ["content_in", "out"]
    ];
    *exec({}){
        if (this.checkPrecondition()) {
            let res = this.agent.device[0].buy_refill("out")
            ///Simplification
            yield res;
            if (res) {
                this.applyEffect();
            } else {
                throw new Error("buy refill failed");
            }
        } else throw new Error("pddl precondition not valid in WashDress");      
    }
}

class MoveRefill extends pddlActionIntention{
    static parameters = ["r1","r2"]
    static precondition = [
        ["in", "r1"],
        ["content_in", "r1"],
        ["door", "r1", "r2"],
    ];
    ///Buy the content for which it is required the refill
    static effect = [
        ["not in", "r1"],
        ["not content_in" , "r1"],
        ["in", "r2"],
        ["content_in", "r2"]
    ];
    *exec({r1,r2}){
        if (this.checkPrecondition()) {
            let res = this.agent.device[0].move(r1, r2)
            yield res;
            if (res) {
                this.applyEffect();
            } else {
                throw new Error("move refill failed");
            }
        } else throw new Error("pddl precondition not valid in MoveRefill");      
    }
}


class DeliverRefill extends pddlActionIntention{
    static parameters = ["r1"]
    static precondition = [
        ["need_to_refill", "r1"],
        ["content_in", "r1"],
        ["in", "r1"],
    ];
    ///Buy the content for which it is required the refill
    static effect = [
        ["not need_to_refill", "r1"]
    ];
    *exec({r1}){
        if (this.checkPrecondition()) {
            let res = 1
            ///Simplification
            yield res;
            if (res) {
                this.applyEffect();
            } else {
                throw new Error("movw refill failed");
            }
        } else throw new Error("pddl precondition not valid in WashDress");      
    }
}

class WashDresses extends pddlActionIntention{
    static parameters = ["r1"];
    ///These preconditions aims at guarantee that
    ///the logistic device (that carries the dress)
    ///is exactly in the same room as the dishwasher
    static precondition = [
        ["in-logistic-device", "r1"],
        ["dress_to_wash","r1"],
        ["in-dishwasher", "r1"],
        ["not dress_washed"]
    ];
    static effect = [
        ["dress_washed"],
        ["not dress_to_wash","r1"]
    ];
    *exec({r1, r2}){
        if (this.checkPrecondition()) {


            ///Simplification
            let res = this.agent.dishwasher_device[0].wash_dresses(r1)
            yield res;
            if (res) {
                this.applyEffect();
            } else {
                throw new Error("put out wash failed");
            }
        } else throw new Error("pddl precondition not valid in WashDress");      
    }
}



class PickGarbage extends pddlActionIntention{
    static parameters = ["room1"]
    static precondition = [["in", "room1"],
                          ["in-garbage", "room1"],
                          ["not grab"],
                          ["full"],
                          ["has-garbage","room1"]
    ]
    static effect = [
        ["grab"]
    ];
    *exec({room1, room2}){
        if (this.checkPrecondition()) {
            let res = 1//this.agent.device.move_out_garbage(room1, room2);
            //this.agent.room = room2

            yield res;
            if (res) {
                this.applyEffect();
            } else {
                throw new Error("pick garbage failed");
            }
        } else throw new Error("pddl precondition not valid in MoveGarbage");      
    }    
}


//Corrisponde al device che rilascia a terra il contenitore affinché gli altri dispositivi possano usufruirne
class LeaveEmptyGarbage extends pddlActionIntention{
    static parameters = ["room1"]
    static precondition = [
        ["in", "room1"],
        ["in-garbage", "room1"],
        ["grab"],
        ["not full"],
        ["not has-garbage","room1"]
    ]
    static effect = [
        ["not grab"]
    ];
    *exec({room1}){
        if (this.checkPrecondition()) {
            let res = this.agent.device.leave_garbage(room1)//this.agent.device.move_out_garbage(room1, room2);
            //this.agent.room = room2
            this.agent.house.rooms[room1].garbage_available = true

            yield res;
            if (res) {
                this.applyEffect();
            } else {
                throw new Error("leave empty garbage failed");
            }
        } else throw new Error("pddl precondition not valid in MoveGarbage");      
    }
}

class MoveEmptyGarbage extends pddlActionIntention{
    static parameters = ["room1","room2"]
    static precondition= [
        ["in", "room1"],
        ["in-garbage","room1"],
        ["not has-garbage", "room1"],
        ["door", "room1", "room2"],
        ["not full"],
        ["grab"]
    ];
    static effect=[
        ["in","room2"],
        ["in-garbage", "room2"],
        ["not has-garbage", "room2"],
        ["not in","room1"],
    ];
    *exec({room1, room2}){
            if (this.checkPrecondition()) {
                let res = this.agent.device.move_empty_garbage(room1, room2);
                this.agent.room = room2

                yield res;
                if (res) {
                    this.applyEffect();
                } else {
                    throw new Error("movegarbage garbage failed");
                }
            } else throw new Error("pddl precondition not valid in MoveGarbage");      
    }
}

class MoveNoGarbage extends pddlActionIntention{
    static parameters = ["room1","room2"]
    static precondition= [
        ["in", "room1"],
        ["door", "room1", "room2"],
        //["not full"],
    ];
    static effect=[
        ["in","room2"],
        //["not has-garbage", "room2"],
        ["not in","room1"],
    ];
    *exec({room1, room2}){
            if (this.checkPrecondition()) {
                let res = this.agent.device.move_garbage(room1, room2);
                this.agent.room = room2
                yield res;
                if (res) {
                    this.applyEffect();
                } else {
                    throw new Error("MOVENOGARB garbage failed");
                }
            } else throw new Error("pddl precondition not valid in MoveNoGarbage");      
    } 
}

///room2 refers to out
///not content means that the garbage contains no more waste as it has been thrown
class PutOutGarbage extends pddlActionIntention{
    static parameters = ["room1"]
    static precondition= [
        ["in", "out"],
        ["in-garbage","out"],
        ["full"],
        ["has-garbage","out"],
        ["grab"]
    ];
    static effect=[
        ["not full"],
        ["not has-garbage", "out"]
    ];
    *exec({room1}){
            if (this.checkPrecondition()) {
                let res = this.agent.device.empty_garbage(room1);
                yield res;
                if (res) {
                    this.applyEffect();
                } else {
                    throw new Error("putOUTGARB garbage failed");
                }
            } else throw new Error("pddl precondition not valid in PutOut");      
    }
}

class MoveGarbage extends pddlActionIntention{
    static parameters = ["room1","room2"]
    static precondition= [
        ["in", "room1"],
        ["has-garbage", "room1"],
        ["in-garbage","room1"],
        ["door", "room1", "room2"],
        ["grab"]
        //["full"]
    ];
    static effect=[
        ["in","room2"],
        ["has-garbage", "room2"],
        ["in-garbage","room2"],
        ["not in","room1"],
        ["not has-garbage", "room1"],
        ["not in-garbage","room1"]
    ];
    *exec({room1, room2}){
            if (this.checkPrecondition()) {
                let res = this.agent.device.move_out_garbage(room1, room2);
                this.agent.room = room2

                yield res;
                if (res) {
                    this.applyEffect();
                } else {
                    throw new Error("movegarbage garbage failed");
                }
            } else throw new Error("pddl precondition not valid in MoveGarbage");      
    }
}



/*class PrepareMeal extends pddlActionIntention{
    static parameters = ["name"];
    static precondition = [
       ["waiting", "name"]
    ];
    static effect = [
       ["ready_meal","name"]
    ];
    *exec(){
        if (this.checkPrecondition){

            let res = this.agent.device[0].prepareMeal()            

            yield res;

            if (res){
                this.applyEffect();
            } else{
                throw new Error("PrepareMeal non succedeed")
            }
        } else throw new Error("pddl precondition not valid")
    }
}

class DeliverMeal extends pddlActionIntention{
    static parameters = ["name"];
    static precondition = [
        ["ready_meal", "name"],
        ["waiting", "name"]

    ];
    static effect = [
        ["not waiting", "name"],
        ///At the next iteration, food will be kitchened again
        ["not ready_meal", "name"]
    ];
    *exec({name, room}){
        if (this.checkPrecondition){

            let res = this.agent.device[0].deliverMeal(name, room)          

            yield res;

            if (res){
                this.applyEffect();
            } else{
                throw new Error("DeliverMeal error")
            }
        } else throw new Error("pddl precondition not valid in DeliverMeal")
    }
}*/

class MoveTurnedOnDevice extends pddlActionIntention{
    static parameters =["r1","r2"];

    static precondition = [
        ["in-music-device", "r1"], 
        ["door", "r1", "r2"],
        ["turn_on_music", "r1"]
        ];
    static effect = [
            ["in-music-device", "r2"],
            ["not in-music-device", "r1"],
            ["turn_on_music", "r2"],
            ["not turn_on_music", "r1"]
        ];

    *exec({r1,r2}){
        if (this.checkPrecondition){
            ///Soluzione semplificata 
            let music_device = this.agent.house.getMusicDevices()[0]
            let res = music_device.move(r1, r2)
            yield res;
            if (res){
                this.applyEffect();
            } else{
                throw new Error("music device turned on cannot be moved")
            }
        } else throw new Error("pddl precondition not valid in MoveTurnedOnMusicDevice") 
    }
}

class MoveMusicDevice extends pddlActionIntention{
    static parameters =["r1","r2"];

    static precondition = [
        ["in-music-device", "r1"], 
        ["door", "r1", "r2"]
        ];
    static effect = [
            ["in-music-device", "r2"],
            ["not in-music-device", "r1"],
        ];
    *exec({r1,r2}){
        if (this.checkPrecondition){
            let music_device = this.agent.house.getMusicDevices()[0]
            let res = music_device.move(r1, r2)
            yield res;
            if (res){
                this.applyEffect();
            } else{
                throw new Error("music device turned off cannot be moved")
            }
        } else throw new Error("pddl precondition not valid in MoveMusicDevice") 
    }
}

class TurnOnMusic extends pddlActionIntention{
    static parameters = ["r1"];
    static precondition = [
        ["people_want_party", "r1"],
        ["not turn_on_music", "r1"],
        ["in-music-device", "r1"]
    ];
    static effect = [
        ["turn_on_music","r1"],
    ];
    *exec({r1}){
        if (this.checkPrecondition){
            let music_device = this.agent.house.getMusicDevices()[0]
            let res = music_device.switchOn(r1)//r1)
            yield res;

            if (res){
                this.applyEffect();
            } else{
                throw new Error("music not yet on")
            }
        } else throw new Error("pddl precondition not valid in TurnOnMusic")
    }
}

class TurnOffMusic extends pddlActionIntention{
    static parameters = ["r1"];
    static precondition = [
        ["not people_want_party", "r1"],
        ["turn_on_music", "r1"],
        ["in-music-device", "r1"]
    ];
    static effect = [
        ["not turn_on_music","r1"],
    ];
    *exec({r1}){
        if (this.checkPrecondition){
            let music_device = this.agent.house.getMusicDevices()[0]
            let res = music_device.switchOff(r1)//r1)
            yield res;
            if (res){
                this.applyEffect();
            } else{
                throw new Error("music not yet off")
            }
        } else throw new Error("pddl precondition not valid in TurnOffMusic")
    }
}

class SwitchOn extends pddlActionIntention{
    static parameters = ["r1"];
    static precondition = [
        ["person_in", "r1"],
        ["not switch_on", "r1"], 
        ["switch_off","r1"],
    ];
    static effect = [
        ["switch_on","r1"],
        ["not switch_off", "r1"],
    ];
    *exec({r1}){
        if (this.checkPrecondition){

            let res = 0
            for (let lig of this.agent.lights){
                if (lig.room == r1){
                    res = lig.switchOn(r1)
                }
            }
            yield res;

            if (res){
                this.applyEffect();
            } else{
                throw new Error("Lights not yet on")
            }
        } else throw new Error("pddl precondition not valid")
    }
}

class SwitchOff extends pddlActionIntention{
    static parameters = ["r1"];
    static precondition = [
        ["not person_in","r1"],
        ["switch_on", "r1"], 
        ["not switch_off","r1"],
    ];
    static effect = [
        ["not switch_on","r1"],
        ["switch_off", "r1"],
    ];
    *exec({r1}){
            if (this.checkPrecondition){
    
                let res = 0
                ///Da aggiustare, deve referenziare la stanza corretta
                for (let lig of this.agent.lights){
                    if (lig.room == r1){
                        res = lig.switchOff(r1)//r1)
                    }
                }
   
                yield res;
                if (res){
                    this.applyEffect();
                } else{
                    throw new Error("Light not yet off")
                }
            } else throw new Error("pddl precondition not valid")
    }
}

class DeliverWeights extends pddlActionIntention{
    static parameters = ["r1"];
    static precondition = [
        ["in", "r1"]
    ];
    static effect = [
        ["leave-weights", "r1"]
    ];
    *exec({r1}){
        if (this.checkPrecondition()) {
            let res = this.agent.device.leave_weights(r1);
            yield res;
            if (res) {
                this.applyEffect();
            } else {
                throw new Error("leave weights failed");
            }
        } else throw new Error("pddl precondition not valid in MOVEDelW");
    }
}

//MoveGrabbingLogisticDevice requires one second
class MoveGrabbingLogisticDevice extends pddlActionIntention{
    static parameters = ["r1", "r2"];
    static precondition = [
    ///"in" refers to the logistic device position
    ["in-logistic-device", "r1"], 
    ["dress_to_wash","r1"],
    ["door", "r1", "r2"]
    ];

    static effect = [
        ["not dress_to_wash", "r1"],
        ["not in-logistic-device", "r1"],
        ["in-logistic-device", "r2"],
        ["dress_to_wash","r2"]
    ];
    *exec({ r1, r2 }) {
        if (this.checkPrecondition()) {
            //let res = 1
            let res =  this.agent.logistic_device[0].move_grabbing_logistic_device(r1,r2);
            yield res;
            if (res) {
                this.applyEffect();
            } else {
                throw new Error("move grabbing logistic device failed");
            }
        } else throw new Error("pddl precondition not valid in MOVEgRAB");
    }   
}

class MoveLogisticDevice extends pddlActionIntention{
    static parameters = ["r1", "r2"];
    static precondition = [
    ///"in" refers to the logistic device position
    ["in-logistic-device", "r1"], 
    ["door", "r1", "r2"],
    ];

    static effect = [
        ["not in-logistic-device", "r1"],
        ["in-logistic-device", "r2"],
    ];
    *exec({ r1, r2 }) {
        if (this.checkPrecondition()) {
            let res = this.agent.logistic_device[0].move_logistic_device(r1, r2);
            yield res;
            if (res) {
                this.applyEffect();
            } else {
                throw new Error("move logistic device failed");
            }
        } else throw new Error("pddl precondition not valid in MOVELogistic");
    }   
}

class MoveWeights extends pddlActionIntention {
    static parameters = ["r1", "r2"];
    static precondition = [
    ["in", "r1"], 
    ["door", "r1", "r2"]
    ];
    static effect = [
        ["not leave-weights", "r1"],
        ["in", "r2"],
        ["not in", "r1"],
    ];
    *exec({ r1, r2 }) {
        if (this.checkPrecondition()) {
            let res = this.agent.device.move(r1, r2);
            yield res;
            if (res) {
                this.applyEffect();
            } else {
                throw new Error("move failed");
            }
        } else throw new Error("pddl precondition not valid in MOVEWeights");
    }
}

class Move extends pddlActionIntention {
    static parameters = ["r1", "r2"];
    static precondition = [
    ["in", "r1"], 
    ["door", "r1", "r2"],
    ];
    static effect = [
        ["in", "r2"],
        ["not in", "r1"],
    ];
    *exec({ r1, r2 }) {
        if (this.checkPrecondition()) {
            let res = 0
            if (Array.isArray(this.agent.device)){
               res = this.agent.device[0].move(r1, r2);
            }
            else{
                res = this.agent.device.move(r1,r2)
            }
            yield res;
            if (res) {
                this.applyEffect();
            } else {
                throw new Error("move failed");
            }
        } else throw new Error("pddl precondition not valid in Move");
    }
}
class Suck extends pddlActionIntention {
    static parameters = ["r"];
    static precondition = [
        ["not person_room", "r"],
        ["in", "r"],
        ["dirty", "r"],
        //["not zero_battery"],
        ["not clean", "r"],
    ];
    static effect = [
        ["not dirty", "r"],
        ["sucked", "r"],
    ];
    *exec({ r }) {
        if (this.checkPrecondition()) {
            let res = yield this.agent.device.suck(r);
            if (res) {
                this.applyEffect();
            } else {
                throw new Error("suck failed");
            }
        } else throw new Error("pddl precondition not valid");
    }
}

class Clean extends pddlActionIntention {
    static parameters = ["r"];
    static precondition = [
        ["not person_room", "r"],
        ["in", "r"],
        ["sucked", "r"],
        ["not dirty", "r"],
    ];
    static effect = [
        ["not sucked", "r"],
        ["clean", "r"], 
    ];
    *exec({ r }) {
        if (this.checkPrecondition()) {
            let res = yield this.agent.device.clean(r);
            if (res) {
                this.applyEffect();
            } else {
                throw new Error("cleaning failed");
            }
        } else throw new Error("pddl precondition not valid");
    }
}
module.exports = {
    MoveCharging,
    ChargeDevice,
    DeliverRefill,
    BuyRefill,
    MoveRefill,
    PickGarbage,
    LeaveEmptyGarbage,
    MoveEmptyGarbage,
    MoveGrabbingLogisticDevice,
    MoveLogisticDevice,
    WashDresses,
    MoveNoGarbage,
    PutOutGarbage, MoveGarbage,
    TurnOnMusic, TurnOffMusic, MoveMusicDevice, MoveTurnedOnDevice,
    //DeliverMeal, PrepareMeal, 
    DeliverWeights, SwitchOn, SwitchOff, Move, MoveWeights, Suck, Clean};
