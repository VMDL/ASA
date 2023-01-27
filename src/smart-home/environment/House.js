const Observable = require("../../utils/Observable");
const Person = require("../Person");
const Room = require("./Room")

class House {
    static DIRTINESS = 0; // between 0 and 1
    constructor() {
        this.name = "house";
        this.id = global.deviceNextId++;

        this.rooms = {
            kitchen: new Room(
                this,
                "kitchen", 
                25,
                30,
                ),
            living_room: new Room(
                this,
                "living_room",
                20,
                25,
            ),
            garage: new Room(
                this,
                "garage",
                20,
                25,
            ),
            bathroom_0: new Room(
                this,
                "bathroom_0",
                10,
                15,
            ),
            utility_room: new Room(
                this,
                "utility_room",
                5,
                5,
            ),
            hallway: new Room(
                this,
                "hallway",
                5,
                5,
                ),
            stairs: new Room(
                this,
                "stairs",
                5,
                5,
                ),
            hallway_upstairs: new Room(
                this,
                "hallway_upstairs",
                5,
                5,
            ),
            master_bedroom: new Room(
                this,
                "master_bedroom",
                15,
                20,
                ),
            bedroom_0: new Room(
                this,
                "bedroom_0",
                10,
                15,
                ),
            bedroom_1: new Room(
                this,
                "bedroom_1",
                10,
                15,
                ),
            bathroom_1: new Room(
                this,
                "bathroom_1",
                10,
                15,
                ),
            out: new Room(
                this,
                "out",
                10,
                15,
                ),
        };

        function addPeople(rooms, house){
            let p1 = new Person("Marco", rooms.kitchen.name, house)
            let p2 = new Person("Sabrina", rooms.master_bedroom.name, house)
            let p3 = new Person("Soleira", rooms.bedroom_0.name, house)
            let p4 = new Person("Lorenzo", rooms.bedroom_1.name, house)
        }

        addPeople(this.rooms, this)

        function addDevices(rooms, house){


            rooms.kitchen.addSmartMealSensor();


            rooms.kitchen.addMusicDevice(house);

            rooms.kitchen.addSmokeDevice();
            rooms.living_room.addSmokeDevice();
            rooms.garage.addSmokeDevice();
            rooms.bathroom_0.addSmokeDevice();
            rooms.utility_room.addSmokeDevice();
            rooms.hallway.addSmokeDevice();
            rooms.stairs.addSmokeDevice();
            rooms.hallway_upstairs.addSmokeDevice();
            rooms.master_bedroom.addSmokeDevice();
            rooms.bedroom_0.addSmokeDevice();
            rooms.bedroom_1.addSmokeDevice();
            rooms.bathroom_1.addSmokeDevice();

            rooms.out.addBurglarCamera();
            rooms.kitchen.addBurglarCamera();
            rooms.living_room.addBurglarCamera();
            rooms.garage.addBurglarCamera();
            rooms.bathroom_0.addBurglarCamera();
            rooms.utility_room.addBurglarCamera();
            rooms.hallway.addBurglarCamera();
            rooms.stairs.addBurglarCamera();
            rooms.hallway_upstairs.addBurglarCamera();
            rooms.master_bedroom.addBurglarCamera();
            rooms.bedroom_0.addBurglarCamera();
            rooms.bedroom_1.addBurglarCamera();
            rooms.bathroom_1.addBurglarCamera();

            rooms.kitchen.addWorkoutSensor();
            rooms.living_room.addWorkoutSensor();
            rooms.garage.addWorkoutSensor();
            rooms.bathroom_0.addWorkoutSensor();
            rooms.utility_room.addWorkoutSensor();
            rooms.hallway.addWorkoutSensor();
            rooms.stairs.addWorkoutSensor();
            rooms.hallway_upstairs.addWorkoutSensor();
            rooms.master_bedroom.addWorkoutSensor();
            rooms.bedroom_0.addWorkoutSensor();
            rooms.bedroom_1.addWorkoutSensor();
            rooms.bathroom_1.addWorkoutSensor();

            rooms.out.addEmergencyCallDevice(house);
            rooms.kitchen.addEmergencyCallDevice(house);
            rooms.living_room.addEmergencyCallDevice(house);
            rooms.garage.addEmergencyCallDevice(house);
            rooms.bathroom_0.addEmergencyCallDevice(house);
            rooms.utility_room.addEmergencyCallDevice(house);
            rooms.hallway.addEmergencyCallDevice(house);
            rooms.stairs.addEmergencyCallDevice(house);
            rooms.hallway_upstairs.addEmergencyCallDevice(house);
            rooms.master_bedroom.addEmergencyCallDevice(house);
            rooms.bedroom_0.addEmergencyCallDevice(house);
            rooms.bedroom_1.addEmergencyCallDevice(house);
            rooms.bathroom_1.addEmergencyCallDevice(house);

            rooms.kitchen.addSecurityAlarm(house);
            rooms.living_room.addSecurityAlarm(house);
            rooms.garage.addSecurityAlarm(house);
            rooms.bathroom_0.addSecurityAlarm(house);
            rooms.utility_room.addSecurityAlarm(house);
            rooms.hallway.addSecurityAlarm(house);
            rooms.stairs.addSecurityAlarm(house);
            rooms.hallway_upstairs.addSecurityAlarm(house);
            rooms.master_bedroom.addSecurityAlarm(house);
            rooms.bedroom_0.addSecurityAlarm(house);
            rooms.bedroom_1.addSecurityAlarm(house);
            rooms.bathroom_1.addSecurityAlarm(house);

            rooms.kitchen.addHeatingSystem(house)
            rooms.living_room.addHeatingSystem(house)
            rooms.garage.addHeatingSystem(house)
            rooms.bathroom_0.addHeatingSystem(house)
            rooms.utility_room.addHeatingSystem(house)
            rooms.hallway.addHeatingSystem(house)
            rooms.stairs.addHeatingSystem(house)
            rooms.hallway_upstairs.addHeatingSystem(house)
            rooms.master_bedroom.addHeatingSystem(house)
            rooms.bedroom_0.addHeatingSystem(house)
            rooms.bedroom_1.addHeatingSystem(house)
            rooms.bathroom_1.addHeatingSystem(house)

            rooms.kitchen.addThermometer(house);
            rooms.living_room.addThermometer(house);
            rooms.garage.addThermometer(house);
            rooms.bathroom_0.addThermometer(house);
            rooms.utility_room.addThermometer(house);
            rooms.hallway.addThermometer(house);
            rooms.stairs.addThermometer(house);
            rooms.hallway_upstairs.addThermometer(house);
            rooms.master_bedroom.addThermometer(house);
            rooms.bedroom_0.addThermometer(house);
            rooms.bedroom_1.addThermometer(house);
            rooms.bathroom_1.addThermometer(house);
            
            rooms.kitchen.addCoolingSystem(house);
            rooms.living_room.addCoolingSystem(house);
            rooms.garage.addCoolingSystem(house);
            rooms.bathroom_0.addCoolingSystem(house);
            rooms.utility_room.addCoolingSystem(house);
            rooms.hallway.addCoolingSystem(house);
            rooms.stairs.addCoolingSystem(house);
            rooms.hallway_upstairs.addCoolingSystem(house);
            rooms.master_bedroom.addCoolingSystem(house);
            rooms.bedroom_0.addCoolingSystem(house);
            rooms.bedroom_1.addCoolingSystem(house);
            rooms.bathroom_1.addCoolingSystem(house);

            rooms.kitchen.addCameraSensor(house);
            rooms.living_room.addCameraSensor(house);
            rooms.garage.addCameraSensor(house);
            rooms.bathroom_0.addCameraSensor(house);
            rooms.utility_room.addCameraSensor(house);
            rooms.hallway.addCameraSensor(house);
            rooms.stairs.addCameraSensor(house);
            rooms.hallway_upstairs.addCameraSensor(house);
            rooms.master_bedroom.addCameraSensor(house);
            rooms.bedroom_0.addCameraSensor(house);
            rooms.bedroom_1.addCameraSensor(house);
            rooms.bathroom_1.addCameraSensor(house);

            rooms.kitchen.addDressCameraSensor(house);
            rooms.living_room.addDressCameraSensor(house);
            rooms.garage.addDressCameraSensor(house);
            rooms.bathroom_0.addDressCameraSensor(house);
            rooms.utility_room.addDressCameraSensor(house);
            rooms.hallway.addDressCameraSensor(house);
            rooms.stairs.addDressCameraSensor(house);
            rooms.hallway_upstairs.addDressCameraSensor(house);
            rooms.master_bedroom.addDressCameraSensor(house);
            rooms.bedroom_0.addDressCameraSensor(house);
            rooms.bedroom_1.addDressCameraSensor(house);
            rooms.bathroom_1.addDressCameraSensor(house);


            rooms.kitchen.addOpenWaterDevice(house);
            rooms.living_room.addOpenWaterDevice(house);
            rooms.garage.addOpenWaterDevice(house);
            rooms.bathroom_0.addOpenWaterDevice(house);
            rooms.utility_room.addOpenWaterDevice(house);
            rooms.hallway.addOpenWaterDevice(house);
            rooms.stairs.addOpenWaterDevice(house);
            rooms.hallway_upstairs.addOpenWaterDevice(house);
            rooms.master_bedroom.addOpenWaterDevice(house);
            rooms.bedroom_0.addOpenWaterDevice(house);
            rooms.bedroom_1.addOpenWaterDevice(house);
            rooms.bathroom_1.addOpenWaterDevice(house);

            rooms.kitchen.addAudioAlarmDevice(house);
            rooms.living_room.addAudioAlarmDevice(house);
            rooms.garage.addAudioAlarmDevice(house);
            rooms.bathroom_0.addAudioAlarmDevice(house);
            rooms.utility_room.addAudioAlarmDevice(house);
            rooms.hallway.addAudioAlarmDevice(house);
            rooms.stairs.addAudioAlarmDevice(house);
            rooms.hallway_upstairs.addAudioAlarmDevice(house);
            rooms.master_bedroom.addAudioAlarmDevice(house);
            rooms.bedroom_0.addAudioAlarmDevice(house);
            rooms.bedroom_1.addAudioAlarmDevice(house);
            rooms.bathroom_1.addAudioAlarmDevice(house);


            rooms.kitchen.addSmartWeights(house)


            ///For the sake of simplicity, addMealDevice has been completely used with the default arguments
            rooms.kitchen.addMealDevice(house);
            /*rooms.living_room.addMealDevice(house);
            rooms.garage.addMealDevice(house);
            rooms.bathroom_0.addMealDevice(house);
            rooms.utility_room.addMealDevice(house);
            rooms.hallway.addMealDevice(house);
            rooms.stairs.addMealDevice(house);
            rooms.hallway_upstairs.addMealDevice(house);
            rooms.master_bedroom.addMealDevice(house);
            rooms.bedroom_0.addMealDevice(house);
            rooms.bedroom_1.addMealDevice(house);
            rooms.bathroom_1.addMealDevice(house);*/

            rooms.kitchen.addRefillSensor();
            rooms.living_room.addRefillSensor();
            rooms.garage.addRefillSensor();
            rooms.bathroom_0.addRefillSensor();
            rooms.utility_room.addRefillSensor();
            rooms.hallway.addRefillSensor();
            rooms.stairs.addRefillSensor();
            rooms.hallway_upstairs.addRefillSensor();
            rooms.master_bedroom.addRefillSensor();
            rooms.bedroom_0.addRefillSensor();
            rooms.bedroom_1.addRefillSensor();
            rooms.bathroom_1.addRefillSensor();

            rooms.kitchen.addRefillDevice(house)


            rooms.bathroom_0.addWashingMachine(house)

            rooms.kitchen.addChargingDevice(house)

            rooms.kitchen.addLogisticDevice(house)



            rooms.bedroom_0.addGarbageDevice(house)
            rooms.living_room.addGarbageSensor()
            rooms.living_room.addGarbage()
        }

        addDevices(this.rooms, this)

        this.metrics = new Observable({ electricity: 0,  gas: 0, water: 0})

        ///N.b. addDoors_to(A,B) method is bidirectional, add the neighbouring room 
        ///from both the A side and the B side
        function addNeighbouringRooms(rooms){
            rooms["kitchen"].addDoors_to(rooms["out"])
            rooms["kitchen"].addDoors_to(rooms["living_room"])
            rooms["living_room"].addDoors_to(rooms["hallway"])
            rooms["living_room"].addDoors_to(rooms["out"])
            rooms["garage"].addDoors_to(rooms["hallway"])
            rooms["garage"].addDoors_to(rooms["out"])
            rooms["bathroom_0"].addDoors_to(rooms["hallway"])
            rooms["utility_room"].addDoors_to(rooms["hallway"])
            rooms["hallway"].addDoors_to(rooms["stairs"])
            rooms["stairs"].addDoors_to(rooms["hallway_upstairs"])
            rooms["hallway_upstairs"].addDoors_to(rooms["master_bedroom"])
            rooms["hallway_upstairs"].addDoors_to(rooms["bedroom_0"])
            rooms["hallway_upstairs"].addDoors_to(rooms["bedroom_1"])
            rooms["hallway_upstairs"].addDoors_to(rooms["bathroom_1"])
        }

        addNeighbouringRooms(this.rooms)

    }

