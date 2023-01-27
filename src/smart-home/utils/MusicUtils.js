
const{MusicAgent, MusicGoal, MusicIntention} = require("../agents/MusicAgent");

const { AskRoomLocationIntention, AskRoomLocationGoal, HouseServerAgent } = require("../agents/HouseServerAgent");

const {TurnOnMusic, TurnOffMusic, MoveMusicDevice, MoveTurnedOnDevice} = require("../agents/pddlActions");

let {OnlinePlanning: MusicPlanning} = require("../../pddl/OnlinePlanner")([TurnOnMusic, TurnOffMusic, MoveMusicDevice, MoveTurnedOnDevice]);

const {PersonPartyIntention, PersonPartyGoal, CameraSensor } = require("../sensors/CameraSensor")

const Intention = require("../../bdi/Intention");
const { MusicDevice } = require("../devices/MusicDevice");

function argumentTypeCheck(device){
   if (Array.isArray(device) == false){
      device = [device]
   }
}

class MusicUtils{
    /** @type {String} name */
    /** @type {House} house */
    /** @type {CameraSensor} cameras */
    /** @type {MusicDevice} music_devices */
    /** @type {String} room */
    /** @type {HouseServerAgent} server_agent */
    constructor(name, house, cameras, music_devices, room, server_agent){
        ///If the argument provided is a single variable, rather than a list
        ///it is transformed into a list of a single element
        argumentTypeCheck(music_devices)
         
        this.house = house
        this.agent = new MusicAgent(name, house, music_devices, room)

        this.cameras = cameras

        this.music_devices = music_devices

        this.agent.intentions.push(AskRoomLocationIntention)

        this.agent.postSubGoal(new AskRoomLocationGoal({
            queriedAgent: server_agent,
            recipientAgent: this.agent, 
        }))

    }

    run (){

        this.agent.intentions.push(MusicPlanning)

        this.agent.intentions.push(MusicIntention)

        this.agent.intentions.push(PersonPartyIntention)

        this.agent.postSubGoal(
            new PersonPartyGoal({
                camera_sensors: this.cameras,
            })
        )

        this.agent.postSubGoal(
            new MusicGoal({
                camera_sensors: this.cameras,
                music_devices: this.music_devices
            })
        )


    }
}

module.exports = {MusicUtils};
