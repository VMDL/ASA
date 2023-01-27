const Observable = require("../../utils/Observable");
const {BatterySensor} = require("../sensors/BatterySensor")
class GenericDevice extends Observable {
    /** @type {name} String */
    /** @type {room} String */
    constructor(name, room, house) {
        super();
 

        ///"id" attribute refers to the deviceID s.t. each device will have a unique associated integer 
        this.id = global.deviceNextId++;
        
        ///"name" attribute refers to the device (informal) name to be concatenated with the id
        this.name = name+this.id
        ///"room" attribute refers to the string that identifies the room where the device is located
        this.room = room

        this.house = house

        this.battery = new BatterySensor(name, room)


    }
    headerLog(header = "", ...args) {
        process.stdout.cursorTo(0);
        console.log(header, ...args);
    }
    log(...args) {
        this.headerLog(this.name + " " + this.constructor.name, ...args);
    }
    headerError(header = "", ...args) {
        process.stderr.cursorTo(0);
        console.error(header, ...args);
    }
    error(...args) {
        this.headerError(this.name + " " + this.constructor.name, ...args);
    }
}

module.exports = GenericDevice;
