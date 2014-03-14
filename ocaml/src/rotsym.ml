open Core

let range start stop =
  if stop < start then failwith "Invalid range";
  let n = stop - start + 1 in
  Array.init n ~f:(fun i -> i + start)

module Rotating_ngon = struct
  let rotating_ngon w h n =
    let open Draw in
    let w, h   = float_of_int w, float_of_int h in
    let radius = min w h /. 4. in
    let center = (w /. 2., h /. 2.) in
    let p0     = (w /. 2., (h /. 2.) -. radius) in
    let theta  = 360. /. float_of_int n in

    let nice_blue = Color.of_rgb ~r:120 ~g:154 ~b:243 () in
    let ngon color = 
      let pts = 
        Array.map (range 0 (n - 1)) ~f:(fun i -> let open Angle in
          rotate ~about:center p0 (float_of_int i * of_degrees theta)
        )
      in let open Property in let open Frp.Behavior in
      polygon (return pts) ~props:[| return (fill color) |]
    in

    let angle =
      let open Animate.Sequence in
      Array.map (range 1 n)
        ~f:(fun i -> quadratic 1000. ~final:(float_of_int i *. theta) >> stay_for 500.)
      |> Array.fold_right ~init:stay_forever ~f:(>>)
      |> (fun x -> stay_for 500. >> x)
      |> run ~init:0.
      |> Frp.Behavior.map ~f:Angle.of_degrees
    in

    let rots = Frp.Behavior.map angle ~f:(fun a -> int_of_float (Angle.to_degrees a /. theta)) in

    let arc = let open Frp.Behavior in
      path
        ~anchor:(let (x, y) = p0 in return (x, y -. 40.))
        ~props:[|
          return (Property.stroke Color.black 4);
          return (Property.fill Color.none)
        |]
        (map angle ~f:(fun a -> [|
          let a = min a (Angle.of_degrees 359.9999) in
          let flag = if a < Angle.of_degrees 180. then `short else `long in
          Segment.arc (Angle.of_degrees 90.) Angle.(of_degrees 90. + a) flag (radius +. 40.)
        |]))
    in

    let labels = let open Frp.Behavior in
      let theta = Angle.of_degrees theta in
      let label_pos i = let open Draw.Point in
        Frp.Behavior.map angle ~f:(fun a -> let open Angle in
          rotate ~about:center (let (x,y) = p0 in (x, y -. 20.)) (a + (float_of_int i * theta))
        )
      in
      Array.map (range 1 n)
        ~f:(fun i -> text (return (string_of_int i)) (label_pos (i - 1)))
    in
    pictures (
(*       Array.append labels *)
        [| ngon (Color.of_rgb ~r:0xEE ~g:0xEE ~b:0xEE ())
        ;  transform (ngon nice_blue) (Frp.Behavior.map angle ~f:(fun a -> Transform.Rotate (a, center)))
        ;  arc
        ;  text (Frp.Behavior.map rots ~f:string_of_int) (Frp.Behavior.return (w -. 10., 54.))
            ~props:[|Frp.Behavior.return (Property.any ~name:"font-size" ~value:"40pt" ) 
                   ; Frp.Behavior.return (Property.any ~name:"text-anchor" ~value:"end")
                   |]
        |]
    )

  let mk () =
    let container = Option.value_exn (Jq.jq "#ngon") in
    let open Widget in
    create ~width:400 ~height:400 container (fun nb -> 
      Draw.dynamic (Frp.Behavior.map nb ~f:(fun n -> 
        if n = 2
        then Frp.Behavior.(
          Draw.text (return "Hit plus yo") (return (200.,200.))
        )
        else rotating_ngon 400 400 n
      ))
    )
    +> Control.incr_decr ~bot:2 ~top:6 ()
    |> run
end

let () = ignore (Rotating_ngon.mk ())

(*
let () =
  let svg = Jq.Dom.svg_node "svg" [| "width", "400"; "height", "600" |] in
  Jq.Dom.append svg (fst (Draw.render (rotating_ngon 400 400 4)));
  match Option.bind (Jq.jq "#square") Jq.to_dom_node with
    | None -> print "hi"
    | Some t -> Jq.Dom.append t svg

*)
module Point_in_plane = struct
  let (init_x, init_y) = (50, 100)

  let point_in_plane () =
    let container = Option.value_exn (Jq.jq "#point-in-plane") in
    let w, h      = 400., 400. in
    let open Draw in
    let plane_anim pt = let open Frp.Behavior in
      let props = [|
          return (Property.stroke (Color.of_rgb ~r:0xAA ~g:0xAA ~b:0xAA ()) 2);
          return (Property.fill Color.none)
        |]
      in
      let x_tracker =
        path ~props ~anchor:(map pt ~f:(fun (x, y) -> (float_of_int x, 0.)))
          (return [|Segment.line_to (0., h)|])
      in
      let y_tracker =
        path ~props ~anchor:(map pt ~f:(fun (x, y) -> (0., float_of_int y)))
          (return [|Segment.line_to (w, 0.)|])
      in
      let circ = 
        circle ~props:[|return (Property.fill Color.black)|] (return 5.)
          (map ~f:(Arrow.both float_of_int) pt)
      in
      let pt_text =
        text (map pt ~f:(fun (x, y) -> Printf.sprintf "(%d, %d)" x (400 - y))) (return (10., h -. 40.))
      in
      pictures [| x_tracker; y_tracker; pt_text; circ|]
    in
    let open Widget in
    create ~width:400 ~height:400 container plane_anim
    +> Control.drag_point (init_x, init_y)
    |> run
