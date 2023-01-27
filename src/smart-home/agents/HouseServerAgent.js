const Agent = require("../../bdi/Agent");
const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");
const Room = require("../environment/Room");
const {ExploringDevice} = require("../devices/ExploringDevice")
const { MessageDispatcher } = require("../helpers/Communication");


class HouseServerAgent extends Agent {
    /** @type {String} name */
    /** @type {House} house */
    /** @type {String} room */
    ///Model garbage from discrete perspective
    constructor(name, house, room) {
        super(name);
        this.house = house
        this.room = room
        this.device = new ExploringDevice("exploring_device_"+name, "kitchen", house)
    }
}

class LearnHouseConfigurationGoal extends Goal{}
class LearnHouseConfigurationIntention extends Intention{
    static applicable(goal){
        return goal instanceof LearnHouseConfigurationGoal
    }
    *exec(){
        //console.log("Questi sono i miei parameters")
        //console.log(this.goal.parameters.house)
        let house = this.goal.parameters.house;
        let s = house.rooms["kitchen"];
        let visited = {};
        yield* this.onlineDFS(s, visited);

    }
    /** @type {String} room*/
    /** @type {Room}  */
    *onlineDFS(room, visited) {
        if (typeof(room)!== undefined && room !== null){
        for (let confRoom of room.doors_to) {
            if (!(confRoom in visited)) {
                this.agent.beliefs.declare("door " + room.name + " " + confRoom);
                this.agent.beliefs.declare("door " + confRoom + " " + room.name);
                let res = this.agent.device.move(room.name, confRoom)
                yield res;
                visited[room.name] = room.name;
                yield* this.onlineDFS(this.agent.house.rooms[confRoom], visited);
                delete visited[room.name];
              }
           }
        yield;
        }
   }
}

class AskRoomLocationGoal extends Goal {}
class AskRoomLocationIntention extends Intention {
    static applicable(goal) {
        return goal instanceof AskRoomLocationGoal;
    }
    *exec() {
        let queriedAgent = this.goal.parameters.queriedAgent;
        let recipientAgent = this.goal.parameters.recipientAgent
        let request = yield new SendRoomLocationGoal({
            queriedAgent: queriedAgent,
            recipientAgent: recipientAgent
        });
        yield MessageDispatcher.authenticate(this.agent).sendTo(queriedAgent.name, request);
    }
}

// Writes directly into belief state of recipient
class SendRoomLocationGoal extends Goal {}
class SendRoomLocationIntention extends Intention {
    static applicable(goal) {
        return goal instanceof SendRoomLocationGoal;
    }
    *exec() {
        let recipientAgent = this.goal.parameters.recipientAgent;
        let queriedAgent = this.goal.parameters.queriedAgent
        let house = this.agent.house;
        for (let r of Object.values(house.rooms)) {
            for (let cr of r.doors_to){
                ///Directly writes into the beliefs of the agents that had send the question
                recipientAgent.beliefs.declare("door " + r.name + " " + cr);
            }
        }
        yield;
    }
}



class AskHouseConfigurationGoal extends Goal {}
class AskHouseConfigurationIntention extends Intention {
    static applicable(goal) {
        return goal instanceof AskHouseConfigurationGoal;
    }
    *exec() {
        let queriedAgent = this.goal.parameters.queriedAgent;
        let house = this.goal.parameters.house;
        let request = yield new SendHouseConfigurationGoal({
            house: house,
            recipientAgent: this.agent,
        });
        yield MessageDispatcher.authenticate(this.agent).sendTo(queriedAgent.name, request);
    }
}


// Writes directly into belief state of recipient
// Writes directly into belief state of recipient
class SendHouseConfigurationGoal extends Goal {}
class SendHouseConfigurationIntention extends Intention {
    static applicable(goal) {
        return goal instanceof SendHouseConfigurationGoal;
    }
    *exec() {
        let recipientAgent = this.goal.parameters.recipientAgent;
        for (let [fact, value] of Object.values(this.agent.beliefs.entries)) {
            let tokens = fact.split(" ");
            switch (tokens[0]) {
                case "door":
                case "person_room":
                case "sucked":
                case "dirty":
                case "clean":
                    if (value) {
                        recipientAgent.beliefs.declare(fact);
                    } else {
                        recipientAgent.beliefs.undeclare(fact);
                    }
                    break;
            }
        }
        yield;
    }
}


