;; domain file: domain-refill_agent.pddl
(define (domain refill_agent)
    (:requirements :strips :negative-preconditions :equality)
    (:predicates
        (in ?r1)
        (door ?r1 ?r2)
        (content_in ?r1)
        (content_bought )
        (need_to_refill ?r1)              
    )
    
        (:action Move
            :parameters (?r1 ?r2)
            :precondition (and
                (in ?r1)
                (door ?r1 ?r2)
            )
            :effect (and
                (in ?r2)
                (not (in ?r1))
            )
        )
        
        (:action MoveRefill
            :parameters (?r1 ?r2)
            :precondition (and
                (in ?r1)
                (content_in ?r1)
                (door ?r1 ?r2)
            )
            :effect (and
                (not (in ?r1))
                (not (content_in ?r1))
                (in ?r2)
                (content_in ?r2)
            )
        )
        
        (:action BuyRefill
            :parameters ()
            :precondition (and
                (in out)
            )
            :effect (and
                (content_bought )
                (content_in out)
            )
        )
        
        (:action DeliverRefill
            :parameters (?r1)
            :precondition (and
                (need_to_refill ?r1)
                (content_in ?r1)
                (in ?r1)
            )
            :effect (and
                (not (need_to_refill ?r1))
            )
        )
)