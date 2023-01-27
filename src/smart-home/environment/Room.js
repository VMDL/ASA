const Observable = require("../../utils/Observable");
const Temperature = require("./Temperature");
const { MealDevice} = require("../devices/MealDevice");
const {MusicDevice} = require("../devices/MusicDevice")
const {SmokeDevice} = require("../sensors/SmokeSensor")
const {ChargingDevice} = require("../devices/ChargingDevice")
const {GarbageDevice} = require("../devices/GarbageDevice")
const {WashingMachine} = require("../devices/WashingMachine");
const { Light } = require("../devices/Light");
const { SecurityAlarm } = require("../devices/SecurityAlarm");
const { BurglarSensor } = require("../sensors/BurglarSensor");
const { EmergencyCall } = require("../devices/EmergencyCall");
const { CameraSensor } = require("../sensors/CameraSensor");
const {TemperatureSensor} = require("../sensors/ThermometerSensor");
const { CoolingSystem } = require("../devices/CoolingSystem");
const { HeatingSystem } = require("../devices/HeatingSystem");
const { WorkoutSensor } = require("../sensors/WorkoutSensor");
const { SmartWeight } = require("../devices/SmartWeight");
const { SmartMealSensor } = require("../sensors/SmartMealSensor");
const { GarbageSensor } = require("../sensors/GarbageSensor");
const { DressCameraSensor } = require("../sensors/DressCameraSensor");
const { RefillSensor } = require("../sensors/RefillSensor");
const { LogisticDevice } = require("../devices/LogisticDevice");
const { RefillDevice } = require("../devices/RefillDevice");
const { OpenWaterDevice} = require("../devices/OpenWaterDevice");
const { AudioAlarmDevice } = require("../devices/AudioAlarmDevice");

class Room extends Observable{

    constructor(house, name, suck_time, clean_time){
        super()
    
        this.name = name;
        this.suck_time = suck_time;
        this.clean_time = clean_time;
        this.set("status", "clean")
        this.set("dirty_amount", 0)
        this.set("count_dirty_dresses",0)
        this.grab_dresses = false
        this.doors_to = [];
        this.cleaned = false;
        this.temperature = new Temperature(),
        this.set("need_to_refill",false)
        //this.cleanStatus = new Observable({ status: "clean" }),
        //this.thermometer = new Thermometer(name, "thermometer_" + name)
        this.light = new Light(house, name, "light_"+name)
        ///It is possible to create multiple alarms
        this.alarms = []
        this.set("people_len", 0)
        this.people = {}
        ///A room is a volume that has specific width and length
        ///then its area is computed as width*length
        //this.width = 3
        //this.length = 3
        this.garbage_device = null
        this.garbage_sensor = null
        this.set("garbage_full", null)
        this.garbage_available = null

        this.camera_sensor = null
        
        this.washing_machine = null

        this.charging_device = null
        
        this.smart_weights = null
        
        this.music_device = null
        
        this.workout_sensor = null

        this.refill_sensor = null

        this.refill_device = null

        this.emergency_call_device = null

        this.smoke_device = null

        this.burglar_camera = null

        this.meal_device = null
                
        this.dress_camera_sensor = null
        
        this.garage_door = null
        
        this.thermometer = null

        this.cooling_system = null

        this.heating_system = null
    
        this.dishwasher = null

        this.security_alarm = null
        
        this.smart_meal_sensor = null

        this.alarm = null

        this.open_water_device = null

        this.audio_alarm_device = null

        this.set("smoke", false)

        this.set("burglar", false)

    }
  
    addRefillDevice(house){
        this.refill_device = new RefillDevice("refill_device"+this.name, this.name, house)
    }

    addGarbageSensor(){
        this.garbage_sensor = new GarbageSensor("garbage_sensor_"+ this.name, this.name)
    }

    addWashingMachine(minimum_amount = 2){
        this.washing_machine = new WashingMachine("washing_machine_" + this.name, this.name, minimum_amount)
    }

    addChargingDevice(house, charging_minutes=15){
        this.charging_device = new ChargingDevice("charging_device_"+this.name, this.name, house, charging_minutes)
    }

    addSmartWeights(house){
        this.smart_weights = new SmartWeight(house, "smart_weight"+this.name, this.name, 'kitchen', 'bedroom_0')
    }

    addMusicDevice(house){
        this.music_device = new MusicDevice("music_device_" + this.name, this.name, house)//, "Pop", "Spotify")
    }

    addWorkoutSensor(){
        this.workout_sensor = new WorkoutSensor("workout_sensor" + this.name, this.name)
    }

    addRefillSensor(){
        this.refill_sensor = new RefillSensor("refill_sensor_"+this.name, this.name)
    }

    addOpenWaterDevice(house){
        this.open_water_device = new OpenWaterDevice("open_water_device"+this.name, this.name, house)
    }

