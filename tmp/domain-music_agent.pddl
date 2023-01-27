;; domain file: domain-music_agent.pddl
(define (domain music_agent)
    (:requirements :strips :negative-preconditions :equality)
    (:predicates
        (people_want_party ?r1)
        (turn_on_music ?r1)
        (in-music-device ?r1)
        (door ?r1 ?r2)              
    )
    
        (:action TurnOnMusic
            :parameters (?r1)
            :precondition (and
                (people_want_party ?r1)
                (not (turn_on_music ?r1))
                (in-music-device ?r1)
            )
            :effect (and
                (turn_on_music ?r1)
            )
        )
        
        (:action TurnOffMusic
            :parameters (?r1)
            :precondition (and
                (not (people_want_party ?r1))
                (turn_on_music ?r1)
                (in-music-device ?r1)
            )
            :effect (and
                (not (turn_on_music ?r1))
            )
        )
        
        (:action MoveMusicDevice
            :parameters (?r1 ?r2)
            :precondition (and
                (in-music-device ?r1)
                (door ?r1 ?r2)
            )
            :effect (and
                (in-music-device ?r2)
                (not (in-music-device ?r1))
            )
        )
        
        (:action MoveTurnedOnDevice
            :parameters (?r1 ?r2)
            :precondition (and
                (in-music-device ?r1)
                (door ?r1 ?r2)
                (turn_on_music ?r1)
            )
            :effect (and
                (in-music-device ?r2)
                (not (in-music-device ?r1))
                (turn_on_music ?r2)
                (not (turn_on_music ?r1))
            )
        )
)