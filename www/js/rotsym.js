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
function caml_equal (x, y) { return +(caml_compare_val(x,y,false) == 0); }
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
function caml_compare (a, b) { return caml_compare_val (a, b, true); }
function caml_greaterequal (x, y) { return +(caml_compare(x,y,false) >= 0); }
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
(function()
   {function _l7_(_tH_,_tI_,_tJ_,_tK_,_tL_,_tM_,_tN_,_tO_)
     {return _tH_.length==7
              ?_tH_(_tI_,_tJ_,_tK_,_tL_,_tM_,_tN_,_tO_)
              :caml_call_gen(_tH_,[_tI_,_tJ_,_tK_,_tL_,_tM_,_tN_,_tO_]);}
    function _ia_(_tA_,_tB_,_tC_,_tD_,_tE_,_tF_,_tG_)
     {return _tA_.length==6
              ?_tA_(_tB_,_tC_,_tD_,_tE_,_tF_,_tG_)
              :caml_call_gen(_tA_,[_tB_,_tC_,_tD_,_tE_,_tF_,_tG_]);}
    function _lL_(_tu_,_tv_,_tw_,_tx_,_ty_,_tz_)
     {return _tu_.length==5
              ?_tu_(_tv_,_tw_,_tx_,_ty_,_tz_)
              :caml_call_gen(_tu_,[_tv_,_tw_,_tx_,_ty_,_tz_]);}
    function _l6_(_tp_,_tq_,_tr_,_ts_,_tt_)
     {return _tp_.length==4
              ?_tp_(_tq_,_tr_,_ts_,_tt_)
              :caml_call_gen(_tp_,[_tq_,_tr_,_ts_,_tt_]);}
    function _dY_(_tl_,_tm_,_tn_,_to_)
     {return _tl_.length==3
              ?_tl_(_tm_,_tn_,_to_)
              :caml_call_gen(_tl_,[_tm_,_tn_,_to_]);}
    function _er_(_ti_,_tj_,_tk_)
     {return _ti_.length==2?_ti_(_tj_,_tk_):caml_call_gen(_ti_,[_tj_,_tk_]);}
    function _c1_(_tg_,_th_)
     {return _tg_.length==1?_tg_(_th_):caml_call_gen(_tg_,[_th_]);}
    var
     _a_=[0,new MlString("Failure")],
     _b_=[0,new MlString("Invalid_argument")],
     _c_=[0,0,0,0,1],
     _d_=[0,255,0,0,1],
     _e_=[0,0,0,255,1],
     _f_=new MlString("class"),
     match_g_=[0,400,400],
     _h_=[0,50,100];
    caml_register_global(6,[0,new MlString("Not_found")]);
    caml_register_global(5,[0,new MlString("Division_by_zero")]);
    caml_register_global(3,_b_);
    caml_register_global(2,_a_);
    var
     _b4_=[0,new MlString("Assert_failure")],
     _b3_=new MlString("%d"),
     _b2_=new MlString("true"),
     _b1_=new MlString("false"),
     _b0_=new MlString("Pervasives.do_at_exit"),
     _bZ_=new MlString("\\b"),
     _bY_=new MlString("\\t"),
     _bX_=new MlString("\\n"),
     _bW_=new MlString("\\r"),
     _bV_=new MlString("\\\\"),
     _bU_=new MlString("\\'"),
     _bT_=new MlString("String.blit"),
     _bS_=new MlString("String.sub"),
     _bR_=new MlString("Buffer.add: cannot grow buffer"),
     _bQ_=new MlString(""),
     _bP_=new MlString(""),
     _bO_=new MlString("%.12g"),
     _bN_=new MlString("\""),
     _bM_=new MlString("\""),
     _bL_=new MlString("'"),
     _bK_=new MlString("'"),
     _bJ_=new MlString("nan"),
     _bI_=new MlString("neg_infinity"),
     _bH_=new MlString("infinity"),
     _bG_=new MlString("."),
     _bF_=new MlString("printf: bad positional specification (0)."),
     _bE_=new MlString("%_"),
     _bD_=[0,new MlString("printf.ml"),143,8],
     _bC_=new MlString("'"),
     _bB_=new MlString("Printf: premature end of format string '"),
     _bA_=new MlString("'"),
     _bz_=new MlString(" in format string '"),
     _by_=new MlString(", at char number "),
     _bx_=new MlString("Printf: bad conversion %"),
     _bw_=new MlString("Sformat.index_of_int: negative argument "),
     _bv_=new MlString("Option.value_exn: None"),
     _bu_=
      new
       MlString
       ("(function(a,f){var len=a.length;for(var i = 0; i < len; ++i){f(a[i]);}})"),
     _bt_=new MlString(""),
     _bs_=new MlString("iter"),
     _br_=
      new
       MlString
       ("(function(t, x0, f){for(var k in t){if(t.hasOwnProperty(k)){x0=f(x0,parseInt(k),t[k]);}} return x0;})"),
     _bq_=
      new
       MlString
       ("(function(t, f){for(var k in t){if(t.hasOwnProperty(k)){f(parseInt(k),t[k]);}}})"),
     _bp_=new MlString("(function(x,y){return x % y;})"),
     _bo_=new MlString("mousedown"),
     _bn_=new MlString("mouseup"),
     _bm_=new MlString("offsetY"),
     _bl_=new MlString("offsetX"),
     _bk_=new MlString("which"),
     _bj_=new MlString("click"),
     _bi_=new MlString("pageY"),
     _bh_=new MlString("pageX"),
     _bg_=new MlString("Not a valid mouse code: "),
     _bf_=new MlString("http://www.w3.org/2000/svg"),
     _be_=new MlString(">"),
     _bd_=new MlString("<"),
     _bc_=new MlString("body"),
     _bb_=new MlString("mousemove"),
     _ba_=new MlString("M%f,%f %s"),
     _a$_=new MlString("circle"),
     _a__=new MlString("style"),
     _a9_=new MlString("r"),
     _a8_=new MlString("cy"),
     _a7_=new MlString("cx"),
     _a6_=new MlString("transform"),
     _a5_=[0,new MlString(",")],
     _a4_=new MlString("points"),
     _a3_=new MlString("style"),
     _a2_=new MlString("polygon"),
     _a1_=new MlString("points"),
     _a0_=new MlString("path"),
     _aZ_=new MlString("d"),
     _aY_=new MlString("path"),
     _aX_=new MlString("d"),
     _aW_=new MlString("text"),
     _aV_=new MlString("style"),
     _aU_=new MlString("y"),
     _aT_=new MlString("x"),
     _aS_=new MlString("g"),
     _aR_=new MlString("style"),
     _aQ_=new MlString("height"),
     _aP_=new MlString("width"),
     _aO_=new MlString("y"),
     _aN_=new MlString("x"),
     _aM_=new MlString("rect"),
     _aL_=new MlString("height"),
     _aK_=new MlString("width"),
     _aJ_=new MlString("y"),
     _aI_=new MlString("x"),
     _aH_=new MlString("g"),
     _aG_=new MlString("style"),
     _aF_=[0,new MlString(";")],
     _aE_=[0,new MlString(" ")],
     _aD_=new MlString("l%f %f"),
     _aC_=new MlString("m%f %f"),
     _aB_=[0,0,0],
     _aA_=new MlString("a%f,%f 0 %d,1 %f,%f"),
     _az_=new MlString("fill:"),
     _ay_=new MlString("stroke-linejoin:"),
     _ax_=new MlString("stroke-linecap:"),
     _aw_=new MlString("stroke-width:"),
     _av_=new MlString("stroke:"),
     _au_=[0,new MlString(";")],
     _at_=[0,new MlString(" ")],
     _as_=new MlString("stroke-dasharray:"),
     _ar_=new MlString("%s:%s"),
     _aq_=new MlString("miter"),
     _ap_=new MlString("bevel"),
     _ao_=new MlString("round"),
     _an_=new MlString("butt"),
     _am_=new MlString("round"),
     _al_=new MlString("square"),
     _ak_=new MlString("matrix(%f,%f,%f,%f,%f,%f)"),
     _aj_=new MlString("translate(%f %f)"),
     _ai_=new MlString("scale(%f %f)"),
     _ah_=new MlString("rotate(%f %f %f)"),
     _ag_=new MlString("skewX(%f)"),
     _af_=new MlString("skewY(%f)"),
     _ae_=new MlString("rgba(%d,%d,%d,%f)"),
     _ad_=[0,new MlString(" ")],
     _ac_=new MlString(","),
     _ab_=[0,new MlString("class"),new MlString("proof-canvas")],
     _aa_=new MlString("height"),
     _$_=new MlString("width"),
     ___=new MlString("svg"),
     _Z_=new MlString("p"),
     _Y_=new MlString("a class='btn btn-primary'"),
     _X_=new MlString("a class='btn btn-default'"),
     _W_=new MlString("span class='glyphicon glyphicon-plus'"),
     _V_=new MlString("span class='glyphicon glyphicon-minus'"),
     _U_=new MlString("value"),
     _T_=new MlString("div"),
     _S_=new MlString("div"),
     _R_=new MlString("div"),
     _Q_=new MlString("value"),
     _P_=new MlString("option"),
     _O_=new MlString("value"),
     _N_=new MlString("option"),
     _M_=new MlString("cp-slider-button-playing"),
     _L_=new MlString("cp-slider-button-paused"),
     _K_=new MlString("Graph.Change.Add_arc: Nodes not in graph"),
     _J_=new MlString("Graph.Change.Remove_arc: Nodes not in graph"),
     _I_=new MlString("Graph.Change.Remove_node : Node not in graph"),
     _H_=
      new
       MlString
       ("M15.514,227.511c0,0-14.993-122.591,109.361-59.091 c124.356,63.501,157.872,22.049,125.238-49.389c-32.632-71.439-127.305-15.875-111.719,108.479 c15.586,124.355,246.658,35.278,246.658,35.278"),
     _G_=new MlString("#pathanim"),
     _F_=new MlString(""),
     _E_=new MlString("(%d, %d)"),
     _D_=new MlString("#point-in-plane"),
     _C_=[0,200,200],
     _B_=new MlString("Hit plus yo"),
     _A_=new MlString("#ngon"),
     _z_=[0,6],
     _y_=[0,2],
     _x_=new MlString("end"),
     _w_=new MlString("text-anchor"),
     _v_=new MlString("40pt"),
     _u_=new MlString("font-size"),
     _t_=new MlString("Invalid range"),
     _s_=[0,new MlString("fill"),new MlString("none")],
     _r_=[0,new MlString("stroke-width"),new MlString("5")],
     _q_=
      [0,
       new MlString("d"),
       new
        MlString
        ("m74.072388,176.343704c0,0 -48.240629,-187.48112 77.664017,-81.201996c125.904617,106.279099 131.036606,-49.55714 131.036606,-49.55714c0,0 14.027405,-41.795149 -142.669113,-23.882954c-156.696512,17.912197 69.794968,40.60104 69.794968,40.60104c0,0 218.280304,19.106365 -31.818298,157.030354c-250.098579,137.92395 -120.088375,-207.781625 -120.088375,-207.781625")],
     _p_=[0,new MlString("stroke"),new MlString("#000000")],
     _o_=new MlString("path"),
     _n_=new MlString("Big booboo in bowtie");
    /*<<990: pervasives.ml 20 17 33>>*/function _m_(s_i_){throw [0,_a_,s_i_];}
    /*<<984: pervasives.ml 21 20 45>>*/function _b5_(s_j_)
     {throw [0,_b_,s_j_];}
    function _b6_(x_l_,y_k_){return caml_lessequal(x_l_,y_k_)?x_l_:y_k_;}
    var min_int_b7_=1<<31,max_int_ch_=min_int_b7_-1|0;
    function _cg_(s1_b8_,s2_b__)
     {var
       l1_b9_=s1_b8_.getLen(),
       l2_b$_=s2_b__.getLen(),
       s_ca_=caml_create_string(l1_b9_+l2_b$_|0);
      caml_blit_string(s1_b8_,0,s_ca_,0,l1_b9_);
      caml_blit_string(s2_b__,0,s_ca_,l1_b9_,l2_b$_);
      return s_ca_;}
    /*<<846: pervasives.ml 186 2 19>>*/function string_of_int_ci_(n_cb_)
     {return caml_format_int(_b3_,n_cb_);}
    /*<<220: pervasives.ml 451 20 39>>*/function do_at_exit_cj_(param_cf_)
     {var param_cc_=caml_ml_out_channels_list(0);
      /*<<720: pervasives.ml 253 17 50>>*/for(;;)
       {if(param_cc_)
         {var l_cd_=param_cc_[2];
          try {}catch(_ce_){}
          var param_cc_=l_cd_;
          continue;}
        return 0;}}
    caml_register_named_value(_b0_,do_at_exit_cj_);
    function _cw_(n_ck_,c_cm_)
     {var s_cl_=caml_create_string(n_ck_);
      caml_fill_string(s_cl_,0,n_ck_,c_cm_);
      return s_cl_;}
    function _cx_(s_cp_,ofs_cn_,len_co_)
     {if(0<=ofs_cn_&&0<=len_co_&&!((s_cp_.getLen()-len_co_|0)<ofs_cn_))
       {var r_cq_=caml_create_string(len_co_);
        /*<<6675: string.ml 41 7 5>>*/caml_blit_string
         (s_cp_,ofs_cn_,r_cq_,0,len_co_);
        return r_cq_;}
      return _b5_(_bS_);}
    function _cy_(s1_ct_,ofs1_cs_,s2_cv_,ofs2_cu_,len_cr_)
     {if
       (0<=
        len_cr_&&
        0<=
        ofs1_cs_&&
        !((s1_ct_.getLen()-len_cr_|0)<ofs1_cs_)&&
        0<=
        ofs2_cu_&&
        !((s2_cv_.getLen()-len_cr_|0)<ofs2_cu_))
       return caml_blit_string(s1_ct_,ofs1_cs_,s2_cv_,ofs2_cu_,len_cr_);
      return _b5_(_bT_);}
    var
     _cz_=caml_sys_const_word_size(0),
     _cA_=caml_mul(_cz_/8|0,(1<<(_cz_-10|0))-1|0)-1|0;
    /*<<8284: buffer.ml 23 1 59>>*/function _cS_(n_cB_)
     {var
       n_cC_=1<=n_cB_?n_cB_:1,
       n_cD_=_cA_<n_cC_?_cA_:n_cC_,
       s_cE_=caml_create_string(n_cD_);
      return [0,s_cE_,0,n_cD_,s_cE_];}
    /*<<8274: buffer.ml 28 17 49>>*/function _cT_(b_cF_)
     {return _cx_(b_cF_[1],0,b_cF_[2]);}
    function _cM_(b_cG_,more_cI_)
     {var new_len_cH_=[0,b_cG_[3]];
      for(;;)
       {if(new_len_cH_[1]<(b_cG_[2]+more_cI_|0))
         {new_len_cH_[1]=2*new_len_cH_[1]|0;continue;}
        if(_cA_<new_len_cH_[1])
         if((b_cG_[2]+more_cI_|0)<=_cA_)
          /*<<8082: buffer.ml 68 9 41>>*/new_len_cH_[1]=_cA_;
         else
          /*<<8089: buffer.ml 69 9 50>>*/_m_(_bR_);
        var new_buffer_cJ_=caml_create_string(new_len_cH_[1]);
        /*<<8095: buffer.ml 69 9 50>>*/_cy_
         (b_cG_[1],0,new_buffer_cJ_,0,b_cG_[2]);
        /*<<8095: buffer.ml 69 9 50>>*/b_cG_[1]=new_buffer_cJ_;
        /*<<8095: buffer.ml 69 9 50>>*/b_cG_[3]=new_len_cH_[1];
        return 0;}}
    function _cU_(b_cK_,c_cN_)
     {var pos_cL_=b_cK_[2];
      if(b_cK_[3]<=pos_cL_)/*<<8019: buffer.ml 78 26 36>>*/_cM_(b_cK_,1);
      /*<<8023: buffer.ml 78 26 36>>*/b_cK_[1].safeSet(pos_cL_,c_cN_);
      /*<<8023: buffer.ml 78 26 36>>*/b_cK_[2]=pos_cL_+1|0;
      return 0;}
    function _cV_(b_cQ_,s_cO_)
     {var len_cP_=s_cO_.getLen(),new_position_cR_=b_cQ_[2]+len_cP_|0;
      if(b_cQ_[3]<new_position_cR_)
       /*<<7921: buffer.ml 93 34 46>>*/_cM_(b_cQ_,len_cP_);
      /*<<7925: buffer.ml 93 34 46>>*/_cy_(s_cO_,0,b_cQ_[1],b_cQ_[2],len_cP_);
      /*<<7925: buffer.ml 93 34 46>>*/b_cQ_[2]=new_position_cR_;
      return 0;}
    /*<<11963: printf.ml 32 4 80>>*/function index_of_int_cZ_(i_cW_)
     {return 0<=i_cW_?i_cW_:_m_(_cg_(_bw_,string_of_int_ci_(i_cW_)));}
    function add_int_index_c0_(i_cX_,idx_cY_)
     {return index_of_int_cZ_(i_cX_+idx_cY_|0);}
    var _c2_=_c1_(add_int_index_c0_,1);
    /*<<11929: printf.ml 58 22 66>>*/function _c9_(fmt_c3_)
     {return _cx_(fmt_c3_,0,fmt_c3_.getLen());}
    function bad_conversion_c$_(sfmt_c4_,i_c5_,c_c7_)
     {var
       _c6_=_cg_(_bz_,_cg_(sfmt_c4_,_bA_)),
       _c8_=_cg_(_by_,_cg_(string_of_int_ci_(i_c5_),_c6_));
      return _b5_(_cg_(_bx_,_cg_(_cw_(1,c_c7_),_c8_)));}
    function bad_conversion_format_d4_(fmt_c__,i_db_,c_da_)
     {return bad_conversion_c$_(_c9_(fmt_c__),i_db_,c_da_);}
    /*<<11842: printf.ml 75 2 34>>*/function incomplete_format_d5_(fmt_dc_)
     {return _b5_(_cg_(_bB_,_cg_(_c9_(fmt_dc_),_bC_)));}
    function extract_format_dA_(fmt_dd_,start_dl_,stop_dn_,widths_dp_)
     {/*<<11574: printf.ml 123 4 16>>*/function skip_positional_spec_dk_
       (start_de_)
       {if
         ((fmt_dd_.safeGet(start_de_)-48|0)<
          0||
          9<
          (fmt_dd_.safeGet(start_de_)-48|0))
         return start_de_;
        var i_df_=start_de_+1|0;
        /*<<11545: printf.ml 126 8 20>>*/for(;;)
         {var _dg_=fmt_dd_.safeGet(i_df_);
          if(48<=_dg_)
           {if(!(58<=_dg_)){var _di_=i_df_+1|0,i_df_=_di_;continue;}
            var _dh_=0;}
          else
           if(36===_dg_){var _dj_=i_df_+1|0,_dh_=1;}else var _dh_=0;
          if(!_dh_)var _dj_=start_de_;
          return _dj_;}}
      var
       start_dm_=skip_positional_spec_dk_(start_dl_+1|0),
       b_do_=_cS_((stop_dn_-start_dm_|0)+10|0);
      _cU_(b_do_,37);
      var l1_dq_=widths_dp_,l2_dr_=0;
      for(;;)
       {if(l1_dq_)
         {var
           l_ds_=l1_dq_[2],
           _dt_=[0,l1_dq_[1],l2_dr_],
           l1_dq_=l_ds_,
           l2_dr_=_dt_;
          continue;}
        var i_du_=start_dm_,widths_dv_=l2_dr_;
        for(;;)
         {if(i_du_<=stop_dn_)
           {var _dw_=fmt_dd_.safeGet(i_du_);
            if(42===_dw_)
             {if(widths_dv_)
               {var t_dx_=widths_dv_[2];
                _cV_(b_do_,string_of_int_ci_(widths_dv_[1]));
                var
                 i_dy_=skip_positional_spec_dk_(i_du_+1|0),
                 i_du_=i_dy_,
                 widths_dv_=t_dx_;
                continue;}
              throw [0,_b4_,_bD_];}
            _cU_(b_do_,_dw_);
            var _dz_=i_du_+1|0,i_du_=_dz_;
            continue;}
          return _cT_(b_do_);}}}
    function extract_format_int_fu_
     (conv_dG_,fmt_dE_,start_dD_,stop_dC_,widths_dB_)
     {var sfmt_dF_=extract_format_dA_(fmt_dE_,start_dD_,stop_dC_,widths_dB_);
      if(78!==conv_dG_&&110!==conv_dG_)return sfmt_dF_;
      /*<<11463: printf.ml 155 4 8>>*/sfmt_dF_.safeSet
       (sfmt_dF_.getLen()-1|0,117);
      return sfmt_dF_;}
    function sub_format_d6_
     (incomplete_format_dN_,bad_conversion_format_dX_,conv_d2_,fmt_dH_,i_d1_)
     {var len_dI_=fmt_dH_.getLen();
      function sub_fmt_dZ_(c_dJ_,i_dW_)
       {var close_dK_=40===c_dJ_?41:125;
        /*<<11228: printf.ml 181 7 26>>*/function sub_dV_(j_dL_)
         {var j_dM_=j_dL_;
          /*<<11228: printf.ml 181 7 26>>*/for(;;)
           {if(len_dI_<=j_dM_)return _c1_(incomplete_format_dN_,fmt_dH_);
            if(37===fmt_dH_.safeGet(j_dM_))
             {var _dO_=j_dM_+1|0;
              if(len_dI_<=_dO_)
               var _dP_=_c1_(incomplete_format_dN_,fmt_dH_);
              else
               {var _dQ_=fmt_dH_.safeGet(_dO_),_dR_=_dQ_-40|0;
                if(_dR_<0||1<_dR_)
                 {var _dS_=_dR_-83|0;
                  if(_dS_<0||2<_dS_)
                   var _dT_=1;
                  else
                   switch(_dS_)
                    {case 1:var _dT_=1;break;
                     case 2:var _dU_=1,_dT_=0;break;
                     default:var _dU_=0,_dT_=0;}
                  if(_dT_){var _dP_=sub_dV_(_dO_+1|0),_dU_=2;}}
                else
                 var _dU_=0===_dR_?0:1;
                switch(_dU_)
                 {case 1:
                   var
                    _dP_=
                     _dQ_===close_dK_
                      ?_dO_+1|0
                      :_dY_(bad_conversion_format_dX_,fmt_dH_,i_dW_,_dQ_);
                   break;
                  case 2:break;
                  default:var _dP_=sub_dV_(sub_fmt_dZ_(_dQ_,_dO_+1|0)+1|0);}}
              return _dP_;}
            var _d0_=j_dM_+1|0,j_dM_=_d0_;
            continue;}}
        return sub_dV_(i_dW_);}
      return sub_fmt_dZ_(conv_d2_,i_d1_);}
    /*<<11222: printf.ml 199 2 57>>*/function sub_format_for_printf_eu_
     (conv_d3_)
     {return _dY_
              (sub_format_d6_,
               incomplete_format_d5_,
               bad_conversion_format_d4_,
               conv_d3_);}
    function iter_on_format_args_eK_(fmt_d7_,add_conv_eg_,add_char_eq_)
     {var lim_d8_=fmt_d7_.getLen()-1|0;
      /*<<11162: printf.ml 254 4 10>>*/function scan_fmt_es_(i_d9_)
       {var i_d__=i_d9_;
        a:
        /*<<11162: printf.ml 254 4 10>>*/for(;;)
         {if(i_d__<lim_d8_)
           {if(37===fmt_d7_.safeGet(i_d__))
             {var skip_d$_=0,i_ea_=i_d__+1|0;
              for(;;)
               {if(lim_d8_<i_ea_)
                 var _eb_=incomplete_format_d5_(fmt_d7_);
                else
                 {var _ec_=fmt_d7_.safeGet(i_ea_);
                  if(58<=_ec_)
                   {if(95===_ec_)
                     {var _ee_=i_ea_+1|0,_ed_=1,skip_d$_=_ed_,i_ea_=_ee_;
                      continue;}}
                  else
                   if(32<=_ec_)
                    switch(_ec_-32|0)
                     {case 1:
                      case 2:
                      case 4:
                      case 5:
                      case 6:
                      case 7:
                      case 8:
                      case 9:
                      case 12:
                      case 15:break;
                      case 0:
                      case 3:
                      case 11:
                      case 13:var _ef_=i_ea_+1|0,i_ea_=_ef_;continue;
                      case 10:
                       var _eh_=_dY_(add_conv_eg_,skip_d$_,i_ea_,105),i_ea_=_eh_;
                       continue;
                      default:var _ei_=i_ea_+1|0,i_ea_=_ei_;continue;}
                  var i_ej_=i_ea_;
                  c:
                  for(;;)
                   {if(lim_d8_<i_ej_)
                     var _ek_=incomplete_format_d5_(fmt_d7_);
                    else
                     {var _el_=fmt_d7_.safeGet(i_ej_);
                      if(126<=_el_)
                       var _em_=0;
                      else
                       switch(_el_)
                        {case 78:
                         case 88:
                         case 100:
                         case 105:
                         case 111:
                         case 117:
                         case 120:
                          var _ek_=_dY_(add_conv_eg_,skip_d$_,i_ej_,105),_em_=1;break;
                         case 69:
                         case 70:
                         case 71:
                         case 101:
                         case 102:
                         case 103:
                          var _ek_=_dY_(add_conv_eg_,skip_d$_,i_ej_,102),_em_=1;break;
                         case 33:
                         case 37:
                         case 44:
                         case 64:var _ek_=i_ej_+1|0,_em_=1;break;
                         case 83:
                         case 91:
                         case 115:
                          var _ek_=_dY_(add_conv_eg_,skip_d$_,i_ej_,115),_em_=1;break;
                         case 97:
                         case 114:
                         case 116:
                          var _ek_=_dY_(add_conv_eg_,skip_d$_,i_ej_,_el_),_em_=1;
                          break;
                         case 76:
                         case 108:
                         case 110:
                          var j_en_=i_ej_+1|0;
                          if(lim_d8_<j_en_)
                           {var _ek_=_dY_(add_conv_eg_,skip_d$_,i_ej_,105),_em_=1;}
                          else
                           {var _eo_=fmt_d7_.safeGet(j_en_)-88|0;
                            if(_eo_<0||32<_eo_)
                             var _ep_=1;
                            else
                             switch(_eo_)
                              {case 0:
                               case 12:
                               case 17:
                               case 23:
                               case 29:
                               case 32:
                                var
                                 _ek_=
                                  _er_
                                   (add_char_eq_,_dY_(add_conv_eg_,skip_d$_,i_ej_,_el_),105),
                                 _em_=1,
                                 _ep_=0;
                                break;
                               default:var _ep_=1;}
                            if(_ep_)
                             {var _ek_=_dY_(add_conv_eg_,skip_d$_,i_ej_,105),_em_=1;}}
                          break;
                         case 67:
                         case 99:
                          var _ek_=_dY_(add_conv_eg_,skip_d$_,i_ej_,99),_em_=1;break;
                         case 66:
                         case 98:
                          var _ek_=_dY_(add_conv_eg_,skip_d$_,i_ej_,66),_em_=1;break;
                         case 41:
                         case 125:
                          var _ek_=_dY_(add_conv_eg_,skip_d$_,i_ej_,_el_),_em_=1;
                          break;
                         case 40:
                          var
                           _ek_=scan_fmt_es_(_dY_(add_conv_eg_,skip_d$_,i_ej_,_el_)),
                           _em_=1;
                          break;
                         case 123:
                          var
                           i_et_=_dY_(add_conv_eg_,skip_d$_,i_ej_,_el_),
                           j_ev_=_dY_(sub_format_for_printf_eu_,_el_,fmt_d7_,i_et_),
                           i_ew_=i_et_;
                          /*<<10784: printf.ml 240 8 63>>*/for(;;)
                           {if(i_ew_<(j_ev_-2|0))
                             {var
                               _ex_=_er_(add_char_eq_,i_ew_,fmt_d7_.safeGet(i_ew_)),
                               i_ew_=_ex_;
                              continue;}
                            var _ey_=j_ev_-1|0,i_ej_=_ey_;
                            continue c;}
                         default:var _em_=0;}
                      if(!_em_)
                       var _ek_=bad_conversion_format_d4_(fmt_d7_,i_ej_,_el_);}
                    var _eb_=_ek_;
                    break;}}
                var i_d__=_eb_;
                continue a;}}
            var _ez_=i_d__+1|0,i_d__=_ez_;
            continue;}
          return i_d__;}}
      scan_fmt_es_(0);
      return 0;}
    /*<<10497: printf.ml 310 2 12>>*/function
     count_printing_arguments_of_format_gJ_
     (fmt_eL_)
     {var ac_eA_=[0,0,0,0];
      function add_conv_eJ_(skip_eF_,i_eG_,c_eB_)
       {var _eC_=41!==c_eB_?1:0,_eD_=_eC_?125!==c_eB_?1:0:_eC_;
        if(_eD_)
         {var inc_eE_=97===c_eB_?2:1;
          if(114===c_eB_)
           /*<<10553: printf.ml 295 20 48>>*/ac_eA_[3]=ac_eA_[3]+1|0;
          if(skip_eF_)
           /*<<10562: printf.ml 297 9 39>>*/ac_eA_[2]=ac_eA_[2]+inc_eE_|0;
          else
           /*<<10570: printf.ml 298 9 39>>*/ac_eA_[1]=ac_eA_[1]+inc_eE_|0;}
        return i_eG_+1|0;}
      /*<<10578: printf.ml 292 2 4>>*/iter_on_format_args_eK_
       (fmt_eL_,add_conv_eJ_,function(i_eH_,param_eI_){return i_eH_+1|0;});
      return ac_eA_[1];}
    function scan_positional_spec_fq_(fmt_eM_,got_spec_eP_,i_eN_)
     {var _eO_=fmt_eM_.safeGet(i_eN_);
      if((_eO_-48|0)<0||9<(_eO_-48|0))return _er_(got_spec_eP_,0,i_eN_);
      var accu_eQ_=_eO_-48|0,j_eR_=i_eN_+1|0;
      for(;;)
       {var _eS_=fmt_eM_.safeGet(j_eR_);
        if(48<=_eS_)
         {if(!(58<=_eS_))
           {var
             _eV_=j_eR_+1|0,
             _eU_=(10*accu_eQ_|0)+(_eS_-48|0)|0,
             accu_eQ_=_eU_,
             j_eR_=_eV_;
            continue;}
          var _eT_=0;}
        else
         if(36===_eS_)
          if(0===accu_eQ_)
           {var _eW_=_m_(_bF_),_eT_=1;}
          else
           {var
             _eW_=
              _er_(got_spec_eP_,[0,index_of_int_cZ_(accu_eQ_-1|0)],j_eR_+1|0),
             _eT_=1;}
         else
          var _eT_=0;
        if(!_eT_)var _eW_=_er_(got_spec_eP_,0,i_eN_);
        return _eW_;}}
    function next_index_fl_(spec_eX_,n_eY_)
     {return spec_eX_?n_eY_:_c1_(_c2_,n_eY_);}
    function get_index_fa_(spec_eZ_,n_e0_){return spec_eZ_?spec_eZ_[1]:n_e0_;}
    function _h$_
     (to_s_g4_,get_out_e2_,outc_he_,outs_e5_,flush_gO_,k_hk_,fmt_e1_)
     {var out_e3_=_c1_(get_out_e2_,fmt_e1_);
      /*<<8830: printf.ml 615 15 25>>*/function outs_g5_(s_e4_)
       {return _er_(outs_e5_,out_e3_,s_e4_);}
      function pr_gN_(k_e__,n_hj_,fmt_e6_,v_fd_)
       {var len_e9_=fmt_e6_.getLen();
        function doprn_gK_(n_hb_,i_e7_)
         {var i_e8_=i_e7_;
          for(;;)
           {if(len_e9_<=i_e8_)return _c1_(k_e__,out_e3_);
            var _e$_=fmt_e6_.safeGet(i_e8_);
            if(37===_e$_)
             {var
               get_arg_fh_=
                function(spec_fc_,n_fb_)
                 {return caml_array_get(v_fd_,get_index_fa_(spec_fc_,n_fb_));},
               scan_flags_fn_=
                function(spec_fp_,n_fi_,widths_fk_,i_fe_)
                 {var i_ff_=i_fe_;
                  for(;;)
                   {var _fg_=fmt_e6_.safeGet(i_ff_)-32|0;
                    if(!(_fg_<0||25<_fg_))
                     switch(_fg_)
                      {case 1:
                       case 2:
                       case 4:
                       case 5:
                       case 6:
                       case 7:
                       case 8:
                       case 9:
                       case 12:
                       case 15:break;
                       case 10:
                        return scan_positional_spec_fq_
                                (fmt_e6_,
                                 function(wspec_fj_,i_fo_)
                                  {var _fm_=[0,get_arg_fh_(wspec_fj_,n_fi_),widths_fk_];
                                   return scan_flags_fn_
                                           (spec_fp_,next_index_fl_(wspec_fj_,n_fi_),_fm_,i_fo_);},
                                 i_ff_+1|0);
                       default:var _fr_=i_ff_+1|0,i_ff_=_fr_;continue;}
                    var _fs_=fmt_e6_.safeGet(i_ff_);
                    if(124<=_fs_)
                     var _ft_=0;
                    else
                     switch(_fs_)
                      {case 78:
                       case 88:
                       case 100:
                       case 105:
                       case 111:
                       case 117:
                       case 120:
                        var
                         x_fv_=get_arg_fh_(spec_fp_,n_fi_),
                         s_fw_=
                          caml_format_int
                           (extract_format_int_fu_(_fs_,fmt_e6_,i_e8_,i_ff_,widths_fk_),
                            x_fv_),
                         _fy_=
                          cont_s_fx_(next_index_fl_(spec_fp_,n_fi_),s_fw_,i_ff_+1|0),
                         _ft_=1;
                        break;
                       case 69:
                       case 71:
                       case 101:
                       case 102:
                       case 103:
                        var
                         x_fz_=get_arg_fh_(spec_fp_,n_fi_),
                         s_fA_=
                          caml_format_float
                           (extract_format_dA_(fmt_e6_,i_e8_,i_ff_,widths_fk_),x_fz_),
                         _fy_=
                          cont_s_fx_(next_index_fl_(spec_fp_,n_fi_),s_fA_,i_ff_+1|0),
                         _ft_=1;
                        break;
                       case 76:
                       case 108:
                       case 110:
                        var _fB_=fmt_e6_.safeGet(i_ff_+1|0)-88|0;
                        if(_fB_<0||32<_fB_)
                         var _fC_=1;
                        else
                         switch(_fB_)
                          {case 0:
                           case 12:
                           case 17:
                           case 23:
                           case 29:
                           case 32:
                            var i_fD_=i_ff_+1|0,_fE_=_fs_-108|0;
                            if(_fE_<0||2<_fE_)
                             var _fF_=0;
                            else
                             {switch(_fE_)
                               {case 1:var _fF_=0,_fG_=0;break;
                                case 2:
                                 var
                                  x_fH_=get_arg_fh_(spec_fp_,n_fi_),
                                  _fI_=
                                   caml_format_int
                                    (extract_format_dA_(fmt_e6_,i_e8_,i_fD_,widths_fk_),x_fH_),
                                  _fG_=1;
                                 break;
                                default:
                                 var
                                  x_fJ_=get_arg_fh_(spec_fp_,n_fi_),
                                  _fI_=
                                   caml_format_int
                                    (extract_format_dA_(fmt_e6_,i_e8_,i_fD_,widths_fk_),x_fJ_),
                                  _fG_=1;}
                              if(_fG_){var s_fK_=_fI_,_fF_=1;}}
                            if(!_fF_)
                             {var
                               x_fL_=get_arg_fh_(spec_fp_,n_fi_),
                               s_fK_=
                                caml_int64_format
                                 (extract_format_dA_(fmt_e6_,i_e8_,i_fD_,widths_fk_),x_fL_);}
                            var
                             _fy_=
                              cont_s_fx_(next_index_fl_(spec_fp_,n_fi_),s_fK_,i_fD_+1|0),
                             _ft_=1,
                             _fC_=0;
                            break;
                           default:var _fC_=1;}
                        if(_fC_)
                         {var
                           x_fM_=get_arg_fh_(spec_fp_,n_fi_),
                           s_fN_=
                            caml_format_int
                             (extract_format_int_fu_(110,fmt_e6_,i_e8_,i_ff_,widths_fk_),
                              x_fM_),
                           _fy_=
                            cont_s_fx_(next_index_fl_(spec_fp_,n_fi_),s_fN_,i_ff_+1|0),
                           _ft_=1;}
                        break;
                       case 37:
                       case 64:
                        var _fy_=cont_s_fx_(n_fi_,_cw_(1,_fs_),i_ff_+1|0),_ft_=1;
                        break;
                       case 83:
                       case 115:
                        var x_fO_=get_arg_fh_(spec_fp_,n_fi_);
                        if(115===_fs_)
                         var x_fP_=x_fO_;
                        else
                         {var n_fQ_=[0,0],_fR_=0,_fS_=x_fO_.getLen()-1|0;
                          if(!(_fS_<_fR_))
                           {var i_fT_=_fR_;
                            for(;;)
                             {var
                               _fU_=x_fO_.safeGet(i_fT_),
                               _fV_=
                                14<=_fU_
                                 ?34===_fU_?1:92===_fU_?1:0
                                 :11<=_fU_?13<=_fU_?1:0:8<=_fU_?1:0,
                               _fW_=_fV_?2:caml_is_printable(_fU_)?1:4;
                              n_fQ_[1]=n_fQ_[1]+_fW_|0;
                              var _fX_=i_fT_+1|0;
                              if(_fS_!==i_fT_){var i_fT_=_fX_;continue;}
                              break;}}
                          if(n_fQ_[1]===x_fO_.getLen())
                           var _fY_=x_fO_;
                          else
                           {var s__fZ_=caml_create_string(n_fQ_[1]);
                            /*<<5987: string.ml 115 33 9>>*/n_fQ_[1]=0;
                            var _f0_=0,_f1_=x_fO_.getLen()-1|0;
                            if(!(_f1_<_f0_))
                             {var i_f2_=_f0_;
                              for(;;)
                               {var _f3_=x_fO_.safeGet(i_f2_),_f4_=_f3_-34|0;
                                if(_f4_<0||58<_f4_)
                                 if(-20<=_f4_)
                                  var _f5_=1;
                                 else
                                  {switch(_f4_+34|0)
                                    {case 8:
                                      /*<<6079: string.ml 130 16 67>>*/s__fZ_.safeSet(n_fQ_[1],92);
                                      /*<<6079: string.ml 130 16 67>>*/n_fQ_[1]+=1;
                                      /*<<6079: string.ml 130 16 67>>*/s__fZ_.safeSet(n_fQ_[1],98);
                                      var _f6_=1;
                                      break;
                                     case 9:
                                      /*<<6096: string.ml 126 16 67>>*/s__fZ_.safeSet(n_fQ_[1],92);
                                      /*<<6096: string.ml 126 16 67>>*/n_fQ_[1]+=1;
                                      /*<<6096: string.ml 126 16 67>>*/s__fZ_.safeSet
                                       (n_fQ_[1],116);
                                      var _f6_=1;
                                      break;
                                     case 10:
                                      /*<<6113: string.ml 124 16 67>>*/s__fZ_.safeSet(n_fQ_[1],92);
                                      /*<<6113: string.ml 124 16 67>>*/n_fQ_[1]+=1;
                                      /*<<6113: string.ml 124 16 67>>*/s__fZ_.safeSet
                                       (n_fQ_[1],110);
                                      var _f6_=1;
                                      break;
                                     case 13:
                                      /*<<6130: string.ml 128 16 67>>*/s__fZ_.safeSet(n_fQ_[1],92);
                                      /*<<6130: string.ml 128 16 67>>*/n_fQ_[1]+=1;
                                      /*<<6130: string.ml 128 16 67>>*/s__fZ_.safeSet
                                       (n_fQ_[1],114);
                                      var _f6_=1;
                                      break;
                                     default:var _f5_=1,_f6_=0;}
                                   if(_f6_)var _f5_=0;}
                                else
                                 var
                                  _f5_=
                                   (_f4_-1|0)<0||56<(_f4_-1|0)
                                    ?(s__fZ_.safeSet(n_fQ_[1],92),
                                      n_fQ_[1]+=
                                      1,
                                      s__fZ_.safeSet(n_fQ_[1],_f3_),
                                      0)
                                    :1;
                                if(_f5_)
                                 if(caml_is_printable(_f3_))
                                  /*<<6159: string.ml 133 18 36>>*/s__fZ_.safeSet
                                   (n_fQ_[1],_f3_);
                                 else
                                  {/*<<6166: string.ml 134 21 19>>*/s__fZ_.safeSet
                                    (n_fQ_[1],92);
                                   /*<<6166: string.ml 134 21 19>>*/n_fQ_[1]+=1;
                                   /*<<6166: string.ml 134 21 19>>*/s__fZ_.safeSet
                                    (n_fQ_[1],48+(_f3_/100|0)|0);
                                   /*<<6166: string.ml 134 21 19>>*/n_fQ_[1]+=1;
                                   /*<<6166: string.ml 134 21 19>>*/s__fZ_.safeSet
                                    (n_fQ_[1],48+((_f3_/10|0)%10|0)|0);
                                   /*<<6166: string.ml 134 21 19>>*/n_fQ_[1]+=1;
                                   /*<<6166: string.ml 134 21 19>>*/s__fZ_.safeSet
                                    (n_fQ_[1],48+(_f3_%10|0)|0);}
                                n_fQ_[1]+=1;
                                var _f7_=i_f2_+1|0;
                                if(_f1_!==i_f2_){var i_f2_=_f7_;continue;}
                                break;}}
                            var _fY_=s__fZ_;}
                          var x_fP_=_cg_(_bM_,_cg_(_fY_,_bN_));}
                        if(i_ff_===(i_e8_+1|0))
                         var s_f8_=x_fP_;
                        else
                         {var
                           _f9_=
                            extract_format_dA_(fmt_e6_,i_e8_,i_ff_,widths_fk_);
                          /*<<11812: printf.ml 83 2 42>>*/try
                           {var neg_f__=0,i_f$_=1;
                            for(;;)
                             {if(_f9_.getLen()<=i_f$_)
                               var _ga_=[0,0,neg_f__];
                              else
                               {var _gb_=_f9_.safeGet(i_f$_);
                                if(49<=_gb_)
                                 if(58<=_gb_)
                                  var _gc_=0;
                                 else
                                  {var
                                    _ga_=
                                     [0,
                                      caml_int_of_string
                                       (_cx_(_f9_,i_f$_,(_f9_.getLen()-i_f$_|0)-1|0)),
                                      neg_f__],
                                    _gc_=1;}
                                else
                                 {if(45===_gb_)
                                   {var _ge_=i_f$_+1|0,_gd_=1,neg_f__=_gd_,i_f$_=_ge_;
                                    continue;}
                                  var _gc_=0;}
                                if(!_gc_){var _gf_=i_f$_+1|0,i_f$_=_gf_;continue;}}
                              var match_gg_=_ga_;
                              break;}}
                          catch(_gh_)
                           {if(_gh_[1]!==_a_)throw _gh_;
                            var match_gg_=bad_conversion_c$_(_f9_,0,115);}
                          var
                           p_gi_=match_gg_[1],
                           _gj_=x_fP_.getLen(),
                           _gk_=0,
                           neg_go_=match_gg_[2],
                           _gn_=32;
                          if(p_gi_===_gj_&&0===_gk_)
                           {var _gl_=x_fP_,_gm_=1;}
                          else
                           var _gm_=0;
                          if(!_gm_)
                           if(p_gi_<=_gj_)
                            var _gl_=_cx_(x_fP_,_gk_,_gj_);
                           else
                            {var res_gp_=_cw_(p_gi_,_gn_);
                             if(neg_go_)
                              /*<<11709: printf.ml 105 7 32>>*/_cy_
                               (x_fP_,_gk_,res_gp_,0,_gj_);
                             else
                              /*<<11726: printf.ml 106 7 40>>*/_cy_
                               (x_fP_,_gk_,res_gp_,p_gi_-_gj_|0,_gj_);
                             var _gl_=res_gp_;}
                          var s_f8_=_gl_;}
                        var
                         _fy_=
                          cont_s_fx_(next_index_fl_(spec_fp_,n_fi_),s_f8_,i_ff_+1|0),
                         _ft_=1;
                        break;
                       case 67:
                       case 99:
                        var x_gq_=get_arg_fh_(spec_fp_,n_fi_);
                        if(99===_fs_)
                         var s_gr_=_cw_(1,x_gq_);
                        else
                         {if(39===x_gq_)
                           var _gs_=_bU_;
                          else
                           if(92===x_gq_)
                            var _gs_=_bV_;
                           else
                            {if(14<=x_gq_)
                              var _gt_=0;
                             else
                              switch(x_gq_)
                               {case 8:var _gs_=_bZ_,_gt_=1;break;
                                case 9:var _gs_=_bY_,_gt_=1;break;
                                case 10:var _gs_=_bX_,_gt_=1;break;
                                case 13:var _gs_=_bW_,_gt_=1;break;
                                default:var _gt_=0;}
                             if(!_gt_)
                              if(caml_is_printable(x_gq_))
                               {var s_gu_=caml_create_string(1);
                                /*<<5422: char.ml 37 27 7>>*/s_gu_.safeSet(0,x_gq_);
                                var _gs_=s_gu_;}
                              else
                               {var s_gv_=caml_create_string(4);
                                /*<<5432: char.ml 41 13 7>>*/s_gv_.safeSet(0,92);
                                /*<<5432: char.ml 41 13 7>>*/s_gv_.safeSet
                                 (1,48+(x_gq_/100|0)|0);
                                /*<<5432: char.ml 41 13 7>>*/s_gv_.safeSet
                                 (2,48+((x_gq_/10|0)%10|0)|0);
                                /*<<5432: char.ml 41 13 7>>*/s_gv_.safeSet
                                 (3,48+(x_gq_%10|0)|0);
                                var _gs_=s_gv_;}}
                          var s_gr_=_cg_(_bK_,_cg_(_gs_,_bL_));}
                        var
                         _fy_=
                          cont_s_fx_(next_index_fl_(spec_fp_,n_fi_),s_gr_,i_ff_+1|0),
                         _ft_=1;
                        break;
                       case 66:
                       case 98:
                        var
                         _gx_=i_ff_+1|0,
                         _gw_=get_arg_fh_(spec_fp_,n_fi_)?_b2_:_b1_,
                         _fy_=cont_s_fx_(next_index_fl_(spec_fp_,n_fi_),_gw_,_gx_),
                         _ft_=1;
                        break;
                       case 40:
                       case 123:
                        var
                         xf_gy_=get_arg_fh_(spec_fp_,n_fi_),
                         i_gz_=_dY_(sub_format_for_printf_eu_,_fs_,fmt_e6_,i_ff_+1|0);
                        if(123===_fs_)
                         {var
                           b_gA_=_cS_(xf_gy_.getLen()),
                           add_char_gE_=
                            function(i_gC_,c_gB_){_cU_(b_gA_,c_gB_);return i_gC_+1|0;};
                          /*<<10644: printf.ml 268 2 19>>*/iter_on_format_args_eK_
                           (xf_gy_,
                            function(skip_gD_,i_gG_,c_gF_)
                             {if(skip_gD_)
                               /*<<10609: printf.ml 272 17 41>>*/_cV_(b_gA_,_bE_);
                              else
                               /*<<10618: printf.ml 272 47 68>>*/_cU_(b_gA_,37);
                              return add_char_gE_(i_gG_,c_gF_);},
                            add_char_gE_);
                          var
                           _gH_=_cT_(b_gA_),
                           _fy_=cont_s_fx_(next_index_fl_(spec_fp_,n_fi_),_gH_,i_gz_),
                           _ft_=1;}
                        else
                         {var
                           _gI_=next_index_fl_(spec_fp_,n_fi_),
                           m_gL_=
                            add_int_index_c0_
                             (count_printing_arguments_of_format_gJ_(xf_gy_),_gI_),
                           _fy_=
                            pr_gN_
                             (/*<<8760: printf.ml 647 30 39>>*/function(param_gM_)
                               {return doprn_gK_(m_gL_,i_gz_);},
                              _gI_,
                              xf_gy_,
                              v_fd_),
                           _ft_=1;}
                        break;
                       case 33:
                        _c1_(flush_gO_,out_e3_);
                        var _fy_=doprn_gK_(n_fi_,i_ff_+1|0),_ft_=1;
                        break;
                       case 41:
                        var _fy_=cont_s_fx_(n_fi_,_bQ_,i_ff_+1|0),_ft_=1;break;
                       case 44:
                        var _fy_=cont_s_fx_(n_fi_,_bP_,i_ff_+1|0),_ft_=1;break;
                       case 70:
                        var x_gP_=get_arg_fh_(spec_fp_,n_fi_);
                        if(0===widths_fk_)
                         var _gQ_=_bO_;
                        else
                         {var
                           sfmt_gR_=
                            extract_format_dA_(fmt_e6_,i_e8_,i_ff_,widths_fk_);
                          if(70===_fs_)
                           /*<<11427: printf.ml 164 4 8>>*/sfmt_gR_.safeSet
                            (sfmt_gR_.getLen()-1|0,103);
                          var _gQ_=sfmt_gR_;}
                        var _gS_=caml_classify_float(x_gP_);
                        if(3===_gS_)
                         var s_gT_=x_gP_<0?_bI_:_bH_;
                        else
                         if(4<=_gS_)
                          var s_gT_=_bJ_;
                         else
                          {var
                            _gU_=caml_format_float(_gQ_,x_gP_),
                            i_gV_=0,
                            l_gW_=_gU_.getLen();
                           /*<<9936: printf.ml 448 6 37>>*/for(;;)
                            {if(l_gW_<=i_gV_)
                              var _gX_=_cg_(_gU_,_bG_);
                             else
                              {var
                                _gY_=_gU_.safeGet(i_gV_)-46|0,
                                _gZ_=
                                 _gY_<0||23<_gY_
                                  ?55===_gY_?1:0
                                  :(_gY_-1|0)<0||21<(_gY_-1|0)?1:0;
                               if(!_gZ_){var _g0_=i_gV_+1|0,i_gV_=_g0_;continue;}
                               var _gX_=_gU_;}
                             var s_gT_=_gX_;
                             break;}}
                        var
                         _fy_=
                          cont_s_fx_(next_index_fl_(spec_fp_,n_fi_),s_gT_,i_ff_+1|0),
                         _ft_=1;
                        break;
                       case 91:
                        var
                         _fy_=bad_conversion_format_d4_(fmt_e6_,i_ff_,_fs_),
                         _ft_=1;
                        break;
                       case 97:
                        var
                         printer_g1_=get_arg_fh_(spec_fp_,n_fi_),
                         n_g2_=_c1_(_c2_,get_index_fa_(spec_fp_,n_fi_)),
                         arg_g3_=get_arg_fh_(0,n_g2_),
                         _g7_=i_ff_+1|0,
                         _g6_=next_index_fl_(spec_fp_,n_g2_);
                        if(to_s_g4_)
                         /*<<8701: printf.ml 631 8 63>>*/outs_g5_
                          (_er_(printer_g1_,0,arg_g3_));
                        else
                         /*<<8710: printf.ml 633 8 23>>*/_er_
                          (printer_g1_,out_e3_,arg_g3_);
                        var _fy_=doprn_gK_(_g6_,_g7_),_ft_=1;
                        break;
                       case 114:
                        var
                         _fy_=bad_conversion_format_d4_(fmt_e6_,i_ff_,_fs_),
                         _ft_=1;
                        break;
                       case 116:
                        var
                         printer_g8_=get_arg_fh_(spec_fp_,n_fi_),
                         _g__=i_ff_+1|0,
                         _g9_=next_index_fl_(spec_fp_,n_fi_);
                        if(to_s_g4_)
                         /*<<8728: printf.ml 637 8 54>>*/outs_g5_
                          (_c1_(printer_g8_,0));
                        else
                         /*<<8736: printf.ml 639 8 19>>*/_c1_(printer_g8_,out_e3_);
                        var _fy_=doprn_gK_(_g9_,_g__),_ft_=1;
                        break;
                       default:var _ft_=0;}
                    if(!_ft_)
                     var _fy_=bad_conversion_format_d4_(fmt_e6_,i_ff_,_fs_);
                    return _fy_;}},
               _hd_=i_e8_+1|0,
               _ha_=0;
              return scan_positional_spec_fq_
                      (fmt_e6_,
                       function(spec_hc_,i_g$_)
                        {return scan_flags_fn_(spec_hc_,n_hb_,_ha_,i_g$_);},
                       _hd_);}
            /*<<8835: printf.ml 614 15 25>>*/_er_(outc_he_,out_e3_,_e$_);
            var _hf_=i_e8_+1|0,i_e8_=_hf_;
            continue;}}
        function cont_s_fx_(n_hi_,s_hg_,i_hh_)
         {outs_g5_(s_hg_);return doprn_gK_(n_hi_,i_hh_);}
        return doprn_gK_(n_hj_,0);}
      var
       kpr_hl_=_er_(pr_gN_,k_hk_,index_of_int_cZ_(0)),
       _hm_=count_printing_arguments_of_format_gJ_(fmt_e1_);
      if(_hm_<0||6<_hm_)
       {var
         loop_hz_=
          function(i_hn_,args_ht_)
           {if(_hm_<=i_hn_)
             {var
               a_ho_=caml_make_vect(_hm_,0),
               _hr_=
                function(i_hp_,arg_hq_)
                 {return caml_array_set(a_ho_,(_hm_-i_hp_|0)-1|0,arg_hq_);},
               i_hs_=0,
               param_hu_=args_ht_;
              for(;;)
               {if(param_hu_)
                 {var _hv_=param_hu_[2],_hw_=param_hu_[1];
                  if(_hv_)
                   {_hr_(i_hs_,_hw_);
                    var _hx_=i_hs_+1|0,i_hs_=_hx_,param_hu_=_hv_;
                    continue;}
                  /*<<10476: printf.ml 318 11 16>>*/_hr_(i_hs_,_hw_);}
                return _er_(kpr_hl_,fmt_e1_,a_ho_);}}
            /*<<10312: printf.ml 363 31 56>>*/return function(x_hy_)
             {return loop_hz_(i_hn_+1|0,[0,x_hy_,args_ht_]);};},
         _hA_=loop_hz_(0,0);}
      else
       switch(_hm_)
        {case 1:
          var
           _hA_=
            /*<<10298: printf.ml 331 6 15>>*/function(x_hC_)
             {var a_hB_=caml_make_vect(1,0);
              /*<<10298: printf.ml 331 6 15>>*/caml_array_set(a_hB_,0,x_hC_);
              return _er_(kpr_hl_,fmt_e1_,a_hB_);};
          break;
         case 2:
          var
           _hA_=
            function(x_hE_,y_hF_)
             {var a_hD_=caml_make_vect(2,0);
              caml_array_set(a_hD_,0,x_hE_);
              caml_array_set(a_hD_,1,y_hF_);
              return _er_(kpr_hl_,fmt_e1_,a_hD_);};
          break;
         case 3:
          var
           _hA_=
            function(x_hH_,y_hI_,z_hJ_)
             {var a_hG_=caml_make_vect(3,0);
              caml_array_set(a_hG_,0,x_hH_);
              caml_array_set(a_hG_,1,y_hI_);
              caml_array_set(a_hG_,2,z_hJ_);
              return _er_(kpr_hl_,fmt_e1_,a_hG_);};
          break;
         case 4:
          var
           _hA_=
            function(x_hL_,y_hM_,z_hN_,t_hO_)
             {var a_hK_=caml_make_vect(4,0);
              caml_array_set(a_hK_,0,x_hL_);
              caml_array_set(a_hK_,1,y_hM_);
              caml_array_set(a_hK_,2,z_hN_);
              caml_array_set(a_hK_,3,t_hO_);
              return _er_(kpr_hl_,fmt_e1_,a_hK_);};
          break;
         case 5:
          var
           _hA_=
            function(x_hQ_,y_hR_,z_hS_,t_hT_,u_hU_)
             {var a_hP_=caml_make_vect(5,0);
              caml_array_set(a_hP_,0,x_hQ_);
              caml_array_set(a_hP_,1,y_hR_);
              caml_array_set(a_hP_,2,z_hS_);
              caml_array_set(a_hP_,3,t_hT_);
              caml_array_set(a_hP_,4,u_hU_);
              return _er_(kpr_hl_,fmt_e1_,a_hP_);};
          break;
         case 6:
          var
           _hA_=
            function(x_hW_,y_hX_,z_hY_,t_hZ_,u_h0_,v_h1_)
             {var a_hV_=caml_make_vect(6,0);
              caml_array_set(a_hV_,0,x_hW_);
              caml_array_set(a_hV_,1,y_hX_);
              caml_array_set(a_hV_,2,z_hY_);
              caml_array_set(a_hV_,3,t_hZ_);
              caml_array_set(a_hV_,4,u_h0_);
              caml_array_set(a_hV_,5,v_h1_);
              return _er_(kpr_hl_,fmt_e1_,a_hV_);};
          break;
         default:var _hA_=_er_(kpr_hl_,fmt_e1_,[0]);}
      return _hA_;}
    /*<<8494: printf.ml 678 2 19>>*/function _h__(fmt_h2_)
     {return _cS_(2*fmt_h2_.getLen()|0);}
    function _h7_(k_h5_,b_h3_)
     {var s_h4_=_cT_(b_h3_);
      /*<<8139: buffer.ml 56 14 29>>*/b_h3_[2]=0;
      return _c1_(k_h5_,s_h4_);}
    /*<<8453: printf.ml 691 2 78>>*/function _id_(k_h6_)
     {var _h9_=_c1_(_h7_,k_h6_);
      return _ia_(_h$_,1,_h__,_cU_,_cV_,function(_h8_){return 0;},_h9_);}
    /*<<8441: printf.ml 694 18 43>>*/function _ie_(fmt_ic_)
     {return _er_
              (_id_,
               /*<<8438: printf.ml 694 37 38>>*/function(s_ib_){return s_ib_;},
               fmt_ic_);}
    var
     _if_=[0,0],
     null_ig_=null,
     array_constructor_ii_=Array,
     date_constr_ij_=Date;
    /*<<13052: js.ml 376 7 77>>*/function _ik_(e_ih_)
     {return e_ih_ instanceof array_constructor_ii_
              ?0
              :[0,new MlWrappedString(e_ih_.toString())];}
    /*<<12349: printexc.ml 167 2 29>>*/_if_[1]=[0,_ik_,_if_[1]];
    function _ir_(f_im_,param_il_)
     {var x_in_=param_il_[1],_io_=_c1_(f_im_,param_il_[2]);
      return [0,_c1_(f_im_,x_in_),_io_];}
    /*<<15632: src/option.ml 23 16 15>>*/function _iq_(param_ip_)
     {return param_ip_?param_ip_[1]:_m_(_bv_);}
    function _iP_(arr_is_,f_iv_)
     {var l_it_=arr_is_.length-1;
      if(0===l_it_)
       var _iu_=[0];
      else
       {var
         r_iw_=caml_make_vect(l_it_,_c1_(f_iv_,arr_is_[0+1])),
         _ix_=1,
         _iy_=l_it_-1|0;
        if(!(_iy_<_ix_))
         {var i_iz_=_ix_;
          for(;;)
           {r_iw_[i_iz_+1]=_c1_(f_iv_,arr_is_[i_iz_+1]);
            var _iA_=i_iz_+1|0;
            if(_iy_!==i_iz_){var i_iz_=_iA_;continue;}
            break;}}
        var _iu_=r_iw_;}
      return _iu_;}
    function _iQ_(arr_iC_,f_iF_)
     {var _iB_=0,_iD_=arr_iC_.length-1-1|0;
      if(!(_iD_<_iB_))
       {var i_iE_=_iB_;
        for(;;)
         {_c1_(f_iF_,arr_iC_[i_iE_+1]);
          var _iG_=i_iE_+1|0;
          if(_iD_!==i_iE_){var i_iE_=_iG_;continue;}
          break;}}
      return 0;}
    function _iR_(n_iH_,f_iJ_)
     {if(0===n_iH_)
       var _iI_=[0];
      else
       {var res_iK_=caml_make_vect(n_iH_,_c1_(f_iJ_,0)),_iL_=1,_iM_=n_iH_-1|0;
        if(!(_iM_<_iL_))
         {var i_iN_=_iL_;
          for(;;)
           {res_iK_[i_iN_+1]=_c1_(f_iJ_,i_iN_);
            var _iO_=i_iN_+1|0;
            if(_iM_!==i_iN_){var i_iN_=_iO_;continue;}
            break;}}
        var _iI_=res_iK_;}
      return _iI_;}
    ({}.iter=caml_js_eval_string(_bu_));
    function _iV_(_opt__iS_,ts_iU_)
     {var sep_iT_=_opt__iS_?_opt__iS_[1]:_bt_;
      return new
              MlWrappedString
              (caml_js_from_array(ts_iU_).join(sep_iT_.toString()));}
    var
     _iW_=caml_js_eval_string(_br_),
     _i5_={"iter":caml_js_eval_string(_bq_),"fold":_iW_};
    /*<<17769: src/inttbl.ml 18 16 34>>*/function _i$_(param_iX_){return {};}
    function _ja_(t_iY_,key_iZ_,data_i0_){return t_iY_[key_iZ_]=data_i0_;}
    function _jb_(t_i1_,k_i2_){return delete t_i1_[k_i2_];}
    function _jc_(t_i3_,k_i4_)
     {return t_i3_.hasOwnProperty(k_i4_)|0?[0,t_i3_[k_i4_]]:0;}
    function _jd_(t_i__,f_i8_)
     {var js_iter_i9_=_i5_[_bs_.toString()];
      return js_iter_i9_
              (t_i__,
               caml_js_wrap_callback
                (function(key_i7_,data_i6_)
                  {return _er_(f_i8_,key_i7_,data_i6_);}));}
    /*<<17981: src/time.ml 3 13 60>>*/function _ji_(param_je_)
     {return new date_constr_ij_().valueOf();}
    function _jj_(_jf_,_jg_){return _jf_-_jg_;}
    /*<<17951: src/time.ml 14 16 17>>*/function _jk_(t_jh_){return t_jh_;}
    /*<<18179: src/core.ml 16 24 73>>*/function string_of_float_jm_(x_jl_)
     {return new MlWrappedString(x_jl_.toString());}
    caml_js_eval_string(_bp_);
    function _jr_(ms_jo_,f_jn_)
     {return setInterval(caml_js_wrap_callback(f_jn_),ms_jo_);}
    function _js_(x_jp_,f_jq_){return _c1_(f_jq_,x_jp_);}
    /*<<19774: src/frp.ml 34 24 26>>*/function _kx_(param_jt_){return 0;}
    /*<<19770: src/frp.ml 36 17 21>>*/function _jv_(t_ju_)
     {return _c1_(t_ju_,0);}
    function _ky_(t1_jw_,t2_jx_,param_jy_){_jv_(t1_jw_);return _jv_(t2_jx_);}
    function _kz_(ts_jz_,param_jA_){return _iQ_(ts_jz_,_jv_);}
    /*<<19745: src/frp.ml 42 15 16>>*/function _jG_(x_jB_){return x_jB_;}
    function iter_jS_(t_jC_,f_jE_)
     {var key_jD_=t_jC_[2];
      t_jC_[2]=key_jD_+1|0;
      _ja_(t_jC_[1],key_jD_,f_jE_);
      return _jG_
              (/*<<19707: src/frp.ml 55 33 62>>*/function(param_jF_)
                {return _jb_(t_jC_[1],key_jD_);});}
    function trigger_jR_(t_jK_,x_jH_)
     {function _jL_(key_jJ_,data_jI_){return _c1_(data_jI_,x_jH_);}
      return _jd_(t_jK_[1],_jL_);}
    /*<<19673: src/frp.ml 63 18 60>>*/function create_jN_(param_jM_)
     {return [0,_i$_(0),0];}
    function map_kA_(t_jT_,f_jQ_)
     {var t__jO_=create_jN_(0);
      iter_jS_
       (t_jT_,
        /*<<19566: src/frp.ml 98 32 48>>*/function(x_jP_)
         {return trigger_jR_(t__jO_,_c1_(f_jQ_,x_jP_));});
      return t__jO_;}
    function _kB_(t_j1_,f_jZ_)
     {var t__jU_=create_jN_(0),last_jV_=[0,0];
      function _j0_(_jW_){return 0;}
      _js_
       (iter_jS_
         (t_j1_,
          /*<<19052: src/frp.ml 198 6 20>>*/function(x_jY_)
           {var _jX_=last_jV_[1];
            if(_jX_)
             /*<<19044: src/frp.ml 198 37 55>>*/trigger_jR_
              (t__jU_,_er_(f_jZ_,_jX_[1],x_jY_));
            last_jV_[1]=[0,x_jY_];
            return 0;}),
        _j0_);
      return t__jU_;}
    /*<<18867: src/frp.ml 245 15 22>>*/function peek_kt_(t_j2_)
     {return t_j2_[2];}
    function add_listener_ke_(t_j3_,f_j4_)
     {t_j3_[1]=[0,f_j4_,t_j3_[1]];return 0;}
    function trigger_kd_(t_j5_,x_j6_)
     {t_j5_[2]=x_j6_;
      var param_j7_=t_j5_[1];
      for(;;)
       {if(param_j7_)
         {var l_j8_=param_j7_[2];
          /*<<18837: src/frp.ml 251 27 36>>*/_c1_(param_j7_[1],t_j5_[2]);
          var param_j7_=l_j8_;
          continue;}
        return 0;}}
    /*<<18810: src/frp.ml 263 20 53>>*/function return_ka_(init_j9_)
     {return [0,0,init_j9_];}
    function map_kC_(t_j__,f_j$_)
     {var t__kb_=return_ka_(_c1_(f_j$_,t_j__[2]));
      add_listener_ke_
       (t_j__,
        /*<<18726: src/frp.ml 272 29 45>>*/function(x_kc_)
         {return trigger_kd_(t__kb_,_c1_(f_j$_,x_kc_));});
      return t__kb_;}
    function zip_with_kD_(t1_kg_,t2_kf_,f_kh_)
     {var t__ki_=return_ka_(_er_(f_kh_,t1_kg_[2],t2_kf_[2]));
      add_listener_ke_
       (t1_kg_,
        /*<<18682: src/frp.ml 278 30 55>>*/function(x_kj_)
         {return trigger_kd_(t__ki_,_er_(f_kh_,x_kj_,t2_kf_[2]));});
      add_listener_ke_
       (t2_kf_,
        /*<<18672: src/frp.ml 279 30 55>>*/function(y_kk_)
         {return trigger_kd_(t__ki_,_er_(f_kh_,t1_kg_[2],y_kk_));});
      return t__ki_;}
    /*<<18444: src/frp.ml 313 4 5>>*/function _kE_(t_km_)
     {var s_kl_=create_jN_(0);
      /*<<18444: src/frp.ml 313 4 5>>*/trigger_jR_(s_kl_,t_km_[2]);
      /*<<18444: src/frp.ml 313 4 5>>*/add_listener_ke_
       (t_km_,_c1_(trigger_jR_,s_kl_));
      return s_kl_;}
    function _kF_(cond_ko_,s_kq_)
     {var s__kn_=create_jN_(0);
      iter_jS_
       (s_kq_,
        /*<<18376: src/frp.ml 331 37 84>>*/function(x_kp_)
         {return cond_ko_[2]?trigger_jR_(s__kn_,x_kp_):0;});
      return s__kn_;}
    function _kG_(s_kw_,init_kr_,f_kv_)
     {var b_ks_=return_ka_(init_kr_);
      iter_jS_
       (s_kw_,
        /*<<18341: src/frp.ml 339 6 48>>*/function(x_ku_)
         {return trigger_kd_(b_ks_,_er_(f_kv_,peek_kt_(b_ks_),x_ku_));});
      return b_ks_;}
    /*<<21147: src/jq.ml 5 29 84>>*/function unsafe_jq_kI_(s_kH_)
     {return jQuery(s_kH_.toString());}
    /*<<21120: src/jq.ml 8 2 15>>*/function jq_lb_(s_kJ_)
     {var t_kK_=unsafe_jq_kI_(s_kJ_);return 0===t_kK_.length?0:[0,t_kK_];}
    /*<<21101: src/jq.ml 14 13 58>>*/function wrap_lc_(elt_kL_)
     {return jQuery(elt_kL_);}
    /*<<21085: src/jq.ml 16 17 44>>*/function create_ld_(tag_kM_)
     {return unsafe_jq_kI_(_cg_(_bd_,_cg_(tag_kM_,_be_)));}
    function append_le_(parent_kN_,child_kO_)
     {return parent_kN_.append(child_kO_);}
    function on_lf_(t_kR_,event_name_kQ_,f_kP_)
     {return t_kR_.on(event_name_kQ_.toString(),caml_js_wrap_callback(f_kP_));}
    function set_attr_lg_(t_kU_,name_kT_,value_kS_)
     {return t_kU_.attr(name_kT_.toString(),value_kS_.toString());}
    function _lh_(t_kY_,name_kW_,value_kV_)
     {var _kX_=peek_kt_(value_kV_).toString();
      t_kY_.setAttribute(name_kW_.toString(),_kX_);
      var name_k0_=name_kW_.toString();
      /*<<20827: src/jq.ml 58 6 7>>*/function _k1_(value_kZ_)
       {return t_kY_.setAttribute(name_k0_,value_kZ_.toString());}
      return iter_jS_(_kE_(value_kV_),_k1_);}
    function _li_(t_k3_,s_k2_){return t_k3_.innerHTML=s_k2_.toString();}
    function _lj_(t_k4_,c_k5_){t_k4_.appendChild(c_k5_);return 0;}
    function _lk_(tag_k8_,attrs_la_)
     {/*<<20630: src/jq.ml 75 16 46>>*/function str_k7_(s_k6_)
       {return s_k6_.toString();}
      var
       _k9_=str_k7_(tag_k8_),
       elt_k__=document.createElementNS(str_k7_(_bf_),_k9_);
      _iQ_
       (attrs_la_,
        /*<<20604: src/jq.ml 81 29 49>>*/function(param_k$_)
         {return elt_k__.setAttribute
                  (param_k$_[1].toString(),param_k$_[2].toString());});
      return elt_k__;}
    var body_ll_=unsafe_jq_kI_(_bc_),mouse_pos_lm_=create_jN_(0);
    on_lf_
     (body_ll_,
      _bb_,
      /*<<20532: src/jq.ml 126 4 28>>*/function(e_ln_)
       {return trigger_jR_
                (mouse_pos_lm_,
                 [0,e_ln_[_bh_.toString()],e_ln_[_bi_.toString()]]);});
    var
     _ly_=
      _kB_
       (mouse_pos_lm_,
        function(param_lp_,_lo_)
         {return [0,_lo_[1]-param_lp_[1]|0,_lo_[2]-param_lp_[2]|0];});
    /*<<20491: src/jq.ml 136 2 3>>*/function _lx_(t_lw_)
     {var s_lq_=create_jN_(0);
      /*<<20491: src/jq.ml 136 2 3>>*/on_lf_
       (t_lw_,
        _bj_,
        /*<<20451: src/jq.ml 138 4 59>>*/function(e_lr_)
         {var
           _ls_=e_lr_[_bk_.toString()],
           _lt_=_ls_-1|0,
           pos_lv_=[0,e_lr_[_bl_.toString()],e_lr_[_bm_.toString()]];
          if(_lt_<0||2<_lt_)
           var button_lu_=_m_(_cg_(_bg_,string_of_int_ci_(_ls_)));
          else
           switch(_lt_)
            {case 1:var button_lu_=15943541;break;
             case 2:var button_lu_=-57574468;break;
             default:var button_lu_=847852583;}
          return trigger_jR_(s_lq_,[0,pos_lv_,button_lu_]);});
      return s_lq_;}
    /*<<23208: src/draw.ml 8 13 65>>*/function _lC_(param_lz_)
     {var
       x_lA_=param_lz_[1],
       _lB_=_cg_(_ac_,string_of_float_jm_(param_lz_[2]));
      return _cg_(string_of_float_jm_(x_lA_),_lB_);}
    /*<<23191: src/draw.ml 10 24 78>>*/function _lN_(pts_lD_)
     {return _iV_(_ad_,_iP_(pts_lD_,_lC_));}
    function _lM_(_opt__lE_,r_lI_,g_lH_,b_lG_,param_lJ_)
     {var alpha_lF_=_opt__lE_?_opt__lE_[1]:1;
      return [0,r_lI_,g_lH_,b_lG_,alpha_lF_];}
    /*<<23147: src/draw.ml 18 13 50>>*/function _lO_(param_lK_)
     {return _lL_
              (_ie_,_ae_,param_lK_[1],param_lK_[2],param_lK_[3],param_lK_[4]);}
    var _lP_=[0,_e_[1],_e_[2],_e_[3],0],c_lQ_=2*(4*Math.atan(1))/360;
    /*<<23138: src/draw.ml 35 58 64>>*/function to_radians_lX_(x_lR_)
     {return c_lQ_*x_lR_;}
    /*<<23135: src/draw.ml 37 21 22>>*/function of_degrees_mQ_(x_lS_)
     {return x_lS_;}
    function _my_(param_lU_,_lT_,angle_lY_)
     {var
       b_lV_=param_lU_[2],
       a_lW_=param_lU_[1],
       y_l1_=_lT_[2],
       x_l0_=_lT_[1],
       angle_lZ_=to_radians_lX_(angle_lY_),
       _l2_=y_l1_-b_lV_,
       _l3_=x_l0_-a_lW_;
      return [0,
              _l3_*Math.cos(angle_lZ_)-_l2_*Math.sin(angle_lZ_)+a_lW_,
              _l3_*Math.sin(angle_lZ_)+_l2_*Math.cos(angle_lZ_)+b_lV_];}
    /*<<22918: src/draw.ml 66 15 56>>*/function _mS_(param_l4_)
     {switch(param_l4_[0])
       {case 1:return _dY_(_ie_,_aj_,param_l4_[1],param_l4_[2]);
        case 2:return _dY_(_ie_,_ai_,param_l4_[1],param_l4_[2]);
        case 3:
         var match_l5_=param_l4_[2];
         return _l6_(_ie_,_ah_,param_l4_[1],match_l5_[1],match_l5_[2]);
        case 4:return _er_(_ie_,_ag_,param_l4_[1]);
        case 5:return _er_(_ie_,_af_,param_l4_[1]);
        default:
         return _l7_
                 (_ie_,
                  _ak_,
                  param_l4_[1],
                  param_l4_[2],
                  param_l4_[3],
                  param_l4_[4],
                  param_l4_[5],
                  param_l4_[6]);}}
    /*<<22873: src/draw.ml 117 15 21>>*/function _mR_(c_l8_)
     {return [0,c_l8_];}
    function _mT_(name_l__,value_l9_){return [3,name_l__,value_l9_];}
    function _mU_(_opt__l$_,_mb_,color_md_,width_me_)
     {var
       cap_ma_=_opt__l$_?_opt__l$_[1]:737755699,
       join_mc_=_mb_?_mb_[1]:463106021;
      return [1,[0,cap_ma_,join_mc_,width_me_,color_md_]];}
    /*<<22701: src/draw.ml 127 4 60>>*/function _mL_(param_mf_)
     {switch(param_mf_[0])
       {case 1:
         var
          match_mg_=param_mf_[1],
          join_mh_=match_mg_[2],
          cap_mi_=match_mg_[1],
          color_ml_=match_mg_[4],
          width_mk_=match_mg_[3],
          _mj_=9660462===join_mh_?_ao_:463106021<=join_mh_?_aq_:_ap_,
          _mn_=_cg_(_ay_,_mj_),
          _mm_=226915517===cap_mi_?_al_:737755699<=cap_mi_?_an_:_am_,
          _mo_=_cg_(_ax_,_mm_),
          _mp_=_cg_(_aw_,string_of_int_ci_(width_mk_));
         return _iV_(_au_,[0,_cg_(_av_,_lO_(color_ml_)),_mp_,_mo_,_mn_]);
        case 2:
         return _cg_(_as_,_iV_(_at_,_iP_(param_mf_[1],string_of_float_jm_)));
        case 3:return _dY_(_ie_,_ar_,param_mf_[1],param_mf_[2]);
        default:return _cg_(_az_,_lO_(param_mf_[1]));}}
    /*<<22696: src/draw.ml 148 18 27>>*/function _mV_(x_mq_)
     {return [0,x_mq_];}
    /*<<22577: src/draw.ml 154 15 57>>*/function _mX_(param_mr_)
     {switch(param_mr_[0])
       {case 1:
         var match_ms_=param_mr_[1];
         return _dY_(_ie_,_aC_,match_ms_[1],match_ms_[2]);
        case 2:
         var
          r_mt_=param_mr_[4],
          a1_mu_=param_mr_[1],
          a2_mw_=param_mr_[2],
          flag_mv_=-64519044<=param_mr_[3]?0:1,
          _mx_=Math.sin(to_radians_lX_(a1_mu_))*r_mt_,
          match_mz_=
           _my_
            ([0,-Math.cos(to_radians_lX_(a1_mu_))*r_mt_,_mx_],
             _aB_,
             a2_mw_-a1_mu_);
         return _ia_(_ie_,_aA_,r_mt_,r_mt_,flag_mv_,match_mz_[1],match_mz_[2]);
        default:
         var match_mA_=param_mr_[1];
         return _dY_(_ie_,_aD_,match_mA_[1],match_mA_[2]);}}
    function path_mW_(_opt__mB_,mask_mE_,anchor_mF_,segs_mD_)
     {var props_mC_=_opt__mB_?_opt__mB_[1]:[0];
      return [3,props_mC_,anchor_mF_,mask_mE_,segs_mD_];}
    function text_mY_(_opt__mG_,str_mI_,corner_mJ_)
     {var props_mH_=_opt__mG_?_opt__mG_[1]:[0];
      return [5,props_mH_,corner_mJ_,str_mI_];}
    /*<<22412: src/draw.ml 217 18 29>>*/function pictures_mZ_(ts_mK_)
     {return [6,ts_mK_];}
    /*<<22388: src/draw.ml 221 27 89>>*/function render_properties_m0_(ps_mM_)
     {return _iV_(_aF_,_iP_(ps_mM_,_mL_));}
    function sink_attrs_m1_(elt_mO_,ps_mP_)
     {return _js_
              (_iP_
                (ps_mP_,
                 /*<<22352: src/draw.ml 224 20 70>>*/function(param_mN_)
                  {return _lh_(elt_mO_,param_mN_[1],param_mN_[2]);}),
               _kz_);}
    var render_m2_=[];
    /*<<22344: src/draw.ml 228 39 66>>*/function _m4_(param_m3_)
     {return string_of_float_jm_(param_m3_[1]);}
    function x_beh_n8_(_m5_){return map_kC_(_m5_,_m4_);}
    /*<<22331: src/draw.ml 229 39 66>>*/function _m7_(param_m6_)
     {return string_of_float_jm_(param_m6_[2]);}
    function y_beh_n6_(_m8_){return map_kC_(_m8_,_m7_);}
    /*<<22318: src/draw.ml 230 23 70>>*/function zip_props_nA_(ps_b_m9_)
     {var t__m__=return_ka_(render_properties_m0_(_iP_(ps_b_m9_,peek_kt_)));
      _iQ_
       (ps_b_m9_,
        /*<<18622: src/frp.ml 286 6 69>>*/function(t_na_)
         {return add_listener_ke_
                  (t_na_,
                   /*<<18606: src/frp.ml 286 31 68>>*/function(param_m$_)
                    {return trigger_kd_
                             (t__m__,render_properties_m0_(_iP_(ps_b_m9_,peek_kt_)));});});
      return t__m__;}
    function path_mask_nT_(elt_nb_,segs_nl_,mask_nn_,props_nu_)
     {/*<<22220: src/draw.ml 233 32 77>>*/function get_length_nd_(param_nc_)
       {return elt_nb_.getTotalLength();}
      var _nh_=get_length_nd_(0);
      function _ng_(param_nf_,x_ne_){return x_ne_;}
      function _nk_(_ni_){return _kG_(_ni_,_nh_,_ng_);}
      /*<<22204: src/draw.ml 235 62 75>>*/function _nm_(param_nj_)
       {return get_length_nd_(0);}
      var path_length_ns_=_js_(map_kA_(_kE_(segs_nl_),_nm_),_nk_);
      if(mask_nn_)
       {var
         mask_nr_=mask_nn_[1],
         _nt_=
          [0,
           zip_with_kD_
            (path_length_ns_,
             mask_nr_,
             function(l_nq_,param_no_)
              {var a_np_=param_no_[1];
               return [2,[254,0,l_nq_*a_np_,l_nq_*(param_no_[2]-a_np_),l_nq_]];})],
         l1_nv_=props_nu_.length-1;
        if(0===l1_nv_)
         {var
           l_nw_=_nt_.length-1,
           _nx_=0===l_nw_?[0]:caml_array_sub(_nt_,0,l_nw_),
           _ny_=_nx_;}
        else
         var
          _ny_=
           0===_nt_.length-1
            ?caml_array_sub(props_nu_,0,l1_nv_)
            :caml_array_append(props_nu_,_nt_);
        var props__nz_=_ny_;}
      else
       var props__nz_=props_nu_;
      return _lh_(elt_nb_,_aG_,zip_props_nA_(props__nz_));}
    caml_update_dummy
     (render_m2_,
      /*<<21505: src/draw.ml 251 18 81>>*/function(param_nB_)
       {switch(param_nB_[0])
         {case 1:
           var
            trans_nD_=param_nB_[2],
            match_nC_=_c1_(render_m2_,param_nB_[1]),
            elt_nE_=match_nC_[1],
            sub_nF_=match_nC_[2];
           return [0,
                   elt_nE_,
                   _er_
                    (_ky_,_lh_(elt_nE_,_a6_,map_kC_(trans_nD_,_mS_)),sub_nF_)];
          case 2:
           var
            pts_nG_=param_nB_[2],
            props_nH_=param_nB_[1],
            _nI_=[0,_a4_,_iV_(_a5_,_iP_(peek_kt_(pts_nG_),_lC_))],
            elt_nJ_=
             _lk_
              (_a2_,
               [0,
                [0,_a3_,render_properties_m0_(_iP_(props_nH_,peek_kt_))],
                _nI_]);
           return [0,elt_nJ_,_lh_(elt_nJ_,_a1_,map_kC_(pts_nG_,_lN_))];
          case 3:
           var
            segs_nK_=param_nB_[4],
            mask_nO_=param_nB_[3],
            anchor_nN_=param_nB_[2],
            props_nM_=param_nB_[1],
            elt_nL_=_lk_(_a0_,[0]),
            sub_nU_=
             _lh_
              (elt_nL_,
               _aZ_,
               zip_with_kD_
                (anchor_nN_,
                 segs_nK_,
                 function(param_nP_,sgs_nQ_)
                  {var y_nS_=param_nP_[2],x_nR_=param_nP_[1];
                   return _l6_
                           (_ie_,_ba_,x_nR_,y_nS_,_iV_(_aE_,_iP_(sgs_nQ_,_mX_)));}));
           return [0,
                   elt_nL_,
                   _er_
                    (_ky_,
                     sub_nU_,
                     path_mask_nT_(elt_nL_,segs_nK_,mask_nO_,props_nM_))];
          case 4:
           var
            path_strb_nV_=param_nB_[3],
            mask_nY_=param_nB_[2],
            props_nX_=param_nB_[1],
            elt_nW_=_lk_(_aY_,[0]),
            sub_nZ_=_lh_(elt_nW_,_aX_,path_strb_nV_);
           return [0,
                   elt_nW_,
                   _er_
                    (_ky_,
                     sub_nZ_,
                     path_mask_nT_(elt_nW_,path_strb_nV_,mask_nY_,props_nX_))];
          case 5:
           var
            text_n0_=param_nB_[3],
            corner_n1_=param_nB_[2],
            ps_n3_=param_nB_[1],
            elt_n2_=_lk_(_aW_,[0]);
           _li_(elt_n2_,peek_kt_(text_n0_));
           var
            _n4_=_c1_(_li_,elt_n2_),
            _n5_=_c1_(_ky_,iter_jS_(_kE_(text_n0_),_n4_)),
            _n7_=[0,_aV_,zip_props_nA_(ps_n3_)],
            _n9_=[0,_aU_,y_beh_n6_(corner_n1_)];
           return [0,
                   elt_n2_,
                   _js_
                    (sink_attrs_m1_
                      (elt_n2_,[0,[0,_aT_,x_beh_n8_(corner_n1_)],_n9_,_n7_]),
                     _n5_)];
          case 6:
           var elts_n__=_iP_(param_nB_[1],render_m2_),elt_n$_=_lk_(_aS_,[0]);
           _iQ_
            (elts_n__,
             /*<<21473: src/draw.ml 312 23 52>>*/function(param_oa_)
              {return _lj_(elt_n$_,param_oa_[1]);});
           return [0,
                   elt_n$_,
                   _c1_(_kz_,_iP_(elts_n__,function(_ob_){return _ob_[2];}))];
          case 7:
           var
            hb_oc_=param_nB_[4],
            wb_od_=param_nB_[3],
            corner_oe_=param_nB_[2],
            ps_og_=param_nB_[1],
            match_of_=peek_kt_(corner_oe_),
            y_oi_=match_of_[2],
            x_oh_=match_of_[1],
            _oj_=[0,_aR_,render_properties_m0_(_iP_(ps_og_,peek_kt_))],
            _ok_=[0,_aQ_,string_of_float_jm_(peek_kt_(hb_oc_))],
            _ol_=[0,_aP_,string_of_float_jm_(peek_kt_(wb_od_))],
            _om_=[0,_aO_,string_of_float_jm_(y_oi_)],
            elt_on_=
             _lk_
              (_aM_,
               [0,[0,_aN_,string_of_float_jm_(x_oh_)],_om_,_ol_,_ok_,_oj_]),
            _oo_=[0,_aL_,map_kC_(hb_oc_,string_of_float_jm_)],
            _op_=[0,_aK_,map_kC_(wb_od_,string_of_float_jm_)],
            _oq_=[0,_aJ_,y_beh_n6_(corner_oe_)];
           return [0,
                   elt_on_,
                   sink_attrs_m1_
                    (elt_on_,[0,[0,_aI_,x_beh_n8_(corner_oe_)],_oq_,_op_,_oo_])];
          case 8:
           var
            tb_or_=param_nB_[1],
            container_os_=_lk_(_aH_,[0]),
            match_ot_=_c1_(render_m2_,peek_kt_(tb_or_)),
            sub_ou_=match_ot_[2];
           _lj_(container_os_,match_ot_[1]);
           var
            last_sub_ov_=[0,sub_ou_],
            _oA_=
             /*<<21436: src/draw.ml 340 6 22>>*/function(t_ox_)
              {/*<<21436: src/draw.ml 340 6 22>>*/_jv_(last_sub_ov_[1]);
               /*<<20735: src/jq.ml 71 6 71>>*/for(;;)
                {if(1-(container_os_.firstChild==null_ig_?1:0))
                  {var _ow_=container_os_.firstChild;
                   if(_ow_!=null_ig_)
                    /*<<20690: src/jq.ml 71 44 70>>*/container_os_.removeChild
                     (_ow_);
                   continue;}
                 var match_oy_=_c1_(render_m2_,t_ox_),sub_oz_=match_oy_[2];
                 _lj_(container_os_,match_oy_[1]);
                 last_sub_ov_[1]=sub_oz_;
                 return 0;}},
            dyn_sub_oC_=iter_jS_(_kE_(tb_or_),_oA_);
           return [0,
                   container_os_,
                   _er_
                    (_ky_,
                     dyn_sub_oC_,
                     _jG_
                      (/*<<21428: src/draw.ml 347 61 77>>*/function(param_oB_)
                        {return _jv_(last_sub_ov_[1]);}))];
          case 9:return [0,param_nB_[1],_kx_];
          default:
           var
            center_oD_=param_nB_[3],
            r_oG_=param_nB_[2],
            ps_oF_=param_nB_[1],
            elt_oE_=_lk_(_a$_,[0]),
            _oH_=[0,_a__,zip_props_nA_(ps_oF_)],
            _oI_=[0,_a9_,map_kC_(r_oG_,string_of_float_jm_)],
            _oJ_=[0,_a8_,y_beh_n6_(center_oD_)];
           return [0,
                   elt_oE_,
                   sink_attrs_m1_
                    (elt_oE_,[0,[0,_a7_,x_beh_n8_(center_oD_)],_oJ_,_oI_,_oH_])];}});
    /*<<24090: src/animate.ml 26 21 46>>*/function stay_for_oP_(dur_oM_)
     {return [0,dur_oM_,function(x0_oK_,param_oL_){return x0_oK_;}];}
    var
     _oQ_=[],
     stay_forever_o4_=[1,function(x0_oN_,param_oO_){return x0_oN_;}];
    function mk_f_o2_(dur1_oU_,f1_oS_,f2_oV_,x0_oR_)
     {var
       f1__oT_=_c1_(f1_oS_,x0_oR_),
       f2__oX_=_c1_(f2_oV_,_c1_(f1__oT_,dur1_oU_));
      /*<<23993: src/animate.ml 44 17 61>>*/return function(t_oW_)
       {return t_oW_<=dur1_oU_
                ?_c1_(f1__oT_,t_oW_)
                :_c1_(f2__oX_,t_oW_-dur1_oU_);};}
    caml_update_dummy
     (_oQ_,
      /*<<23981: src/animate.ml 46 8 60>>*/function(param_oY_)
       {var f1_oZ_=param_oY_[2],dur1_o0_=param_oY_[1];
        /*<<23948: src/animate.ml 47 4 60>>*/return function(t2_o1_)
         {{if(0===t2_o1_[0])
            {var dur2_o3_=t2_o1_[1];
             return [0,
                     dur1_o0_+dur2_o3_,
                     _dY_(mk_f_o2_,dur1_o0_,f1_oZ_,t2_o1_[2])];}
           return [1,_dY_(mk_f_o2_,dur1_o0_,f1_oZ_,t2_o1_[1])];}};});
    /*<<23771: src/animate.ml 52 65 38>>*/function _ph_(param_o5_)
     {var f_pd_=param_o5_[1];
      /*<<23743: src/animate.ml 55 8 38>>*/return function(init_pc_)
       {function _o9_(param_o7_,t_o6_){return _jk_(t_o6_);}
        var t_o8_=create_jN_(0),_pb_=0,_pa_=30,start_o__=_ji_(0);
        /*<<19125: src/frp.ml 187 4 5>>*/_jr_
         (_pa_,
          /*<<19109: src/frp.ml 190 6 37>>*/function(param_o$_)
           {return trigger_jR_(t_o8_,_jj_(_ji_(0),start_o__));});
        var elapsed_pe_=_kG_(t_o8_,_pb_,_o9_);
        return map_kC_(elapsed_pe_,_c1_(f_pd_,init_pc_));};}
    function _q1_(init_pf_,t_pg_){return _er_(_ph_,t_pg_,init_pf_);}
    function _q2_(label_p3_,container_pS_,param_p4_)
     {var
       inner_container_pi_=create_ld_(_T_),
       slider_div_pj_=create_ld_(_S_),
       _pk_=create_ld_(_R_),
       slider_val_pl_=return_ka_(0),
       sliding_pm_=return_ka_(0),
       rate__pp_=25/1e3;
      function _pq_(p_pn_,param_po_){return 1-p_pn_;}
      var playing_pr_=_kG_(_lx_(_pk_),0,_pq_);
      function _pu_(_ps_){return 0;}
      var
       _pv_=
        map_kC_
         (playing_pr_,
          /*<<25152: src/widget.ml 13 8 75>>*/function(p_pt_)
           {return p_pt_?_M_:_L_;});
      set_attr_lg_(_pk_,_f_,peek_kt_(_pv_));
      /*<<20930: src/jq.ml 42 4 27>>*/function _px_(value_pw_)
       {return set_attr_lg_(_pk_,_f_,value_pw_);}
      _js_(iter_jS_(_kE_(_pv_),_px_),_pu_);
      /*<<25140: src/widget.ml 15 46 74>>*/function _pC_(chg_py_)
       {return _jk_(chg_py_)*rate__pp_;}
      var _pB_=30;
      function _pE_(t1_pz_,t2_pA_){return _jj_(t2_pA_,t1_pz_);}
      var t_pD_=create_jN_(0);
      /*<<19158: src/frp.ml 181 4 5>>*/_jr_
       (_pB_,
        /*<<19148: src/frp.ml 182 34 57>>*/function(param_pF_)
         {return trigger_jR_(t_pD_,_ji_(0));});
      var
       incrs_pJ_=map_kA_(_kB_(t_pD_,_pE_),_pC_),
       _pN_=
        _kF_
         (zip_with_kD_
           (playing_pr_,
            sliding_pm_,
            function(p_pG_,s_pH_){var _pI_=p_pG_?1-s_pH_:p_pG_;return _pI_;}),
          incrs_pJ_);
      function update_slider_val_pO_(e_pL_,ui_pK_)
       {return trigger_kd_(slider_val_pl_,ui_pK_[_U_.toString()]/100);}
      function _pR_(_pM_){return 0;}
      _js_
       (iter_jS_
         (_pN_,
          /*<<25042: src/widget.ml 21 8 78>>*/function(x_pP_)
           {var
             new_val_pQ_=
              _b6_
               (slider_div_pj_.slider(_P_.toString(),_Q_.toString())+x_pP_,
                100);
            /*<<25042: src/widget.ml 21 8 78>>*/trigger_kd_
             (slider_val_pl_,new_val_pQ_/100);
            return slider_div_pj_.slider
                    (_N_.toString(),_O_.toString(),new_val_pQ_);}),
        _pR_);
      append_le_(inner_container_pi_,_pk_);
      append_le_(inner_container_pi_,slider_div_pj_);
      append_le_(container_pS_,inner_container_pi_);
      var
       _pV_=0.01,
       _pY_=
        caml_js_wrap_callback
         (function(param_pT_,_pU_){return trigger_kd_(sliding_pm_,0);}),
       _pZ_=
        caml_js_wrap_callback
         (function(param_pW_,_pX_){return trigger_kd_(sliding_pm_,1);}),
       arg_obj_p1_=
        {"slide":caml_js_wrap_callback(update_slider_val_pO_),
         "start":
         caml_js_wrap_callback
          (function(param_pW_,_pX_){return trigger_kd_(sliding_pm_,1);}),
         "stop":_pY_,
         "step":_pV_};
      function _p2_(_p0_){return 0;}
      _js_(slider_div_pj_.slider(arg_obj_p1_),_p2_);
      return slider_val_pl_;}
    function _q3_(_opt__p5_,_p7_,param_qB_,container_qc_,_qC_)
     {var
       bot_p6_=_opt__p5_?_opt__p5_[1]:min_int_b7_,
       top_p8_=_p7_?_p7_[1]:max_int_ch_,
       buttons_p_p9_=create_ld_(_Z_),
       incr_button_p__=create_ld_(_Y_),
       decr_button_p$_=create_ld_(_X_),
       incr_icon_qa_=create_ld_(_W_),
       decr_icon_qb_=create_ld_(_V_);
      append_le_(incr_button_p__,incr_icon_qa_);
      append_le_(decr_button_p$_,decr_icon_qb_);
      append_le_(buttons_p_p9_,decr_button_p$_);
      append_le_(buttons_p_p9_,incr_button_p__);
      append_le_(container_qc_,buttons_p_p9_);
      /*<<24577: src/widget.ml 94 7 35>>*/function _qr_(eta_qh_)
       {var
         _qd_=0,
         eq_qe_=
          _qd_?_qd_[1]:function(_qg_,_qf_){return caml_equal(_qg_,_qf_);},
         t__qi_=return_ka_(eta_qh_[2]);
        add_listener_ke_
         (eta_qh_,
          /*<<18754: src/frp.ml 267 29 69>>*/function(x_qj_)
           {return _er_(eq_qe_,x_qj_,t__qi_[2])?0:trigger_kd_(t__qi_,x_qj_);});
        return t__qi_;}
      function _qo_(n_qk_,i_ql_)
       {var
         _qm_=_b6_(top_p8_,n_qk_+i_ql_|0),
         _qn_=caml_greaterequal(bot_p6_,_qm_)?bot_p6_:_qm_;
        return _qn_;}
      function _qs_(_qp_){return _kG_(_qp_,bot_p6_,_qo_);}
      /*<<24550: src/widget.ml 92 24 26>>*/function _qt_(param_qq_)
       {return -1;}
      var _qv_=map_kA_(_lx_(decr_button_p$_),_qt_);
      /*<<24547: src/widget.ml 91 24 25>>*/function _qw_(param_qu_){return 1;}
      var _qy_=map_kA_(_lx_(incr_button_p__),_qw_),t_qx_=create_jN_(0);
      iter_jS_
       (_qy_,
        /*<<19280: src/frp.ml 151 33 44>>*/function(x_qz_)
         {return trigger_jR_(t_qx_,x_qz_);});
      iter_jS_
       (_qv_,
        /*<<19275: src/frp.ml 152 33 44>>*/function(x_qA_)
         {return trigger_jR_(t_qx_,x_qA_);});
      return _js_(_js_(t_qx_,_qs_),_qr_);}
    function _q5_(init_qK_,param_qL_,canvas_qI_)
     {function _qG_(param_qE_,_qD_)
       {return [0,param_qE_[1]+_qD_[1]|0,param_qE_[2]+_qD_[2]|0];}
      var b_qF_=return_ka_(0);
      /*<<20401: src/jq.ml 148 2 3>>*/on_lf_
       (canvas_qI_,
        _bo_,
        /*<<20392: src/jq.ml 149 32 59>>*/function(param_qH_)
         {return trigger_kd_(b_qF_,1);});
      /*<<20401: src/jq.ml 148 2 3>>*/on_lf_
       (body_ll_,
        _bn_,
        /*<<20383: src/jq.ml 150 32 60>>*/function(param_qJ_)
         {return trigger_kd_(b_qF_,0);});
      return _kG_(_kF_(b_qF_,_ly_),init_qK_,_qG_);}
    function _q4_(param_qM_,w_qP_)
     {var
       canvas_qN_=param_qM_[2],
       container_qO_=param_qM_[1],
       f_qQ_=param_qM_[3];
      return [0,
              container_qO_,
              canvas_qN_,
              _c1_(f_qQ_,_er_(w_qP_,container_qO_,canvas_qN_))];}
    function _q6_(width_qS_,height_qR_,container_qV_,f_qW_)
     {var
       _qT_=[0,_aa_,string_of_int_ci_(height_qR_)],
       canvas_qU_=
        _js_
         (_lk_(___,[0,[0,_$_,string_of_int_ci_(width_qS_)],_qT_,_ab_]),
          wrap_lc_);
      append_le_(container_qV_,canvas_qU_);
      return [0,container_qV_,canvas_qU_,f_qW_];}
    /*<<24298: src/widget.ml 137 8 5>>*/function _q7_(param_qX_)
     {var
       canvas_qZ_=param_qX_[2],
       match_qY_=_c1_(render_m2_,param_qX_[3]),
       sub_q0_=match_qY_[2];
      /*<<24298: src/widget.ml 137 8 5>>*/append_le_
       (canvas_qZ_,wrap_lc_(match_qY_[1]));
      return sub_q0_;}
    /*<<26190: src/graph.ml 21 2 8>>*/function _rc_(nodes_rb_)
     {var nodes__q8_=_i$_(0);
      /*<<26190: src/graph.ml 21 2 8>>*/_jd_
       (nodes_rb_,
        function(key_ra_,data_q9_)
         {var _q$_=data_q9_[2],t__q__=_i$_(0);
          /*<<17365: src/inttbl.ml 77 2 4>>*/_jd_(_q$_,_c1_(_ja_,t__q__));
          return _ja_(nodes__q8_,key_ra_,[0,data_q9_[1],t__q__]);});
      return nodes__q8_;}
    function range_rh_(start_re_,stop_rd_)
     {if(stop_rd_<start_re_)/*<<28267: src/rotsym.ml 4 23 47>>*/_m_(_t_);
      var n_rg_=(stop_rd_-start_re_|0)+1|0;
      return _iR_
              (n_rg_,
               /*<<28254: src/rotsym.ml 6 28 37>>*/function(i_rf_)
                {return i_rf_+start_re_|0;});}
    var container_ri_=_iq_(jq_lb_(_A_)),_si_=_dY_(_q3_,_y_,_z_,0);
    /*<<27599: src/rotsym.ml 63 4 10>>*/_js_
     (_q4_
       (_q6_
         (400,
          400,
          container_ri_,
          /*<<27584: src/rotsym.ml 66 6 8>>*/function(nb_sh_)
           {return [8,
                    map_kC_
                     (nb_sh_,
                      /*<<27550: src/rotsym.ml 67 8 36>>*/function(n_rj_)
                       {if(2===n_rj_)
                         {var _rk_=return_ka_(_C_);
                          return text_mY_(0,return_ka_(_B_),_rk_);}
                        var
                         _rl_=400,
                         _rm_=400,
                         radius_rn_=_b6_(_rm_,_rl_)/4,
                         center_ro_=[0,_rm_/2,_rl_/2],
                         p0_rp_=[0,_rm_/2,_rl_/2-radius_rn_],
                         theta_rq_=360/n_rj_,
                         nice_blue_rz_=_lM_(0,120,154,243,0),
                         ngon_ry_=
                          /*<<27827: src/rotsym.ml 19 6 59>>*/function(color_rt_)
                           {/*<<27803: src/rotsym.ml 21 10 69>>*/function _rs_(i_rr_)
                             {return _my_
                                      (center_ro_,p0_rp_,i_rr_*of_degrees_mQ_(theta_rq_));}
                            var
                             _ru_=return_ka_(_iP_(range_rh_(0,n_rj_-1|0),_rs_)),
                             _rv_=[0,return_ka_(_mR_(color_rt_))],
                             props_rw_=[0,_rv_]?_rv_:[0];
                            return [2,props_rw_,_ru_];},
                         _rA_=function(_rx_){return map_kC_(_rx_,of_degrees_mQ_);},
                         _rX_=_c1_(_q1_,0),
                         _rY_=
                          /*<<27783: src/rotsym.ml 32 19 37>>*/function(x_rB_)
                           {return _er_(_oQ_,stay_for_oP_(500),x_rB_);},
                         _rZ_=
                          function(_rD_)
                           {var
                             r_rC_=[0,stay_forever_o4_],
                             _rE_=_rD_.length-1-1|0,
                             _rF_=0;
                            if(!(_rE_<_rF_))
                             {var i_rG_=_rE_;
                              for(;;)
                               {r_rC_[1]=_er_(_oQ_,_rD_[i_rG_+1],r_rC_[1]);
                                var _rH_=i_rG_-1|0;
                                if(_rF_!==i_rG_){var i_rG_=_rH_;continue;}
                                break;}}
                            return r_rC_[1];},
                         _r0_=
                          /*<<27749: src/rotsym.ml 30 21 86>>*/function(i_rI_)
                           {var _rJ_=i_rI_*theta_rq_,_rK_=1e3,_rT_=stay_for_oP_(500);
                            /*<<23804: src/animate.ml 79 6 74>>*/function f_rW_(x0_rL_)
                             {var
                               h_rM_=(_rJ_+x0_rL_)/2,
                               _rN_=_rK_/2,
                               b_rO_=(h_rM_-_rJ_)/_rN_,
                               c_rQ_=(h_rM_-x0_rL_)/Math.pow(_rK_/2,2),
                               a_rS_=b_rO_/_rN_;
                              /*<<23779: src/animate.ml 82 15 74>>*/return function(t_rP_)
                               {if(t_rP_<=_rK_/2)return x0_rL_+c_rQ_*Math.pow(t_rP_,2);
                                var _rR_=t_rP_-_rK_/2;
                                return h_rM_+a_rS_*Math.pow(_rR_,2)-2*b_rO_*_rR_;};}
                            return _er_
                                    (_oQ_,
                                     _er_
                                      (_oQ_,
                                       [0,_rK_,f_rW_],
                                       [0,0,function(param_rU_,_rV_){return _rJ_;}]),
                                     _rT_);},
                         angle_r1_=
                          _js_
                           (_js_
                             (_js_(_js_(_iP_(range_rh_(1,n_rj_),_r0_),_rZ_),_rY_),_rX_),
                            _rA_),
                         rots_r7_=
                          map_kC_
                           (angle_r1_,
                            /*<<27735: src/rotsym.ml 37 51 93>>*/function(a_r2_)
                             {return a_r2_/theta_rq_|0;}),
                         _r8_=
                          map_kC_
                           (angle_r1_,
                            /*<<27657: src/rotsym.ml 46 32 10>>*/function(a_r3_)
                             {var
                               a_r4_=_b6_(a_r3_,of_degrees_mQ_(359.9999)),
                               flag_r5_=
                                caml_lessthan(a_r4_,of_degrees_mQ_(180))
                                 ?-64519044
                                 :-944265860,
                               _r6_=of_degrees_mQ_(90)+a_r4_;
                              return [0,
                                      [2,of_degrees_mQ_(90),_r6_,flag_r5_,radius_rn_+40]];}),
                         _r9_=return_ka_([0,p0_rp_[1],p0_rp_[2]-40]),
                         _r__=return_ka_(_mR_(_lP_)),
                         arc_r$_=
                          path_mW_
                           ([0,[0,return_ka_(_mU_(0,0,_c_,4)),_r__]],0,_r9_,_r8_),
                         _sa_=return_ka_([0,_rm_-10,54]),
                         _sb_=map_kC_(rots_r7_,string_of_int_ci_),
                         _sc_=return_ka_(_mT_(_w_,_x_)),
                         _se_=
                          text_mY_([0,[0,return_ka_(_mT_(_u_,_v_)),_sc_]],_sb_,_sa_),
                         _sf_=
                          map_kC_
                           (angle_r1_,
                            /*<<27651: src/rotsym.ml 54 73 101>>*/function(a_sd_)
                             {return [3,a_sd_,center_ro_];}),
                         _sg_=[1,ngon_ry_(nice_blue_rz_),_sf_];
                        return pictures_mZ_
                                ([0,ngon_ry_(_lM_(0,238,238,238,0)),_sg_,arc_r$_,_se_]);})];}),
        _si_),
      _q7_);
    var
     _sk_=_h_[2],
     _sj_=_h_[1],
     container_sm_=_iq_(jq_lb_(_D_)),
     h_sl_=match_g_[2],
     w_ss_=match_g_[1];
    /*<<27260: src/rotsym.ml 97 6 55>>*/function plane_anim_sF_(pt_sr_)
     {var
       _sn_=return_ka_(_mR_(_lP_)),
       props_so_=[0,return_ka_(_mU_(0,0,_lM_(0,170,170,170,0),2)),_sn_],
       _sq_=return_ka_([0,_mV_([0,0,h_sl_])]),
       x_tracker_st_=
        path_mW_
         ([0,props_so_],
          0,
          map_kC_
           (pt_sr_,
            /*<<27249: src/rotsym.ml 103 44 74>>*/function(param_sp_)
             {return [0,param_sp_[1],0];}),
          _sq_),
       _sv_=return_ka_([0,_mV_([0,w_ss_,0])]),
       y_tracker_sx_=
        path_mW_
         ([0,props_so_],
          0,
          map_kC_
           (pt_sr_,
            /*<<27238: src/rotsym.ml 107 44 74>>*/function(param_su_)
             {return [0,0,param_su_[2]];}),
          _sv_),
       _sy_=map_kC_(pt_sr_,_c1_(_ir_,function(_sw_){return _sw_;})),
       _sz_=return_ka_(5),
       _sA_=[0,return_ka_(_mR_(_c_))],
       props_sB_=[0,_sA_]?_sA_:[0],
       _sE_=[0,props_sB_,_sz_,_sy_],
       _sD_=return_ka_([0,10,h_sl_-40]);
      return pictures_mZ_
              ([0,
                x_tracker_st_,
                y_tracker_sx_,
                text_mY_
                 (0,
                  map_kC_
                   (pt_sr_,
                    /*<<27217: src/rotsym.ml 115 29 76>>*/function(param_sC_)
                     {return _dY_(_ie_,_E_,param_sC_[1],400-param_sC_[2]|0);}),
                  _sD_),
                _sE_]);}
    var _sG_=_c1_(_q5_,[0,_sj_,_sk_]);
    /*<<27491: src/rotsym.ml 93 4 10>>*/_js_
     (_q4_(_q6_(400,400,container_sm_,plane_anim_sF_),_sG_),_q7_);
    _lk_(_o_,[0,_p_,_q_,_r_,_s_]);
    var
     _sH_=0,
     _sI_=caml_make_vect(5,_c_),
     nodes__sJ_=_rc_(_i$_(0)),
     len_sK_=_sI_.length-1,
     i_sL_=0;
    /*<<26041: src/graph.ml 40 4 7>>*/for(;;)
     {if(len_sK_<=i_sL_)
       {var
         _sN_=
          _iR_
           (len_sK_,
            /*<<26078: src/graph.ml 49 32 39>>*/function(i_sM_)
             {return _sH_+i_sM_|0;});
        if(5===_sN_.length-1)
         {var
           a_sO_=_sN_[0+1],
           b_sP_=_sN_[1+1],
           c_sQ_=_sN_[2+1],
           d_sR_=_sN_[3+1],
           e_sS_=_sN_[4+1],
           nodes__sT_=_rc_(nodes__sJ_),
           _s5_=
            [0,
             [0,a_sO_,b_sP_,0],
             [0,b_sP_,c_sQ_,0],
             [0,c_sQ_,a_sO_,0],
             [0,c_sQ_,d_sR_,0],
             [0,d_sR_,e_sS_,0],
             [0,e_sS_,c_sQ_,0]];
          _iQ_
           (_s5_,
            /*<<25383: src/graph.ml 139 39 9>>*/function(param_sU_)
             {switch(param_sU_[0])
               {case 1:
                 var
                  v_sV_=param_sU_[2],
                  match_sW_=_jc_(nodes__sT_,param_sU_[1]),
                  _sX_=_jc_(nodes__sT_,v_sV_);
                 if(match_sW_&&_sX_)return _jb_(match_sW_[1][2],v_sV_);
                 return _m_(_J_);
                case 2:
                 var u_sY_=param_sU_[1];
                 return _jc_(nodes__sT_,u_sY_)
                         ?(_jb_(nodes__sT_,u_sY_),
                           _jd_
                            (nodes__sT_,
                             function(key_s0_,data_sZ_){return _jb_(data_sZ_[2],u_sY_);}))
                         :_m_(_I_);
                default:
                 var
                  v_s1_=param_sU_[2],
                  e_s3_=param_sU_[3],
                  match_s2_=_jc_(nodes__sT_,param_sU_[1]),
                  _s4_=_jc_(nodes__sT_,v_s1_);
                 if(match_s2_&&_s4_)return _ja_(match_s2_[1][2],v_s1_,e_s3_);
                 return _m_(_K_);}});}
        else
         /*<<28397: src/rotsym.ml 171 11 42>>*/_m_(_n_);
        var
         container_tb_=_iq_(jq_lb_(_G_)),
         path_anim_tc_=
          /*<<27086: src/rotsym.ml 142 6 206>>*/function(slider_val_s8_)
           {var
             _s7_=return_ka_(_H_),
             _s9_=
              [0,
               map_kC_
                (slider_val_s8_,
                 /*<<27075: src/rotsym.ml 147 44 55>>*/function(x_s6_)
                  {return [0,0,Math.pow(x_s6_,2)];})],
             _s__=return_ka_(_mU_(0,0,_c_,4)),
             _s$_=[0,return_ka_(_mR_([0,_d_[1],_d_[2],_d_[3],0])),_s__],
             props_ta_=[0,_s$_]?_s$_:[0];
            return [4,props_ta_,_s9_,_s7_];},
         _td_=_c1_(_q2_,_F_);
        /*<<27168: src/rotsym.ml 138 4 10>>*/_js_
         (_q4_(_q6_(400,400,container_tb_,path_anim_tc_),_td_),_q7_);
        do_at_exit_cj_(0);
        return;}
      var _te_=_i$_(0);
      /*<<26049: src/graph.ml 43 6 18>>*/_ja_
       (nodes__sJ_,_sH_+i_sL_|0,[0,caml_array_get(_sI_,i_sL_),_te_]);
      var _tf_=i_sL_+1|0,i_sL_=_tf_;
      continue;}}
  ());