    getAudioAlarmDevices(){
        let audio_alarm_device_list = []
        for (let room of Object.values(this.rooms)){
            if (typeof(room.audio_alarm_device) !== 'undefined' && room.audio_alarm_device !== null){
                audio_alarm_device_list.push(room.audio_alarm_device)
            }
        }
        return audio_alarm_device_list
    }

    getOpenWaterDevices(){
        let open_water_device_list = []
        for (let room of Object.values(this.rooms)){
            if (typeof(room.open_water_device)!== 'undefined' && room.open_water_device !== null){
               open_water_device_list.push(room.open_water_device)
            }
        }
        return open_water_device_list
    }

    getLogisticDevices(){
        let logistic_device_list = []
        for (let room of Object.values(this.rooms)){
            if (typeof(room.logistic_device) !== 'undefined' && room.logistic_device !== null){
                logistic_device_list.push(room.logistic_device)
            }
        }
        return logistic_device_list
    }

    getClotheslines(){
        let clothesline_list = []
        for (let room of Object.values(this.rooms)){
            if (typeof(room.clothesline) !== 'undefined' && room.clothesline !== null){
                clothesline_list.push(room.clothesline)
            }
        }
        return clothesline_list
    }

    getLights(){
        let lights = []
        for (let room of Object.values(this.rooms)){
            if (typeof(room.light) !== 'undefined' && room.light !== null){
                lights.push(room.light)
            }
        }
        return lights
    }
    
