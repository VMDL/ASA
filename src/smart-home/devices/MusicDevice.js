const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");
const Clock = require("../../utils/Clock");
const SimpleOnOffDevice = require("./SimpleOnOffDevice");


class MusicDevice extends SimpleOnOffDevice{
    /** @type {String} name*/
    /** @type {String} room */
    /** @type {House} house */
    constructor(name, room, house){
        super(house, name, room);
        this.electricity_consumption = {on: 2, switch_on: 2, switch_off: 1, move: 4}

    }

    async move(from, to){
      if (this.room == to) {
          return false;
      }
      if (this.room != from) {
          return false;
      }
      if (to == "out") {
          return false;
      }
      if (!this.house.rooms[from].doors_to.includes(to)) {
          return false;
      }
      let timeRemaining = 5
      while (timeRemaining) {
          await Clock.global.notifyChange("mm", "move_"+this.name);
          if (timeRemaining > 0) {
              timeRemaining = timeRemaining - Clock.TIME_STEP;
          }
      }
      this.room = to;
      this.house.rooms[to].music_device = this
      this.house.rooms[from].music_device = null
      this.log(" Move action ends")
      this.house.metrics.electricity += this.electricity_consumption.move

      return true;
    }

    async switchOn(r1){
      if (this.room != r1){
          return false
      }
      if (this.status == "on") {
          return false;
      }
      ///Instantaneous action
      let timeRemaining = 0
      while (timeRemaining) {
          await Clock.global.notifyChange("mm", "switch_on_"+this.name);
          if (timeRemaining > 0) {
              timeRemaining = timeRemaining - Clock.TIME_STEP;
          }
      }
      this.status = "on";
      this.log(" Switch on action ends")
      return true;
    }

    async switchOff(r1){
      if (this.room != r1){
          return false
      }
      if (this.status == "off") {
          return false;
      }
      ///Instantaneous action
      let timeRemaining = 0
      while (timeRemaining) {
          await Clock.global.notifyChange("mm", "switch_off_"+this.name);
          if (timeRemaining > 0) {
              timeRemaining = timeRemaining - Clock.TIME_STEP;
          }
      }
      this.status = "off";
      this.log(" Switch off action ends")
      return true;
    }
};

class MusicDeviceGoal extends Goal {}

class MusicDeviceIntention extends Intention {
    static applicable(goal) {
        return goal instanceof MusicDeviceGoal;
    }

    
    ///Create a for-loop in such a way to look on the second search_engine
    ///in case of not-found playlist on the first search_engine
    /** @type {device} MusicDevice */
    /** @type {genre} String */
    /** @type {search_engine} String */
    searchPlaylist(device, genre, search_engine){
        let found = false
        //Use some kind of API
        //console.log(device + " is looking for " + genre + " playlist on " + search_engine)
        //in case of some API, it should verify that the playlist has been found
        //here, for the sake of simplicity, it is simply return true
        if (true){
          found = true
        }
        return found
    }

    /** @type {people} Array<Person> */
    /** @type {mood} String */
    /** @type {room} Room */
    MajorityWantsMusic(people, mood, room){
      let counter = 0
      let len = 0
      for (let [key,value] of Object.entries(people)){
        ///Count how many people in the room share the same mood
        //to decide if it is a good idea to start the music
        if (value.room == room){
          len = len + 1
          if (value.emotion == mood){
            counter = counter + 1
          }
        }
      }
      ///If at least half of the person in the room 
      ///wants to listen music, it starts
      if (counter > len/2){
        return true
      }
      else{
        return false
      }
    }

    /** @type {people} Array <Person> */
    /** @type {room} Room */
    ChoiceProperPlaylist(people, room){
        ///Measure the most common mood in the room
        let count_mood = {}
        ///Measure the favorite genre of the people in the room 
        let count_genre = {}

        for (let [key,value] of Object.entries(people)){
          ///Count how many people in the room share the same mood
          //to decide for which kind of playlist look for on some search engine
          if (value.emotion in count_mood){
            count_mood[value.emotion] = count_mood[value.emotion] + 1
          }
          else{
            count_mood[value.emotion] = 1
          }
          ///Count how many people in the room share the same favorite music genre
          ///to decice for which kind of playlist look for on some search engine
          if (value.favorite_music_genre in count_genre){
            count_genre[value.favorite_music_genre] = count_genre[value.favorite_music_genre] + 1;
          }
          else{
            count_genre[value.favorite_music_genre] = 1
          }
        }

        ///IDEA: Define it as a global function in utils, as it can be used by any class
        ///Find some simpler method
        ///Do that during previously defined initialization
        /** @type {dictionary} Object*/
        function maximum(dictionary){
            let curr_max;
            let max_value = 0
            for (let [key, value] of Object.entries(dictionary)){
               if (value > max_value){
                max_value = value
                curr_max = key
               }
            }
            return curr_max
        }

        let preferred_genre = maximum(count_genre)
        let preferred_mood = maximum(count_mood)
        let res = {genre: preferred_genre,
                   mood: preferred_mood}
        return res
         
   }

  /** @type {people} Array<Person> */
  /** @type {person} Person */
  /** @type {device} MusicDevice */
  startMusic(people, person, device){
    if (person.emotion == "party" && device.music_started === false){
      if (this.MajorityWantsMusic(people, person.emotion, device.room)){
        let res = this.ChoiceProperPlaylist(people)
        if (this.searchPlaylist(device, res.genre, res.mood) == true){
            console.log(device.name + " has found " + res.genre + " " + res.mood + " playlist on " + device.search_engine)
            device.music_started = true
        }
        else{
            console.log("Sorry, but " + device.name + " has not found " + device.genre + " playlist on " + device.search_engine)
            device.music_started = false
        }
      }
      /*else{
        console.log("Just a small amount of the person in the room wants to listen music")
      }*/
    } 
  }
  
  endMusic(people, person, device){
    ///If no more the majority of the people of the room
    ///wants to listen the music, it is stopped
    if (device.music_started === true && !this.MajorityWantsMusic(people, person.emotion, device.room)){
          device.music_started = false
          console.log("The music has stopped! - No more enough people in " + device.room + "that wants to listen music")
    }
  ///else: still the majority of the people in the room wants to listen the music
  }

    *exec() {
            let device = this.goal.parameters.music_device
            ///Receive as input all the people in the house
            ///later will check which are the ones in the room
            let people = this.goal.parameters.people

            let followPeoplePromises = [];
            for (let p of Object.values(people)) {
                let followPersonPromise = new Promise(async (res) => {
                    while (true) {
                       await p.notifyChange("room", "changeRoom" + p.uuid)
                       this.startMusic(people, p, device)
                       this.endMusic(people, p, device)
                       await p.notifyChange("emotion", "musicDesire"+ p.uuid)
                       ///Question: how the device can monitor people outside of its room
                       ///N.B. There are multiple moods that can be conciliated with some music playlists
                       ///(e.g. chill, party, happy etc, 
                       ///of course some moods as "nervous, angry, tired" cannot be coinciliated with the music
                       this.startMusic(people, p, device)
                       this.endMusic(people, p, device)
                    }
                });
                followPeoplePromises.push(followPersonPromise);
            }
            yield Promise.all(followPeoplePromises);
            }
        }


module.exports = { MusicDevice, MusicDeviceGoal, MusicDeviceIntention };
