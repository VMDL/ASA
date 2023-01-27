const {HouseServerAgent, LearnHouseConfigurationGoal, LearnHouseConfigurationIntention, SendRoomLocationIntention } = require("../agents/HouseServerAgent")
const {PostmanAcceptAllRequest, Postman} = require("../helpers/Communication")
class HouseServerUtils{
    /** @type {name} String */
    /** @type {house} House */
    /** @type {room} String */
    constructor(name, house, room){

        this.agent = new HouseServerAgent(name, house, room)

        this.agent.intentions.push(LearnHouseConfigurationIntention)


        this.agent.postSubGoal(new LearnHouseConfigurationGoal({
                                     house: house,
                                     s: 'kitchen'}))

    }

    run(){

                             
        //for (let i = 0; i < 20; i++){

            this.agent.intentions.push(PostmanAcceptAllRequest);

            for (let i = 0; i < 12; i++){
               this.agent.intentions.push(SendRoomLocationIntention)
            }

            this.agent.postSubGoal(new Postman());
        //}
    }
}

module.exports = {HouseServerUtils}
