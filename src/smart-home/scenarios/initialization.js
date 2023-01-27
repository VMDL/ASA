const Clock = require("../../utils/Clock");
const { House } = require("../environment/House");
const { Utils } = require("./Utils")
const {WashingMachineUtils } = require("../utils/WashingMachineUtils")
const {ChargingUtils} = require("../utils/ChargingUtils")
const {MusicUtils} = require("../utils/MusicUtils")
const { HouseServerUtils } = require("../utils/HouseServerUtils")
const {AlarmUtils} = require("../utils/AlarmUtils")
const {MealsUtils} = require("../utils/MealsUtils")
const { GymUtils } = require("../utils/GymUtils");
const {HouseServerAgent} = require("../agents/HouseServerAgent")
const {Postman, PostmanAcceptAllRequest } = require("../helpers/Communication");
const {RefillUtils} = require("../utils/RefillUtils")
const {GarbageUtils} = require("../utils/GarbageUtils")
const {SecurityUtils} = require("../utils/SecurityUtils")
const { LightUtils } = require("../utils/LightUtils")
const {TemperatureUtils} = require("../utils/TemperatureUtils");
const { VacuumCleanerUtils } = require("../utils/VacuumCleanerUtils")
const {HouseUtils} = require("../utils/HouseUtils")
//const Person = require("../Person");
const {VacuumCleaner} = require("../devices/VacuumCleaner")

class Scenario{
    constructor(){

        global.deviceNextId = 0;
        // House, which includes rooms and devices
        
        this.house = new House();
        
        let house_people = this.house.getPeopleDict()
        
        
        this.house_server_utils = new HouseServerUtils("house_server_agent", this.house, "kitchen")
        
        
        this.washing_machine_utils = new WashingMachineUtils("washing_machine_agent",
                                                  this.house.getDressCameraSensors(),
                                                  this.house,
                                                  this.house.getWashingMachines(),
                                                  this.house.getLogisticDevices(),
                                                  this.house_server_utils.agent)
        
        
        this.charging_utils = new ChargingUtils("charging_agent", 
                                               "bedroom_0", 
                                               this.house.getAllDevices(), 
                                               this.house.getChargingDevices(),
                                               this.house_server_utils.agent,
                                               this.house)
        
        
        this.meals_utils = new MealsUtils("meal_agent", 
                                               this.house, 
                                               this.house.getSmartMealSensors(),
                                               this.house.getMealDevices())
        
        this.light_utils = new LightUtils("light_agent",
                              this.house,
                              this.house.getCameraSensors(),
                              this.house.getLights()
        )
        
                                               
        this.music_utils = new MusicUtils("music_agent", 
                                        this.house,
                                        this.house.getCameraSensors(),
                                        this.house.getMusicDevices(),
                                        this.house.rooms.kitchen, 
                                        this.house_server_utils.agent)
        
                                        
        this.garbage_utils = new GarbageUtils("garbage_agent", 
                                             this.house,
                                             this.house.getGarbageSensors(),
                                             this.house.getGarbageDevices(),
                                             "bedroom_0",
                                             this.house_server_utils.agent)
        
        
        
        this.house_utils = new HouseUtils("house_agent", 
                                         this.house
                                         )
        
        this.alarm_utils = new AlarmUtils("alarm_agent")
        
        
        
        this.refill_utils = new RefillUtils("refill_agent", 
                                            this.house, 
                                            this.house.getRefillSensors(),
                                            this.house_server_utils.agent,
                                            this.house.getRefillDevices()
                                            )
        
        this.security_utils = new SecurityUtils("security_agent", 
                                              this.house_people, 
                                              this.house.getSmokeDevices(),
                                              this.house, 
                                              this.house.getAudioAlarmDevices(),
                                              this.house.getOpenWaterDevices(),
                                              this.house.getBurglarCameras(),
                                              this.house.getEmergencyCallDevices(),
                                              )
        
        
        this.gym_utils = new GymUtils("gym_agent", 
                                     this.house,  
                                     this.house.getWorkoutSensors(),
                                     this.house.getSmartWeights(),
                                     this.house_server_utils.agent
                                     )
                
        this.temp_utils = new TemperatureUtils("temperature_agent",
                                               this.house.getThermometers(),
                                               this.house.getCoolingSystems(),
                                               this.house.getHeatingSystems(),
                                               this.house)
        
    }
}

module.exports = {Scenario}