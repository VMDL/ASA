const Agent = require("../../bdi/Agent");
const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");

///CREARE SENSING AGENT + RAPPRESENTAZIONE DELL'ENVIRONMENT INTERNA ALL'AGENTE
///+ NELLA DELIBERATION , L'AGENTE DECIDE SE REAGIRE E CHIAMARE METODI
///SEPARAZIONE STRUTTURE DATI + COMUNICAZIONE (LATO SENSING)
//SEPARARE AGENT E DEVICE/SENSING (KEYPOINT!)
///+(4+VACUUM CLEANER)AZIONI (E.G. AGENT) + PLANNING (REASONING)

///(AGENTE CHIAMA DEVICE) + AGISCE DIRETTAMENTE SUL DEVICE
///DEVICE NON OSSERVA BELIEFS DELL'AGENT 

///BASIC IDEA: AGENT TO SOLVE A PROBLEM RESORT TO PLANNING OR CALL A METHOD FROM A DEVICE

///MY REMIND: PROMISE - YIELD - ASYNC/AWAIT
class SecurityAgent extends Agent {
    constructor(name, house, emergency_call_device, audio_alarm_device, water_device) {
        super(name);
        this.house = house;
        this.emergency_call_device = emergency_call_device
        this.audio_alarm_device = audio_alarm_device
        this.water_device = water_device
        this.fire_activated = false
        this.burglar_activated = false
    }
}

class FireGoal extends Goal {}
class FireIntention extends Intention {
    static applicable(goal) {
        return goal instanceof FireGoal;
    }


    *exec() {
        let smoke_devices = this.goal.parameters.smoke_devices;
        let smokePromises = []
        let smoke_devices_list = Object.values(smoke_devices)
        let smoke_length = smoke_devices_list.length

        ///Here we assume that there is a smoke device for each security alarm (one per each room)
        for (let i = 0; i < smoke_length; i++) {
            let smokePromise = new Promise(async (res) => {
                while (true) {
                    
                    ///If one of the smoke devices within the house has detected the presence of smoke in a room
                    ///it will be actived the Planning procedure
                    await smoke_devices_list[i].notifyChange("smoke", "securityAlarm"+smoke_devices_list[i].name);
                    if (smoke_devices_list[i].smoke === true){
                        this.agent.beliefs.declare("fire_now " + smoke_devices_list[i].room)
                        this.agent.beliefs.undeclare("shut_down " + smoke_devices_list[i].room)

                        ///Open water mechanism
                        for (let dev of this.agent.water_device){
                            if (dev.room == smoke_devices_list[i].room){
                                dev.open_water(smoke_devices_list[i].room)
                            }
                        }

                        ///Audio alarm mechanism - Run over the entire house
                        for (let dev of this.agent.audio_alarm_device){
                            ///the room information is passed to inform the people about the fire location
                            dev.activate_smoke_alarm(smoke_devices_list[i].room)
                        }

                        
                        ///N.B. activated works as a lock to prevent consequent call to firemann
                        if (this.agent.fire_activated === false){
                            ///Call Fireman mechanism - Just one call
                            this.fire_activated = true
                            let res = this.agent.emergency_call_device[0].call_firemen(smoke_devices_list[i].room)

                            ///Unlock our lock once the promise has been solved
                            res.then((val) => {
                               this.agent.fire_activated = !val
                               if (val){
                                  this.agent.beliefs.undeclare("fire_now " + smoke_devices_list[i].room)
                                  this.agent.beliefs.declare("shut_down " + smoke_devices_list[i].room)
                               }
                               });
                        }

                    }
                    else{
                        this.agent.beliefs.undeclare("fire_now " + smoke_devices_list[i].room)
                        this.agent.beliefs.declare("shut_down " + smoke_devices_list[i].room)
                    }
                }
            });
            smokePromises.push(smokePromise);
        }
        yield Promise.all(smokePromises);
    }
}


class BurglarGoal extends Goal {}
class BurglarIntention extends Intention {
    static applicable(goal) {
        return goal instanceof BurglarGoal;
    }

    *exec() {
        let burglar_cameras = this.goal.parameters.burglar_cameras
        let burglarPromises = [];

        for (let burglar_camera of burglar_cameras) {
            let burglarPromise = new Promise(async (res) => {
                while (true) {
                    await burglar_camera.notifyChange("burglar", burglar_camera.name)
                    if (burglar_camera.burglar === true){
                        this.agent.beliefs.declare("burglar " + burglar_camera.room)
                        this.agent.beliefs.undeclare("police " + burglar_camera.room)

                        ///Audio alarm mechanism - Run over the entire house
                        for (let dev of this.agent.audio_alarm_device){
                            ///the room information is passed to inform the people about the fire location
                            dev.activate_burglar_alarm(burglar_camera.room)
                        }
                        if (this.agent.burglar_activated === false){
                            ///Call Fireman mechanism - Just one call
                            this.burglar_activated = true
                            let res = this.agent.emergency_call_device[0].call_police(burglar_camera.room)

                            ///Unlock our lock once the promise has been solved
                            res.then((val) => {
                               this.agent.burglar_activated = !val
                               if (val){
                                  this.agent.beliefs.undeclare("burglar " + burglar_camera.room)
                                  this.agent.beliefs.declare("police " + burglar_camera.room)
                               }
                               });
                        }

                    }
                    else{
                        this.agent.beliefs.undeclare("burglar " + burglar_camera.room)   
                        this.agent.beliefs.declare("police " + burglar_camera.room)              
                    }
                }
            });
            burglarPromises.push(burglarPromise);
        }
    yield Promise.all(burglarPromises);
    }
}

module.exports = { SecurityAgent, FireGoal, FireIntention, BurglarGoal, BurglarIntention };