    getWashingMachines(){
        let washing_machine_list = []
        for (let room of Object.values(this.rooms)){
            if (typeof(room.washing_machine) !== 'undefined' && room.washing_machine !== null){
                washing_machine_list.push(room.washing_machine)
            }
        }
        return washing_machine_list       
    }

    getChargingDevices(){
        let charging_device_list = []
        for (let room of Object.values(this.rooms)){
            if (typeof(room.charging_device) !== 'undefined' && room.charging_device !== null){
                charging_device_list.push(room.charging_device)
            }
        }
        return charging_device_list  
    }

    getSmartWeights(){
        let smart_weights_list = []
        for (let room of Object.values(this.rooms)){
            if (typeof(room.smart_weights) !== 'undefined' && room.smart_weights !== null){
                smart_weights_list.push(room.smart_weights)
            }
        }
        return smart_weights_list 
    }

    getMusicDevices(){
        let music_device_list = []
        for (let room of Object.values(this.rooms)){
            if (typeof(room.music_device) !== 'undefined' && room.music_device !== null){
                music_device_list.push(room.music_device)
            }
        }
        return music_device_list 
    }

    getWorkoutSensors(){
        let workout_sensor_list = []
        for (let room of Object.values(this.rooms)){
            if (typeof(room.workout_sensor) !== 'undefined' && room.workout_sensor !== null){
                workout_sensor_list.push(room.workout_sensor)
            }
        }
        return workout_sensor_list 
    }

