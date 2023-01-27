;; domain file: domain-vacuum_cleaner.pddl
(define (domain vacuum_cleaner)
    (:requirements :strips :negative-preconditions :equality)
    (:predicates
        (in ?r1)
        (door ?r1 ?r2)
        (person_room ?r)
        (dirty ?r)
        (clean ?r)
        (sucked ?r)              
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
        
        (:action Suck
            :parameters (?r)
            :precondition (and
                (not (person_room ?r))
                (in ?r)
                (dirty ?r)
                (not (clean ?r))
            )
            :effect (and
                (not (dirty ?r))
                (sucked ?r)
            )
        )
)