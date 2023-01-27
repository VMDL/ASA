const Goal = require("../../bdi/Goal");
const Intention = require("../../bdi/Intention");
const Clock = require("../../utils/Clock");
const GenericDevice = require("./GenericDevice");

//class Alarm extends GenericDevice
class Alarm extends GenericDevice{
    /** @type {name} String */
    /** @type {decibel}  Number*/
    /** @type {song_name} String */
    /** @type {hh} Number */
    /** @type {mm} Number */
    /** @type {room} String */
    constructor(name, decibel, song_name, hh, mm, room){
        super(name, room)
        this.decibel = decibel

        ///N.b. as elsewhere in the source code, everything that has not yet been implemented
        ///has been realized through a modular approach in such a way
        ///to simplify the integration of more sophisticated procedures.
        ///Here for the sake of simplicity the function always return true
        ///but the main idea is to guarantee that the song called "song_name"
        ///can be found on some song archieve (e.g. YoutubeMusic or Spotify)
        ///This could be simulated also by means of some WebScraping techniques.
        ///N.B. we return also the hour specification to address some playlist case
        function look_for_song(song_name){
           let found = {hh:0, mm: 0}
           ///Look for song on spotify that would set the "found" variable
           ///Here just set to true
           if (true){
              ///here we should have a subroutine to look in a search engine
              ///that returns also the duration of the song in terms of minutes
              ///(N.B. We consider just minutes since this is the accuracy of the Clock we are using
              ///in this prototype version)
              found = {hh:0, mm: 5}
           }

           return found
        }
   
        ///We use just minutes since this is a prototype version
        ///in a realistic case it would be of interest take into account also the seconds
        ///Create subroutine to check the existence of the song
        this.song_duration = look_for_song(song_name)

        ///this.song_duration specifies the duration of the song
        ///if it has not been found, it should be 0
        ///in a realistic case, the duration should be specified in terms of seconds
        ///to guarantee the management of cases in which a song has duration equal to 0 minutes 
        ///but more than 0 seconds
        if (this.song_duration['mm'] != 0 || this.song_duration['hh'] != 0 ){
            this.song_name = song_name
        }
        ///If the song is not found it informs the user of the error
        ///and set an predefined alarm song (internal to the device)
        ///There could be set also other strategies (e.g. set the song with a name similar to the one requested)
        ///or wait for another input from the user 
        ///or just let the user define the name of the singer and choose a random song of that singer
        else{
            console.log("The song do you want to set as alarm (" + song_name +
                                ") has not been found on the search engine, check if you write it properly")
            this.song_name = 'Predefined Alarm song'
            ///We assume that the duration of the predefined Alarm song is equal to 5 minutes
            this.song_duration['mm'] = 5
        }
        this.hh = hh
        this.mm = mm
        ///TO INTEGRATE: set day too!
    }


}
class AlarmGoal extends Goal {}

class AlarmIntention extends Intention {
    static applicable(goal) {
        return goal instanceof AlarmGoal;
    }

    *exec() {
        while (true) {
            yield Clock.global.notifyChange("mm", "alarm" + this.goal.parameters.alarm_device.name);
            if (Clock.global.hh == this.goal.parameters.alarm_device.hh &&
                Clock.global.mm == this.goal.parameters.alarm_device.mm) {

                ///Create a function (A sort of "press start button")
                this.log(" Plays: " + this.goal.parameters.alarm_device.song_name + 
                            ", Decibel: " + this.goal.parameters.alarm_device.decibel 
                            + "' at: hh:" + Clock.global.hh + ":mm" + Clock.global.mm)

                
                //Encapsulation
                let timeRemaining = this.goal.parameters.alarm_device.song_duration['mm']+10
                while(timeRemaining > 0){
                    yield Clock.global.notifyChange("mm", "is_playing" + this.goal.parameters.alarm_device.name);
                    timeRemaining -= Clock.TIME_STEP
                }

                ///Create a function (A sort of "press stop button")
                this.log(" Ends:'" + this.goal.parameters.alarm_device.song_name
                                + "' at: hh:" + Clock.global.hh + ":mm" + Clock.global.mm)
                }
        }
    }
}

module.exports = { Alarm, AlarmGoal, AlarmIntention};
