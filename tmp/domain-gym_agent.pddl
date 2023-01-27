;; domain file: domain-gym_agent.pddl
(define (domain gym_agent)
    (:requirements :strips :negative-preconditions :equality)
    (:predicates
        (in ?r1)
        (door ?r1 ?r2)
        (leave-weights ?r1)              
    )
    
        (:action MoveWeights
            :parameters (?r1 ?r2)
            :precondition (and
                (in ?r1)
                (door ?r1 ?r2)
            )
            :effect (and
                (not (leave-weights ?r1))
                (in ?r2)
                (not (in ?r1))
            )
        )
        
        (:action DeliverWeights
            :parameters (?r1)
            :precondition (and
                (in ?r1)
            )
            :effect (and
                (leave-weights ?r1)
            )
        )
)