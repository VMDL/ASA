///Agente che osserva altri agenti e devices se si stanno scaricando (su tutta la casa)
///Per ora semplificato, ricarica solo devices
///Collegato a dei charging devices
///Planning, scelta device più vicino

const Agent = require("../../bdi/Agent");
const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");
const {ChargeDevice} = require("../../smart-home/agents/pddlGoals");
const GenericDevice = require("../devices/GenericDevice");



class ChargingAgent extends Agent {
    /** @type {String} name*/
    /** @type {Room} room */
    /** @type {GenericDevice} device */
    /** @type {House} house */
    constructor(name, room, device, house) {
        super(name);
        this.room = room
        this.house = house
        this.device = device
        this.beliefs.declare("in " + device.room)
    }
}

class ChargingGoal extends Goal {}
class ChargingIntention extends Intention {
    static applicable(goal) {
        return  goal instanceof ChargingGoal
    }

    ///Idea cerca il primo caricatore libero
    ///per caricare il device al primo caricatore libero (più vicino)
    *exec() {
        let chargingPromises = []
        let device = this.goal.parameters.device;
        let times = 3
        for (let d of device){
            let batteryPromise = new Promise(async (res) =>{
                while (true) {
                    ///Gestire il fatto che più dispotivi potrebbero cercare di caricarlo
                    await d.battery.notifyChange("low_battery", "charge_status" + d.name);
                        if (d.battery.low_battery === true){
                            this.agent.beliefs.declare("need_to_charge " + d.name)
                            this.agent.beliefs.declare("request_in "+d.room)
                            
                            let goalAchieved =  this.agent.postSubGoal(new ChargeDevice(d.room, d.name))

                            this.agent.postSubGoal(
                                new ChargeDevice(d.room, d.name)
                            )
                        }
                    }
                });
                chargingPromises.push(batteryPromise);
            }
        yield Promise.all(chargingPromises);
        }
}

module.exports = { ChargingAgent, ChargingGoal, ChargingIntention};
