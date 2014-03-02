open Core

let range start stop =
  if stop < start then failwith "Invalid range";
  let n = stop - start + 1 in
  Array.init n ~f:(fun i -> i + start)

let rotating_ngon w h n =
  let open Draw in
  let w, h   = float_of_int w, float_of_int h in
  let radius = min w h /. 4. in
  let center = {Point. x = w /. 2.; y = h /. 2.} in
  let p0     = {Point. x = w /. 2.; y = (h /. 2.) -. radius} in
  let theta  = 360. /. float_of_int n in

  let ngon = 
    let pts = 
      Array.map (range 0 (n - 1)) ~f:(fun i -> let open Angle in
        rotate ~about:center p0 (float_of_int i * of_degrees theta)
      )
    in let open Property in let open Frp.Behavior in
    polygon (return pts) ~props:[|
      Frp.Stream.ticks 30. 
      |> Frp.scan ~init:Color.white ~f:(fun c _ -> Color.({c with b = c.b + 1}))
      |> map ~f:fill;
      return (stroke Color.black 2)
    |]
  in

  let angle =
    let open Animate.Sequence in
    Array.map (range 1 n)
      ~f:(fun i -> quadratic 1000. ~final:(float_of_int i *. theta) >> stay_for 500.)
    |> Array.fold_right ~init:stay_forever ~f:(>>)
    |> run ~init:0.
    |> Frp.Behavior.map ~f:Angle.of_degrees
  in

  let arc =  let open Frp.Behavior in
    path ~anchor:(return Point.({p0 with y = p0.y -. 40.}))
      ~props:[|
        return (Property.stroke Color.red 4);
        return (Property.fill Color.({red with alpha = 0.}))
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
        rotate ~about:center {p0 with y = p0.y -. 20.} (a + (float_of_int i * theta))
      )
    in
    Array.map (range 1 n)
      ~f:(fun i -> text (return (string_of_int i)) (label_pos (i - 1)))
  in
  pictures (
    Array.append labels
      [| transform ngon (Frp.Behavior.map angle ~f:(fun a -> Transform.Rotate (a, center)))
      ;  arc
      |]
  )

let () =
  let svg = Jq.Dom.svg_node "svg" [| "width", "400"; "height", "600" |] in
  Jq.Dom.append svg (fst (Draw.render (rotating_ngon 400 600 6)));
  match Jq.to_dom_node (Jq.jq "#content") with
    | None -> print "hi"
    | Some t -> Jq.Dom.append t svg

module Continuous_path = struct
  (* <path stroke="#000000" id="svg_7" d="m74.072388,176.343704c0,0 -48.240629,-187.48112 77.664017,-81.201996c125.904617,106.279099 131.036606,-49.55714 131.036606,-49.55714c0,0 14.027405,-41.795149 -142.669113,-23.882954c-156.696512,17.912197 69.794968,40.60104 69.794968,40.60104c0,0 218.280304,19.106365 -31.818298,157.030354c-250.098579,137.92395 -120.088375,-207.781625 -120.088375,-207.781625" stroke-width="5" fill="none"/>
  *)
  let mk () =
    let container = Jq.jq "#pathanim" in
    let path_anim slider_val =
      let open Frp.Behavior in
      let open Draw in let open Point in let open Segment in
      path 
        ~props:[|
          return Property.(fill Color.({red with alpha = 0.}));
          return Property.(stroke Color.black 2)
        |]
        ~anchor:(return {x = 5.; y = 5.})
        ~mask:(map slider_val ~f:(fun x -> (0., x ** 2.)))
        (return [| line_to {x = 100.; y = 100.}; line_to {x = 200.; y = 100.} |])
(*       |> fill   red *)
    in
    let open Widget in
    create ~width:400 ~height:400 container path_anim
    +> Control.slider ""
    |> run
end

let _ = Continuous_path.mk ()

