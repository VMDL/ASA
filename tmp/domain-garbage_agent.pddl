;; domain file: domain-garbage_agent.pddl
(define (domain garbage_agent)
    (:requirements :strips :negative-preconditions :equality)
    (:predicates
        (in ?room1)
        (has-garbage ?room1)
        (in-garbage ?room1)
        (door ?room1 ?room2)
        (grab )
        (full )              
    )
    
        (:action MoveGarbage
            :parameters (?room1 ?room2)
            :precondition (and
                (in ?room1)
                (has-garbage ?room1)
                (in-garbage ?room1)
                (door ?room1 ?room2)
                (grab )
            )
            :effect (and
                (in ?room2)
                (has-garbage ?room2)
                (in-garbage ?room2)
                (not (in ?room1))
                (not (has-garbage ?room1))
                (not (in-garbage ?room1))
            )
        )
        
        (:action MoveNoGarbage
            :parameters (?room1 ?room2)
            :precondition (and
                (in ?room1)
                (door ?room1 ?room2)
            )
            :effect (and
                (in ?room2)
                (not (in ?room1))
            )
        )
        
        (:action PutOutGarbage
            :parameters (?room1)
            :precondition (and
                (in out)
                (in-garbage out)
                (full )
                (has-garbage out)
                (grab )
            )
            :effect (and
                (not (full ))
                (not (has-garbage out))
            )
        )
        
        (:action MoveEmptyGarbage
            :parameters (?room1 ?room2)
            :precondition (and
                (in ?room1)
                (in-garbage ?room1)
                (not (has-garbage ?room1))
                (door ?room1 ?room2)
                (not (full ))
                (grab )
            )
            :effect (and
                (in ?room2)
                (in-garbage ?room2)
                (not (has-garbage ?room2))
                (not (in ?room1))
            )
        )
        
        (:action PickGarbage
            :parameters (?room1)
            :precondition (and
                (in ?room1)
                (in-garbage ?room1)
                (not (grab ))
                (full )
                (has-garbage ?room1)
            )
            :effect (and
                (grab )
            )
        )
        
        (:action LeaveEmptyGarbage
            :parameters (?room1)
            :precondition (and
                (in ?room1)
                (in-garbage ?room1)
                (grab )
                (not (full ))
                (not (has-garbage ?room1))
            )
            :effect (and
                (not (grab ))
            )
        )
)