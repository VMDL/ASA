# ASA
Smart-Home - Project Autonomous Software Agents 2021-2022 

## Run

1) Install dependencies

```
npm install
```

2) Run the scenario

```
node ./src/smart-home/scenarios/complete_scenario.js 
```

Under `src/smart-home`, there are the main ingredients of the BDI system: agent, devices, sensors and environment; in addition to them there are some Util files that are useful to run the scenarios.

Note that among that there are multiple types of agents: HouseAgent that can work as Server or simple Client and PlanningAgent.

The Agent files contain the agent definition, its intention and its goal.
The sensor files define how this hardware components interact with the environment.
The device files define how to directly act on the environment.
Under helper package it is defined the way how agents communicate.

Under `tmp`, there are the Planning domains and problems generated during the execution of the scenario.

More specifically this is the folder structure:
    
  📂 src
      📂 bdi
      |  📄 Agent.js
      |  📄 Beliefset.js
      |  📄 Goal.js
      |  📄 Intention.js
      📂 pddl
      |   📁 actions
          |   📄 pddlActionGoal.js
          |   📄 pddlActionIntention.js
          |   📄 pddlValidateEffectsAndPreconditions.js
      |   📄 OnlinePlanner.js
      |   📄 PddlDomain.js
      |   📄 PddlProblem.js
      |   📄 PlanningGoal.js
      |   📄 Index.js
      |   📁 smart-home
          |   📁 agents
              |   📄   AlarmAgent.js
              |   📄   ChargingAgent.js
              |   📄   EmergencyCallAgent.js
              |   📄   GarbageAgent.js
              |   📄   GymAgent.js
              |   📄   HouseServerAgent.js
              |   📄   LightAgent.js
              |   📄   MealAgent.js
              |   📄   MusicAgent.js
              |   📄   RefillAgent.js
              |   📄   SecurityAgent.js
              |   📄   ThermostatAgent.js
              |   📄   VacuumCleanerAgent.js
              |   📄   WashingMachineAgent.js
              |   📄   pddlActions.js
              |   📄   pddlGoals.js
          |   📁 devices
              |   📄   Alarm.js
              |   📄   AudioAlarmDevice.js
              |   📄   ChargingDevice.js
              |   📄   CoolingSystem.js
              |   📄   EmergencyCall.js
              |   📄   ExploringDevice.js
              |   📄   GarbageDevice.js
              |   📄   HeatingSystem.js
              |   📄   Light.js
              |   📄   LogisticDevice.js
              |   📄   MealDevice.js
              |   📄   MusicDevice.js
              |   📄   OpenWaterDevice.js
              |   📄   RefillDevice.js
              |   📄   SecurityAlarm.js
              |   📄   SmartWeight.js
              |   📄   VacuumCleaner.js
              |   📄   WashingMachine.js
          |   📁 environment
              |   📄   House.js
              |   📄   Room.js
              |   📄   Temperature.js
          |   📁 helpers
              |   📄   Communication.js
          |   📁 scenarios
              |   📄   complete_scenario.js
              |   📄   randomized_scenario.js
              |   📄   initialization.js
              |   📄   randomized_scenario.js
          |   📁 sensors
              |   📄   BatterySensor.js
              |   📄   BurglarSensor.js
              |   📄   CameraSensor.js
              |   📄   DressCameraSensor.js
              |   📄   GarbageSensor.js
              |   📄   RefillSensor.js
              |   📄   SmartMealSensor.js
              |   📄   SmokeSensor.js
              |   📄   ThermometerSensor.js
              |   📄   WorkoutSensor.js
          |   📁 utils
              |   📄   AlarmUtils.js
              |   📄   ChargingUtils.js
              |   📄   GarbageUtils.js
              |   📄   GymUtils.js
              |   📄   HouseServerUtils.js
              |   📄   HouseUtils.js
              |   📄   LightUtils.js
              |   📄   MealsUtils.js
              |   📄   MusicUtils.js
              |   📄   RefillUtils.js
              |   📄   SecurityUtils.js
              |   📄   TemperatureUtils.js
              |   📄   VacuumCleanerUtils.js
              |   📄   WashingMachineUtils.js
          |   📄 Person.js
      |  📁 utils
          |    📄 Clock.js
          |    📄 Observable.js
          |    📄 keypress.js

  📁 tmp
      |    📄 domain-garbage-agent.js
      |    📄 problem-garbage-agent.js
      |    📄 domain-gym-agent.js
      |    📄 problem-gym-agent.js
      |    📄 domain-music-agent.js
      |    📄 problem-music-agent.js
      |    📄 domain-refill-agent.js
      |    📄 problem-refill-agent.js
      |    📄 domain-vacuum-agent.js
      |    📄 problem-vacuum-agent.js
      |    📄 domain-washing_machine_agent.js
      |    📄 problem-washing_machine_agent.js



