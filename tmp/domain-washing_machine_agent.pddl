;; domain file: domain-washing_machine_agent.pddl
(define (domain washing_machine_agent)
    (:requirements :strips :negative-preconditions :equality)
    (:predicates
        (in-logistic-device ?r1)
        (door ?r1 ?r2)
        (dress_to_wash ?r1)
        (in-dishwasher ?r1)
        (dress_washed )              
    )
    
        (:action MoveLogisticDevice
            :parameters (?r1 ?r2)
            :precondition (and
                (in-logistic-device ?r1)
                (door ?r1 ?r2)
            )
            :effect (and
                (not (in-logistic-device ?r1))
                (in-logistic-device ?r2)
            )
        )
        
        (:action WashDresses
            :parameters (?r1)
            :precondition (and
                (in-logistic-device ?r1)
                (dress_to_wash ?r1)
                (in-dishwasher ?r1)
                (not (dress_washed ))
            )
            :effect (and
                (dress_washed )
                (not (dress_to_wash ?r1))
            )
        )
        
        (:action MoveGrabbingLogisticDevice
            :parameters (?r1 ?r2)
            :precondition (and
                (in-logistic-device ?r1)
                (dress_to_wash ?r1)
                (door ?r1 ?r2)
            )
            :effect (and
                (not (dress_to_wash ?r1))
                (not (in-logistic-device ?r1))
                (in-logistic-device ?r2)
                (dress_to_wash ?r2)
            )
        )
)