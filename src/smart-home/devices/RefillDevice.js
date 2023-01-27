const GenericDevice = require("./GenericDevice");
const Clock = require("../../utils/Clock");


class RefillDevice extends GenericDevice{
    
    constructor(name, room, house){

        super(name, room, house)

        this.electricity_consumption = {deliver_refill: 4, buy_refill: 2, move: 5}

    }

    async deliver_refill(room){
        if (this.room != room){
            return false
        }



        ///In minutes
        let timeRemaining = 5
        while (timeRemaining) {
            await Clock.global.notifyChange("mm", "deliver_refill_"+this.name);
                if (timeRemaining > 0) {
                    timeRemaining = timeRemaining - Clock.TIME_STEP;
                }
        }

        this.log(" deliver refill action ends")

        this.house.metrics.electricity += this.electricity_consumption.deliver_refill


        return true
    }

    async buy_refill(room){
        if (this.room != room){
            return false
        }

        

        ///In minutes
        let timeRemaining = 25
        while (timeRemaining) {
            await Clock.global.notifyChange("mm", "buy_refill_"+this.name);
            if (timeRemaining > 0) {
                timeRemaining = timeRemaining - Clock.TIME_STEP;
            }
        }

        this.log(" buying action ends")

        this.house.metrics.electricity += this.electricity_consumption.buy_refill


        return true
    }

    async move(from, to){
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
        while (timeRemaining) {
            await Clock.global.notifyChange("mm", "move_"+this.name);
            if (timeRemaining > 0) {
                timeRemaining = timeRemaining - Clock.TIME_STEP;
            }
        }

        this.room = to;
        this.house.rooms[to].refill_device = this.house.rooms[from].refill_device
        this.house.rooms[from].refill_device = null

        this.log(" move action ends")

        this.house.metrics.electricity += this.electricity_consumption.move


        return true;
    }

}



module.exports = {
    RefillDevice 
}