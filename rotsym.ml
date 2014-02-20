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

let rotate ~about:{Draw.Point.x = a; y = b} {Draw.Point. x; y} angle =
  let x', y' = x -. a, y -. b in
  let x' = (x' *. cos angle) -. (y' *. sin angle) in
  let y' = (x' *. sin angle) +. (y' *. cos angle) in
  {Draw.Point. x = x' +. a; y = y' +. b}

let n_gon w h n =
  let open Draw in
  let w, h   = float_of_int w, float_of_int h in
  let radius = min w h /. 4. in
  let theta  = 2. *. pi /. float_of_int n in
  let center = {Point. x = w /. 2.; y = h /. 2.} in
  let p0     = {Point. x = w /. 2.; y = (h /. 2.) +. radius} in
  let pts    = 
    Array.map (range 0 (n - 1))
    ~f:(fun i -> rotate ~about:center p0 (float_of_int i *. theta))
  in
  let angles = List.map (range 0 (n - 1)) ~f:(fun i -> float_of_int i *. theta) in
  let rotation =
    List.ma
    List.fold_right ~init:stay_forever ~f:(>>) ();
  angles

