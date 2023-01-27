const GenericDevice = require("./GenericDevice");
const Clock = require("../../utils/Clock");


class SmartWeight extends GenericDevice {
    constructor(house, name, room) {
        super(name, room, house);
        this.electricity_consumption = {leave_weights: 3, move_logistic_device: 6}

    }

    async leave_weights(room){
        if (this.room != room){
            return false
        }

        ///Simplification, we take just the first person
        let people_room = Object.values(this.house.rooms[room].people)[0]

        ///In minutes
        let timeRemaining = 5
        while (timeRemaining > 0) {
            await Clock.global.notifyChange("mm", "leave_weights_"+this.name);
            timeRemaining = timeRemaining - Clock.TIME_STEP;
        }
        people_room.wants_to_train = false

        this.log(" LeaveWeights action ends")
        this.house.metrics.electricity += this.electricity_consumption.leave_weights

        return true
    }

    async move(from, to) {
        if (this.room == to) {
            return false;
        }
        if (this.room != from) {
            return false;
        }
        if (!this.house.rooms[from].doors_to.includes(to)) {
            return false;
        }


        ///In minutes
        let timeRemaining = 5
        while (timeRemaining > 0) {
            await Clock.global.notifyChange("mm", "move_"+this.name);
            timeRemaining = timeRemaining - Clock.TIME_STEP;
        }
        this.room = to;

        this.log(" move action ends")

        this.house.metrics.electricity += this.electricity_consumption.move

        return true;
    }
}

module.exports = { SmartWeight };
