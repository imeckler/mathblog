open Core

module Elt = struct
  type 'a t = [ `In of 'a | `Inv of 'a ]
end

module type Free_group_sig = sig
  module Elt : sig
    type 'a t = 'a Elt.t
  end

  type 'a t

  val mul : 'a t -> 'a t -> 'a t

  val id : 'a t

  val inv : 'a t -> 'a t

  val inj : 'a -> 'a t

  val inj_inv : 'a -> 'a t

  val product : 'a Elt.t array -> 'a t

  val to_array : 'a t -> 'a Elt.t array

  val kill : 'a array -> 'a t -> 'a t

  module Infix : sig
    val ( * ) : 'a t -> 'a t -> 'a t
  end
end

module Zipper = struct
  type 'a t = 'a list * 'a * 'a list

  let left = function
    | ([], _, _)       -> None
    | ((l::ls), x, rs) -> Some (ls, l, x::rs)

  let right = function
    | (_, _, [])     -> None
    | (ls, x, r::rs) -> Some (x::ls, r, rs)

  let rec examine n = function
    | []     -> failwith "Zipper.examine: Empty list"
    | (x::xs) -> 
      if n = 0 then ([], x, xs) 
      else let (ls, y, rs) = examine (n - 1) xs in (x::ls, y, rs)

  let rebuild (ls, x, rs) =
    List.fold_left ~init:(x::rs) ~f:(fun acc l -> l :: acc) ls
end

module Free_group = struct

  module Elt = Elt

  type 'a t = 'a Elt.t list

  let mul = (@)

  let id = []

  let inj x = [`In x]

  let inj_inv x = [`Inv x]

  let product  = Array.to_list
  let to_array = Array.of_list
  let to_list x = x

  let inv_one = function
    | `In x  -> `Inv x
    | `Inv x -> `In x

  let inv = List.rev_map ~f:inv_one

  let simplify =

    let rec loop z = match z with
      | ([], x, []) -> Some [x]
      | ([], x, [r]) ->
          if inv_one x = r then None else Some [x; r]
      | ([], x, r1::r2::rs) ->
          if inv_one x = r1
          then loop ([], r2, rs)
          else loop ([r1; x], r2, rs)

      | ([l], x, r::rs) ->
          if inv_one x = l then loop ([], r, rs) else loop ([x; l], r, rs)

      | (l::ls, x, [])  -> Some (Zipper.rebuild z)
      | (l1::l2::ls, x, r::rs) ->
          if inv_one x = l1 then loop (ls, l2, r::rs) else loop (x::l1::l2::ls, r, rs)

    in fun xs -> loop (Zipper.examine 0 xs)

  let unelt = function
    | `In x | `Inv x -> x

  let kill gs = List.filter ~f:(fun x -> not (Array.mem gs (unelt x)))

  module Infix = struct
    let ( * ) = mul
  end
end

let interp nails_y g =
  let init_pos = (0., nails_y +. 20.) in
  Free_group.to_list g
  |> List.fold_left ~init:(init_pos, []) ~f:(fun ((curr_x,curr_y),p) e -> match e with
    | `Inv n -> (* go from where you are to between the n and n+ 1 place, eg *)
  )

let split_array xs =
  let n = Array.length xs in
  let m = n / 2 in
  (Array.init m ~f:(fun i -> xs.(i)), Array.init (n - m) ~f:(fun i -> xs.(i + m)))

let commutator arr = let open Free_group in
  let n = Array.length arr in
  let rec loop i =
    if i = n - 1
    then inj arr.(i)
    else
      let r = loop (i + 1) in let x = arr.(i) in let open Infix in
      inj x * r * inj_inv x * inv r
  in
  if n = 0
  then id
  else loop 0

