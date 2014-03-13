(* split : ('a, 'b) t -> ('a, 'b) t option *)
open Core

(* This is pretty inefficient. We could have a priority queue of
 * vertices to be split
 *)

let finished g =
  Array.for_all (Graph.nodes g) ~f:(fun v ->
    (Option.value_map ~default:0 (Graph.successors v g) ~f:Array.length) 
    <= 1
  )

let splittable g =
  Array.find (Graph.nodes g) ~f:(fun v ->
    Array.length (Graph.successors_exn v g) > 1
  )

let choose_succ v g = fst (Graph.successors_exn v g).(0)

let choose_pred v g = fst (Graph.predecessors_exn v g).(0)

let split def_nodeval def_arcval g =
  match splittable g with
  | None -> None
  | Some v ->
    let (v', g') = Graph.add_node def_nodeval g in
    let s = choose_succ v g' in
    let p = choose_pred v g' in
    let g'' = let open Graph.Change in
      Graph.change [|
        Remove_arc (v, s);
        Remove_arc (p, v);
        Add_arc (v', s, def_arcval);
        Add_arc (p, v', def_arcval);
      |] g'
    in
    Some g''

let decompose def_nodeval def_arcval =
  let rec loop arr g = 
    match split def_nodeval def_arcval g with
    | None -> arr
    | Some g' -> begin
      Array.push g' arr;
      loop arr g'
    end
  in
  fun g -> let arr = [|g|] in loop arr g