end

let () = ignore (Point_in_plane.point_in_plane ())

module Continuous_path = struct

  let path_svg = Jq.Dom.svg_node "path"
    [| "stroke", "#000000"
    ;  "d", "m74.072388,176.343704c0,0 -48.240629,-187.48112 77.664017,-81.201996c125.904617,106.279099 131.036606,-49.55714 131.036606,-49.55714c0,0 14.027405,-41.795149 -142.669113,-23.882954c-156.696512,17.912197 69.794968,40.60104 69.794968,40.60104c0,0 218.280304,19.106365 -31.818298,157.030354c-250.098579,137.92395 -120.088375,-207.781625 -120.088375,-207.781625" 
    ; "stroke-width", "5"
    ; "fill", "none"
    |]

  let mk () =
    let container = Option.value_exn (Jq.jq "#pathanim") in
    let path_anim slider_val =
      let open Frp.Behavior in
      let open Draw in let open Point in let open Segment in
      path_string
        ~props:[|
          return Property.(fill Color.({red with alpha = 0.}));
          return Property.(stroke Color.black 4)
        |]
        ~mask:(map slider_val ~f:(fun x -> (0., x ** 2.)))
        (return "M15.514,227.511c0,0-14.993-122.591,109.361-59.091 c124.356,63.501,157.872,22.049,125.238-49.389c-32.632-71.439-127.305-15.875-111.719,108.479 c15.586,124.355,246.658,35.278,246.658,35.278")
    in
    let open Widget in
    create ~width:400 ~height:400 container path_anim
    +> Control.continuous_slider ""
    |> run
end

module Graph_split = struct
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

  let charge_accel p1 p2 =
    if p1 = p2
    then (1., 1.) 
    else
      let charge_constant = 1. in
      let d = Vector.sub p2 p1 in
      Vector.scale (charge_constant /. (Vector.norm d ** 2.)) d

  let spring_accel p1 p2 : (float * float) =
    let spring_constant = 1. in
    Vector.scale spring_constant (Vector.sub p2 p1)

  let side_force_x w h c p (a, b) =
    -. c *. (atan ((b -. h) /. (a -. p)) -. atan (b /. (a -. p)))

  let side_force_y w h c p (a, b) =
(*     let f y = log (a**2. -. (2. *. a *. p) +. b**2. -. (2. *. b *. y) +. p**2. +. y**2.) in *)
    let f y = log ((a -. p)**2. +. (b -. y)**2.) in
    -. (c /. 2.) *. (f h -. f 0.)

  let draw_graph g =
    let posg = Graph.map_nodes g ~f:(fun _ -> Frp.Behavior.return (1.,1.)) in
    let get_pos v = Frp.Behavior.peek (Graph.get_exn v posg) in

    let spring_accels p0 vs =
      Array.fold vs ~init:(0., 0.) ~f:(fun acc (v2, _) -> 
        Vector.add acc (spring_accel p0 (get_pos v2))
      )
    in

    let update () =
      Graph.iter_nodes posg ~f:(fun v1 posb1 ->
        let pos1 = Frp.Behavior.peek posb1 in
        let charge_acc = 
          Graph.fold_nodes posg ~init:(0., 0.) ~f:(fun acc v2 posb2 ->
            if v1 <> v2
            then Vector.add acc (charge_accel pos1 (Frp.Behavior.peek posb2))
            else acc
          )
        in
        Frp.Behavior.trigger posb1 (
          Vector.add charge_acc (
          Vector.add (spring_accels pos1 (Graph.successors_exn v1 posg))
                     (spring_accels pos1 (Graph.predecessors_exn v1 posg))
          )
        )
      )
    in

    let drawing = let open Draw in
      let circs = 
        Graph.fold_nodes posg ~init:[] ~f:(fun cs v pos_v ->
          circle (Frp.Behavior.return 10.) pos_v
          :: cs
        ) |> Array.of_list
      in
      let edges =
        Graph.fold_arcs posg ~init:[] ~f:(fun es v1 v2 _ ->
          path ~anchor:(Graph.get_exn v1 posg)
            (Frp.Behavior.map (Graph.get_exn v2 posg) ~f:(fun p -> [|Segment.move_to p|]))
          :: es
        ) |> Array.of_list
      in
      pictures (Array.append circs edges)
    in
    begin
      let (elt, sub) = Draw.render drawing in
      let svg        = Jq.Dom.svg_node "svg" [| "width", "400"; "height", "600" |] in
      Jq.Dom.append svg elt;
      Frp.Stream.(iter (ticks 30.) ~f:(fun _ -> update ())) |> ignore;
      match Option.bind (Jq.jq "#graphanim") Jq.to_dom_node with
        | None   -> print "ho"
        | Some t -> Jq.Dom.append t svg
    end
end

(* let () = Graph_split.(draw_graph bowtie) *)

let _ = Continuous_path.mk ()

