const Agent = require("../../bdi/Agent");
const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");
const{
    LetTheMusicBegin
} = require("../agents/pddlGoals")


class MusicAgent extends Agent {
    constructor(name, house, music_devices, room) {

        super(name);
        this.house = house;
        this.music_devices = music_devices
        this.room = room 

        this.party_goal = []
    }
}


class MusicGoal extends Goal{}

///Modulare

///Lo scopo in parole semplici è di 
class MusicIntention extends Intention{
    static applicable(goal) {
        return goal instanceof MusicGoal;
    }
    *exec() {
        let camera_sensors = this.goal.parameters.camera_sensors
        let music_devices = this.goal.parameters.music_devices
        let camera_in_goal = {}
        let idx = 0

        let musicPromises = []

        for (let camera_sensor of Object.values(camera_sensors)) {
            camera_in_goal[idx] = false
            let musicPromise = new Promise(async (res) => {
                while (true) {
                    await camera_sensor.notifyChange("update_party", "light_agent_people_len" + camera_sensor.room)
                    let count_wantParty = camera_sensor.party_desire[camera_sensor.room]
                    let half_person = (camera_sensor.total_person[camera_sensor.room]/2)
                    if (count_wantParty > half_person){
                       if (!this.agent.beliefs.literals.includes("people_want_party "+camera_sensor.room)){
                          this.agent.beliefs.declare("people_want_party " + camera_sensor.room)
                          ///Soluzione semplificata, assunzione di un singolo music device
                          let music_device = music_devices[0]
                          this.agent.beliefs.declare("in-music-device " + music_device.room)
                             this.agent.postSubGoal(
                                 new LetTheMusicBegin(music_device.room, camera_sensor.room, true)
                             )
                        }
                    }
                    else{
                        if (!this.agent.beliefs.literals.includes("not people_want_party " + camera_sensor.room)){
                           this.agent.beliefs.undeclare("people_want_party " + camera_sensor.room)
                           let music_device = music_devices[0]
                           if (music_device.status == "on"){
                              this.agent.postSubGoal(
                                  new LetTheMusicBegin(music_device.room, camera_sensor.room, false)
                              )
                            }
                        }
                        
                    }
                }
            });
            musicPromises.push(musicPromise);
        }
        yield Promise.all(musicPromises);
    }
}

module.exports = {MusicAgent, MusicGoal, MusicIntention}
