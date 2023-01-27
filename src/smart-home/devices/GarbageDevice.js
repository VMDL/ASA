///This device is in charge of throwing out the garbage (when it is full)

const GenericDevice = require("./GenericDevice");
const Clock = require("../../utils/Clock");


class GarbageDevice extends GenericDevice{
    
    constructor(name, room, house){

        super(name, room, house)

        this.electricity_consumption = {on: 2, switch_on: 3, switch_off: 1, 
                        move_empty_garbage:4, leave_garbage:3, move_out_garbage: 8,
                        move_garbage: 5, empty_garbage: 3}
    }

    async move_empty_garbage(from, to){
        if (this.room == to) {
            return false;
        }

        if (this.room != from) {
            return false;
        }
        if (!this.house.rooms[from].doors_to.includes(to)) {
            return false;
        }
        if (this.charging) {
            return false;
        }

        let timeRemaining = 5
        this.log(" move empty garbage from" + from + " to " + to + " requires " + timeRemaining + " minutes")
        while (timeRemaining) {
            await Clock.global.notifyChange("mm", "move_empty_garbage_"+this.name);
            if (timeRemaining > 0) {
                timeRemaining = timeRemaining - Clock.TIME_STEP;
            }
         }
        this.room = to;
        
        this.house.rooms[to].garbage_device = this
        this.house.rooms[to].garbage_sensor = this.house.rooms[from].garbage_sensor
        this.house.rooms[to].garbage_full = null
        this.house.rooms[to].garbage_available = null

        this.house.rooms[from].garbage_device = null
        this.house.rooms[from].garbage_available = null
        this.house.rooms[from].garbage_sensor = null
        this.house.rooms[from].garbage_full = null
        this.log(" move empty garbage")

        this.house.metrics.electricity += this.electricity_consumption.move_empty_garbage

        return true;  
    }

    async leave_garbage(room1){
        if (this.room != room1) {
            return false;
        }

        if (this.charging) {
            return false;
        }
        
        
        let timeRemaining = 2
        while (timeRemaining) {
            await Clock.global.notifyChange("mm", "leave_garbage_"+this.name);
            if (timeRemaining > 0) {
                timeRemaining = timeRemaining - Clock.TIME_STEP;
            }
         }
        this.house.rooms[room1].garbage_available = true
        this.house.rooms[room1].garbage_full = false
        this.house.rooms[room1].garbage_sensor.full = false

        this.log(" leave the garbage ends")
        this.house.metrics.electricity += this.electricity_consumption.leave_garbage
        return true;     
    }

    ///Move con garbage
    async move_out_garbage(from, to){
        if (this.room == to) {
            return false;
        }

        if (this.room != from) {
            return false;
        }
        if (!this.house.rooms[from].doors_to.includes(to)) {
            return false;
        }
        if (this.charging) {
            return false;
        }

        let timeRemaining = 7
        this.log(" move out garbage begins from  "+  from  + " to " + to + " requires " + timeRemaining + " minutes")
        while (timeRemaining) {
            await Clock.global.notifyChange("mm", "move_out_garbage_"+this.name);
            if (timeRemaining > 0) {
                timeRemaining = timeRemaining - Clock.TIME_STEP;
            }
         }        
        this.room = to;
        this.house.rooms[to].garbage_device = this
        this.house.rooms[to].garbage_sensor = this.house.rooms[from].garbage_sensor
        this.house.rooms[to].garbage_full = true
        this.house.rooms[to].garbage_available = true

        this.house.rooms[from].garbage_device = null
        this.house.rooms[from].garbage_available = false
        this.house.rooms[from].garbage_sensor = null
        this.house.rooms[from].garbage_full = false

        this.log(" move out garbage ends");
        this.house.metrics.electricity += this.electricity_consumption.move_out_garbage

        return true;
    }

    ///Move senza garbage
    async move_garbage(from, to){

        if (this.room == to) {
            return false;
        }

        if (this.room != from) {
            return false;
        }
        if (!this.house.rooms[from].doors_to.includes(to)) {
            return false;
        }
        if (this.charging) {
            return false;
        }

        
        let timeRemaining  = 3
        this.log(" move garbage begins from  "+  from  + " to " + to + " requires " + timeRemaining + " minutes")
        while (timeRemaining) {
            await Clock.global.notifyChange("mm", "move_garbage_"+this.name);
            if (timeRemaining > 0) {
                timeRemaining = timeRemaining - Clock.TIME_STEP;
            }
         }        
        this.room = to;
        this.house.rooms[to].garbage_device = this
        this.house.rooms[from].garbage_device = null
        
        this.log(" move garbage ends")
        this.house.metrics.electricity += this.electricity_consumption.move_garbage

        return true;
    }

    async empty_garbage(r){

        if (this.room!=r){
            return false;
        }

        let timeRemaining = 1
        this.log(" empty garbage begins in  "+  r  + " and requires: " + timeRemaining + " minutes" )
        while (timeRemaining) {
            await Clock.global.notifyChange("mm", "empty_garbage_"+this.name);
            if (timeRemaining > 0) {
                timeRemaining = timeRemaining - Clock.TIME_STEP;
            }
         }
        this.house.rooms[this.room].garbage_sensor.full = 0
        this.house.rooms[this.room].garbage_full = false
        this.log(" empty garbage ends")
        this.house.metrics.electricity += this.electricity_consumption.empty_garbage
        return true
    }
}



module.exports = {
    GarbageDevice 
}