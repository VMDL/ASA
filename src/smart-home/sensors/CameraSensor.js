const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");
const Clock = require("../../utils/Clock");
const GenericDevice = require("../devices/GenericDevice");


class CameraSensor extends GenericDevice{
    /** @type {name} String */
    /** @type {room} String */
    /** @type {smoke} Boolean */
    /** @type {security_alarm} List <SecurityAlarm> */
    constructor(name, room, light_device = []){
        super(name, room);

        ///The SmokeSensor instance capture from the environment
        ///the information related to the presence of smoke in a certain room
        this.set("people_len", 0)//person_room)

        ///Agents whose beliefs are updated by the SmokeSensor instance
        this.light_device = light_device

        this.party_desire = {}
        this.total_person = {}

        this.set("update_party", 0)
    }
};

class PersonPartyGoal extends Goal{}

class PersonPartyIntention extends Intention{
    static applicable(goal) {
        return goal instanceof PersonPartyGoal;
    }

    *exec() {
        let cameraPromises = []
        let camera_sensors = this.goal.parameters.camera_sensors
        for (let camera of camera_sensors){
            let cameraPromise = new Promise(async (res) =>{
                while (true) {
                    await this.agent.house.rooms[camera.room].notifyChange("people_len", "camera_sensor_people_len_"+camera.room)
                    camera.party_desire[camera.room] = 0
                    for (let p of Object.values(this.agent.house.rooms[camera.room].people)){
                        if (p.emotion == 'party'){
                            camera.party_desire[camera.room]+=1
                        }
                    }
                    camera.total_person[camera.room] = Object.keys(this.agent.house.rooms[camera.room].people).length

                    ///The swap between 0 and 1 of this variable enables the music agent to be informed about changes in the room
                    ///This is the variable observed by the music agent
                    camera.update_party = (camera.update_party+1)%2
                }
            });
        cameraPromises.push(cameraPromise);
        }
    yield Promise.all(cameraPromises);
    }
}

class PersonRoomGoal extends Goal {}

class PersonRoomIntention extends Intention {
    static applicable(goal) {
        return goal instanceof PersonRoomGoal;
    }

    *exec() {
        let cameraPromises = []
        let camera_sensors = this.goal.parameters.camera_sensors
        for (let camera of camera_sensors){
            let cameraPromise = new Promise(async (res) =>{
                while (true) {
                    await this.agent.house.rooms[camera.room].notifyChange("people_len", "camera_sensor_people_len_"+camera.room)
                    camera.people_len = this.agent.house.rooms[camera.room].people_len
                }
            });
        cameraPromises.push(cameraPromise);
        }
    yield Promise.all(cameraPromises);
    }
}


module.exports = { CameraSensor, 
    PersonPartyGoal, PersonPartyIntention,
    PersonRoomGoal, PersonRoomIntention,
};
