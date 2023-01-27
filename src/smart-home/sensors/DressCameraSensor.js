const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");
const Clock = require("../../utils/Clock");
const GenericDevice = require("../devices/GenericDevice");


class DressCameraSensor extends GenericDevice{
    /** @type {name} String */
    /** @type {room} String */
    constructor(name, room){
        super(name, room);

        ///The SmokeSensor instance capture from the environment
        ///the information related to the presence of smoke in a certain room
        this.set("update_dirty_dresses", 0)
    }
};

class DetectDressCameraGoal extends Goal{}

class DetectDressCameraIntention extends Intention{
    static applicable(goal) {
        return goal instanceof DetectDressCameraGoal;
    }

    *exec() {
        let cameraPromises = []
        let dress_camera_sensors = this.goal.parameters.dress_camera_sensors
        for (let camera of Object.values(dress_camera_sensors)){
            let cameraPromise = new Promise(async (res) =>{
                while (true) {
                    await this.agent.house.rooms[camera.room].notifyChange("count_dirty_dresses", "camera_dirty_dress_"+camera.room)
                    camera.update_dirty_dresses = this.agent.house.rooms[camera.room].count_dirty_dresses
                }
            });
        cameraPromises.push(cameraPromise);
        }
    yield Promise.all(cameraPromises);
    }
}

module.exports = { DressCameraSensor, 
    DetectDressCameraGoal, 
    DetectDressCameraIntention
};
