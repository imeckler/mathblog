(* split : ('a, 'b) t -> ('a, 'b) t option *)
open Core

let () = Random.self_init ()

(* This is pretty inefficient. We could have a priority queue of
 * vertices to be split
 *)

module Decomp = struct
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
end

let single_node : (Draw.Color.t, unit) Graph.t =
  let open Graph.Builder in let open Monad_infix in let open Draw in
  run (Graph.empty ()) (new_node Color.black)

let binary_graph = let open Graph.Builder in let open Monad_infix in let open Draw in
  begin
  new_node Color.black >>= fun v1 ->
  new_node Color.black >>= fun v2 ->
  add_arc v1 v2 ()
  end
  |> run (Graph.empty ())

let bowtie =
  let gph = Graph.empty () in
  match Graph.add_nodes (Array.create ~len:5 Draw.Color.black) gph with
  | ([|a;b;c;d;e|], gph') ->
    let open Graph.Change in
    Graph.change [|
      Add_arc (a, b, ());
      Add_arc (b, c, ());
      Add_arc (c, a, ());

      Add_arc (c, d, ());
      Add_arc (d, e, ());
      Add_arc (e, c, ());
    |] gph'
  | _ -> failwith "Big booboo in bowtie"

module Vector = struct
  let scale c (x, y) = (c *. x, c *. y)

  let add (x1, y1) (x2, y2) = (x1 +. x2, y1 +. y2)

  let sub (x1, y1) (x2, y2) = (x1 -. x2, y1 -. y2)

  let norm (x, y) = sqrt (x ** 2. +. y ** 2.)
end

let charge_constant = 1.

let charge_accel p1 p2 =
  let d = Vector.sub p2 p1 in
  let c = (Vector.norm d ** 2.) in
  if c = 0.
  then (100., 100.)
  else Vector.scale (charge_constant /. c) d

let spring_accel p1 p2 : (float * float) =
  let spring_constant = 0.01 in
  Vector.scale spring_constant (Vector.sub p2 p1)

let side_force_x h c p (a, b) =
  c *. (atan (b /. (a -. p)) -. atan ((b -. h) /. (a -. p)))

let side_force_y h c p (a, b) =
(*     let f y = log (a**2. -. (2. *. a *. p) +. b**2. -. (2. *. b *. y) +. p**2. +. y**2.) in *)
  let f y = log ((a -. p) ** 2. +. (b -. y) ** 2.) in
  -. (c /. 2.) *. (f h -. f 0.)

let side_force h c p pt = (side_force_x h c p pt, side_force_y h c p pt)

let horiz_force_x w c p (a, b) =
  let f x = log ((a -. x) ** 2. +. (b -. p) ** 2.) in
  (c /. 2.) *. (f 0. -. f w)

let horiz_force_y w c p (a, b) =
  c *. (atan (a /. (b -. p)) -. atan ((a -. w) /. (b -. p)))

(*
  let f x = atan2 (a -. x) (b -. p) in
  c *. (f 0. -. f w)
*)
let horiz_force w c p pt = (horiz_force_x w c p pt, horiz_force_y w c p pt)

let friction = Vector.scale (-0.001)

let clip_pos w h (x, y) = (min (w -. 5.) (max x 5.), min (h -. 5.) (max y 5.))

let draw_graph g =
  let w, h       = 600, 400 in
  let w', h'     = float_of_int w, float_of_int h in
  let data_g     = Graph.map_nodes g ~f:(fun _ -> 
     Frp.Behavior.(return (Random.float w', Random.float h'), return (0., 0.))) in
  let get_pos v  = Frp.Behavior.peek (fst (Graph.get_exn v data_g)) in

  let spring_accels p0 vs =
    Array.fold vs ~init:(0., 0.) ~f:(fun acc (v2, _) -> 
      Vector.add acc (spring_accel p0 (get_pos v2))
    )
  in
  (* change this to be a fold over the delta stream *)

  let update delta =
    let delta = Time.Span.to_ms delta in
    Graph.iter_nodes data_g ~f:(fun v1 (posb1, velb1) ->
      let pos1 = Frp.Behavior.peek posb1 in
      let charge_acc = 
        Graph.fold_nodes data_g ~init:(0., 0.) ~f:(fun acc v2 (posb2, _) ->
          if v1 <> v2
          then Vector.add acc (charge_accel pos1 (Frp.Behavior.peek posb2))
          else acc
        )
      in
      let forces = [|
          charge_acc;
          spring_accels pos1 (Graph.successors_exn v1 data_g);
          spring_accels pos1 (Graph.predecessors_exn v1 data_g);
          (side_force_x h' 1. 0. pos1, 0.);
          (side_force_x h' 1. w' pos1, 0.);
          (0. , horiz_force_y w' 1. 0. pos1);
          (0., horiz_force_y w' 1. h' pos1);
          friction (Frp.Behavior.peek velb1)
        |]
      in
      let force = Array.fold ~init:(0., 0.) ~f:Vector.add forces |> Vector.scale 0.00001 in
      let open Frp.Behavior in
      let curr_vel = peek velb1 in
      let pos' = Vector.add (peek posb1) (Vector.scale delta curr_vel) |> clip_pos w' h' in 

      Frp.Behavior.(trigger velb1 (Vector.add curr_vel (Vector.scale delta force)));
      Frp.Behavior.(trigger posb1 pos')
    )
  in

  let drawing = let open Draw in
    let circs = 
      Graph.fold_nodes data_g ~init:[] ~f:(fun cs v (pos_v, _) ->
        circle (Frp.Behavior.return 10.) pos_v
        :: cs
      ) |> Array.of_list
    in
    let edges =
      Graph.fold_arcs data_g ~init:[] ~f:(fun es v1 v2 _ ->
        path 
          ~props:[| Frp.Behavior.return (Property.stroke Color.black 2) |]
          ~anchor:(fst (Graph.get_exn v1 data_g))
          (Frp.Behavior.map (fst (Graph.get_exn v2 data_g)) ~f:(fun p -> [|Segment.line_to p|]))
        :: es
      ) |> Array.of_list
    in
    pictures (Array.append circs edges)
  in
  begin
    let (elt, sub) = Draw.render drawing in
    let svg        = Jq.Dom.svg_node "svg" [| "width", string_of_int w; "height", string_of_int h |] in
    Jq.Dom.append svg elt;

    begin match Option.bind (Jq.jq "#graphanim") Jq.to_dom_node with
      | None   -> print "ho"
      | Some t -> Jq.Dom.append t svg
    end;

    Frp.Stream.(iter (deltas 30.) ~f:update) |> ignore;
  end

let () = draw_graph bowtie

