const Observable = require("../utils/Observable");
const { v4: uuidv4 } = require("uuid");
const Clock = require("../utils/Clock");
let nextId = 0;
class Person extends Observable {
    constructor(name, room, house, favorite_music_genre, emotion = "Chill") {
        super();
        this.name = name; // non-observable
        this.id = nextId++ 
        this.uuid = uuidv4();
        this.set("want_meal", false)
        this.set("end", false)
        this.set("emotion", emotion)

        //What I actually use
        this.set("wants_to_train", false)

        this.house = house
        this.set("room", room); // observable
        this.previous_room = room;
        this.house.rooms[room].addPerson(this)
        //this.favorite_music_genre = favorite_music_genre;

        // this.observe( 'room', v => console.log(this.name, 'moved to', v) )    // observe
    }
    headerLog(header = "", ...args) {
        process.stdout.cursorTo(0);
        console.log(header, ...args);
    }

    log(...args) {
        this.headerLog(this.name, ...args);
    }
    headerError(header = "", ...args) {
        process.stderr.cursorTo(0);
        console.error(header, ...args);
    }
    error(...args) {
        this.headerError(this.name + " " + this.constructor.name, ...args);
    }

    async moveTo(to, house, useCar = false) {
        if (this.room == to) {
            return false;
        }
        if (!house.rooms[this.room].doors_to.includes(to)) {
            return false;
        }
        this.log('Person moving from '+ this.room + ' to ' + to)

        this.previous_room = this.room;
        this.room = to;

        this.house.rooms[this.room].addPerson(this)
        this.house.rooms[this.previous_room].removePerson(this)
        return true;
    }
    
    changeMood(mood){
        this.emotion = mood;
    }

    want_train(){
        if (this.wants_to_train === true){
            this.log(this.name + " cannot train now")
            return false
        }
        this.wants_to_train = true
        return true
    }

    wants_to_meal(){
        if (this.want_meal === true){
            this.log(this.name + " cannot eat now")
            return false
        }
        this.want_meal = true
        this.log(Clock.global.hh + ": " + Clock.global.mm + "[" + this.name + "]: want to meal")
        return true;
    }

}

module.exports = Person;
