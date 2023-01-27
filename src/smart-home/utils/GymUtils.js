const {GymAgent, 
    HandleGymObjectsGoal, 
    HandleGymObjectsIntention } = require("../agents/GymAgent")
const { DetectWorkoutGoal, DetectWorkoutIntention, WorkoutSensor } = require("../sensors/WorkoutSensor")
const { AskRoomLocationIntention, AskRoomLocationGoal, HouseServerAgent } = require("../agents/HouseServerAgent");


const {MoveWeights, DeliverWeights} = require("../agents/pddlActions");
const { SmartWeight } = require("../devices/SmartWeight");

let {OnlinePlanning: GymPlanning} = require("../../pddl/OnlinePlanner")([MoveWeights, DeliverWeights]);


class GymUtils{
    /**@type {String} name */
    /**@type {House} house */
    /**@type {WorkoutSensor} workout_sensors */
    /**@type {SmartWeight} smart_weights */
    /**@type {HouseServerAgent} server_agent */
    constructor(name, house, workout_sensors, smart_weights, server_agent){
        this.agent = new GymAgent(name, house, 'kitchen', smart_weights)

        this.workout_sensors = workout_sensors
        this.house = house

        this.agent.intentions.push(AskRoomLocationIntention)

        this.agent.postSubGoal(new AskRoomLocationGoal({
            queriedAgent: server_agent,
            recipientAgent: this.agent

        }))
    }

    run(){
        
        this.agent.intentions.push(GymPlanning)

        this.agent.intentions.push(HandleGymObjectsIntention)

        this.agent.intentions.push(DetectWorkoutIntention)

        this.agent.postSubGoal(
            new DetectWorkoutGoal({
                workout_sensors: this.workout_sensors,
                house: this.house
               }
            )
        )
        this.agent.postSubGoal(
            new HandleGymObjectsGoal({
                workout_sensors: this.workout_sensors
            }),
        )

    }
}

module.exports = {GymUtils}