    getRefillSensors(){
        let refill_sensor_list = []
        for (let room of Object.values(this.rooms)){
            if (typeof(room.refill_sensor) !== 'undefined' && room.refill_sensor !== null){
                refill_sensor_list.push(room.refill_sensor)
            }
        }
        return refill_sensor_list 
    }

    getEmergencyCallDevices(){
        let emergency_call_device_list = []
        for (let room of Object.values(this.rooms)){
            if (typeof(room.emergency_call_device) !== 'undefined' && room.emergency_call_device !== null){
                emergency_call_device_list.push(room.emergency_call_device)
            }
        }
        return emergency_call_device_list 
    }

    getSmokeDevices(){
        let smoke_device_list = []
        for (let room of Object.values(this.rooms)){
            if (typeof(room.smoke_device) !== 'undefined' && room.smoke_device !== null){
                smoke_device_list.push(room.smoke_device)
            }
        }
        return smoke_device_list 
    }
    
    getBurglarCameras(){
        let burglar_camera_list = []
        for (let room of Object.values(this.rooms)){
            if (typeof(room.burglar_camera) !== 'undefined' && room.burglar_camera !== null){
                burglar_camera_list.push(room.burglar_camera)
            }
        }
        return burglar_camera_list 
    }
    
    getMealDevices(){
        let meal_device_list = []
        for (let room of Object.values(this.rooms)){
            if (typeof(room.meal_device) !== 'undefined' && room.meal_device !== null){
                meal_device_list.push(room.meal_device)
            }
        }
        return meal_device_list 
    }
    