class AskRoomStatusGoal extends Goal {}
class AskRoomStatusIntention extends Intention {
    static applicable(goal) {
        return goal instanceof AskRoomStatusGoal;
    }
    *exec() {
        let queriedAgent = this.goal.parameters.queriedAgent;
        let request = yield new SendRoomStateGoal({
            recipientAgent: this.agent,
        });
        yield MessageDispatcher.authenticate(this.agent).sendTo(queriedAgent.name, request);
    }
}

class LearnHouseGoal extends Goal {}
class LearnHouseIntention extends Intention {
    static applicable(goal) {
        return goal instanceof LearnHouseGoal;
    }
    *exec() {
        let house = this.goal.parameters.house;

        let s = house.rooms[this.goal.parameters.start];

        let visited = {};
        yield* this.onlineDFS(s, visited);
    }
    *onlineDFS(room, visited) {
        let house = this.goal.parameters.house;
        for (let r of Object.values(house.rooms)){
            for (let neigh of Object.values(r.doors_to)){
                this.agent.beliefs.declare("door " + r.name + " " + neigh)
            }
        }
        /*for (let confRoom of room.doors_to) {
            if (!(confRoom in visited)) {
                if (confRoom != "out") {
                    this.agent.beliefs.declare("door " + room.name + " " + confRoom);
                    this.agent.beliefs.declare("door " + confRoom + " " + room.name);
                    let res = this.agent.device.move(room.name, confRoom);
                    console.log("Blocco 2")
                    if (!res) throw new Error("move failed");

                    this.agent.beliefs.undeclare("in " + room.name);
                    this.agent.beliefs.declare("in " + confRoom);
                    yield res;
                    visited[room.name] = room.name;
                    yield* this.onlineDFS(house.rooms[confRoom], visited);
                    delete visited[room.name];
                    
                    console.log("Blocco 1")
                    res = this.agent.device.move(confRoom, room.name);
                    if (!res) throw new Error("move failed");
                    this.agent.beliefs.undeclare("in " + confRoom);
                    this.agent.beliefs.declare("in " + room.name);
                }
            }
        }
        yield;*/
    }
}


class SendRoomStateGoal extends Goal {}
class SendRoomStateIntention extends Intention {
    static applicable(goal) {
        return goal instanceof SendRoomStateGoal;
    }
    *exec() {
        let recipientAgent = this.goal.parameters.recipientAgent;
        let house = this.agent.house;
        for (let r of Object.values(house.rooms)) {
            if (r.name != "out") {

                if (r.status == "dirty") {
                    recipientAgent.beliefs.declare("dirty " + r.name);
                    recipientAgent.beliefs.undeclare("clean " + r.name);
                    recipientAgent.beliefs.undeclare("sucked " + r.name);
                }

                if (r.status == "sucked") {
                    recipientAgent.beliefs.declare("sucked " + r.name);
                    recipientAgent.beliefs.undeclare("clean " + r.name);
                    recipientAgent.beliefs.undeclare("dirty " + r.name);
                }

                if (r.status == "clean") {
                    recipientAgent.beliefs.declare("clean " + r.name);
                    recipientAgent.beliefs.undeclare("dirty " + r.name);
                    recipientAgent.beliefs.undeclare("sucked " + r.name);
                }
                let isPersonInRoom = false;
                for (let p of house.getPeople()) {
                    if (p.room == r.name) {
                        isPersonInRoom = true;
                        break;
                    }
                }
                if (isPersonInRoom) recipientAgent.beliefs.declare("person_room " + r.name);
                else recipientAgent.beliefs.undeclare("person_room " + r.name);
            }
        }
        yield;
    }
}


module.exports = { 
    SendHouseConfigurationGoal,
    SendHouseConfigurationIntention,
    AskHouseConfigurationGoal,
    AskHouseConfigurationIntention,
    HouseServerAgent,
    LearnHouseConfigurationGoal, LearnHouseConfigurationIntention, 
    SendRoomLocationGoal, SendRoomLocationIntention,
    AskRoomLocationGoal, AskRoomLocationIntention, 
    SendRoomStateGoal,
    SendRoomStateIntention,
    LearnHouseGoal,
    LearnHouseIntention,
    AskRoomStatusGoal, 
    AskRoomStatusIntention,};