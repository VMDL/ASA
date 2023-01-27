;; domain file: domain-temperature_agent.pddl
(define (domain temperature_agent)
    (:requirements :strips :negative-preconditions :equality)
    (:predicates
        (not_hot ?r1)
        (turn_on_cooling ?r1)
        (turn_on ?r1)
        (hot ?r1)
        (cold ?r1)
        (middle ?r1)
        (turn_on_heating ?r1)              
    )
    
        (:action SwitchCoolingSystemOff
            :parameters (?r1)
            :precondition (and
                (not_hot ?r1)
                (turn_on_cooling ?r1)
            )
            :effect (and
                (not (turn_on ?r1))
            )
        )
        
        (:action SwitchCoolingSystemOn
            :parameters (?r1)
            :precondition (and
                (hot ?r1)
                (not (turn_on_cooling ?r1))
            )
            :effect (and
                (turn_on_cooling ?r1)
                (not (cold ?r1))
                (middle ?r1)
            )
        )
        
        (:action SwitchHeatingSystemOff
            :parameters (?r1)
            :precondition (and
                (not (cold ?r1))
                (turn_on_heating ?r1)
            )
            :effect (and
                (not (turn_on_heating ?r1))
            )
        )
        
        (:action SwitchHeatingSystemOn
            :parameters (?r1)
            :precondition (and
                (cold ?r1)
                (not (turn_on_heating ?r1))
            )
            :effect (and
                (turn_on_heating ?r1)
                (not (cold ?r1))
                (middle ?r1)
            )
        )
)