    getGarbageDevices(){
        let garbage_device_list = []
        for (let room of Object.values(this.rooms)){
            if (room.garbage_device !== null && typeof(room.garbage_device)!== null){
                garbage_device_list.push(room.garbage_device)
            }
        }
        return garbage_device_list          
    }

    getGarbageSensors(){
        let garbage_sensor_list = []
        for (let room of Object.values(this.rooms)){
            if (room.garbage_sensor !== null && typeof(room.garbage_sensor) !== 'undefined'){
                garbage_sensor_list.push(room.garbage_sensor)
            }
        }
        return garbage_sensor_list          
    }

    getDressCameraSensors(){
        let dress_camera_sensor_list = []
        for (let room of Object.values(this.rooms)){
            if (room.dress_camera_sensor !== null && typeof(room.dress_camera_sensor) !== 'undefined'){
                dress_camera_sensor_list.push(room.dress_camera_sensor)
            }
        }
        return dress_camera_sensor_list          
    } 

    getCameraSensors(){
        let camera_sensor_list = []
        for (let room of Object.values(this.rooms)){
            if (room.camera_sensor !== null && typeof(room.camera_sensor) !== 'undefined'){
                camera_sensor_list.push(room.camera_sensor)
            }
        }
        return camera_sensor_list          
    }

    getThermometers(){
        let thermometer_list = []
        for (let room of Object.values(this.rooms)){
            if (typeof(room.thermometer) !== 'undefined' && room.thermometer !== null){
                thermometer_list.push(room.thermometer)
            }
        }
        return thermometer_list          
    }

    getCoolingSystems(){
        let cooling_system_list = []
        for (let room of Object.values(this.rooms)){
            if (typeof(room.cooling_system) !== 'undefined' && room.cooling_system !== null){
                cooling_system_list.push(room.cooling_system)
            }
        }
        return cooling_system_list          
    }

    getHeatingSystems(){
        let heating_system_list = []
        for (let room of Object.values(this.rooms)){
            if (typeof(room.heating_system) !== 'undefined' && room.heating_system !== null){
                heating_system_list.push(room.heating_system)
            }
        }
        return heating_system_list          
    }

    getDishwashers(){
        let dishwasher_list = []
        for (let room of Object.values(this.rooms)){
            if (typeof(room.dishwasher) !== 'undefined' && room.dishwasher !== null){
                dishwasher_list.push(room.dishwasher)
            }
        }
        return dishwasher_list    
    }
    
    getSecurityAlarms(){
        let security_alarm_list = []
        for (let room of Object.values(this.rooms)){
            if (typeof(room.security_alarm) !== 'undefined' && room.security_alarm !== null){
                security_alarm_list.push(room.security_alarm)
            }
        }
        return security_alarm_list    
    }  

    getSmartMealSensors(){
        let smart_meal_sensor_list = []
        for (let room of Object.values(this.rooms)){
            if (typeof(room.smart_meal_sensor) !== 'undefined' && room.smart_meal_sensor !== null){
                smart_meal_sensor_list.push(room.smart_meal_sensor)
            }
        }
        return smart_meal_sensor_list    
    }  

    getRefillDevices(){
        let refill_devices_list = []
        for (let room of Object.values(this.rooms)){
            if (typeof(room.refill_device)!== 'undefined' && room.refill_device !== null){
                refill_devices_list.push(room.refill_device)
            }
        }
        return refill_devices_list
    }
    

    getAllDevices(){
        let devices = []
        for (let r of Object.values(this.rooms)){
            devices.concat(r.getAllDevices())
        }
        return devices
        }

    getAlarms(){
        let alarms_list = []
        for (let room of Object.values(this.rooms)){
            if (typeof(room.alarms) !== 'undefined' && room.alarm !== null){
                alarms_list.push(room.alarms)
            }
        }
        return alarms_list    
    } 

    getPeople(){
        let people_list = []
        for (let room of Object.values(this.rooms)){
            people_list.concat(room.people)
        }
        return people_list    
    } 

    ///Assume unique name for people in the house
    getPeopleDict(){
        let house_people = {}
        for (let room of Object.values(this.rooms)){
            for (let p of Object.values(room.people)){
                house_people[p.name] = p
            }
        }
        return house_people
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
    setRandomRoomsDirty() {
        for (let r of Object.values(this.rooms)) {
            if (r.name != "out") {
                r.status =
                    Math.random() > this.constructor.DIRTINESS ? "dirty" : "clean";
            }
        }
        //this.log("set random rooms dirty");
    }
}

module.exports = { House };