    addAudioAlarmDevice(house){
        this.audio_alarm_device = new AudioAlarmDevice("audio_alarm_device"+this.name, this.name, house)
    }

    addEmergencyCallDevice(house){
        this.emergency_call_device = new EmergencyCall("emergency_call_"+this.name, this.name, house)
    }

    addLogisticDevice(house){
        this.logistic_device = new LogisticDevice("logistic_device"+this.name, this.name, house)
    }

    addSmokeDevice(){
        this.smoke_device = new SmokeDevice("smoke_device_"+this.name, this.name)
    }
    
    addBurglarCamera(){
        this.burglar_camera = new BurglarSensor("burglar_sensor_"+this.name, this.name)
    }

    addMealDevice(house){
        this.meal_device = new MealDevice(house, "meal_device_" + this.name)
    }

    addGarbageDevice(house){
        this.garbage_device = new GarbageDevice("garbage_device_"+this.name, this.name, house)
    }

    addDressCameraSensor(){
        this.dress_camera_sensor = new DressCameraSensor("dress_camera_sensor_"+this.name, this.name)
    }

    addCameraSensor(house){
        this.camera_sensor = new CameraSensor("camera_sensor_"+this.name, this.name)
    }

    addThermometer(){
        this.thermometer = new TemperatureSensor("thermometer_sensor_"+this.name, this.name)
    }

    addCoolingSystem(house){
        this.cooling_system = new CoolingSystem("cooling_system_"+this.name, this.name, house)
    }

    addHeatingSystem(house){
        this.heating_system = new HeatingSystem("heating_system_"+this.name, this.name, house)
    }

    addDishwasher(house){
        this.dishwasher = new Dishwasher("dishwasher_" + this.name, this.name, house)
    }

    addSecurityAlarm(house){
        this.security_alarm = new SecurityAlarm("security_alarm_" + this.name, this.name, house)
    }

    addSmartMealSensor(){
        this.smart_meal_sensor = new SmartMealSensor("smart_meal_sensor"+this.name, this.name)
    }
    

    ///Check input is an array
    setDoors_to(doors_to){
        this.doors_to = doors_to;
    }

    ///Check input is a single element or split it in multiple push

    ///system to check whether the room exists in the house
    addDoors_to(neighbouring_room){

        ///Check if the neighbouring room has already been specified
        if (! this.doors_to.includes(neighbouring_room.name)){
            this.doors_to.push(neighbouring_room.name)
            }
        
        ///Check if the neighbouring room has already been specified from the other side
        if (! neighbouring_room.doors_to.includes(this.name)){
            neighbouring_room.doors_to.push(this.name)
        }
    }

    getRoomObjectDoors_to(rooms){
        let doors_to_name = {}
        for (let i = 0; i < this.doors_to.length; i++){
            doors_to_name[this.doors_to[i]] = rooms[this.doors_to[i]]
        }
        return doors_to_name
    }

    getAllDevices(){
        let devices = []
        if (this.dishwasher !== null && typeof(this.dishwasher) !== 'undefined')
            devices.push(this.dishwasher)
        if (this.emergency_call_device !== null && typeof(this.emergency_call_device) !== 'undefined')
            devices.push(this.emergency_call_device)
        if (this.garbage_device !== null && typeof(this.garbage_device) !== 'undefined')
            devices.push(this.garbage_device)
        if (this.logistic_device !== null && typeof(this.logistic_device) !== 'undefined')
            devices.push(this.logistic_device)
        if (this.meal_device !== null && typeof(this.meal_device) !== 'undefined')
            devices.push(this.meal_device)
        if (this.music_device !== null && typeof(this.music_device) !== 'undefined')
            devices.push(this.music_device)
        if (this.smoke_device !== null && typeof(this.smoke_device) !== 'undefined')
            devices.push(this.smoke_device)
        if (this.smart_weights !== null && typeof(this.smart_weights) !== 'undefined')
            devices.push(this.smart_weights)
        if (this.washing_machine !== null && typeof(this.washing_machine) !== 'undefined')
            devices.push(this.washing_machine)
        if (this.refill_device !== null && typeof(this.refill_device) !== 'undefined')
            devices.push(this.refill_device)
        return devices
    }

    addAlarm(alarm){
        this.alarms.push(alarm)
    }

    addPerson(person){
        this.people[person.name] = person
        this.people_len = Object.keys(this.people).length
    }

    addGarbage(){
        this.garbage_full = false
        this.garbage_available = true
    }

    removePerson(person){
        delete this.people[person.name]
        this.people_len = Object.keys(this.people).length
        //this.people_len-1;
        ///N.B. When a person gets out of the room
        ///is set a random amount of waste in the room

        ////TO REINTEGRATE AGAIN - IT IS A REALISTIC IDEA
        //this.#setRandomDirty();
    }

}

module.exports = Room;
