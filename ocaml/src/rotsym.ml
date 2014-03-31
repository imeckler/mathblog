open Core

let range start stop =
  if stop < start then failwith "Invalid range";
  let n = stop - start + 1 in
  Array.init n ~f:(fun i -> i + start)

let nice_blue = Draw.Color.of_rgb ~r:120 ~g:154 ~b:243 ()

module Rotating_ngon = struct
  let rotating_ngon w h n =
    let open Draw in
    let w, h   = float_of_int w, float_of_int h in
    let radius = min w h /. 4. in
    let center = (w /. 2., h /. 2.) in
    let p0     = (w /. 2., (h /. 2.) -. radius) in
    let theta  = 360. /. float_of_int n in

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
    pictures
      [| ngon (Color.of_rgb ~r:0xEE ~g:0xEE ~b:0xEE ())
      ;  transform (ngon nice_blue) (Frp.Behavior.map angle ~f:(fun a -> Transform.Rotate (a, center)))
      ;  arc
      ;  text (Frp.Behavior.map rots ~f:string_of_int) (Frp.Behavior.return (w -. 10., 54.))
          ~props:[|Frp.Behavior.return (Property.any ~name:"font-size" ~value:"40pt" ) 
                  ; Frp.Behavior.return (Property.any ~name:"text-anchor" ~value:"end")
                  |]
      |]

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
        path ~props ~anchor:(return (0.,0.))
          (map pt ~f:(fun (x, y) -> let x' = float_of_int x in [|
            Segment.move_to (x', 0.);
            Segment.line_to (x', h)
          |]))
      in
      let y_tracker =
        path ~props ~anchor:(return (0.,0.))
          (map pt ~f:(fun (x, y) -> let y' = float_of_int y in [|
            Segment.move_to (0., y');
            Segment.line_to (w, y')
          |]))
      in
      let circ = 
        circle ~props:[|return (Property.fill Color.black)|] (return 5.)
          (map ~f:(Arrow.both float_of_int) pt)
      in
      let pt_text =
        text (map pt ~f:(fun (x, y) -> Printf.sprintf "(%d, %d)" x (400 - y))) 
          (return (10., h -. 40.))
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

(* let () = Graph_split.(draw_graph bowtie) *)

module Angular_distance = struct
  let w, h = 400., 400.

  let pi = acos (-1.)


  let trace r = print r; r

  let mk () = let open Draw in

    let container           = Option.value_exn (Jq.jq "#angulardistance") in
    let (cx, cy as center)  = (w /. 2., h /. 2.) in
    let radius              = min w h /. 3. in
    let pt_angle pt = Frp.Behavior.map pt ~f:(Angle.about ~center) in
    let clamp_to_circle angle =
      Frp.Behavior.map angle ~f:(fun a -> 
        (cx +. radius *. Angle.cos a, cy -. radius *. Angle.sin a))
    in
    let drag_point init name =
      Frp.scan (Name.drags name) ~init ~f:(fun (x, y) (dx, dy) ->
        (x +. float_of_int dx, y +. float_of_int dy))
    in
    let mk_anim = let open Frp.Behavior in 
      let circ      =
        circle (return radius) (return center) ~props:[|
          return (Property.fill (Color.none));
          return (Property.stroke Color.black 2)
        |]
      in
      let pt_1_name, pt_2_name = Name.create (), Name.create () in
      let pt_1_init, pt_2_init = (100., 100.), (100., 200.) in

      let pt_1_angle = pt_angle (drag_point pt_1_init pt_1_name) in
      let pt_2_angle = pt_angle (drag_point pt_2_init pt_2_name) in

      let pt_1 = clamp_to_circle pt_1_angle in
      let pt_2 = clamp_to_circle pt_2_angle in

      let arc = let open Frp.Behavior.Infix in
        (fun p1 p2 a1 a2 ->
          let a1, a2 = Angle.(to_degrees a1, to_degrees a2) in 
          let sweep =
            if   (a2 < a1 && abs_float (a1 -. (360. +. a2)) < abs_float (a1 -. a2))
              || (a1 < a2 && abs_float (a1 -. a2) < abs_float (a1 -. (a2 -. 360.)))
            then `pos
            else `neg
          in
          [| Segment.line_to p1
          ;  Segment.arc_to p2 `short sweep radius
          ;  Segment.line_to center
          |])
        <$> pt_1 <*> pt_2 <*> pt_1_angle <*> pt_2_angle
      in
      let pt_1_circ = circle ~name:pt_1_name (return 10.) pt_1
        ~props:[|return (Property.fill (Color.blue))|]
      in
      let pt_2_circ = circle ~name:pt_2_name (return 10.) pt_2
      in
      let label =
        let adist a1 a2 = let open Angle in let open Infix in
          min (abs_float (a1 -. a2))
              (360. -. abs_float (a1 -. a2))
        in
        text 
          (zip_with ~f:(fun a1 a2 ->
              Printf.sprintf "%.3f" Angle.(adist (to_degrees a1) (to_degrees a2)))
            pt_1_angle pt_2_angle)
          (return (0., 400.))
      in
      pictures [|
        circ;
        label;
        path ~anchor:(return center) ~props:[|
          return (Property.fill nice_blue); 
        |] arc; 
        pt_1_circ; pt_2_circ
      |]

    in let open Widget in
    create ~width:400 ~height:400 container mk_anim
    |> run
end

let _ = Angular_distance.mk ()

module Compactness = struct
  let w, h = 400., 400.

  let mk () = 
    let container = Option.value_exn (Jq.jq "#compactness") in
    let mk_anim =
      let open Draw in let open Frp.Behavior in
      let circ = circle (return (w /. 3.)) (return (w /. 2., h/. 2.))
        ~props:[|return (Property.stroke Color.black 2)|] 
      in
      circ
    in
    let open Widget in
    create ~width:400 ~height:400 container mk_anim
    |> run

end

let _ = Compactness.mk ()

let _ = Continuous_path.mk ()

