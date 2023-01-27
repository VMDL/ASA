;; problem file: problem-washing_machine_agent.pddl
(define (problem washing_machine_agent)
    (:domain washing_machine_agent)
    (:objects bathroom_0 kitchen living_room garage utility_room hallway stairs hallway_upstairs master_bedroom bedroom_0 bedroom_1 bathroom_1 out)
	(:init (in-dishwasher bathroom_0) (in-logistic-device kitchen) (dress_to_wash hallway) (door kitchen out) (door kitchen living_room) (door living_room kitchen) (door living_room hallway) (door living_room out) (door garage hallway) (door garage out) (door bathroom_0 hallway) (door utility_room hallway) (door hallway living_room) (door hallway garage) (door hallway bathroom_0) (door hallway utility_room) (door hallway stairs) (door stairs hallway) (door stairs hallway_upstairs) (door hallway_upstairs stairs) (door hallway_upstairs master_bedroom) (door hallway_upstairs bedroom_0) (door hallway_upstairs bedroom_1) (door hallway_upstairs bathroom_1) (door master_bedroom hallway_upstairs) (door bedroom_0 hallway_upstairs) (door bedroom_1 hallway_upstairs) (door bathroom_1 hallway_upstairs) (door out kitchen) (door out living_room) (door out garage))
	(:goal (and (not (dress_to_wash hallway)) (dress_washed)))
)
