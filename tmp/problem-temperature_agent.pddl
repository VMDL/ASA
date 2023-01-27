;; problem file: problem-temperature_agent.pddl
(define (problem temperature_agent)
    (:domain temperature_agent)
    (:objects kitchen living_room garage bathroom_0 utility_room hallway stairs hallway_upstairs master_bedroom bedroom_0 bedroom_1 bathroom_1 out)
	(:init (middle living_room) (middle garage) (middle utility_room) (middle hallway) (middle stairs) (middle hallway_upstairs) (middle master_bedroom) (middle bedroom_0) (middle bathroom_1) (cold kitchen) (hot bathroom_0) (hot bedroom_1))
	(:goal (and (middle bathroom_0)))
)
