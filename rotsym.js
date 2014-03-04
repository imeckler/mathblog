// This program was compiled from OCaml by js_of_ocaml 1.4
function caml_raise_with_arg (tag, arg) { throw [0, tag, arg]; }
function caml_raise_with_string (tag, msg) {
  caml_raise_with_arg (tag, new MlWrappedString (msg));
}
function caml_invalid_argument (msg) {
  caml_raise_with_string(caml_global_data[4], msg);
}
function caml_array_bound_error () {
  caml_invalid_argument("index out of bounds");
}
function caml_str_repeat(n, s) {
  if (!n) { return ""; }
  if (n & 1) { return caml_str_repeat(n - 1, s) + s; }
  var r = caml_str_repeat(n >> 1, s);
  return r + r;
}
function MlString(param) {
  if (param != null) {
    this.bytes = this.fullBytes = param;
    this.last = this.len = param.length;
  }
}
MlString.prototype = {
  string:null,
  bytes:null,
  fullBytes:null,
  array:null,
  len:null,
  last:0,
  toJsString:function() {
    return this.string = decodeURIComponent (escape(this.getFullBytes()));
  },
  toBytes:function() {
    if (this.string != null)
      var b = unescape (encodeURIComponent (this.string));
    else {
      var b = "", a = this.array, l = a.length;
      for (var i = 0; i < l; i ++) b += String.fromCharCode (a[i]);
    }
    this.bytes = this.fullBytes = b;
    this.last = this.len = b.length;
    return b;
  },
  getBytes:function() {
    var b = this.bytes;
    if (b == null) b = this.toBytes();
    return b;
  },
  getFullBytes:function() {
    var b = this.fullBytes;
    if (b !== null) return b;
    b = this.bytes;
    if (b == null) b = this.toBytes ();
    if (this.last < this.len) {
      this.bytes = (b += caml_str_repeat(this.len - this.last, '\0'));
      this.last = this.len;
    }
    this.fullBytes = b;
    return b;
  },
  toArray:function() {
    var b = this.bytes;
    if (b == null) b = this.toBytes ();
    var a = [], l = this.last;
    for (var i = 0; i < l; i++) a[i] = b.charCodeAt(i);
    for (l = this.len; i < l; i++) a[i] = 0;
    this.string = this.bytes = this.fullBytes = null;
    this.last = this.len;
    this.array = a;
    return a;
  },
  getArray:function() {
    var a = this.array;
    if (!a) a = this.toArray();
    return a;
  },
  getLen:function() {
    var len = this.len;
    if (len !== null) return len;
    this.toBytes();
    return this.len;
  },
  toString:function() { var s = this.string; return s?s:this.toJsString(); },
  valueOf:function() { var s = this.string; return s?s:this.toJsString(); },
  blitToArray:function(i1, a2, i2, l) {
    var a1 = this.array;
    if (a1) {
      if (i2 <= i1) {
        for (var i = 0; i < l; i++) a2[i2 + i] = a1[i1 + i];
      } else {
        for (var i = l - 1; i >= 0; i--) a2[i2 + i] = a1[i1 + i];
      }
    } else {
      var b = this.bytes;
      if (b == null) b = this.toBytes();
      var l1 = this.last - i1;
      if (l <= l1)
        for (var i = 0; i < l; i++) a2 [i2 + i] = b.charCodeAt(i1 + i);
      else {
        for (var i = 0; i < l1; i++) a2 [i2 + i] = b.charCodeAt(i1 + i);
        for (; i < l; i++) a2 [i2 + i] = 0;
      }
    }
  },
  get:function (i) {
    var a = this.array;
    if (a) return a[i];
    var b = this.bytes;
    if (b == null) b = this.toBytes();
    return (i<this.last)?b.charCodeAt(i):0;
  },
  safeGet:function (i) {
    if (this.len == null) this.toBytes();
    if ((i < 0) || (i >= this.len)) caml_array_bound_error ();
    return this.get(i);
  },
  set:function (i, c) {
    var a = this.array;
    if (!a) {
      if (this.last == i) {
        this.bytes += String.fromCharCode (c & 0xff);
        this.last ++;
        return 0;
      }
      a = this.toArray();
    } else if (this.bytes != null) {
      this.bytes = this.fullBytes = this.string = null;
    }
    a[i] = c & 0xff;
    return 0;
  },
  safeSet:function (i, c) {
    if (this.len == null) this.toBytes ();
    if ((i < 0) || (i >= this.len)) caml_array_bound_error ();
    this.set(i, c);
  },
  fill:function (ofs, len, c) {
    if (ofs >= this.last && this.last && c == 0) return;
    var a = this.array;
    if (!a) a = this.toArray();
    else if (this.bytes != null) {
      this.bytes = this.fullBytes = this.string = null;
    }
    var l = ofs + len;
    for (var i = ofs; i < l; i++) a[i] = c;
  },
  compare:function (s2) {
    if (this.string != null && s2.string != null) {
      if (this.string < s2.string) return -1;
      if (this.string > s2.string) return 1;
      return 0;
    }
    var b1 = this.getFullBytes ();
    var b2 = s2.getFullBytes ();
    if (b1 < b2) return -1;
    if (b1 > b2) return 1;
    return 0;
  },
  equal:function (s2) {
    if (this.string != null && s2.string != null)
      return this.string == s2.string;
    return this.getFullBytes () == s2.getFullBytes ();
  },
  lessThan:function (s2) {
    if (this.string != null && s2.string != null)
      return this.string < s2.string;
    return this.getFullBytes () < s2.getFullBytes ();
  },
  lessEqual:function (s2) {
    if (this.string != null && s2.string != null)
      return this.string <= s2.string;
    return this.getFullBytes () <= s2.getFullBytes ();
  }
}
function MlWrappedString (s) { this.string = s; }
MlWrappedString.prototype = new MlString();
function MlMakeString (l) { this.bytes = ""; this.len = l; }
MlMakeString.prototype = new MlString ();
function caml_array_append(a1, a2) {
  return a1.concat(a2.slice(1));
}
function caml_array_get (array, index) {
  if ((index < 0) || (index >= array.length - 1)) caml_array_bound_error();
  return array[index+1];
}
function caml_array_set (array, index, newval) {
  if ((index < 0) || (index >= array.length - 1)) caml_array_bound_error();
  array[index+1]=newval; return 0;
}
function caml_array_sub (a, i, len) {
  return [0].concat(a.slice(i+1, i+1+len));
}
function caml_blit_string(s1, i1, s2, i2, len) {
  if (len === 0) return;
  if (i2 === s2.last && s2.bytes != null) {
    var b = s1.bytes;
    if (b == null) b = s1.toBytes ();
    if (i1 > 0 || s1.last > len) b = b.slice(i1, i1 + len);
    s2.bytes += b;
    s2.last += b.length;
    return;
  }
  var a = s2.array;
  if (!a) a = s2.toArray(); else { s2.bytes = s2.string = null; }
  s1.blitToArray (i1, a, i2, len);
}
function caml_call_gen(f, args) {
  if(f.fun)
    return caml_call_gen(f.fun, args);
  var n = f.length;
  var d = n - args.length;
  if (d == 0)
    return f.apply(null, args);
  else if (d < 0)
    return caml_call_gen(f.apply(null, args.slice(0,n)), args.slice(n));
  else
    return function (x){ return caml_call_gen(f, args.concat([x])); };
}
function caml_classify_float (x) {
  if (isFinite (x)) {
    if (Math.abs(x) >= 2.2250738585072014e-308) return 0;
    if (x != 0) return 1;
    return 2;
  }
  return isNaN(x)?4:3;
}
function caml_create_string(len) {
  if (len < 0) caml_invalid_argument("String.create");
  return new MlMakeString(len);
}
function caml_fill_string(s, i, l, c) { s.fill (i, l, c); }
function caml_parse_format (fmt) {
  fmt = fmt.toString ();
  var len = fmt.length;
  if (len > 31) caml_invalid_argument("format_int: format too long");
  var f =
    { justify:'+', signstyle:'-', filler:' ', alternate:false,
      base:0, signedconv:false, width:0, uppercase:false,
      sign:1, prec:-1, conv:'f' };
  for (var i = 0; i < len; i++) {
    var c = fmt.charAt(i);
    switch (c) {
    case '-':
      f.justify = '-'; break;
    case '+': case ' ':
      f.signstyle = c; break;
    case '0':
      f.filler = '0'; break;
    case '#':
      f.alternate = true; break;
    case '1': case '2': case '3': case '4': case '5':
    case '6': case '7': case '8': case '9':
      f.width = 0;
      while (c=fmt.charCodeAt(i) - 48, c >= 0 && c <= 9) {
        f.width = f.width * 10 + c; i++
      }
      i--;
     break;
    case '.':
      f.prec = 0;
      i++;
      while (c=fmt.charCodeAt(i) - 48, c >= 0 && c <= 9) {
        f.prec = f.prec * 10 + c; i++
      }
      i--;
    case 'd': case 'i':
      f.signedconv = true; /* fallthrough */
    case 'u':
      f.base = 10; break;
    case 'x':
      f.base = 16; break;
    case 'X':
      f.base = 16; f.uppercase = true; break;
    case 'o':
      f.base = 8; break;
    case 'e': case 'f': case 'g':
      f.signedconv = true; f.conv = c; break;
    case 'E': case 'F': case 'G':
      f.signedconv = true; f.uppercase = true;
      f.conv = c.toLowerCase (); break;
    }
  }
  return f;
}
function caml_finish_formatting(f, rawbuffer) {
  if (f.uppercase) rawbuffer = rawbuffer.toUpperCase();
  var len = rawbuffer.length;
  if (f.signedconv && (f.sign < 0 || f.signstyle != '-')) len++;
  if (f.alternate) {
    if (f.base == 8) len += 1;
    if (f.base == 16) len += 2;
  }
  var buffer = "";
  if (f.justify == '+' && f.filler == ' ')
    for (var i = len; i < f.width; i++) buffer += ' ';
  if (f.signedconv) {
    if (f.sign < 0) buffer += '-';
    else if (f.signstyle != '-') buffer += f.signstyle;
  }
  if (f.alternate && f.base == 8) buffer += '0';
  if (f.alternate && f.base == 16) buffer += "0x";
  if (f.justify == '+' && f.filler == '0')
    for (var i = len; i < f.width; i++) buffer += '0';
  buffer += rawbuffer;
  if (f.justify == '-')
    for (var i = len; i < f.width; i++) buffer += ' ';
  return new MlWrappedString (buffer);
}
function caml_format_float (fmt, x) {
  var s, f = caml_parse_format(fmt);
  var prec = (f.prec < 0)?6:f.prec;
  if (x < 0) { f.sign = -1; x = -x; }
  if (isNaN(x)) { s = "nan"; f.filler = ' '; }
  else if (!isFinite(x)) { s = "inf"; f.filler = ' '; }
  else
    switch (f.conv) {
    case 'e':
      var s = x.toExponential(prec);
      var i = s.length;
      if (s.charAt(i - 3) == 'e')
        s = s.slice (0, i - 1) + '0' + s.slice (i - 1);
      break;
    case 'f':
      s = x.toFixed(prec); break;
    case 'g':
      prec = prec?prec:1;
      s = x.toExponential(prec - 1);
      var j = s.indexOf('e');
      var exp = +s.slice(j + 1);
      if (exp < -4 || x.toFixed(0).length > prec) {
        var i = j - 1; while (s.charAt(i) == '0') i--;
        if (s.charAt(i) == '.') i--;
        s = s.slice(0, i + 1) + s.slice(j);
        i = s.length;
        if (s.charAt(i - 3) == 'e')
          s = s.slice (0, i - 1) + '0' + s.slice (i - 1);
        break;
      } else {
        var p = prec;
        if (exp < 0) { p -= exp + 1; s = x.toFixed(p); }
        else while (s = x.toFixed(p), s.length > prec + 1) p--;
        if (p) {
          var i = s.length - 1; while (s.charAt(i) == '0') i--;
          if (s.charAt(i) == '.') i--;
          s = s.slice(0, i + 1);
        }
      }
      break;
    }
  return caml_finish_formatting(f, s);
}
function caml_format_int(fmt, i) {
  if (fmt.toString() == "%d") return new MlWrappedString(""+i);
  var f = caml_parse_format(fmt);
  if (i < 0) { if (f.signedconv) { f.sign = -1; i = -i; } else i >>>= 0; }
  var s = i.toString(f.base);
  if (f.prec >= 0) {
    f.filler = ' ';
    var n = f.prec - s.length;
    if (n > 0) s = caml_str_repeat (n, '0') + s;
  }
  return caml_finish_formatting(f, s);
}
function caml_int64_is_negative(x) {
  return (x[3] << 16) < 0;
}
function caml_int64_neg (x) {
  var y1 = - x[1];
  var y2 = - x[2] + (y1 >> 24);
  var y3 = - x[3] + (y2 >> 24);
  return [255, y1 & 0xffffff, y2 & 0xffffff, y3 & 0xffff];
}
function caml_int64_of_int32 (x) {
  return [255, x & 0xffffff, (x >> 24) & 0xffffff, (x >> 31) & 0xffff]
}
function caml_int64_ucompare(x,y) {
  if (x[3] > y[3]) return 1;
  if (x[3] < y[3]) return -1;
  if (x[2] > y[2]) return 1;
  if (x[2] < y[2]) return -1;
  if (x[1] > y[1]) return 1;
  if (x[1] < y[1]) return -1;
  return 0;
}
function caml_int64_lsl1 (x) {
  x[3] = (x[3] << 1) | (x[2] >> 23);
  x[2] = ((x[2] << 1) | (x[1] >> 23)) & 0xffffff;
  x[1] = (x[1] << 1) & 0xffffff;
}
function caml_int64_lsr1 (x) {
  x[1] = ((x[1] >>> 1) | (x[2] << 23)) & 0xffffff;
  x[2] = ((x[2] >>> 1) | (x[3] << 23)) & 0xffffff;
  x[3] = x[3] >>> 1;
}
function caml_int64_sub (x, y) {
  var z1 = x[1] - y[1];
  var z2 = x[2] - y[2] + (z1 >> 24);
  var z3 = x[3] - y[3] + (z2 >> 24);
  return [255, z1 & 0xffffff, z2 & 0xffffff, z3 & 0xffff];
}
function caml_int64_udivmod (x, y) {
  var offset = 0;
  var modulus = x.slice ();
  var divisor = y.slice ();
  var quotient = [255, 0, 0, 0];
  while (caml_int64_ucompare (modulus, divisor) > 0) {
    offset++;
    caml_int64_lsl1 (divisor);
  }
  while (offset >= 0) {
    offset --;
    caml_int64_lsl1 (quotient);
    if (caml_int64_ucompare (modulus, divisor) >= 0) {
      quotient[1] ++;
      modulus = caml_int64_sub (modulus, divisor);
    }
    caml_int64_lsr1 (divisor);
  }
  return [0,quotient, modulus];
}
function caml_int64_to_int32 (x) {
  return x[1] | (x[2] << 24);
}
function caml_int64_is_zero(x) {
  return (x[3]|x[2]|x[1]) == 0;
}
function caml_int64_format (fmt, x) {
  var f = caml_parse_format(fmt);
  if (f.signedconv && caml_int64_is_negative(x)) {
    f.sign = -1; x = caml_int64_neg(x);
  }
  var buffer = "";
  var wbase = caml_int64_of_int32(f.base);
  var cvtbl = "0123456789abcdef";
  do {
    var p = caml_int64_udivmod(x, wbase);
    x = p[1];
    buffer = cvtbl.charAt(caml_int64_to_int32(p[2])) + buffer;
  } while (! caml_int64_is_zero(x));
  if (f.prec >= 0) {
    f.filler = ' ';
    var n = f.prec - buffer.length;
    if (n > 0) buffer = caml_str_repeat (n, '0') + buffer;
  }
  return caml_finish_formatting(f, buffer);
}
function caml_parse_sign_and_base (s) {
  var i = 0, base = 10, sign = s.get(0) == 45?(i++,-1):1;
  if (s.get(i) == 48)
    switch (s.get(i + 1)) {
    case 120: case 88: base = 16; i += 2; break;
    case 111: case 79: base =  8; i += 2; break;
    case  98: case 66: base =  2; i += 2; break;
    }
  return [i, sign, base];
}
function caml_parse_digit(c) {
  if (c >= 48 && c <= 57)  return c - 48;
  if (c >= 65 && c <= 90)  return c - 55;
  if (c >= 97 && c <= 122) return c - 87;
  return -1;
}
var caml_global_data = [0];
function caml_failwith (msg) {
  caml_raise_with_string(caml_global_data[3], msg);
}
function caml_int_of_string (s) {
  var r = caml_parse_sign_and_base (s);
  var i = r[0], sign = r[1], base = r[2];
  var threshold = -1 >>> 0;
  var c = s.get(i);
  var d = caml_parse_digit(c);
  if (d < 0 || d >= base) caml_failwith("int_of_string");
  var res = d;
  for (;;) {
    i++;
    c = s.get(i);
    if (c == 95) continue;
    d = caml_parse_digit(c);
    if (d < 0 || d >= base) break;
    res = base * res + d;
    if (res > threshold) caml_failwith("int_of_string");
  }
  if (i != s.getLen()) caml_failwith("int_of_string");
  res = sign * res;
  if ((res | 0) != res) caml_failwith("int_of_string");
  return res;
}
function caml_is_printable(c) { return +(c > 31 && c < 127); }
function caml_js_eval_string () {return eval(arguments[0].toString());}
function caml_js_from_array(a) { return a.slice(1); }
function caml_js_wrap_callback(f) {
  var toArray = Array.prototype.slice;
  return function () {
    var args = (arguments.length > 0)?toArray.call (arguments):[undefined];
    return caml_call_gen(f, args);
  }
}
function caml_int64_compare(x,y) {
  var x3 = x[3] << 16;
  var y3 = y[3] << 16;
  if (x3 > y3) return 1;
  if (x3 < y3) return -1;
  if (x[2] > y[2]) return 1;
  if (x[2] < y[2]) return -1;
  if (x[1] > y[1]) return 1;
  if (x[1] < y[1]) return -1;
  return 0;
}
function caml_int_compare (a, b) {
  if (a < b) return (-1); if (a == b) return 0; return 1;
}
function caml_compare_val (a, b, total) {
  var stack = [];
  for(;;) {
    if (!(total && a === b)) {
      if (a instanceof MlString) {
        if (b instanceof MlString) {
            if (a != b) {
		var x = a.compare(b);
		if (x != 0) return x;
	    }
        } else
          return 1;
      } else if (a instanceof Array && a[0] === (a[0]|0)) {
        var ta = a[0];
        if (ta === 250) {
          a = a[1];
          continue;
        } else if (b instanceof Array && b[0] === (b[0]|0)) {
          var tb = b[0];
          if (tb === 250) {
            b = b[1];
            continue;
          } else if (ta != tb) {
            return (ta < tb)?-1:1;
          } else {
            switch (ta) {
            case 248: {
		var x = caml_int_compare(a[2], b[2]);
		if (x != 0) return x;
		break;
	    }
            case 255: {
		var x = caml_int64_compare(a, b);
		if (x != 0) return x;
		break;
	    }
            default:
              if (a.length != b.length) return (a.length < b.length)?-1:1;
              if (a.length > 1) stack.push(a, b, 1);
            }
          }
        } else
          return 1;
      } else if (b instanceof MlString ||
                 (b instanceof Array && b[0] === (b[0]|0))) {
        return -1;
      } else {
        if (a < b) return -1;
        if (a > b) return 1;
        if (total && a != b) {
          if (a == a) return 1;
          if (b == b) return -1;
        }
      }
    }
    if (stack.length == 0) return 0;
    var i = stack.pop();
    b = stack.pop();
    a = stack.pop();
    if (i + 1 < a.length) stack.push(a, b, i + 1);
    a = a[i];
    b = b[i];
  }
}
function caml_compare (a, b) { return caml_compare_val (a, b, true); }
function caml_lessequal (x, y) { return +(caml_compare(x,y,false) <= 0); }
function caml_lessthan (x, y) { return +(caml_compare(x,y,false) < 0); }
function caml_make_vect (len, init) {
  var b = [0]; for (var i = 1; i <= len; i++) b[i] = init; return b;
}
function caml_ml_out_channels_list () { return 0; }
function caml_mul(x,y) {
  return ((((x >> 16) * y) << 16) + (x & 0xffff) * y)|0;
}
function caml_register_global (n, v) { caml_global_data[n + 1] = v; }
var caml_named_values = {};
function caml_register_named_value(nm,v) {
  caml_named_values[nm] = v; return 0;
}
function caml_sys_const_word_size () { return 32; }
function caml_update_dummy (x, y) {
  if( typeof y==="function" ) { x.fun = y; return 0; }
  if( y.fun ) { x.fun = y.fun; return 0; }
  var i = y.length; while (i--) x[i] = y[i]; return 0;
}
(function(){function kj(pl,pm,pn,po,pp,pq,pr,ps){return pl.length==7?pl(pm,pn,po,pp,pq,pr,ps):caml_call_gen(pl,[pm,pn,po,pp,pq,pr,ps]);}function hB(pe,pf,pg,ph,pi,pj,pk){return pe.length==6?pe(pf,pg,ph,pi,pj,pk):caml_call_gen(pe,[pf,pg,ph,pi,pj,pk]);}function jX(o_,o$,pa,pb,pc,pd){return o_.length==5?o_(o$,pa,pb,pc,pd):caml_call_gen(o_,[o$,pa,pb,pc,pd]);}function ki(o5,o6,o7,o8,o9){return o5.length==4?o5(o6,o7,o8,o9):caml_call_gen(o5,[o6,o7,o8,o9]);}function dm(o1,o2,o3,o4){return o1.length==3?o1(o2,o3,o4):caml_call_gen(o1,[o2,o3,o4]);}function dS(oY,oZ,o0){return oY.length==2?oY(oZ,o0):caml_call_gen(oY,[oZ,o0]);}function cp(oW,oX){return oW.length==1?oW(oX):caml_call_gen(oW,[oX]);}var a=[0,new MlString("Failure")],b=[0,new MlString("Invalid_argument")],c=[0,0,0,0,1],d=[0,255,0,0,1];caml_register_global(6,[0,new MlString("Not_found")]);caml_register_global(5,[0,new MlString("Division_by_zero")]);caml_register_global(3,b);caml_register_global(2,a);var bo=[0,new MlString("Assert_failure")],bn=new MlString("%d"),bm=new MlString("true"),bl=new MlString("false"),bk=new MlString("Pervasives.do_at_exit"),bj=new MlString("\\b"),bi=new MlString("\\t"),bh=new MlString("\\n"),bg=new MlString("\\r"),bf=new MlString("\\\\"),be=new MlString("\\'"),bd=new MlString("String.blit"),bc=new MlString("String.sub"),bb=new MlString("Buffer.add: cannot grow buffer"),ba=new MlString(""),a$=new MlString(""),a_=new MlString("%.12g"),a9=new MlString("\""),a8=new MlString("\""),a7=new MlString("'"),a6=new MlString("'"),a5=new MlString("nan"),a4=new MlString("neg_infinity"),a3=new MlString("infinity"),a2=new MlString("."),a1=new MlString("printf: bad positional specification (0)."),a0=new MlString("%_"),aZ=[0,new MlString("printf.ml"),143,8],aY=new MlString("'"),aX=new MlString("Printf: premature end of format string '"),aW=new MlString("'"),aV=new MlString(" in format string '"),aU=new MlString(", at char number "),aT=new MlString("Printf: bad conversion %"),aS=new MlString("Sformat.index_of_int: negative argument "),aR=new MlString("(function(a,f){var len=a.length;for(var i = 0; i < len; ++i){f(a[i]);}})"),aQ=new MlString(""),aP=new MlString("iter"),aO=new MlString("(function(t, f){for(var k in t){if(t.hasOwnProperty(k)){f(parseInt(k),t[k]);}}})"),aN=new MlString("(function(x,y){return x % y;})"),aM=new MlString("pageY"),aL=new MlString("pageX"),aK=new MlString("http://www.w3.org/2000/svg"),aJ=new MlString(">"),aI=new MlString("<"),aH=new MlString("body"),aG=new MlString("mousemove"),aF=new MlString("M%f,%f %s"),aE=new MlString("circle"),aD=new MlString("style"),aC=new MlString("r"),aB=new MlString("cy"),aA=new MlString("cx"),az=new MlString("transform"),ay=[0,new MlString(",")],ax=new MlString("points"),aw=new MlString("style"),av=new MlString("polygon"),au=new MlString("points"),at=new MlString("path"),as=new MlString("d"),ar=new MlString("style"),aq=new MlString("text"),ap=new MlString("style"),ao=new MlString("y"),an=new MlString("x"),am=new MlString("g"),al=new MlString("style"),ak=new MlString("height"),aj=new MlString("width"),ai=new MlString("y"),ah=new MlString("x"),ag=new MlString("rect"),af=new MlString("height"),ae=new MlString("width"),ad=new MlString("y"),ac=new MlString("x"),ab=new MlString("g"),aa=[0,new MlString(";")],$=[0,new MlString(" ")],_=new MlString("L%f %f"),Z=new MlString("M%f %f"),Y=[0,0,0],X=new MlString("a%f,%f 0 %d,1 %f,%f"),W=new MlString("fill:"),V=new MlString("stroke-linejoin:"),U=new MlString("stroke-linecap:"),T=new MlString("stroke-width:"),S=new MlString("stroke:"),R=[0,new MlString(";")],Q=[0,new MlString(" ")],P=new MlString("stroke-dasharray:"),O=new MlString("miter"),N=new MlString("bevel"),M=new MlString("round"),L=new MlString("butt"),K=new MlString("round"),J=new MlString("square"),I=new MlString("matrix(%f,%f,%f,%f,%f,%f)"),H=new MlString("translate(%f %f)"),G=new MlString("scale(%f %f)"),F=new MlString("rotate(%f %f %f)"),E=new MlString("skewX(%f)"),D=new MlString("skewY(%f)"),C=new MlString("rgba(%d,%d,%d,%f)"),B=[0,new MlString(" ")],A=new MlString(","),z=[0,255,255,255,1],y=new MlString("height"),x=new MlString("width"),w=new MlString("svg"),v=new MlString("value"),u=new MlString("div"),t=[0,200,100],s=[0,100,100],r=[0,5,5],q=new MlString("#pathanim"),p=new MlString(""),o=new MlString("Invalid range"),n=[0,new MlString("height"),new MlString("600")],m=[0,new MlString("width"),new MlString("400")],l=new MlString("svg"),k=new MlString("#content"),j=new MlString("hi");function i(e){throw [0,a,e];}function bp(f){throw [0,b,f];}function bq(h,g){return caml_lessequal(h,g)?h:g;}function bB(br,bt){var bs=br.getLen(),bu=bt.getLen(),bv=caml_create_string(bs+bu|0);caml_blit_string(br,0,bv,0,bs);caml_blit_string(bt,0,bv,bs,bu);return bv;}function bC(bw){return caml_format_int(bn,bw);}function bD(bA){var bx=caml_ml_out_channels_list(0);for(;;){if(bx){var by=bx[2];try {}catch(bz){}var bx=by;continue;}return 0;}}caml_register_named_value(bk,bD);function bJ(bE,bG){var bF=bE.length-1;if(0===bF){var bH=bG.length-1,bI=0===bH?[0]:caml_array_sub(bG,0,bH);return bI;}return 0===bG.length-1?caml_array_sub(bE,0,bF):caml_array_append(bE,bG);}function bW(bK,bM){var bL=caml_create_string(bK);caml_fill_string(bL,0,bK,bM);return bL;}function bX(bP,bN,bO){if(0<=bN&&0<=bO&&!((bP.getLen()-bO|0)<bN)){var bQ=caml_create_string(bO);caml_blit_string(bP,bN,bQ,0,bO);return bQ;}return bp(bc);}function bY(bT,bS,bV,bU,bR){if(0<=bR&&0<=bS&&!((bT.getLen()-bR|0)<bS)&&0<=bU&&!((bV.getLen()-bR|0)<bU))return caml_blit_string(bT,bS,bV,bU,bR);return bp(bd);}var bZ=caml_sys_const_word_size(0),b0=caml_mul(bZ/8|0,(1<<(bZ-10|0))-1|0)-1|0;function cg(b1){var b2=1<=b1?b1:1,b3=b0<b2?b0:b2,b4=caml_create_string(b3);return [0,b4,0,b3,b4];}function ch(b5){return bX(b5[1],0,b5[2]);}function ca(b6,b8){var b7=[0,b6[3]];for(;;){if(b7[1]<(b6[2]+b8|0)){b7[1]=2*b7[1]|0;continue;}if(b0<b7[1])if((b6[2]+b8|0)<=b0)b7[1]=b0;else i(bb);var b9=caml_create_string(b7[1]);bY(b6[1],0,b9,0,b6[2]);b6[1]=b9;b6[3]=b7[1];return 0;}}function ci(b_,cb){var b$=b_[2];if(b_[3]<=b$)ca(b_,1);b_[1].safeSet(b$,cb);b_[2]=b$+1|0;return 0;}function cj(ce,cc){var cd=cc.getLen(),cf=ce[2]+cd|0;if(ce[3]<cf)ca(ce,cd);bY(cc,0,ce[1],ce[2],cd);ce[2]=cf;return 0;}function cn(ck){return 0<=ck?ck:i(bB(aS,bC(ck)));}function co(cl,cm){return cn(cl+cm|0);}var cq=cp(co,1);function cx(cr){return bX(cr,0,cr.getLen());}function cz(cs,ct,cv){var cu=bB(aV,bB(cs,aW)),cw=bB(aU,bB(bC(ct),cu));return bp(bB(aT,bB(bW(1,cv),cw)));}function dt(cy,cB,cA){return cz(cx(cy),cB,cA);}function du(cC){return bp(bB(aX,bB(cx(cC),aY)));}function c0(cD,cL,cN,cP){function cK(cE){if((cD.safeGet(cE)-48|0)<0||9<(cD.safeGet(cE)-48|0))return cE;var cF=cE+1|0;for(;;){var cG=cD.safeGet(cF);if(48<=cG){if(!(58<=cG)){var cI=cF+1|0,cF=cI;continue;}var cH=0;}else if(36===cG){var cJ=cF+1|0,cH=1;}else var cH=0;if(!cH)var cJ=cE;return cJ;}}var cM=cK(cL+1|0),cO=cg((cN-cM|0)+10|0);ci(cO,37);var cQ=cP,cR=0;for(;;){if(cQ){var cS=cQ[2],cT=[0,cQ[1],cR],cQ=cS,cR=cT;continue;}var cU=cM,cV=cR;for(;;){if(cU<=cN){var cW=cD.safeGet(cU);if(42===cW){if(cV){var cX=cV[2];cj(cO,bC(cV[1]));var cY=cK(cU+1|0),cU=cY,cV=cX;continue;}throw [0,bo,aZ];}ci(cO,cW);var cZ=cU+1|0,cU=cZ;continue;}return ch(cO);}}}function eV(c6,c4,c3,c2,c1){var c5=c0(c4,c3,c2,c1);if(78!==c6&&110!==c6)return c5;c5.safeSet(c5.getLen()-1|0,117);return c5;}function dv(db,dl,dr,c7,dq){var c8=c7.getLen();function dn(c9,dk){var c_=40===c9?41:125;function dj(c$){var da=c$;for(;;){if(c8<=da)return cp(db,c7);if(37===c7.safeGet(da)){var dc=da+1|0;if(c8<=dc)var dd=cp(db,c7);else{var de=c7.safeGet(dc),df=de-40|0;if(df<0||1<df){var dg=df-83|0;if(dg<0||2<dg)var dh=1;else switch(dg){case 1:var dh=1;break;case 2:var di=1,dh=0;break;default:var di=0,dh=0;}if(dh){var dd=dj(dc+1|0),di=2;}}else var di=0===df?0:1;switch(di){case 1:var dd=de===c_?dc+1|0:dm(dl,c7,dk,de);break;case 2:break;default:var dd=dj(dn(de,dc+1|0)+1|0);}}return dd;}var dp=da+1|0,da=dp;continue;}}return dj(dk);}return dn(dr,dq);}function dV(ds){return dm(dv,du,dt,ds);}function d$(dw,dH,dR){var dx=dw.getLen()-1|0;function dT(dy){var dz=dy;a:for(;;){if(dz<dx){if(37===dw.safeGet(dz)){var dA=0,dB=dz+1|0;for(;;){if(dx<dB)var dC=du(dw);else{var dD=dw.safeGet(dB);if(58<=dD){if(95===dD){var dF=dB+1|0,dE=1,dA=dE,dB=dF;continue;}}else if(32<=dD)switch(dD-32|0){case 1:case 2:case 4:case 5:case 6:case 7:case 8:case 9:case 12:case 15:break;case 0:case 3:case 11:case 13:var dG=dB+1|0,dB=dG;continue;case 10:var dI=dm(dH,dA,dB,105),dB=dI;continue;default:var dJ=dB+1|0,dB=dJ;continue;}var dK=dB;c:for(;;){if(dx<dK)var dL=du(dw);else{var dM=dw.safeGet(dK);if(126<=dM)var dN=0;else switch(dM){case 78:case 88:case 100:case 105:case 111:case 117:case 120:var dL=dm(dH,dA,dK,105),dN=1;break;case 69:case 70:case 71:case 101:case 102:case 103:var dL=dm(dH,dA,dK,102),dN=1;break;case 33:case 37:case 44:case 64:var dL=dK+1|0,dN=1;break;case 83:case 91:case 115:var dL=dm(dH,dA,dK,115),dN=1;break;case 97:case 114:case 116:var dL=dm(dH,dA,dK,dM),dN=1;break;case 76:case 108:case 110:var dO=dK+1|0;if(dx<dO){var dL=dm(dH,dA,dK,105),dN=1;}else{var dP=dw.safeGet(dO)-88|0;if(dP<0||32<dP)var dQ=1;else switch(dP){case 0:case 12:case 17:case 23:case 29:case 32:var dL=dS(dR,dm(dH,dA,dK,dM),105),dN=1,dQ=0;break;default:var dQ=1;}if(dQ){var dL=dm(dH,dA,dK,105),dN=1;}}break;case 67:case 99:var dL=dm(dH,dA,dK,99),dN=1;break;case 66:case 98:var dL=dm(dH,dA,dK,66),dN=1;break;case 41:case 125:var dL=dm(dH,dA,dK,dM),dN=1;break;case 40:var dL=dT(dm(dH,dA,dK,dM)),dN=1;break;case 123:var dU=dm(dH,dA,dK,dM),dW=dm(dV,dM,dw,dU),dX=dU;for(;;){if(dX<(dW-2|0)){var dY=dS(dR,dX,dw.safeGet(dX)),dX=dY;continue;}var dZ=dW-1|0,dK=dZ;continue c;}default:var dN=0;}if(!dN)var dL=dt(dw,dK,dM);}var dC=dL;break;}}var dz=dC;continue a;}}var d0=dz+1|0,dz=d0;continue;}return dz;}}dT(0);return 0;}function f_(ea){var d1=[0,0,0,0];function d_(d6,d7,d2){var d3=41!==d2?1:0,d4=d3?125!==d2?1:0:d3;if(d4){var d5=97===d2?2:1;if(114===d2)d1[3]=d1[3]+1|0;if(d6)d1[2]=d1[2]+d5|0;else d1[1]=d1[1]+d5|0;}return d7+1|0;}d$(ea,d_,function(d8,d9){return d8+1|0;});return d1[1];}function eR(eb,ee,ec){var ed=eb.safeGet(ec);if((ed-48|0)<0||9<(ed-48|0))return dS(ee,0,ec);var ef=ed-48|0,eg=ec+1|0;for(;;){var eh=eb.safeGet(eg);if(48<=eh){if(!(58<=eh)){var ek=eg+1|0,ej=(10*ef|0)+(eh-48|0)|0,ef=ej,eg=ek;continue;}var ei=0;}else if(36===eh)if(0===ef){var el=i(a1),ei=1;}else{var el=dS(ee,[0,cn(ef-1|0)],eg+1|0),ei=1;}else var ei=0;if(!ei)var el=dS(ee,0,ec);return el;}}function eM(em,en){return em?en:cp(cq,en);}function eB(eo,ep){return eo?eo[1]:ep;}function hA(gt,er,gF,eu,gd,gL,eq){var es=cp(er,eq);function gu(et){return dS(eu,es,et);}function gc(ez,gK,ev,eE){var ey=ev.getLen();function f$(gC,ew){var ex=ew;for(;;){if(ey<=ex)return cp(ez,es);var eA=ev.safeGet(ex);if(37===eA){var eI=function(eD,eC){return caml_array_get(eE,eB(eD,eC));},eO=function(eQ,eJ,eL,eF){var eG=eF;for(;;){var eH=ev.safeGet(eG)-32|0;if(!(eH<0||25<eH))switch(eH){case 1:case 2:case 4:case 5:case 6:case 7:case 8:case 9:case 12:case 15:break;case 10:return eR(ev,function(eK,eP){var eN=[0,eI(eK,eJ),eL];return eO(eQ,eM(eK,eJ),eN,eP);},eG+1|0);default:var eS=eG+1|0,eG=eS;continue;}var eT=ev.safeGet(eG);if(124<=eT)var eU=0;else switch(eT){case 78:case 88:case 100:case 105:case 111:case 117:case 120:var eW=eI(eQ,eJ),eX=caml_format_int(eV(eT,ev,ex,eG,eL),eW),eZ=eY(eM(eQ,eJ),eX,eG+1|0),eU=1;break;case 69:case 71:case 101:case 102:case 103:var e0=eI(eQ,eJ),e1=caml_format_float(c0(ev,ex,eG,eL),e0),eZ=eY(eM(eQ,eJ),e1,eG+1|0),eU=1;break;case 76:case 108:case 110:var e2=ev.safeGet(eG+1|0)-88|0;if(e2<0||32<e2)var e3=1;else switch(e2){case 0:case 12:case 17:case 23:case 29:case 32:var e4=eG+1|0,e5=eT-108|0;if(e5<0||2<e5)var e6=0;else{switch(e5){case 1:var e6=0,e7=0;break;case 2:var e8=eI(eQ,eJ),e9=caml_format_int(c0(ev,ex,e4,eL),e8),e7=1;break;default:var e_=eI(eQ,eJ),e9=caml_format_int(c0(ev,ex,e4,eL),e_),e7=1;}if(e7){var e$=e9,e6=1;}}if(!e6){var fa=eI(eQ,eJ),e$=caml_int64_format(c0(ev,ex,e4,eL),fa);}var eZ=eY(eM(eQ,eJ),e$,e4+1|0),eU=1,e3=0;break;default:var e3=1;}if(e3){var fb=eI(eQ,eJ),fc=caml_format_int(eV(110,ev,ex,eG,eL),fb),eZ=eY(eM(eQ,eJ),fc,eG+1|0),eU=1;}break;case 37:case 64:var eZ=eY(eJ,bW(1,eT),eG+1|0),eU=1;break;case 83:case 115:var fd=eI(eQ,eJ);if(115===eT)var fe=fd;else{var ff=[0,0],fg=0,fh=fd.getLen()-1|0;if(!(fh<fg)){var fi=fg;for(;;){var fj=fd.safeGet(fi),fk=14<=fj?34===fj?1:92===fj?1:0:11<=fj?13<=fj?1:0:8<=fj?1:0,fl=fk?2:caml_is_printable(fj)?1:4;ff[1]=ff[1]+fl|0;var fm=fi+1|0;if(fh!==fi){var fi=fm;continue;}break;}}if(ff[1]===fd.getLen())var fn=fd;else{var fo=caml_create_string(ff[1]);ff[1]=0;var fp=0,fq=fd.getLen()-1|0;if(!(fq<fp)){var fr=fp;for(;;){var fs=fd.safeGet(fr),ft=fs-34|0;if(ft<0||58<ft)if(-20<=ft)var fu=1;else{switch(ft+34|0){case 8:fo.safeSet(ff[1],92);ff[1]+=1;fo.safeSet(ff[1],98);var fv=1;break;case 9:fo.safeSet(ff[1],92);ff[1]+=1;fo.safeSet(ff[1],116);var fv=1;break;case 10:fo.safeSet(ff[1],92);ff[1]+=1;fo.safeSet(ff[1],110);var fv=1;break;case 13:fo.safeSet(ff[1],92);ff[1]+=1;fo.safeSet(ff[1],114);var fv=1;break;default:var fu=1,fv=0;}if(fv)var fu=0;}else var fu=(ft-1|0)<0||56<(ft-1|0)?(fo.safeSet(ff[1],92),ff[1]+=1,fo.safeSet(ff[1],fs),0):1;if(fu)if(caml_is_printable(fs))fo.safeSet(ff[1],fs);else{fo.safeSet(ff[1],92);ff[1]+=1;fo.safeSet(ff[1],48+(fs/100|0)|0);ff[1]+=1;fo.safeSet(ff[1],48+((fs/10|0)%10|0)|0);ff[1]+=1;fo.safeSet(ff[1],48+(fs%10|0)|0);}ff[1]+=1;var fw=fr+1|0;if(fq!==fr){var fr=fw;continue;}break;}}var fn=fo;}var fe=bB(a8,bB(fn,a9));}if(eG===(ex+1|0))var fx=fe;else{var fy=c0(ev,ex,eG,eL);try {var fz=0,fA=1;for(;;){if(fy.getLen()<=fA)var fB=[0,0,fz];else{var fC=fy.safeGet(fA);if(49<=fC)if(58<=fC)var fD=0;else{var fB=[0,caml_int_of_string(bX(fy,fA,(fy.getLen()-fA|0)-1|0)),fz],fD=1;}else{if(45===fC){var fF=fA+1|0,fE=1,fz=fE,fA=fF;continue;}var fD=0;}if(!fD){var fG=fA+1|0,fA=fG;continue;}}var fH=fB;break;}}catch(fI){if(fI[1]!==a)throw fI;var fH=cz(fy,0,115);}var fJ=fH[1],fK=fe.getLen(),fL=0,fP=fH[2],fO=32;if(fJ===fK&&0===fL){var fM=fe,fN=1;}else var fN=0;if(!fN)if(fJ<=fK)var fM=bX(fe,fL,fK);else{var fQ=bW(fJ,fO);if(fP)bY(fe,fL,fQ,0,fK);else bY(fe,fL,fQ,fJ-fK|0,fK);var fM=fQ;}var fx=fM;}var eZ=eY(eM(eQ,eJ),fx,eG+1|0),eU=1;break;case 67:case 99:var fR=eI(eQ,eJ);if(99===eT)var fS=bW(1,fR);else{if(39===fR)var fT=be;else if(92===fR)var fT=bf;else{if(14<=fR)var fU=0;else switch(fR){case 8:var fT=bj,fU=1;break;case 9:var fT=bi,fU=1;break;case 10:var fT=bh,fU=1;break;case 13:var fT=bg,fU=1;break;default:var fU=0;}if(!fU)if(caml_is_printable(fR)){var fV=caml_create_string(1);fV.safeSet(0,fR);var fT=fV;}else{var fW=caml_create_string(4);fW.safeSet(0,92);fW.safeSet(1,48+(fR/100|0)|0);fW.safeSet(2,48+((fR/10|0)%10|0)|0);fW.safeSet(3,48+(fR%10|0)|0);var fT=fW;}}var fS=bB(a6,bB(fT,a7));}var eZ=eY(eM(eQ,eJ),fS,eG+1|0),eU=1;break;case 66:case 98:var fY=eG+1|0,fX=eI(eQ,eJ)?bm:bl,eZ=eY(eM(eQ,eJ),fX,fY),eU=1;break;case 40:case 123:var fZ=eI(eQ,eJ),f0=dm(dV,eT,ev,eG+1|0);if(123===eT){var f1=cg(fZ.getLen()),f5=function(f3,f2){ci(f1,f2);return f3+1|0;};d$(fZ,function(f4,f7,f6){if(f4)cj(f1,a0);else ci(f1,37);return f5(f7,f6);},f5);var f8=ch(f1),eZ=eY(eM(eQ,eJ),f8,f0),eU=1;}else{var f9=eM(eQ,eJ),ga=co(f_(fZ),f9),eZ=gc(function(gb){return f$(ga,f0);},f9,fZ,eE),eU=1;}break;case 33:cp(gd,es);var eZ=f$(eJ,eG+1|0),eU=1;break;case 41:var eZ=eY(eJ,ba,eG+1|0),eU=1;break;case 44:var eZ=eY(eJ,a$,eG+1|0),eU=1;break;case 70:var ge=eI(eQ,eJ);if(0===eL)var gf=a_;else{var gg=c0(ev,ex,eG,eL);if(70===eT)gg.safeSet(gg.getLen()-1|0,103);var gf=gg;}var gh=caml_classify_float(ge);if(3===gh)var gi=ge<0?a4:a3;else if(4<=gh)var gi=a5;else{var gj=caml_format_float(gf,ge),gk=0,gl=gj.getLen();for(;;){if(gl<=gk)var gm=bB(gj,a2);else{var gn=gj.safeGet(gk)-46|0,go=gn<0||23<gn?55===gn?1:0:(gn-1|0)<0||21<(gn-1|0)?1:0;if(!go){var gp=gk+1|0,gk=gp;continue;}var gm=gj;}var gi=gm;break;}}var eZ=eY(eM(eQ,eJ),gi,eG+1|0),eU=1;break;case 91:var eZ=dt(ev,eG,eT),eU=1;break;case 97:var gq=eI(eQ,eJ),gr=cp(cq,eB(eQ,eJ)),gs=eI(0,gr),gw=eG+1|0,gv=eM(eQ,gr);if(gt)gu(dS(gq,0,gs));else dS(gq,es,gs);var eZ=f$(gv,gw),eU=1;break;case 114:var eZ=dt(ev,eG,eT),eU=1;break;case 116:var gx=eI(eQ,eJ),gz=eG+1|0,gy=eM(eQ,eJ);if(gt)gu(cp(gx,0));else cp(gx,es);var eZ=f$(gy,gz),eU=1;break;default:var eU=0;}if(!eU)var eZ=dt(ev,eG,eT);return eZ;}},gE=ex+1|0,gB=0;return eR(ev,function(gD,gA){return eO(gD,gC,gB,gA);},gE);}dS(gF,es,eA);var gG=ex+1|0,ex=gG;continue;}}function eY(gJ,gH,gI){gu(gH);return f$(gJ,gI);}return f$(gK,0);}var gM=dS(gc,gL,cn(0)),gN=f_(eq);if(gN<0||6<gN){var g0=function(gO,gU){if(gN<=gO){var gP=caml_make_vect(gN,0),gS=function(gQ,gR){return caml_array_set(gP,(gN-gQ|0)-1|0,gR);},gT=0,gV=gU;for(;;){if(gV){var gW=gV[2],gX=gV[1];if(gW){gS(gT,gX);var gY=gT+1|0,gT=gY,gV=gW;continue;}gS(gT,gX);}return dS(gM,eq,gP);}}return function(gZ){return g0(gO+1|0,[0,gZ,gU]);};},g1=g0(0,0);}else switch(gN){case 1:var g1=function(g3){var g2=caml_make_vect(1,0);caml_array_set(g2,0,g3);return dS(gM,eq,g2);};break;case 2:var g1=function(g5,g6){var g4=caml_make_vect(2,0);caml_array_set(g4,0,g5);caml_array_set(g4,1,g6);return dS(gM,eq,g4);};break;case 3:var g1=function(g8,g9,g_){var g7=caml_make_vect(3,0);caml_array_set(g7,0,g8);caml_array_set(g7,1,g9);caml_array_set(g7,2,g_);return dS(gM,eq,g7);};break;case 4:var g1=function(ha,hb,hc,hd){var g$=caml_make_vect(4,0);caml_array_set(g$,0,ha);caml_array_set(g$,1,hb);caml_array_set(g$,2,hc);caml_array_set(g$,3,hd);return dS(gM,eq,g$);};break;case 5:var g1=function(hf,hg,hh,hi,hj){var he=caml_make_vect(5,0);caml_array_set(he,0,hf);caml_array_set(he,1,hg);caml_array_set(he,2,hh);caml_array_set(he,3,hi);caml_array_set(he,4,hj);return dS(gM,eq,he);};break;case 6:var g1=function(hl,hm,hn,ho,hp,hq){var hk=caml_make_vect(6,0);caml_array_set(hk,0,hl);caml_array_set(hk,1,hm);caml_array_set(hk,2,hn);caml_array_set(hk,3,ho);caml_array_set(hk,4,hp);caml_array_set(hk,5,hq);return dS(gM,eq,hk);};break;default:var g1=dS(gM,eq,[0]);}return g1;}function hz(hr){return cg(2*hr.getLen()|0);}function hw(hu,hs){var ht=ch(hs);hs[2]=0;return cp(hu,ht);}function hE(hv){var hy=cp(hw,hv);return hB(hA,1,hz,ci,cj,function(hx){return 0;},hy);}function hF(hD){return dS(hE,function(hC){return hC;},hD);}var hG=[0,0],hH=null,hL=undefined,hJ=Array,hK=Date;function hM(hI){return hI instanceof hJ?0:[0,new MlWrappedString(hI.toString())];}hG[1]=[0,hM,hG[1]];function h2(hN,hQ){var hO=hN.length-1;if(0===hO)var hP=[0];else{var hR=caml_make_vect(hO,cp(hQ,hN[0+1])),hS=1,hT=hO-1|0;if(!(hT<hS)){var hU=hS;for(;;){hR[hU+1]=cp(hQ,hN[hU+1]);var hV=hU+1|0;if(hT!==hU){var hU=hV;continue;}break;}}var hP=hR;}return hP;}function h3(hX,h0){var hW=0,hY=hX.length-1-1|0;if(!(hY<hW)){var hZ=hW;for(;;){cp(h0,hX[hZ+1]);var h1=hZ+1|0;if(hY!==hZ){var hZ=h1;continue;}break;}}return 0;}({}.iter=caml_js_eval_string(aR));function h7(h4,h6){var h5=h4?h4[1]:aQ;return new MlWrappedString(caml_js_from_array(h6).join(h5.toString()));}var h_={"iter":caml_js_eval_string(aO)};function h9(h8){return new hK().valueOf();}function ia(h$){return new MlWrappedString(h$.toString());}caml_js_eval_string(aN);function ig(ic,ib){return setInterval(caml_js_wrap_callback(ib),ic);}function ih(id,ie){return cp(ie,id);}function ij(ii){return cp(ii,0);}function i9(ik,il,im){ij(ik);return ij(il);}function i_(io,ip){return h3(io,ij);}function iv(iq){return iq;}function i7(ir,it){var is=ir[2];ir[2]=is+1|0;ir[1][is]=it;return iv(function(iu){return delete ir[1][is];});}function i0(iw,ix){var iB=iw[1],iA=h_[aP.toString()];return iA(iB,caml_js_wrap_callback(function(iz,iy){return cp(iy,ix);}));}function iY(iC){return [0,{},0];}function i4(iD){return iD[2];}function iR(iE,iF){iE[1]=[0,iF,iE[1]];return 0;}function iQ(iG,iH){iG[2]=iH;var iI=iG[1];for(;;){if(iI){var iJ=iI[2];cp(iI[1],iG[2]);var iI=iJ;continue;}return 0;}}function iN(iK){return [0,0,iK];}function i$(iL,iM){var iO=iN(cp(iM,iL[2]));iR(iL,function(iP){return iQ(iO,cp(iM,iP));});return iO;}function ja(iT,iS,iU){var iV=iN(dS(iU,iT[2],iS[2]));iR(iT,function(iW){return iQ(iV,dS(iU,iW,iS[2]));});iR(iS,function(iX){return iQ(iV,dS(iU,iT[2],iX));});return iV;}function jb(i1){var iZ=iY(0);iR(i1,cp(i0,iZ));return iZ;}function jc(i8,i2,i6){var i3=iN(i2);i7(i8,function(i5){return iQ(i3,dS(i6,i4(i3),i5));});return i3;}function jz(jd){return jQuery(jd.toString());}function jA(je){return jQuery(je);}function jB(jf,jg){return jf.append(jg);}function jC(jk,ji,jh){var jj=i4(jh).toString();jk.setAttribute(ji.toString(),jj);var jm=ji.toString();function jn(jl){return jk.setAttribute(jm,jl.toString());}return i7(jb(jh),jn);}function jD(jp,jo){return jp.innerHTML=jo.toString();}function jE(jq,jr){jq.appendChild(jr);return 0;}function jF(ju,jy){function jt(js){return js.toString();}var jv=jt(ju),jw=document.createElementNS(jt(aK),jv);h3(jy,function(jx){return jw.setAttribute(jx[1].toString(),jx[2].toString());});return jw;}var jH=jz(aH),jG=iY(0),jJ=caml_js_wrap_callback(function(jI){return i0(jG,[0,jI[aL.toString()],jI[aM.toString()]]);});jH.on(aG.toString(),jJ);var jK=[0,0],jP=iY(0);function jQ(jL){return 0;}ih(i7(jG,function(jO){var jM=jK[1];if(jM){var jN=jM[1];i0(jP,[0,jO[1]-jN[1]|0,jO[2]-jN[2]|0]);}jK[1]=[0,jO];return 0;}),jQ);function jU(jR){var jS=jR[1],jT=bB(A,ia(jR[2]));return bB(ia(jS),jT);}function jZ(jV){return h7(B,h2(jV,jU));}function jY(jW){return jX(hF,C,jW[1],jW[2],jW[3],jW[4]);}var j0=2*(4*Math.atan(1))/360;function j7(j1){return j0*j1;}function kX(j2){return j2;}function kK(j4,j3,j8){var j5=j4[2],j6=j4[1],j$=j3[2],j_=j3[1],j9=j7(j8),ka=j$-j5,kb=j_-j6;return [0,kb*Math.cos(j9)-ka*Math.sin(j9)+j6,kb*Math.sin(j9)+ka*Math.cos(j9)+j5];}function kY(kc,kd){return kc+kd;}function kZ(ke,kf){return ke*kf;}function k1(kg){switch(kg[0]){case 1:return dm(hF,H,kg[1],kg[2]);case 2:return dm(hF,G,kg[1],kg[2]);case 3:var kh=kg[2];return ki(hF,F,kg[1],kh[1],kh[2]);case 4:return dS(hF,E,kg[1]);case 5:return dS(hF,D,kg[1]);default:return kj(hF,I,kg[1],kg[2],kg[3],kg[4],kg[5],kg[6]);}}function k0(kk){return [0,kk];}function k2(kl,kn,kp,kq){var km=kl?kl[1]:737755699,ko=kn?kn[1]:463106021;return [1,[0,km,ko,kq,kp]];}function kS(kr){switch(kr[0]){case 1:var ks=kr[1],kt=ks[2],ku=ks[1],kx=ks[4],kw=ks[3],kv=9660462===kt?M:463106021<=kt?O:N,kz=bB(V,kv),ky=226915517===ku?J:737755699<=ku?L:K,kA=bB(U,ky),kB=bB(T,bC(kw));return h7(R,[0,bB(S,jY(kx)),kB,kA,kz]);case 2:return bB(P,h7(Q,h2(kr[1],ia)));default:return bB(W,jY(kr[1]));}}function k3(kC){return [0,kC];}function k5(kD){switch(kD[0]){case 1:var kE=kD[1];return dm(hF,Z,kE[1],kE[2]);case 2:var kF=kD[4],kG=kD[1],kI=kD[2],kH=-64519044<=kD[3]?0:1,kJ=Math.sin(j7(kG))*kF,kL=kK([0,-Math.cos(j7(kG))*kF,kJ],Y,kI-kG);return hB(hF,X,kF,kF,kH,kL[1],kL[2]);default:var kM=kD[1];return dm(hF,_,kM[1],kM[2]);}}function k4(kN,kQ,kR,kP){var kO=kN?kN[1]:[0];return [3,kO,kR,kQ,kP];}function k6(kT){return h7(aa,h2(kT,kS));}function k7(kV,kW){return ih(h2(kW,function(kU){return jC(kV,kU[1],kU[2]);}),i_);}var k8=[];function k_(k9){return ia(k9[1]);}function l0(k$){return i$(k$,k_);}function lb(la){return ia(la[2]);}function lY(lc){return i$(lc,lb);}function lR(ld){var le=iN(k6(h2(ld,i4)));h3(ld,function(lg){return iR(lg,function(lf){return iQ(le,k6(h2(ld,i4)));});});return le;}caml_update_dummy(k8,function(lh){switch(lh[0]){case 1:var lj=lh[2],li=cp(k8,lh[1]),lk=li[1],ll=li[2];return [0,lk,dS(i9,jC(lk,az,i$(lj,k1)),ll)];case 2:var lm=lh[2],ln=lh[1],lo=[0,ax,h7(ay,h2(i4(lm),jU))],lp=jF(av,[0,[0,aw,k6(h2(ln,i4))],lo]);return [0,lp,jC(lp,au,i$(lm,jZ))];case 3:var lq=lh[4],lr=lh[3],ls=lh[1],lu=lh[2],lt=jF(at,[0]),lB=jC(lt,as,ja(lu,lq,function(lv,lw){var ly=lv[2],lx=lv[1];return ki(hF,aF,lx,ly,h7($,h2(lw,k5)));})),lA=function(lz){return lt.getTotalLength();},lF=lA(0),lE=function(lD,lC){return lC;},lH=function(lG){return jc(lG,lF,lE);},lJ=jb(lq),lI=iY(0);i7(lJ,function(lK){return i0(lI,lA(0));});var lP=ih(lI,lH);if(lr){var lO=lr[1],lQ=bJ(ls,[0,ja(lP,lO,function(lN,lL){var lM=lL[1];return [2,[254,0,lN*lM,lN*(lL[2]-lM),lN]];})]);}else var lQ=ls;return [0,lt,dS(i9,lB,jC(lt,ar,lR(lQ)))];case 4:var lS=lh[3],lT=lh[2],lV=lh[1],lU=jF(aq,[0]);jD(lU,i4(lS));var lW=cp(jD,lU),lX=cp(i9,i7(jb(lS),lW)),lZ=[0,ap,lR(lV)],l1=[0,ao,lY(lT)];return [0,lU,ih(k7(lU,[0,[0,an,l0(lT)],l1,lZ]),lX)];case 5:var l2=h2(lh[1],k8),l3=jF(am,[0]);h3(l2,function(l4){return jE(l3,l4[1]);});return [0,l3,cp(i_,h2(l2,function(l5){return l5[2];}))];case 6:var l6=lh[4],l7=lh[3],l8=lh[2],l_=lh[1],l9=i4(l8),ma=l9[2],l$=l9[1],mb=[0,al,k6(h2(l_,i4))],mc=[0,ak,ia(i4(l6))],md=[0,aj,ia(i4(l7))],me=[0,ai,ia(ma)],mf=jF(ag,[0,[0,ah,ia(l$)],me,md,mc,mb]),mg=[0,af,i$(l6,ia)],mh=[0,ae,i$(l7,ia)],mi=[0,ad,lY(l8)];return [0,mf,k7(mf,[0,[0,ac,l0(l8)],mi,mh,mg])];case 7:var mj=lh[1],mk=jF(ab,[0]),ml=[0,cp(k8,i4(mj))[2]],mq=function(mn){ij(ml[1]);for(;;){if(1-(mk.firstChild==hH?1:0)){var mm=mk.firstChild;if(mm!=hH)mk.removeChild(mm);continue;}var mo=cp(k8,mn),mp=mo[2];jE(mk,mo[1]);ml[1]=mp;return 0;}},ms=i7(jb(mj),mq);return [0,mk,dS(i9,ms,iv(function(mr){return ij(ml[1]);}))];default:var mt=lh[3],mw=lh[2],mv=lh[1],mu=jF(aE,[0]),mx=[0,aD,lR(mv)],my=[0,aC,i$(mw,ia)],mz=[0,aB,lY(mt)];return [0,mu,k7(mu,[0,[0,aA,l0(mt)],mz,my,mx])];}});var mC=[],mQ=[1,function(mA,mB){return mA;}];function mO(mG,mE,mH,mD){var mF=cp(mE,mD),mJ=cp(mH,cp(mF,mG));return function(mI){return mI<=mG?cp(mF,mI):cp(mJ,mI-mG);};}caml_update_dummy(mC,function(mK){var mL=mK[2],mM=mK[1];return function(mN){{if(0===mN[0]){var mP=mN[1];return [0,mM+mP,dm(mO,mM,mL,mN[2])];}return [1,dm(mO,mM,mL,mN[1])];}};});function m5(mR){var m1=mR[1];return function(m0){function mV(mT,mS){return mS;}var mU=iY(0),mZ=0,mY=30,mW=h9(0);ig(mY,function(mX){return i0(mU,h9(0)-mW);});var m2=jc(mU,mZ,mV);return i$(m2,cp(m1,m0));};}function nj(m3,m4){return dS(m5,m4,m3);}function nk(nd,m_,ne){var m6=jz(bB(aI,bB(u,aJ))),m7=iN(0);function m$(m9,m8){return iQ(m7,m8[v.toString()]/100);}jB(m_,m6);var nb={"slide":caml_js_wrap_callback(m$)};function nc(na){return 0;}ih(m6.slider(nb),nc);return m7;}function nx(nf){var nh=nf[2],ng=cp(k8,nf[3]),ni=ng[2];jB(nh,jA(ng[1]));return ni;}function nw(nm,nl){if(nl<nm)i(o);var nn=(nl-nm|0)+1|0;function np(no){return no+nm|0;}if(0===nn)var nq=[0];else{var nr=caml_make_vect(nn,np(0)),ns=1,nt=nn-1|0;if(!(nt<ns)){var nu=ns;for(;;){nr[nu+1]=np(nu);var nv=nu+1|0;if(nt!==nu){var nu=nv;continue;}break;}}var nq=nr;}return nq;}var ny=jF(l,[0,m,n]),nz=6,nA=600,nB=400,nC=bq(nB,nA)/4,nD=[0,nB/2,nA/2],nE=[0,nB/2,nA/2-nC],nF=360/nz;function nH(nG){return kK(nD,nE,kZ(nG,kX(nF)));}var nI=iN(h2(nw(0,nz-1|0),nH)),nO=iN(k2(0,0,c,2));function nP(nJ){return i$(nJ,k0);}function nM(nK,nL){return [0,nK[1],nK[2],nK[3]+1|0,nK[4]];}function nR(nN){return jc(nN,z,nM);}var nQ=iY(0),nT=30;ig(nT,function(nS){return i0(nQ,h9(0));});var nU=[0,ih(ih(nQ,nR),nP),nO],nV=[0,nU]?nU:[0],nX=[2,nV,nI];function nY(nW){return i$(nW,kX);}var ol=cp(nj,0);function om(n0){var nZ=[0,mQ],n1=n0.length-1-1|0,n2=0;if(!(n1<n2)){var n3=n1;for(;;){nZ[1]=dS(mC,n0[n3+1],nZ[1]);var n4=n3-1|0;if(n2!==n3){var n3=n4;continue;}break;}}return nZ[1];}function on(n8){var n7=500,n9=n8*nF,n_=1e3,oh=[0,n7,function(n5,n6){return n5;}];function ok(n$){var oa=(n9+n$)/2,ob=n_/2,oc=(oa-n9)/ob,oe=(oa-n$)/Math.pow(n_/2,2),og=oc/ob;return function(od){if(od<=n_/2)return n$+oe*Math.pow(od,2);var of=od-n_/2;return oa+og*Math.pow(of,2)-2*oc*of;};}return dS(mC,dS(mC,[0,n_,ok],[0,0,function(oi,oj){return n9;}]),oh);}var oo=ih(ih(ih(h2(nw(1,nz),on),om),ol),nY),ot=i$(oo,function(op){var oq=bq(op,kX(359.9999)),or=caml_lessthan(oq,kX(180))?-64519044:-944265860,os=kY(kX(90),oq);return [0,[2,kX(90),os,or,nC+40]];}),ou=iN([0,nE[1],nE[2]-40]),ov=iN(k0([0,d[1],d[2],d[3],0])),ow=k4([0,[0,iN(k2(0,0,d,4)),ov]],0,ou,ot),oy=kX(nF);function oG(ox){var oz=ox-1|0,oC=i$(oo,function(oA){var oB=kY(oA,kZ(oz,oy));return kK(nD,[0,nE[1],nE[2]-20],oB);}),oD=0,oF=iN(bC(ox)),oE=oD?oD[1]:[0];return [4,oE,oC,oF];}var oI=h2(nw(1,nz),oG);jE(ny,cp(k8,[5,bJ(oI,[0,[1,nX,i$(oo,function(oH){return [3,oH,nD];})],ow])])[1]);var oJ=jz(k).get(0),oK=oJ===hL?0:[0,oJ];if(oK)jE(oK[1],ny);else console.log(j);var oL=jz(q),oM=cp(nk,p),oN=[0,y,bC(400)],oO=ih(jF(w,[0,[0,x,bC(400)],oN]),jA);jB(oL,oO);var oP=dS(oM,oL,oO),oQ=k3(t),oR=iN([0,k3(s),oQ]),oT=iN(r),oU=[0,i$(oP,function(oS){return [0,0,Math.pow(oS,2)];})],oV=iN(k2(0,0,c,2));ih([0,oL,oO,k4([0,[0,iN(k0([0,d[1],d[2],d[3],0])),oV]],oU,oT,oR)],nx);bD(0);return;}());
