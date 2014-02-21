open Core

let square w h =
  let open Draw in let open Point in
  let side_len = min w h /. 2. in
  let ctr = {x = w /. 2.; y = h /. 2. } in
  let square = let open Frp.Behavior in let open Property in
    rect 
      ~props:[|return (fill Color.black)|]
      ~width:(return side_len) ~height:(return side_len)
      (return {x = (w -. side_len) /. 2.; y = (h -. side_len) /. 2.})
  in
  let angle = let open Animate.Sequence in
       quadratic 1000. ~final:90.
    >> stay_for 500.
    >> quadratic 1000. ~final:180.
    >> stay_for 500.
    >> quadratic 1000. ~final:270.
    >> stay_for 500.
    >> quadratic 1000. ~final:360.
    >> stay_forever
    |> run ~init:0.
  in
  transform square (Frp.Behavior.map ~f:(fun a -> Transform.Rotate (a, ctr)) angle)

(*
let rec range start stop =
  if stop < start then []
  else start :: range (start + 1) stop

*)

let pi = 4.0 *. atan 1.0

let range start stop =
  if stop < start then failwith "Invalid range";
  let n = stop - start + 1 in
  Array.init n ~f:(fun i -> i + start)

module NGon = struct
  let rotate ~about:{Draw.Point.x = a; y = b} {Draw.Point. x; y} angle =
    let x', y' = x -. a, y -. b in
    let x'' = (x' *. cos angle) -. (y' *. sin angle) in
    let y'' = (x' *. sin angle) +. (y' *. cos angle) in
    {Draw.Point. x = x'' +. a; y = y'' +. b}

  let degrees_to_radians x = x *. 2. *. pi /. 360.

  let center w h = {Draw.Point. x = float_of_int w /. 2.; y = float_of_int h /. 2.}

  let initial_point w h =
    let radius = min (float_of_int w) (float_of_int h) /. 4 in
    let c = center w h in
    Draw.Point.({ c with y = c.y -. radius })

  let ngon w h n =
    let open Draw in
    let w, h   = float_of_int w, float_of_int h in
    let radius = min w h /. 4. in
    let center = {Point. x = w /. 2.; y = h /. 2.} in
    let p0     = {Point. x = w /. 2.; y = (h /. 2.) -. radius} in
    let pts    = 
      let theta  = 2. *. pi /. float_of_int n in
      Array.map (range 0 (n - 1))
      ~f:(fun i -> rotate ~about:center p0 (float_of_int i *. theta))
    in
    let open Property in let open Frp.Behavior in
    polygon (return pts) ~props:[|return (fill Color.white); return (stroke Color.black 2)|]
  ;;

  let rotating_ngon w h n =
    let ngon = 

  let rotating_ngon w h n =
    let open Draw in
    let w, h   = float_of_int w, float_of_int h in
    let radius = min w h /. 4. in
    let center = {Point. x = w /. 2.; y = h /. 2.} in
    let p0     = {Point. x = w /. 2.; y = (h /. 2.) -. radius} in
    let pts    = 
      let theta  = 2. *. pi /. float_of_int n in
      Array.map (range 0 (n - 1))
      ~f:(fun i -> rotate ~about:center p0 (float_of_int i *. theta))
    in
    let ngon = let open Property in let open Frp.Behavior in
      polygon (return pts) ~props:[|return (fill Color.white); return (stroke Color.black 2)|]
    in
    let theta = 360. /. float_of_int n in
    let angle =
      let open Animate.Sequence in
      Array.map (range 1 n)
        ~f:(fun i -> quadratic 1000. ~final:(float_of_int i *. theta) >> stay_for 500.)
      |> Array.fold_right ~init:stay_forever ~f:(>>)
      |> run ~init:0.
    in
    let labels = let open Frp.Behavior in
      let theta = 2. *. pi /. float_of_int n in
      let pos i = let open Draw.Point in
        Frp.Behavior.map angle ~f:(fun a -> 
          rotate ~about:center {p0 with y = p0.y -. 20.} 
            (degrees_to_radians a +. (float_of_int i *. theta))
        )
      in
      Array.map (range 1 n)
        ~f:(fun i -> text (return (string_of_int i)) (pos (i - 1)))
    in
    pictures (
      Array.append labels
        [| transform ngon (Frp.Behavior.map angle ~f:(fun a -> Transform.Rotate (a, center))) |]
    )
end

let () =
  let svg = Jq.Dom.svg_node "svg" [| "width", "400"; "height", "600" |] in
  Jq.Dom.append svg (fst (Draw.render (n_gon 400 600 5)));
  match Jq.to_dom_node (Jq.jq "#content") with
    | None -> print "hi"
    | Some t -> Jq.Dom.append t svg

