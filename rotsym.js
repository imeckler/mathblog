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
(function()
   {function _lx_(_rI_,_rJ_,_rK_,_rL_,_rM_,_rN_,_rO_,_rP_)
     {return _rI_.length==7
              ?_rI_(_rJ_,_rK_,_rL_,_rM_,_rN_,_rO_,_rP_)
              :caml_call_gen(_rI_,[_rJ_,_rK_,_rL_,_rM_,_rN_,_rO_,_rP_]);}
    function _hZ_(_rB_,_rC_,_rD_,_rE_,_rF_,_rG_,_rH_)
     {return _rB_.length==6
              ?_rB_(_rC_,_rD_,_rE_,_rF_,_rG_,_rH_)
              :caml_call_gen(_rB_,[_rC_,_rD_,_rE_,_rF_,_rG_,_rH_]);}
    function _k$_(_rv_,_rw_,_rx_,_ry_,_rz_,_rA_)
     {return _rv_.length==5
              ?_rv_(_rw_,_rx_,_ry_,_rz_,_rA_)
              :caml_call_gen(_rv_,[_rw_,_rx_,_ry_,_rz_,_rA_]);}
    function _lw_(_rq_,_rr_,_rs_,_rt_,_ru_)
     {return _rq_.length==4
              ?_rq_(_rr_,_rs_,_rt_,_ru_)
              :caml_call_gen(_rq_,[_rr_,_rs_,_rt_,_ru_]);}
    function _dL_(_rm_,_rn_,_ro_,_rp_)
     {return _rm_.length==3
              ?_rm_(_rn_,_ro_,_rp_)
              :caml_call_gen(_rm_,[_rn_,_ro_,_rp_]);}
    function _ee_(_rj_,_rk_,_rl_)
     {return _rj_.length==2?_rj_(_rk_,_rl_):caml_call_gen(_rj_,[_rk_,_rl_]);}
    function _cO_(_rh_,_ri_)
     {return _rh_.length==1?_rh_(_ri_):caml_call_gen(_rh_,[_ri_]);}
    var
     _a_=[0,new MlString("Failure")],
     _b_=[0,new MlString("Invalid_argument")],
     _c_=[0,0,0,0,1],
     _d_=[0,255,0,0,1],
     _e_=new MlString("class");
    caml_register_global(6,[0,new MlString("Not_found")]);
    caml_register_global(5,[0,new MlString("Division_by_zero")]);
    caml_register_global(3,_b_);
    caml_register_global(2,_a_);
    var
     _bN_=[0,new MlString("Match_failure")],
     _bM_=[0,new MlString("Assert_failure")],
     _bL_=new MlString("%d"),
     _bK_=new MlString("true"),
     _bJ_=new MlString("false"),
     _bI_=new MlString("Pervasives.do_at_exit"),
     _bH_=new MlString("\\b"),
     _bG_=new MlString("\\t"),
     _bF_=new MlString("\\n"),
     _bE_=new MlString("\\r"),
     _bD_=new MlString("\\\\"),
     _bC_=new MlString("\\'"),
     _bB_=new MlString("String.blit"),
     _bA_=new MlString("String.sub"),
     _bz_=new MlString("Buffer.add: cannot grow buffer"),
     _by_=new MlString(""),
     _bx_=new MlString(""),
     _bw_=new MlString("%.12g"),
     _bv_=new MlString("\""),
     _bu_=new MlString("\""),
     _bt_=new MlString("'"),
     _bs_=new MlString("'"),
     _br_=new MlString("nan"),
     _bq_=new MlString("neg_infinity"),
     _bp_=new MlString("infinity"),
     _bo_=new MlString("."),
     _bn_=new MlString("printf: bad positional specification (0)."),
     _bm_=new MlString("%_"),
     _bl_=[0,new MlString("printf.ml"),143,8],
     _bk_=new MlString("'"),
     _bj_=new MlString("Printf: premature end of format string '"),
     _bi_=new MlString("'"),
     _bh_=new MlString(" in format string '"),
     _bg_=new MlString(", at char number "),
     _bf_=new MlString("Printf: bad conversion %"),
     _be_=new MlString("Sformat.index_of_int: negative argument "),
     _bd_=
      new
       MlString
       ("(function(a,f){var len=a.length;for(var i = 0; i < len; ++i){f(a[i]);}})"),
     _bc_=new MlString(""),
     _bb_=new MlString("iter"),
     _ba_=
      new
       MlString
       ("(function(t, x0, f){for(var k in t){if(t.hasOwnProperty(k)){x0=f(x0,parseInt(k),t[k]);}} return x0;})"),
     _a$_=
      new
       MlString
       ("(function(t, f){for(var k in t){if(t.hasOwnProperty(k)){f(parseInt(k),t[k]);}}})"),
     _a__=new MlString("(function(x,y){return x % y;})"),
     _a9_=new MlString("offsetY"),
     _a8_=new MlString("offsetX"),
     _a7_=new MlString("which"),
     _a6_=new MlString("click"),
     _a5_=new MlString("pageY"),
     _a4_=new MlString("pageX"),
     _a3_=new MlString("Not a valid mouse code: "),
     _a2_=new MlString("http://www.w3.org/2000/svg"),
     _a1_=new MlString(">"),
     _a0_=new MlString("<"),
     _aZ_=new MlString("body"),
     _aY_=new MlString("mousemove"),
     _aX_=new MlString("M%f,%f %s"),
     _aW_=new MlString("circle"),
     _aV_=new MlString("style"),
     _aU_=new MlString("r"),
     _aT_=new MlString("cy"),
     _aS_=new MlString("cx"),
     _aR_=new MlString("transform"),
     _aQ_=[0,new MlString(",")],
     _aP_=new MlString("points"),
     _aO_=new MlString("style"),
     _aN_=new MlString("polygon"),
     _aM_=new MlString("points"),
     _aL_=new MlString("path"),
     _aK_=new MlString("d"),
     _aJ_=new MlString("path"),
     _aI_=new MlString("d"),
     _aH_=new MlString("text"),
     _aG_=new MlString("style"),
     _aF_=new MlString("y"),
     _aE_=new MlString("x"),
     _aD_=new MlString("g"),
     _aC_=new MlString("style"),
     _aB_=new MlString("height"),
     _aA_=new MlString("width"),
     _az_=new MlString("y"),
     _ay_=new MlString("x"),
     _ax_=new MlString("rect"),
     _aw_=new MlString("height"),
     _av_=new MlString("width"),
     _au_=new MlString("y"),
     _at_=new MlString("x"),
     _as_=new MlString("g"),
     _ar_=new MlString("style"),
     _aq_=[0,new MlString(";")],
     _ap_=[0,new MlString(" ")],
     _ao_=new MlString("L%f %f"),
     _an_=new MlString("M%f %f"),
     _am_=[0,0,0],
     _al_=new MlString("a%f,%f 0 %d,1 %f,%f"),
     _ak_=new MlString("fill:"),
     _aj_=new MlString("stroke-linejoin:"),
     _ai_=new MlString("stroke-linecap:"),
     _ah_=new MlString("stroke-width:"),
     _ag_=new MlString("stroke:"),
     _af_=[0,new MlString(";")],
     _ae_=[0,new MlString(" ")],
     _ad_=new MlString("stroke-dasharray:"),
     _ac_=new MlString("miter"),
     _ab_=new MlString("bevel"),
     _aa_=new MlString("round"),
     _$_=new MlString("butt"),
     ___=new MlString("round"),
     _Z_=new MlString("square"),
     _Y_=new MlString("matrix(%f,%f,%f,%f,%f,%f)"),
     _X_=new MlString("translate(%f %f)"),
     _W_=new MlString("scale(%f %f)"),
     _V_=new MlString("rotate(%f %f %f)"),
     _U_=new MlString("skewX(%f)"),
     _T_=new MlString("skewY(%f)"),
     _S_=new MlString("rgba(%d,%d,%d,%f)"),
     _R_=[0,new MlString(" ")],
     _Q_=new MlString(","),
     _P_=[0,255,255,255,1],
     _O_=new MlString("height"),
     _N_=new MlString("width"),
     _M_=new MlString("svg"),
     _L_=new MlString("value"),
     _K_=new MlString("div"),
     _J_=new MlString("div"),
     _I_=new MlString("div"),
     _H_=new MlString("value"),
     _G_=new MlString("option"),
     _F_=new MlString("value"),
     _E_=new MlString("option"),
     _D_=new MlString("cp-slider-button-playing"),
     _C_=new MlString("cp-slider-button-paused"),
     _B_=new MlString("Graph.Change.Add_arc: Nodes not in graph"),
     _A_=new MlString("Graph.Change.Remove_arc: Nodes not in graph"),
     _z_=new MlString("Graph.Change.Remove_node : Node not in graph"),
     _y_=
      new
       MlString
       ("M15.514,227.511c0,0-14.993-122.591,109.361-59.091 c124.356,63.501,157.872,22.049,125.238-49.389c-32.632-71.439-127.305-15.875-111.719,108.479 c15.586,124.355,246.658,35.278,246.658,35.278"),
     _x_=new MlString("#pathanim"),
     _w_=new MlString(""),
     _v_=new MlString("Invalid range"),
     _u_=[0,new MlString("height"),new MlString("600")],
     _t_=[0,new MlString("width"),new MlString("400")],
     _s_=new MlString("svg"),
     _r_=new MlString("#content"),
     _q_=new MlString("hi"),
     _p_=[0,new MlString("fill"),new MlString("none")],
     _o_=[0,new MlString("stroke-width"),new MlString("5")],
     _n_=
      [0,
       new MlString("d"),
       new
        MlString
        ("m74.072388,176.343704c0,0 -48.240629,-187.48112 77.664017,-81.201996c125.904617,106.279099 131.036606,-49.55714 131.036606,-49.55714c0,0 14.027405,-41.795149 -142.669113,-23.882954c-156.696512,17.912197 69.794968,40.60104 69.794968,40.60104c0,0 218.280304,19.106365 -31.818298,157.030354c-250.098579,137.92395 -120.088375,-207.781625 -120.088375,-207.781625")],
     _m_=[0,new MlString("stroke"),new MlString("#000000")],
     _l_=new MlString("path"),
     _k_=[0,new MlString("src/rotsym.ml"),117,9];
    /*<<990: pervasives.ml 20 17 33>>*/function _j_(s_f_){throw [0,_a_,s_f_];}
    /*<<984: pervasives.ml 21 20 45>>*/function _bO_(s_g_)
     {throw [0,_b_,s_g_];}
    function _bP_(x_i_,y_h_){return caml_lessequal(x_i_,y_h_)?x_i_:y_h_;}
    function _b0_(s1_bQ_,s2_bS_)
     {var
       l1_bR_=s1_bQ_.getLen(),
       l2_bT_=s2_bS_.getLen(),
       s_bU_=caml_create_string(l1_bR_+l2_bT_|0);
      caml_blit_string(s1_bQ_,0,s_bU_,0,l1_bR_);
      caml_blit_string(s2_bS_,0,s_bU_,l1_bR_,l2_bT_);
      return s_bU_;}
    /*<<846: pervasives.ml 186 2 19>>*/function string_of_int_b1_(n_bV_)
     {return caml_format_int(_bL_,n_bV_);}
    /*<<220: pervasives.ml 451 20 39>>*/function do_at_exit_b2_(param_bZ_)
     {var param_bW_=caml_ml_out_channels_list(0);
      /*<<720: pervasives.ml 253 17 50>>*/for(;;)
       {if(param_bW_)
         {var l_bX_=param_bW_[2];
          try {}catch(_bY_){}
          var param_bW_=l_bX_;
          continue;}
        return 0;}}
    caml_register_named_value(_bI_,do_at_exit_b2_);
    function _b8_(a1_b3_,a2_b5_)
     {var l1_b4_=a1_b3_.length-1;
      if(0===l1_b4_)
       {var
         l_b6_=a2_b5_.length-1,
         _b7_=0===l_b6_?[0]:caml_array_sub(a2_b5_,0,l_b6_);
        return _b7_;}
      return 0===a2_b5_.length-1
              ?caml_array_sub(a1_b3_,0,l1_b4_)
              :caml_array_append(a1_b3_,a2_b5_);}
    function _cj_(n_b9_,c_b$_)
     {var s_b__=caml_create_string(n_b9_);
      caml_fill_string(s_b__,0,n_b9_,c_b$_);
      return s_b__;}
    function _ck_(s_cc_,ofs_ca_,len_cb_)
     {if(0<=ofs_ca_&&0<=len_cb_&&!((s_cc_.getLen()-len_cb_|0)<ofs_ca_))
       {var r_cd_=caml_create_string(len_cb_);
        /*<<6675: string.ml 41 7 5>>*/caml_blit_string
         (s_cc_,ofs_ca_,r_cd_,0,len_cb_);
        return r_cd_;}
      return _bO_(_bA_);}
    function _cl_(s1_cg_,ofs1_cf_,s2_ci_,ofs2_ch_,len_ce_)
     {if
       (0<=
        len_ce_&&
        0<=
        ofs1_cf_&&
        !((s1_cg_.getLen()-len_ce_|0)<ofs1_cf_)&&
        0<=
        ofs2_ch_&&
        !((s2_ci_.getLen()-len_ce_|0)<ofs2_ch_))
       return caml_blit_string(s1_cg_,ofs1_cf_,s2_ci_,ofs2_ch_,len_ce_);
      return _bO_(_bB_);}
    var
     _cm_=caml_sys_const_word_size(0),
     _cn_=caml_mul(_cm_/8|0,(1<<(_cm_-10|0))-1|0)-1|0;
    /*<<8284: buffer.ml 23 1 59>>*/function _cF_(n_co_)
     {var
       n_cp_=1<=n_co_?n_co_:1,
       n_cq_=_cn_<n_cp_?_cn_:n_cp_,
       s_cr_=caml_create_string(n_cq_);
      return [0,s_cr_,0,n_cq_,s_cr_];}
    /*<<8274: buffer.ml 28 17 49>>*/function _cG_(b_cs_)
     {return _ck_(b_cs_[1],0,b_cs_[2]);}
    function _cz_(b_ct_,more_cv_)
     {var new_len_cu_=[0,b_ct_[3]];
      for(;;)
       {if(new_len_cu_[1]<(b_ct_[2]+more_cv_|0))
         {new_len_cu_[1]=2*new_len_cu_[1]|0;continue;}
        if(_cn_<new_len_cu_[1])
         if((b_ct_[2]+more_cv_|0)<=_cn_)
          /*<<8082: buffer.ml 68 9 41>>*/new_len_cu_[1]=_cn_;
         else
          /*<<8089: buffer.ml 69 9 50>>*/_j_(_bz_);
        var new_buffer_cw_=caml_create_string(new_len_cu_[1]);
        /*<<8095: buffer.ml 69 9 50>>*/_cl_
         (b_ct_[1],0,new_buffer_cw_,0,b_ct_[2]);
        /*<<8095: buffer.ml 69 9 50>>*/b_ct_[1]=new_buffer_cw_;
        /*<<8095: buffer.ml 69 9 50>>*/b_ct_[3]=new_len_cu_[1];
        return 0;}}
    function _cH_(b_cx_,c_cA_)
     {var pos_cy_=b_cx_[2];
      if(b_cx_[3]<=pos_cy_)/*<<8019: buffer.ml 78 26 36>>*/_cz_(b_cx_,1);
      /*<<8023: buffer.ml 78 26 36>>*/b_cx_[1].safeSet(pos_cy_,c_cA_);
      /*<<8023: buffer.ml 78 26 36>>*/b_cx_[2]=pos_cy_+1|0;
      return 0;}
    function _cI_(b_cD_,s_cB_)
     {var len_cC_=s_cB_.getLen(),new_position_cE_=b_cD_[2]+len_cC_|0;
      if(b_cD_[3]<new_position_cE_)
       /*<<7921: buffer.ml 93 34 46>>*/_cz_(b_cD_,len_cC_);
      /*<<7925: buffer.ml 93 34 46>>*/_cl_(s_cB_,0,b_cD_[1],b_cD_[2],len_cC_);
      /*<<7925: buffer.ml 93 34 46>>*/b_cD_[2]=new_position_cE_;
      return 0;}
    /*<<11963: printf.ml 32 4 80>>*/function index_of_int_cM_(i_cJ_)
     {return 0<=i_cJ_?i_cJ_:_j_(_b0_(_be_,string_of_int_b1_(i_cJ_)));}
    function add_int_index_cN_(i_cK_,idx_cL_)
     {return index_of_int_cM_(i_cK_+idx_cL_|0);}
    var _cP_=_cO_(add_int_index_cN_,1);
    /*<<11929: printf.ml 58 22 66>>*/function _cW_(fmt_cQ_)
     {return _ck_(fmt_cQ_,0,fmt_cQ_.getLen());}
    function bad_conversion_cY_(sfmt_cR_,i_cS_,c_cU_)
     {var
       _cT_=_b0_(_bh_,_b0_(sfmt_cR_,_bi_)),
       _cV_=_b0_(_bg_,_b0_(string_of_int_b1_(i_cS_),_cT_));
      return _bO_(_b0_(_bf_,_b0_(_cj_(1,c_cU_),_cV_)));}
    function bad_conversion_format_dR_(fmt_cX_,i_c0_,c_cZ_)
     {return bad_conversion_cY_(_cW_(fmt_cX_),i_c0_,c_cZ_);}
    /*<<11842: printf.ml 75 2 34>>*/function incomplete_format_dS_(fmt_c1_)
     {return _bO_(_b0_(_bj_,_b0_(_cW_(fmt_c1_),_bk_)));}
    function extract_format_dn_(fmt_c2_,start_c__,stop_da_,widths_dc_)
     {/*<<11574: printf.ml 123 4 16>>*/function skip_positional_spec_c9_
       (start_c3_)
       {if
         ((fmt_c2_.safeGet(start_c3_)-48|0)<
          0||
          9<
          (fmt_c2_.safeGet(start_c3_)-48|0))
         return start_c3_;
        var i_c4_=start_c3_+1|0;
        /*<<11545: printf.ml 126 8 20>>*/for(;;)
         {var _c5_=fmt_c2_.safeGet(i_c4_);
          if(48<=_c5_)
           {if(!(58<=_c5_)){var _c7_=i_c4_+1|0,i_c4_=_c7_;continue;}
            var _c6_=0;}
          else
           if(36===_c5_){var _c8_=i_c4_+1|0,_c6_=1;}else var _c6_=0;
          if(!_c6_)var _c8_=start_c3_;
          return _c8_;}}
      var
       start_c$_=skip_positional_spec_c9_(start_c__+1|0),
       b_db_=_cF_((stop_da_-start_c$_|0)+10|0);
      _cH_(b_db_,37);
      var l1_dd_=widths_dc_,l2_de_=0;
      for(;;)
       {if(l1_dd_)
         {var
           l_df_=l1_dd_[2],
           _dg_=[0,l1_dd_[1],l2_de_],
           l1_dd_=l_df_,
           l2_de_=_dg_;
          continue;}
        var i_dh_=start_c$_,widths_di_=l2_de_;
        for(;;)
         {if(i_dh_<=stop_da_)
           {var _dj_=fmt_c2_.safeGet(i_dh_);
            if(42===_dj_)
             {if(widths_di_)
               {var t_dk_=widths_di_[2];
                _cI_(b_db_,string_of_int_b1_(widths_di_[1]));
                var
                 i_dl_=skip_positional_spec_c9_(i_dh_+1|0),
                 i_dh_=i_dl_,
                 widths_di_=t_dk_;
                continue;}
              throw [0,_bM_,_bl_];}
            _cH_(b_db_,_dj_);
            var _dm_=i_dh_+1|0,i_dh_=_dm_;
            continue;}
          return _cG_(b_db_);}}}
    function extract_format_int_fh_
     (conv_dt_,fmt_dr_,start_dq_,stop_dp_,widths_do_)
     {var sfmt_ds_=extract_format_dn_(fmt_dr_,start_dq_,stop_dp_,widths_do_);
      if(78!==conv_dt_&&110!==conv_dt_)return sfmt_ds_;
      /*<<11463: printf.ml 155 4 8>>*/sfmt_ds_.safeSet
       (sfmt_ds_.getLen()-1|0,117);
      return sfmt_ds_;}
    function sub_format_dT_
     (incomplete_format_dA_,bad_conversion_format_dK_,conv_dP_,fmt_du_,i_dO_)
     {var len_dv_=fmt_du_.getLen();
      function sub_fmt_dM_(c_dw_,i_dJ_)
       {var close_dx_=40===c_dw_?41:125;
        /*<<11228: printf.ml 181 7 26>>*/function sub_dI_(j_dy_)
         {var j_dz_=j_dy_;
          /*<<11228: printf.ml 181 7 26>>*/for(;;)
           {if(len_dv_<=j_dz_)return _cO_(incomplete_format_dA_,fmt_du_);
            if(37===fmt_du_.safeGet(j_dz_))
             {var _dB_=j_dz_+1|0;
              if(len_dv_<=_dB_)
               var _dC_=_cO_(incomplete_format_dA_,fmt_du_);
              else
               {var _dD_=fmt_du_.safeGet(_dB_),_dE_=_dD_-40|0;
                if(_dE_<0||1<_dE_)
                 {var _dF_=_dE_-83|0;
                  if(_dF_<0||2<_dF_)
                   var _dG_=1;
                  else
                   switch(_dF_)
                    {case 1:var _dG_=1;break;
                     case 2:var _dH_=1,_dG_=0;break;
                     default:var _dH_=0,_dG_=0;}
                  if(_dG_){var _dC_=sub_dI_(_dB_+1|0),_dH_=2;}}
                else
                 var _dH_=0===_dE_?0:1;
                switch(_dH_)
                 {case 1:
                   var
                    _dC_=
                     _dD_===close_dx_
                      ?_dB_+1|0
                      :_dL_(bad_conversion_format_dK_,fmt_du_,i_dJ_,_dD_);
                   break;
                  case 2:break;
                  default:var _dC_=sub_dI_(sub_fmt_dM_(_dD_,_dB_+1|0)+1|0);}}
              return _dC_;}
            var _dN_=j_dz_+1|0,j_dz_=_dN_;
            continue;}}
        return sub_dI_(i_dJ_);}
      return sub_fmt_dM_(conv_dP_,i_dO_);}
    /*<<11222: printf.ml 199 2 57>>*/function sub_format_for_printf_eh_
     (conv_dQ_)
     {return _dL_
              (sub_format_dT_,
               incomplete_format_dS_,
               bad_conversion_format_dR_,
               conv_dQ_);}
    function iter_on_format_args_ex_(fmt_dU_,add_conv_d5_,add_char_ed_)
     {var lim_dV_=fmt_dU_.getLen()-1|0;
      /*<<11162: printf.ml 254 4 10>>*/function scan_fmt_ef_(i_dW_)
       {var i_dX_=i_dW_;
        a:
        /*<<11162: printf.ml 254 4 10>>*/for(;;)
         {if(i_dX_<lim_dV_)
           {if(37===fmt_dU_.safeGet(i_dX_))
             {var skip_dY_=0,i_dZ_=i_dX_+1|0;
              for(;;)
               {if(lim_dV_<i_dZ_)
                 var _d0_=incomplete_format_dS_(fmt_dU_);
                else
                 {var _d1_=fmt_dU_.safeGet(i_dZ_);
                  if(58<=_d1_)
                   {if(95===_d1_)
                     {var _d3_=i_dZ_+1|0,_d2_=1,skip_dY_=_d2_,i_dZ_=_d3_;
                      continue;}}
                  else
                   if(32<=_d1_)
                    switch(_d1_-32|0)
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
                      case 13:var _d4_=i_dZ_+1|0,i_dZ_=_d4_;continue;
                      case 10:
                       var _d6_=_dL_(add_conv_d5_,skip_dY_,i_dZ_,105),i_dZ_=_d6_;
                       continue;
                      default:var _d7_=i_dZ_+1|0,i_dZ_=_d7_;continue;}
                  var i_d8_=i_dZ_;
                  c:
                  for(;;)
                   {if(lim_dV_<i_d8_)
                     var _d9_=incomplete_format_dS_(fmt_dU_);
                    else
                     {var _d__=fmt_dU_.safeGet(i_d8_);
                      if(126<=_d__)
                       var _d$_=0;
                      else
                       switch(_d__)
                        {case 78:
                         case 88:
                         case 100:
                         case 105:
                         case 111:
                         case 117:
                         case 120:
                          var _d9_=_dL_(add_conv_d5_,skip_dY_,i_d8_,105),_d$_=1;break;
                         case 69:
                         case 70:
                         case 71:
                         case 101:
                         case 102:
                         case 103:
                          var _d9_=_dL_(add_conv_d5_,skip_dY_,i_d8_,102),_d$_=1;break;
                         case 33:
                         case 37:
                         case 44:
                         case 64:var _d9_=i_d8_+1|0,_d$_=1;break;
                         case 83:
                         case 91:
                         case 115:
                          var _d9_=_dL_(add_conv_d5_,skip_dY_,i_d8_,115),_d$_=1;break;
                         case 97:
                         case 114:
                         case 116:
                          var _d9_=_dL_(add_conv_d5_,skip_dY_,i_d8_,_d__),_d$_=1;
                          break;
                         case 76:
                         case 108:
                         case 110:
                          var j_ea_=i_d8_+1|0;
                          if(lim_dV_<j_ea_)
                           {var _d9_=_dL_(add_conv_d5_,skip_dY_,i_d8_,105),_d$_=1;}
                          else
                           {var _eb_=fmt_dU_.safeGet(j_ea_)-88|0;
                            if(_eb_<0||32<_eb_)
                             var _ec_=1;
                            else
                             switch(_eb_)
                              {case 0:
                               case 12:
                               case 17:
                               case 23:
                               case 29:
                               case 32:
                                var
                                 _d9_=
                                  _ee_
                                   (add_char_ed_,_dL_(add_conv_d5_,skip_dY_,i_d8_,_d__),105),
                                 _d$_=1,
                                 _ec_=0;
                                break;
                               default:var _ec_=1;}
                            if(_ec_)
                             {var _d9_=_dL_(add_conv_d5_,skip_dY_,i_d8_,105),_d$_=1;}}
                          break;
                         case 67:
                         case 99:
                          var _d9_=_dL_(add_conv_d5_,skip_dY_,i_d8_,99),_d$_=1;break;
                         case 66:
                         case 98:
                          var _d9_=_dL_(add_conv_d5_,skip_dY_,i_d8_,66),_d$_=1;break;
                         case 41:
                         case 125:
                          var _d9_=_dL_(add_conv_d5_,skip_dY_,i_d8_,_d__),_d$_=1;
                          break;
                         case 40:
                          var
                           _d9_=scan_fmt_ef_(_dL_(add_conv_d5_,skip_dY_,i_d8_,_d__)),
                           _d$_=1;
                          break;
                         case 123:
                          var
                           i_eg_=_dL_(add_conv_d5_,skip_dY_,i_d8_,_d__),
                           j_ei_=_dL_(sub_format_for_printf_eh_,_d__,fmt_dU_,i_eg_),
                           i_ej_=i_eg_;
                          /*<<10784: printf.ml 240 8 63>>*/for(;;)
                           {if(i_ej_<(j_ei_-2|0))
                             {var
                               _ek_=_ee_(add_char_ed_,i_ej_,fmt_dU_.safeGet(i_ej_)),
                               i_ej_=_ek_;
                              continue;}
                            var _el_=j_ei_-1|0,i_d8_=_el_;
                            continue c;}
                         default:var _d$_=0;}
                      if(!_d$_)
                       var _d9_=bad_conversion_format_dR_(fmt_dU_,i_d8_,_d__);}
                    var _d0_=_d9_;
                    break;}}
                var i_dX_=_d0_;
                continue a;}}
            var _em_=i_dX_+1|0,i_dX_=_em_;
            continue;}
          return i_dX_;}}
      scan_fmt_ef_(0);
      return 0;}
    /*<<10497: printf.ml 310 2 12>>*/function
     count_printing_arguments_of_format_gw_
     (fmt_ey_)
     {var ac_en_=[0,0,0,0];
      function add_conv_ew_(skip_es_,i_et_,c_eo_)
       {var _ep_=41!==c_eo_?1:0,_eq_=_ep_?125!==c_eo_?1:0:_ep_;
        if(_eq_)
         {var inc_er_=97===c_eo_?2:1;
          if(114===c_eo_)
           /*<<10553: printf.ml 295 20 48>>*/ac_en_[3]=ac_en_[3]+1|0;
          if(skip_es_)
           /*<<10562: printf.ml 297 9 39>>*/ac_en_[2]=ac_en_[2]+inc_er_|0;
          else
           /*<<10570: printf.ml 298 9 39>>*/ac_en_[1]=ac_en_[1]+inc_er_|0;}
        return i_et_+1|0;}
      /*<<10578: printf.ml 292 2 4>>*/iter_on_format_args_ex_
       (fmt_ey_,add_conv_ew_,function(i_eu_,param_ev_){return i_eu_+1|0;});
      return ac_en_[1];}
    function scan_positional_spec_fd_(fmt_ez_,got_spec_eC_,i_eA_)
     {var _eB_=fmt_ez_.safeGet(i_eA_);
      if((_eB_-48|0)<0||9<(_eB_-48|0))return _ee_(got_spec_eC_,0,i_eA_);
      var accu_eD_=_eB_-48|0,j_eE_=i_eA_+1|0;
      for(;;)
       {var _eF_=fmt_ez_.safeGet(j_eE_);
        if(48<=_eF_)
         {if(!(58<=_eF_))
           {var
             _eI_=j_eE_+1|0,
             _eH_=(10*accu_eD_|0)+(_eF_-48|0)|0,
             accu_eD_=_eH_,
             j_eE_=_eI_;
            continue;}
          var _eG_=0;}
        else
         if(36===_eF_)
          if(0===accu_eD_)
           {var _eJ_=_j_(_bn_),_eG_=1;}
          else
           {var
             _eJ_=
              _ee_(got_spec_eC_,[0,index_of_int_cM_(accu_eD_-1|0)],j_eE_+1|0),
             _eG_=1;}
         else
          var _eG_=0;
        if(!_eG_)var _eJ_=_ee_(got_spec_eC_,0,i_eA_);
        return _eJ_;}}
    function next_index_e__(spec_eK_,n_eL_)
     {return spec_eK_?n_eL_:_cO_(_cP_,n_eL_);}
    function get_index_eZ_(spec_eM_,n_eN_){return spec_eM_?spec_eM_[1]:n_eN_;}
    function _hY_
     (to_s_gR_,get_out_eP_,outc_g3_,outs_eS_,flush_gB_,k_g9_,fmt_eO_)
     {var out_eQ_=_cO_(get_out_eP_,fmt_eO_);
      /*<<8830: printf.ml 615 15 25>>*/function outs_gS_(s_eR_)
       {return _ee_(outs_eS_,out_eQ_,s_eR_);}
      function pr_gA_(k_eX_,n_g8_,fmt_eT_,v_e2_)
       {var len_eW_=fmt_eT_.getLen();
        function doprn_gx_(n_g0_,i_eU_)
         {var i_eV_=i_eU_;
          for(;;)
           {if(len_eW_<=i_eV_)return _cO_(k_eX_,out_eQ_);
            var _eY_=fmt_eT_.safeGet(i_eV_);
            if(37===_eY_)
             {var
               get_arg_e6_=
                function(spec_e1_,n_e0_)
                 {return caml_array_get(v_e2_,get_index_eZ_(spec_e1_,n_e0_));},
               scan_flags_fa_=
                function(spec_fc_,n_e7_,widths_e9_,i_e3_)
                 {var i_e4_=i_e3_;
                  for(;;)
                   {var _e5_=fmt_eT_.safeGet(i_e4_)-32|0;
                    if(!(_e5_<0||25<_e5_))
                     switch(_e5_)
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
                        return scan_positional_spec_fd_
                                (fmt_eT_,
                                 function(wspec_e8_,i_fb_)
                                  {var _e$_=[0,get_arg_e6_(wspec_e8_,n_e7_),widths_e9_];
                                   return scan_flags_fa_
                                           (spec_fc_,next_index_e__(wspec_e8_,n_e7_),_e$_,i_fb_);},
                                 i_e4_+1|0);
                       default:var _fe_=i_e4_+1|0,i_e4_=_fe_;continue;}
                    var _ff_=fmt_eT_.safeGet(i_e4_);
                    if(124<=_ff_)
                     var _fg_=0;
                    else
                     switch(_ff_)
                      {case 78:
                       case 88:
                       case 100:
                       case 105:
                       case 111:
                       case 117:
                       case 120:
                        var
                         x_fi_=get_arg_e6_(spec_fc_,n_e7_),
                         s_fj_=
                          caml_format_int
                           (extract_format_int_fh_(_ff_,fmt_eT_,i_eV_,i_e4_,widths_e9_),
                            x_fi_),
                         _fl_=
                          cont_s_fk_(next_index_e__(spec_fc_,n_e7_),s_fj_,i_e4_+1|0),
                         _fg_=1;
                        break;
                       case 69:
                       case 71:
                       case 101:
                       case 102:
                       case 103:
                        var
                         x_fm_=get_arg_e6_(spec_fc_,n_e7_),
                         s_fn_=
                          caml_format_float
                           (extract_format_dn_(fmt_eT_,i_eV_,i_e4_,widths_e9_),x_fm_),
                         _fl_=
                          cont_s_fk_(next_index_e__(spec_fc_,n_e7_),s_fn_,i_e4_+1|0),
                         _fg_=1;
                        break;
                       case 76:
                       case 108:
                       case 110:
                        var _fo_=fmt_eT_.safeGet(i_e4_+1|0)-88|0;
                        if(_fo_<0||32<_fo_)
                         var _fp_=1;
                        else
                         switch(_fo_)
                          {case 0:
                           case 12:
                           case 17:
                           case 23:
                           case 29:
                           case 32:
                            var i_fq_=i_e4_+1|0,_fr_=_ff_-108|0;
                            if(_fr_<0||2<_fr_)
                             var _fs_=0;
                            else
                             {switch(_fr_)
                               {case 1:var _fs_=0,_ft_=0;break;
                                case 2:
                                 var
                                  x_fu_=get_arg_e6_(spec_fc_,n_e7_),
                                  _fv_=
                                   caml_format_int
                                    (extract_format_dn_(fmt_eT_,i_eV_,i_fq_,widths_e9_),x_fu_),
                                  _ft_=1;
                                 break;
                                default:
                                 var
                                  x_fw_=get_arg_e6_(spec_fc_,n_e7_),
                                  _fv_=
                                   caml_format_int
                                    (extract_format_dn_(fmt_eT_,i_eV_,i_fq_,widths_e9_),x_fw_),
                                  _ft_=1;}
                              if(_ft_){var s_fx_=_fv_,_fs_=1;}}
                            if(!_fs_)
                             {var
                               x_fy_=get_arg_e6_(spec_fc_,n_e7_),
                               s_fx_=
                                caml_int64_format
                                 (extract_format_dn_(fmt_eT_,i_eV_,i_fq_,widths_e9_),x_fy_);}
                            var
                             _fl_=
                              cont_s_fk_(next_index_e__(spec_fc_,n_e7_),s_fx_,i_fq_+1|0),
                             _fg_=1,
                             _fp_=0;
                            break;
                           default:var _fp_=1;}
                        if(_fp_)
                         {var
                           x_fz_=get_arg_e6_(spec_fc_,n_e7_),
                           s_fA_=
                            caml_format_int
                             (extract_format_int_fh_(110,fmt_eT_,i_eV_,i_e4_,widths_e9_),
                              x_fz_),
                           _fl_=
                            cont_s_fk_(next_index_e__(spec_fc_,n_e7_),s_fA_,i_e4_+1|0),
                           _fg_=1;}
                        break;
                       case 37:
                       case 64:
                        var _fl_=cont_s_fk_(n_e7_,_cj_(1,_ff_),i_e4_+1|0),_fg_=1;
                        break;
                       case 83:
                       case 115:
                        var x_fB_=get_arg_e6_(spec_fc_,n_e7_);
                        if(115===_ff_)
                         var x_fC_=x_fB_;
                        else
                         {var n_fD_=[0,0],_fE_=0,_fF_=x_fB_.getLen()-1|0;
                          if(!(_fF_<_fE_))
                           {var i_fG_=_fE_;
                            for(;;)
                             {var
                               _fH_=x_fB_.safeGet(i_fG_),
                               _fI_=
                                14<=_fH_
                                 ?34===_fH_?1:92===_fH_?1:0
                                 :11<=_fH_?13<=_fH_?1:0:8<=_fH_?1:0,
                               _fJ_=_fI_?2:caml_is_printable(_fH_)?1:4;
                              n_fD_[1]=n_fD_[1]+_fJ_|0;
                              var _fK_=i_fG_+1|0;
                              if(_fF_!==i_fG_){var i_fG_=_fK_;continue;}
                              break;}}
                          if(n_fD_[1]===x_fB_.getLen())
                           var _fL_=x_fB_;
                          else
                           {var s__fM_=caml_create_string(n_fD_[1]);
                            /*<<5987: string.ml 115 33 9>>*/n_fD_[1]=0;
                            var _fN_=0,_fO_=x_fB_.getLen()-1|0;
                            if(!(_fO_<_fN_))
                             {var i_fP_=_fN_;
                              for(;;)
                               {var _fQ_=x_fB_.safeGet(i_fP_),_fR_=_fQ_-34|0;
                                if(_fR_<0||58<_fR_)
                                 if(-20<=_fR_)
                                  var _fS_=1;
                                 else
                                  {switch(_fR_+34|0)
                                    {case 8:
                                      /*<<6079: string.ml 130 16 67>>*/s__fM_.safeSet(n_fD_[1],92);
                                      /*<<6079: string.ml 130 16 67>>*/n_fD_[1]+=1;
                                      /*<<6079: string.ml 130 16 67>>*/s__fM_.safeSet(n_fD_[1],98);
                                      var _fT_=1;
                                      break;
                                     case 9:
                                      /*<<6096: string.ml 126 16 67>>*/s__fM_.safeSet(n_fD_[1],92);
                                      /*<<6096: string.ml 126 16 67>>*/n_fD_[1]+=1;
                                      /*<<6096: string.ml 126 16 67>>*/s__fM_.safeSet
                                       (n_fD_[1],116);
                                      var _fT_=1;
                                      break;
                                     case 10:
                                      /*<<6113: string.ml 124 16 67>>*/s__fM_.safeSet(n_fD_[1],92);
                                      /*<<6113: string.ml 124 16 67>>*/n_fD_[1]+=1;
                                      /*<<6113: string.ml 124 16 67>>*/s__fM_.safeSet
                                       (n_fD_[1],110);
                                      var _fT_=1;
                                      break;
                                     case 13:
                                      /*<<6130: string.ml 128 16 67>>*/s__fM_.safeSet(n_fD_[1],92);
                                      /*<<6130: string.ml 128 16 67>>*/n_fD_[1]+=1;
                                      /*<<6130: string.ml 128 16 67>>*/s__fM_.safeSet
                                       (n_fD_[1],114);
                                      var _fT_=1;
                                      break;
                                     default:var _fS_=1,_fT_=0;}
                                   if(_fT_)var _fS_=0;}
                                else
                                 var
                                  _fS_=
                                   (_fR_-1|0)<0||56<(_fR_-1|0)
                                    ?(s__fM_.safeSet(n_fD_[1],92),
                                      n_fD_[1]+=
                                      1,
                                      s__fM_.safeSet(n_fD_[1],_fQ_),
                                      0)
                                    :1;
                                if(_fS_)
                                 if(caml_is_printable(_fQ_))
                                  /*<<6159: string.ml 133 18 36>>*/s__fM_.safeSet
                                   (n_fD_[1],_fQ_);
                                 else
                                  {/*<<6166: string.ml 134 21 19>>*/s__fM_.safeSet
                                    (n_fD_[1],92);
                                   /*<<6166: string.ml 134 21 19>>*/n_fD_[1]+=1;
                                   /*<<6166: string.ml 134 21 19>>*/s__fM_.safeSet
                                    (n_fD_[1],48+(_fQ_/100|0)|0);
                                   /*<<6166: string.ml 134 21 19>>*/n_fD_[1]+=1;
                                   /*<<6166: string.ml 134 21 19>>*/s__fM_.safeSet
                                    (n_fD_[1],48+((_fQ_/10|0)%10|0)|0);
                                   /*<<6166: string.ml 134 21 19>>*/n_fD_[1]+=1;
                                   /*<<6166: string.ml 134 21 19>>*/s__fM_.safeSet
                                    (n_fD_[1],48+(_fQ_%10|0)|0);}
                                n_fD_[1]+=1;
                                var _fU_=i_fP_+1|0;
                                if(_fO_!==i_fP_){var i_fP_=_fU_;continue;}
                                break;}}
                            var _fL_=s__fM_;}
                          var x_fC_=_b0_(_bu_,_b0_(_fL_,_bv_));}
                        if(i_e4_===(i_eV_+1|0))
                         var s_fV_=x_fC_;
                        else
                         {var
                           _fW_=
                            extract_format_dn_(fmt_eT_,i_eV_,i_e4_,widths_e9_);
                          /*<<11812: printf.ml 83 2 42>>*/try
                           {var neg_fX_=0,i_fY_=1;
                            for(;;)
                             {if(_fW_.getLen()<=i_fY_)
                               var _fZ_=[0,0,neg_fX_];
                              else
                               {var _f0_=_fW_.safeGet(i_fY_);
                                if(49<=_f0_)
                                 if(58<=_f0_)
                                  var _f1_=0;
                                 else
                                  {var
                                    _fZ_=
                                     [0,
                                      caml_int_of_string
                                       (_ck_(_fW_,i_fY_,(_fW_.getLen()-i_fY_|0)-1|0)),
                                      neg_fX_],
                                    _f1_=1;}
                                else
                                 {if(45===_f0_)
                                   {var _f3_=i_fY_+1|0,_f2_=1,neg_fX_=_f2_,i_fY_=_f3_;
                                    continue;}
                                  var _f1_=0;}
                                if(!_f1_){var _f4_=i_fY_+1|0,i_fY_=_f4_;continue;}}
                              var match_f5_=_fZ_;
                              break;}}
                          catch(_f6_)
                           {if(_f6_[1]!==_a_)throw _f6_;
                            var match_f5_=bad_conversion_cY_(_fW_,0,115);}
                          var
                           p_f7_=match_f5_[1],
                           _f8_=x_fC_.getLen(),
                           _f9_=0,
                           neg_gb_=match_f5_[2],
                           _ga_=32;
                          if(p_f7_===_f8_&&0===_f9_)
                           {var _f__=x_fC_,_f$_=1;}
                          else
                           var _f$_=0;
                          if(!_f$_)
                           if(p_f7_<=_f8_)
                            var _f__=_ck_(x_fC_,_f9_,_f8_);
                           else
                            {var res_gc_=_cj_(p_f7_,_ga_);
                             if(neg_gb_)
                              /*<<11709: printf.ml 105 7 32>>*/_cl_
                               (x_fC_,_f9_,res_gc_,0,_f8_);
                             else
                              /*<<11726: printf.ml 106 7 40>>*/_cl_
                               (x_fC_,_f9_,res_gc_,p_f7_-_f8_|0,_f8_);
                             var _f__=res_gc_;}
                          var s_fV_=_f__;}
                        var
                         _fl_=
                          cont_s_fk_(next_index_e__(spec_fc_,n_e7_),s_fV_,i_e4_+1|0),
                         _fg_=1;
                        break;
                       case 67:
                       case 99:
                        var x_gd_=get_arg_e6_(spec_fc_,n_e7_);
                        if(99===_ff_)
                         var s_ge_=_cj_(1,x_gd_);
                        else
                         {if(39===x_gd_)
                           var _gf_=_bC_;
                          else
                           if(92===x_gd_)
                            var _gf_=_bD_;
                           else
                            {if(14<=x_gd_)
                              var _gg_=0;
                             else
                              switch(x_gd_)
                               {case 8:var _gf_=_bH_,_gg_=1;break;
                                case 9:var _gf_=_bG_,_gg_=1;break;
                                case 10:var _gf_=_bF_,_gg_=1;break;
                                case 13:var _gf_=_bE_,_gg_=1;break;
                                default:var _gg_=0;}
                             if(!_gg_)
                              if(caml_is_printable(x_gd_))
                               {var s_gh_=caml_create_string(1);
                                /*<<5422: char.ml 37 27 7>>*/s_gh_.safeSet(0,x_gd_);
                                var _gf_=s_gh_;}
                              else
                               {var s_gi_=caml_create_string(4);
                                /*<<5432: char.ml 41 13 7>>*/s_gi_.safeSet(0,92);
                                /*<<5432: char.ml 41 13 7>>*/s_gi_.safeSet
                                 (1,48+(x_gd_/100|0)|0);
                                /*<<5432: char.ml 41 13 7>>*/s_gi_.safeSet
                                 (2,48+((x_gd_/10|0)%10|0)|0);
                                /*<<5432: char.ml 41 13 7>>*/s_gi_.safeSet
                                 (3,48+(x_gd_%10|0)|0);
                                var _gf_=s_gi_;}}
                          var s_ge_=_b0_(_bs_,_b0_(_gf_,_bt_));}
                        var
                         _fl_=
                          cont_s_fk_(next_index_e__(spec_fc_,n_e7_),s_ge_,i_e4_+1|0),
                         _fg_=1;
                        break;
                       case 66:
                       case 98:
                        var
                         _gk_=i_e4_+1|0,
                         _gj_=get_arg_e6_(spec_fc_,n_e7_)?_bK_:_bJ_,
                         _fl_=cont_s_fk_(next_index_e__(spec_fc_,n_e7_),_gj_,_gk_),
                         _fg_=1;
                        break;
                       case 40:
                       case 123:
                        var
                         xf_gl_=get_arg_e6_(spec_fc_,n_e7_),
                         i_gm_=_dL_(sub_format_for_printf_eh_,_ff_,fmt_eT_,i_e4_+1|0);
                        if(123===_ff_)
                         {var
                           b_gn_=_cF_(xf_gl_.getLen()),
                           add_char_gr_=
                            function(i_gp_,c_go_){_cH_(b_gn_,c_go_);return i_gp_+1|0;};
                          /*<<10644: printf.ml 268 2 19>>*/iter_on_format_args_ex_
                           (xf_gl_,
                            function(skip_gq_,i_gt_,c_gs_)
                             {if(skip_gq_)
                               /*<<10609: printf.ml 272 17 41>>*/_cI_(b_gn_,_bm_);
                              else
                               /*<<10618: printf.ml 272 47 68>>*/_cH_(b_gn_,37);
                              return add_char_gr_(i_gt_,c_gs_);},
                            add_char_gr_);
                          var
                           _gu_=_cG_(b_gn_),
                           _fl_=cont_s_fk_(next_index_e__(spec_fc_,n_e7_),_gu_,i_gm_),
                           _fg_=1;}
                        else
                         {var
                           _gv_=next_index_e__(spec_fc_,n_e7_),
                           m_gy_=
                            add_int_index_cN_
                             (count_printing_arguments_of_format_gw_(xf_gl_),_gv_),
                           _fl_=
                            pr_gA_
                             (/*<<8760: printf.ml 647 30 39>>*/function(param_gz_)
                               {return doprn_gx_(m_gy_,i_gm_);},
                              _gv_,
                              xf_gl_,
                              v_e2_),
                           _fg_=1;}
                        break;
                       case 33:
                        _cO_(flush_gB_,out_eQ_);
                        var _fl_=doprn_gx_(n_e7_,i_e4_+1|0),_fg_=1;
                        break;
                       case 41:
                        var _fl_=cont_s_fk_(n_e7_,_by_,i_e4_+1|0),_fg_=1;break;
                       case 44:
                        var _fl_=cont_s_fk_(n_e7_,_bx_,i_e4_+1|0),_fg_=1;break;
                       case 70:
                        var x_gC_=get_arg_e6_(spec_fc_,n_e7_);
                        if(0===widths_e9_)
                         var _gD_=_bw_;
                        else
                         {var
                           sfmt_gE_=
                            extract_format_dn_(fmt_eT_,i_eV_,i_e4_,widths_e9_);
                          if(70===_ff_)
                           /*<<11427: printf.ml 164 4 8>>*/sfmt_gE_.safeSet
                            (sfmt_gE_.getLen()-1|0,103);
                          var _gD_=sfmt_gE_;}
                        var _gF_=caml_classify_float(x_gC_);
                        if(3===_gF_)
                         var s_gG_=x_gC_<0?_bq_:_bp_;
                        else
                         if(4<=_gF_)
                          var s_gG_=_br_;
                         else
                          {var
                            _gH_=caml_format_float(_gD_,x_gC_),
                            i_gI_=0,
                            l_gJ_=_gH_.getLen();
                           /*<<9936: printf.ml 448 6 37>>*/for(;;)
                            {if(l_gJ_<=i_gI_)
                              var _gK_=_b0_(_gH_,_bo_);
                             else
                              {var
                                _gL_=_gH_.safeGet(i_gI_)-46|0,
                                _gM_=
                                 _gL_<0||23<_gL_
                                  ?55===_gL_?1:0
                                  :(_gL_-1|0)<0||21<(_gL_-1|0)?1:0;
                               if(!_gM_){var _gN_=i_gI_+1|0,i_gI_=_gN_;continue;}
                               var _gK_=_gH_;}
                             var s_gG_=_gK_;
                             break;}}
                        var
                         _fl_=
                          cont_s_fk_(next_index_e__(spec_fc_,n_e7_),s_gG_,i_e4_+1|0),
                         _fg_=1;
                        break;
                       case 91:
                        var
                         _fl_=bad_conversion_format_dR_(fmt_eT_,i_e4_,_ff_),
                         _fg_=1;
                        break;
                       case 97:
                        var
                         printer_gO_=get_arg_e6_(spec_fc_,n_e7_),
                         n_gP_=_cO_(_cP_,get_index_eZ_(spec_fc_,n_e7_)),
                         arg_gQ_=get_arg_e6_(0,n_gP_),
                         _gU_=i_e4_+1|0,
                         _gT_=next_index_e__(spec_fc_,n_gP_);
                        if(to_s_gR_)
                         /*<<8701: printf.ml 631 8 63>>*/outs_gS_
                          (_ee_(printer_gO_,0,arg_gQ_));
                        else
                         /*<<8710: printf.ml 633 8 23>>*/_ee_
                          (printer_gO_,out_eQ_,arg_gQ_);
                        var _fl_=doprn_gx_(_gT_,_gU_),_fg_=1;
                        break;
                       case 114:
                        var
                         _fl_=bad_conversion_format_dR_(fmt_eT_,i_e4_,_ff_),
                         _fg_=1;
                        break;
                       case 116:
                        var
                         printer_gV_=get_arg_e6_(spec_fc_,n_e7_),
                         _gX_=i_e4_+1|0,
                         _gW_=next_index_e__(spec_fc_,n_e7_);
                        if(to_s_gR_)
                         /*<<8728: printf.ml 637 8 54>>*/outs_gS_
                          (_cO_(printer_gV_,0));
                        else
                         /*<<8736: printf.ml 639 8 19>>*/_cO_(printer_gV_,out_eQ_);
                        var _fl_=doprn_gx_(_gW_,_gX_),_fg_=1;
                        break;
                       default:var _fg_=0;}
                    if(!_fg_)
                     var _fl_=bad_conversion_format_dR_(fmt_eT_,i_e4_,_ff_);
                    return _fl_;}},
               _g2_=i_eV_+1|0,
               _gZ_=0;
              return scan_positional_spec_fd_
                      (fmt_eT_,
                       function(spec_g1_,i_gY_)
                        {return scan_flags_fa_(spec_g1_,n_g0_,_gZ_,i_gY_);},
                       _g2_);}
            /*<<8835: printf.ml 614 15 25>>*/_ee_(outc_g3_,out_eQ_,_eY_);
            var _g4_=i_eV_+1|0,i_eV_=_g4_;
            continue;}}
        function cont_s_fk_(n_g7_,s_g5_,i_g6_)
         {outs_gS_(s_g5_);return doprn_gx_(n_g7_,i_g6_);}
        return doprn_gx_(n_g8_,0);}
      var
       kpr_g__=_ee_(pr_gA_,k_g9_,index_of_int_cM_(0)),
       _g$_=count_printing_arguments_of_format_gw_(fmt_eO_);
      if(_g$_<0||6<_g$_)
       {var
         loop_hm_=
          function(i_ha_,args_hg_)
           {if(_g$_<=i_ha_)
             {var
               a_hb_=caml_make_vect(_g$_,0),
               _he_=
                function(i_hc_,arg_hd_)
                 {return caml_array_set(a_hb_,(_g$_-i_hc_|0)-1|0,arg_hd_);},
               i_hf_=0,
               param_hh_=args_hg_;
              for(;;)
               {if(param_hh_)
                 {var _hi_=param_hh_[2],_hj_=param_hh_[1];
                  if(_hi_)
                   {_he_(i_hf_,_hj_);
                    var _hk_=i_hf_+1|0,i_hf_=_hk_,param_hh_=_hi_;
                    continue;}
                  /*<<10476: printf.ml 318 11 16>>*/_he_(i_hf_,_hj_);}
                return _ee_(kpr_g__,fmt_eO_,a_hb_);}}
            /*<<10312: printf.ml 363 31 56>>*/return function(x_hl_)
             {return loop_hm_(i_ha_+1|0,[0,x_hl_,args_hg_]);};},
         _hn_=loop_hm_(0,0);}
      else
       switch(_g$_)
        {case 1:
          var
           _hn_=
            /*<<10298: printf.ml 331 6 15>>*/function(x_hp_)
             {var a_ho_=caml_make_vect(1,0);
              /*<<10298: printf.ml 331 6 15>>*/caml_array_set(a_ho_,0,x_hp_);
              return _ee_(kpr_g__,fmt_eO_,a_ho_);};
          break;
         case 2:
          var
           _hn_=
            function(x_hr_,y_hs_)
             {var a_hq_=caml_make_vect(2,0);
              caml_array_set(a_hq_,0,x_hr_);
              caml_array_set(a_hq_,1,y_hs_);
              return _ee_(kpr_g__,fmt_eO_,a_hq_);};
          break;
         case 3:
          var
           _hn_=
            function(x_hu_,y_hv_,z_hw_)
             {var a_ht_=caml_make_vect(3,0);
              caml_array_set(a_ht_,0,x_hu_);
              caml_array_set(a_ht_,1,y_hv_);
              caml_array_set(a_ht_,2,z_hw_);
              return _ee_(kpr_g__,fmt_eO_,a_ht_);};
          break;
         case 4:
          var
           _hn_=
            function(x_hy_,y_hz_,z_hA_,t_hB_)
             {var a_hx_=caml_make_vect(4,0);
              caml_array_set(a_hx_,0,x_hy_);
              caml_array_set(a_hx_,1,y_hz_);
              caml_array_set(a_hx_,2,z_hA_);
              caml_array_set(a_hx_,3,t_hB_);
              return _ee_(kpr_g__,fmt_eO_,a_hx_);};
          break;
         case 5:
          var
           _hn_=
            function(x_hD_,y_hE_,z_hF_,t_hG_,u_hH_)
             {var a_hC_=caml_make_vect(5,0);
              caml_array_set(a_hC_,0,x_hD_);
              caml_array_set(a_hC_,1,y_hE_);
              caml_array_set(a_hC_,2,z_hF_);
              caml_array_set(a_hC_,3,t_hG_);
              caml_array_set(a_hC_,4,u_hH_);
              return _ee_(kpr_g__,fmt_eO_,a_hC_);};
          break;
         case 6:
          var
           _hn_=
            function(x_hJ_,y_hK_,z_hL_,t_hM_,u_hN_,v_hO_)
             {var a_hI_=caml_make_vect(6,0);
              caml_array_set(a_hI_,0,x_hJ_);
              caml_array_set(a_hI_,1,y_hK_);
              caml_array_set(a_hI_,2,z_hL_);
              caml_array_set(a_hI_,3,t_hM_);
              caml_array_set(a_hI_,4,u_hN_);
              caml_array_set(a_hI_,5,v_hO_);
              return _ee_(kpr_g__,fmt_eO_,a_hI_);};
          break;
         default:var _hn_=_ee_(kpr_g__,fmt_eO_,[0]);}
      return _hn_;}
    /*<<8494: printf.ml 678 2 19>>*/function _hX_(fmt_hP_)
     {return _cF_(2*fmt_hP_.getLen()|0);}
    function _hU_(k_hS_,b_hQ_)
     {var s_hR_=_cG_(b_hQ_);
      /*<<8139: buffer.ml 56 14 29>>*/b_hQ_[2]=0;
      return _cO_(k_hS_,s_hR_);}
    /*<<8453: printf.ml 691 2 78>>*/function _h2_(k_hT_)
     {var _hW_=_cO_(_hU_,k_hT_);
      return _hZ_(_hY_,1,_hX_,_cH_,_cI_,function(_hV_){return 0;},_hW_);}
    /*<<8441: printf.ml 694 18 43>>*/function _h3_(fmt_h1_)
     {return _ee_
              (_h2_,
               /*<<8438: printf.ml 694 37 38>>*/function(s_h0_){return s_h0_;},
               fmt_h1_);}
    var
     _h4_=[0,0],
     null_h5_=null,
     undefined_h9_=undefined,
     array_constructor_h7_=Array,
     date_constr_h8_=Date;
    /*<<13052: js.ml 376 7 77>>*/function _h__(e_h6_)
     {return e_h6_ instanceof array_constructor_h7_
              ?0
              :[0,new MlWrappedString(e_h6_.toString())];}
    /*<<12349: printexc.ml 167 2 29>>*/_h4_[1]=[0,_h__,_h4_[1]];
    function _iw_(arr_h$_,f_ic_)
     {var l_ia_=arr_h$_.length-1;
      if(0===l_ia_)
       var _ib_=[0];
      else
       {var
         r_id_=caml_make_vect(l_ia_,_cO_(f_ic_,arr_h$_[0+1])),
         _ie_=1,
         _if_=l_ia_-1|0;
        if(!(_if_<_ie_))
         {var i_ig_=_ie_;
          for(;;)
           {r_id_[i_ig_+1]=_cO_(f_ic_,arr_h$_[i_ig_+1]);
            var _ih_=i_ig_+1|0;
            if(_if_!==i_ig_){var i_ig_=_ih_;continue;}
            break;}}
        var _ib_=r_id_;}
      return _ib_;}
    function _ix_(arr_ij_,f_im_)
     {var _ii_=0,_ik_=arr_ij_.length-1-1|0;
      if(!(_ik_<_ii_))
       {var i_il_=_ii_;
        for(;;)
         {_cO_(f_im_,arr_ij_[i_il_+1]);
          var _in_=i_il_+1|0;
          if(_ik_!==i_il_){var i_il_=_in_;continue;}
          break;}}
      return 0;}
    function _iy_(n_io_,f_iq_)
     {if(0===n_io_)
       var _ip_=[0];
      else
       {var res_ir_=caml_make_vect(n_io_,_cO_(f_iq_,0)),_is_=1,_it_=n_io_-1|0;
        if(!(_it_<_is_))
         {var i_iu_=_is_;
          for(;;)
           {res_ir_[i_iu_+1]=_cO_(f_iq_,i_iu_);
            var _iv_=i_iu_+1|0;
            if(_it_!==i_iu_){var i_iu_=_iv_;continue;}
            break;}}
        var _ip_=res_ir_;}
      return _ip_;}
    ({}.iter=caml_js_eval_string(_bd_));
    function _iC_(_opt__iz_,ts_iB_)
     {var sep_iA_=_opt__iz_?_opt__iz_[1]:_bc_;
      return new
              MlWrappedString
              (caml_js_from_array(ts_iB_).join(sep_iA_.toString()));}
    var
     _iD_=caml_js_eval_string(_ba_),
     _iM_={"iter":caml_js_eval_string(_a$_),"fold":_iD_};
    /*<<17166: src/inttbl.ml 18 16 34>>*/function _iS_(param_iE_){return {};}
    function _iT_(t_iF_,key_iG_,data_iH_){return t_iF_[key_iG_]=data_iH_;}
    function _iU_(t_iI_,k_iJ_){return delete t_iI_[k_iJ_];}
    function _iV_(t_iK_,k_iL_)
     {return t_iK_.hasOwnProperty(k_iL_)|0?[0,t_iK_[k_iL_]]:0;}
    function _iW_(t_iR_,f_iP_)
     {var js_iter_iQ_=_iM_[_bb_.toString()];
      return js_iter_iQ_
              (t_iR_,
               caml_js_wrap_callback
                (function(key_iO_,data_iN_)
                  {return _ee_(f_iP_,key_iO_,data_iN_);}));}
    /*<<17378: src/time.ml 3 13 60>>*/function _i1_(param_iX_)
     {return new date_constr_h8_().valueOf();}
    function _i2_(_iY_,_iZ_){return _iY_-_iZ_;}
    /*<<17348: src/time.ml 14 16 17>>*/function _i3_(t_i0_){return t_i0_;}
    /*<<17576: src/core.ml 15 24 73>>*/function string_of_float_i5_(x_i4_)
     {return new MlWrappedString(x_i4_.toString());}
    caml_js_eval_string(_a__);
    function _i__(ms_i7_,f_i6_)
     {return setInterval(caml_js_wrap_callback(f_i6_),ms_i7_);}
    function _i$_(x_i8_,f_i9_){return _cO_(f_i9_,x_i8_);}
    /*<<19105: src/frp.ml 34 24 26>>*/function _kd_(param_ja_){return 0;}
    /*<<19101: src/frp.ml 36 17 21>>*/function _jc_(t_jb_)
     {return _cO_(t_jb_,0);}
    function _ke_(t1_jd_,t2_je_,param_jf_){_jc_(t1_jd_);return _jc_(t2_je_);}
    function _kf_(ts_jg_,param_jh_){return _ix_(ts_jg_,_jc_);}
    /*<<19076: src/frp.ml 42 15 16>>*/function _jn_(x_ji_){return x_ji_;}
    function iter_jz_(t_jj_,f_jl_)
     {var key_jk_=t_jj_[2];
      t_jj_[2]=key_jk_+1|0;
      _iT_(t_jj_[1],key_jk_,f_jl_);
      return _jn_
              (/*<<19038: src/frp.ml 55 33 62>>*/function(param_jm_)
                {return _iU_(t_jj_[1],key_jk_);});}
    function trigger_jy_(t_jr_,x_jo_)
     {function _js_(key_jq_,data_jp_){return _cO_(data_jp_,x_jo_);}
      return _iW_(t_jr_[1],_js_);}
    /*<<19004: src/frp.ml 63 18 60>>*/function create_ju_(param_jt_)
     {return [0,_iS_(0),0];}
    function map_kg_(t_jA_,f_jx_)
     {var t__jv_=create_ju_(0);
      iter_jz_
       (t_jA_,
        /*<<18897: src/frp.ml 98 32 48>>*/function(x_jw_)
         {return trigger_jy_(t__jv_,_cO_(f_jx_,x_jw_));});
      return t__jv_;}
    /*<<18489: src/frp.ml 181 4 5>>*/function _kh_(ms_jD_)
     {var t_jB_=create_ju_(0);
      /*<<18489: src/frp.ml 181 4 5>>*/_i__
       (ms_jD_,
        /*<<18479: src/frp.ml 182 34 57>>*/function(param_jC_)
         {return trigger_jy_(t_jB_,_i1_(0));});
      return t_jB_;}
    function _ki_(t_jL_,f_jJ_)
     {var t__jE_=create_ju_(0),last_jF_=[0,0];
      function _jK_(_jG_){return 0;}
      _i$_
       (iter_jz_
         (t_jL_,
          /*<<18383: src/frp.ml 198 6 20>>*/function(x_jI_)
           {var _jH_=last_jF_[1];
            if(_jH_)
             /*<<18375: src/frp.ml 198 37 55>>*/trigger_jy_
              (t__jE_,_ee_(f_jJ_,_jH_[1],x_jI_));
            last_jF_[1]=[0,x_jI_];
            return 0;}),
        _jK_);
      return t__jE_;}
    /*<<18198: src/frp.ml 245 15 22>>*/function peek_j$_(t_jM_)
     {return t_jM_[2];}
    function add_listener_j0_(t_jN_,f_jO_)
     {t_jN_[1]=[0,f_jO_,t_jN_[1]];return 0;}
    function trigger_jZ_(t_jP_,x_jQ_)
     {t_jP_[2]=x_jQ_;
      var param_jR_=t_jP_[1];
      for(;;)
       {if(param_jR_)
         {var l_jS_=param_jR_[2];
          /*<<18168: src/frp.ml 251 27 36>>*/_cO_(param_jR_[1],t_jP_[2]);
          var param_jR_=l_jS_;
          continue;}
        return 0;}}
    /*<<18141: src/frp.ml 263 20 53>>*/function return_jW_(init_jT_)
     {return [0,0,init_jT_];}
    function map_kj_(t_jU_,f_jV_)
     {var t__jX_=return_jW_(_cO_(f_jV_,t_jU_[2]));
      add_listener_j0_
       (t_jU_,
        /*<<18113: src/frp.ml 267 29 45>>*/function(x_jY_)
         {return trigger_jZ_(t__jX_,_cO_(f_jV_,x_jY_));});
      return t__jX_;}
    function zip_with_kk_(t1_j2_,t2_j1_,f_j3_)
     {var t__j4_=return_jW_(_ee_(f_j3_,t1_j2_[2],t2_j1_[2]));
      add_listener_j0_
       (t1_j2_,
        /*<<18069: src/frp.ml 273 30 55>>*/function(x_j5_)
         {return trigger_jZ_(t__j4_,_ee_(f_j3_,x_j5_,t2_j1_[2]));});
      add_listener_j0_
       (t2_j1_,
        /*<<18059: src/frp.ml 274 30 55>>*/function(y_j6_)
         {return trigger_jZ_(t__j4_,_ee_(f_j3_,t1_j2_[2],y_j6_));});
      return t__j4_;}
    /*<<17837: src/frp.ml 308 4 5>>*/function _kl_(t_j8_)
     {var s_j7_=create_ju_(0);
      /*<<17837: src/frp.ml 308 4 5>>*/add_listener_j0_
       (t_j8_,_cO_(trigger_jy_,s_j7_));
      return s_j7_;}
    function _km_(s_kc_,init_j9_,f_kb_)
     {var b_j__=return_jW_(init_j9_);
      iter_jz_
       (s_kc_,
        /*<<17734: src/frp.ml 333 6 48>>*/function(x_ka_)
         {return trigger_jZ_(b_j__,_ee_(f_kb_,peek_j$_(b_j__),x_ka_));});
      return b_j__;}
    /*<<20431: src/jq.ml 6 13 68>>*/function jq_kq_(s_kn_)
     {return jQuery(s_kn_.toString());}
    /*<<20418: src/jq.ml 9 13 58>>*/function wrap_kR_(elt_ko_)
     {return jQuery(elt_ko_);}
    /*<<20402: src/jq.ml 11 17 37>>*/function create_kS_(tag_kp_)
     {return jq_kq_(_b0_(_a0_,_b0_(tag_kp_,_a1_)));}
    function append_kT_(parent_kr_,child_ks_)
     {return parent_kr_.append(child_ks_);}
    function on_kU_(t_kv_,event_name_ku_,f_kt_)
     {return t_kv_.on(event_name_ku_.toString(),caml_js_wrap_callback(f_kt_));}
    function set_attr_kV_(t_ky_,name_kx_,value_kw_)
     {return t_ky_.attr(name_kx_.toString(),value_kw_.toString());}
    function _kW_(t_kC_,name_kA_,value_kz_)
     {var _kB_=peek_j$_(value_kz_).toString();
      t_kC_.setAttribute(name_kA_.toString(),_kB_);
      var name_kE_=name_kA_.toString();
      /*<<20144: src/jq.ml 53 6 7>>*/function _kF_(value_kD_)
       {return t_kC_.setAttribute(name_kE_,value_kD_.toString());}
      return iter_jz_(_kl_(value_kz_),_kF_);}
    function _kX_(t_kH_,s_kG_){return t_kH_.innerHTML=s_kG_.toString();}
    function _kY_(t_kI_,c_kJ_){t_kI_.appendChild(c_kJ_);return 0;}
    function _kZ_(tag_kM_,attrs_kQ_)
     {/*<<19947: src/jq.ml 70 16 46>>*/function str_kL_(s_kK_)
       {return s_kK_.toString();}
      var
       _kN_=str_kL_(tag_kM_),
       elt_kO_=document.createElementNS(str_kL_(_a2_),_kN_);
      _ix_
       (attrs_kQ_,
        /*<<19921: src/jq.ml 76 29 49>>*/function(param_kP_)
         {return elt_kO_.setAttribute
                  (param_kP_[1].toString(),param_kP_[2].toString());});
      return elt_kO_;}
    var body_k1_=jq_kq_(_aZ_),mouse_pos_k0_=create_ju_(0);
    on_kU_
     (body_k1_,
      _aY_,
      /*<<19849: src/jq.ml 121 4 28>>*/function(e_k2_)
       {return trigger_jy_
                (mouse_pos_k0_,
                 [0,e_k2_[_a4_.toString()],e_k2_[_a5_.toString()]]);});
    _ki_
     (mouse_pos_k0_,
      function(param_k4_,_k3_)
       {return [0,_k3_[1]-param_k4_[1]|0,_k3_[2]-param_k4_[2]|0];});
    /*<<22455: src/draw.ml 8 13 65>>*/function _k8_(param_k5_)
     {var x_k6_=param_k5_[1],_k7_=_b0_(_Q_,string_of_float_i5_(param_k5_[2]));
      return _b0_(string_of_float_i5_(x_k6_),_k7_);}
    /*<<22438: src/draw.ml 10 24 78>>*/function _lb_(pts_k9_)
     {return _iC_(_R_,_iw_(pts_k9_,_k8_));}
    /*<<22394: src/draw.ml 18 13 50>>*/function _la_(param_k__)
     {return _k$_
              (_h3_,_S_,param_k__[1],param_k__[2],param_k__[3],param_k__[4]);}
    var c_lc_=2*(4*Math.atan(1))/360;
    /*<<22385: src/draw.ml 34 58 64>>*/function to_radians_lj_(x_ld_)
     {return c_lc_*x_ld_;}
    /*<<22382: src/draw.ml 36 21 22>>*/function of_degrees_l5_(x_le_)
     {return x_le_;}
    function _lX_(param_lg_,_lf_,angle_lk_)
     {var
       b_lh_=param_lg_[2],
       a_li_=param_lg_[1],
       y_ln_=_lf_[2],
       x_lm_=_lf_[1],
       angle_ll_=to_radians_lj_(angle_lk_),
       _lo_=y_ln_-b_lh_,
       _lp_=x_lm_-a_li_;
      return [0,
              _lp_*Math.cos(angle_ll_)-_lo_*Math.sin(angle_ll_)+a_li_,
              _lp_*Math.sin(angle_ll_)+_lo_*Math.cos(angle_ll_)+b_lh_];}
    function _l6_(_lq_,_lr_){return _lq_+_lr_;}
    function _l7_(_ls_,_lt_){return _ls_*_lt_;}
    /*<<22165: src/draw.ml 65 15 56>>*/function _l9_(param_lu_)
     {switch(param_lu_[0])
       {case 1:return _dL_(_h3_,_X_,param_lu_[1],param_lu_[2]);
        case 2:return _dL_(_h3_,_W_,param_lu_[1],param_lu_[2]);
        case 3:
         var match_lv_=param_lu_[2];
         return _lw_(_h3_,_V_,param_lu_[1],match_lv_[1],match_lv_[2]);
        case 4:return _ee_(_h3_,_U_,param_lu_[1]);
        case 5:return _ee_(_h3_,_T_,param_lu_[1]);
        default:
         return _lx_
                 (_h3_,
                  _Y_,
                  param_lu_[1],
                  param_lu_[2],
                  param_lu_[3],
                  param_lu_[4],
                  param_lu_[5],
                  param_lu_[6]);}}
    /*<<22120: src/draw.ml 114 15 21>>*/function _l8_(c_ly_)
     {return [0,c_ly_];}
    function _l__(_opt__lz_,_lB_,color_lD_,width_lE_)
     {var
       cap_lA_=_opt__lz_?_opt__lz_[1]:737755699,
       join_lC_=_lB_?_lB_[1]:463106021;
      return [1,[0,cap_lA_,join_lC_,width_lE_,color_lD_]];}
    /*<<21971: src/draw.ml 122 4 70>>*/function _l0_(param_lF_)
     {switch(param_lF_[0])
       {case 1:
         var
          match_lG_=param_lF_[1],
          join_lH_=match_lG_[2],
          cap_lI_=match_lG_[1],
          color_lL_=match_lG_[4],
          width_lK_=match_lG_[3],
          _lJ_=9660462===join_lH_?_aa_:463106021<=join_lH_?_ac_:_ab_,
          _lN_=_b0_(_aj_,_lJ_),
          _lM_=226915517===cap_lI_?_Z_:737755699<=cap_lI_?_$_:___,
          _lO_=_b0_(_ai_,_lM_),
          _lP_=_b0_(_ah_,string_of_int_b1_(width_lK_));
         return _iC_(_af_,[0,_b0_(_ag_,_la_(color_lL_)),_lP_,_lO_,_lN_]);
        case 2:
         return _b0_(_ad_,_iC_(_ae_,_iw_(param_lF_[1],string_of_float_i5_)));
        default:return _b0_(_ak_,_la_(param_lF_[1]));}}
    /*<<21847: src/draw.ml 148 15 57>>*/function _ma_(param_lQ_)
     {switch(param_lQ_[0])
       {case 1:
         var match_lR_=param_lQ_[1];
         return _dL_(_h3_,_an_,match_lR_[1],match_lR_[2]);
        case 2:
         var
          r_lS_=param_lQ_[4],
          a1_lT_=param_lQ_[1],
          a2_lV_=param_lQ_[2],
          flag_lU_=-64519044<=param_lQ_[3]?0:1,
          _lW_=Math.sin(to_radians_lj_(a1_lT_))*r_lS_,
          match_lY_=
           _lX_
            ([0,-Math.cos(to_radians_lj_(a1_lT_))*r_lS_,_lW_],
             _am_,
             a2_lV_-a1_lT_);
         return _hZ_(_h3_,_al_,r_lS_,r_lS_,flag_lU_,match_lY_[1],match_lY_[2]);
        default:
         var match_lZ_=param_lQ_[1];
         return _dL_(_h3_,_ao_,match_lZ_[1],match_lZ_[2]);}}
    /*<<21659: src/draw.ml 215 27 89>>*/function render_properties_l$_(ps_l1_)
     {return _iC_(_aq_,_iw_(ps_l1_,_l0_));}
    function sink_attrs_mb_(elt_l3_,ps_l4_)
     {return _i$_
              (_iw_
                (ps_l4_,
                 /*<<21623: src/draw.ml 218 20 70>>*/function(param_l2_)
                  {return _kW_(elt_l3_,param_l2_[1],param_l2_[2]);}),
               _kf_);}
    var render_mc_=[];
    /*<<21615: src/draw.ml 222 39 66>>*/function _me_(param_md_)
     {return string_of_float_i5_(param_md_[1]);}
    function x_beh_nd_(_mf_){return map_kj_(_mf_,_me_);}
    /*<<21602: src/draw.ml 223 39 66>>*/function _mh_(param_mg_)
     {return string_of_float_i5_(param_mg_[2]);}
    function y_beh_nb_(_mi_){return map_kj_(_mi_,_mh_);}
    /*<<21589: src/draw.ml 224 23 70>>*/function zip_props_mH_(ps_b_mj_)
     {var t__mk_=return_jW_(render_properties_l$_(_iw_(ps_b_mj_,peek_j$_)));
      _ix_
       (ps_b_mj_,
        /*<<18009: src/frp.ml 281 6 69>>*/function(t_mm_)
         {return add_listener_j0_
                  (t_mm_,
                   /*<<17993: src/frp.ml 281 31 68>>*/function(param_ml_)
                    {return trigger_jZ_
                             (t__mk_,render_properties_l$_(_iw_(ps_b_mj_,peek_j$_)));});});
      return t__mk_;}
    function path_mask_m0_(elt_mn_,segs_mx_,mask_mz_,props_mF_)
     {/*<<21491: src/draw.ml 227 32 77>>*/function get_length_mp_(param_mo_)
       {return elt_mn_.getTotalLength();}
      var _mt_=get_length_mp_(0);
      function _ms_(param_mr_,x_mq_){return x_mq_;}
      function _mw_(_mu_){return _km_(_mu_,_mt_,_ms_);}
      /*<<21475: src/draw.ml 229 62 75>>*/function _my_(param_mv_)
       {return get_length_mp_(0);}
      var path_length_mE_=_i$_(map_kg_(_kl_(segs_mx_),_my_),_mw_);
      if(mask_mz_)
       {var
         mask_mD_=mask_mz_[1],
         props__mG_=
          _b8_
           (props_mF_,
            [0,
             zip_with_kk_
              (path_length_mE_,
               mask_mD_,
               function(l_mC_,param_mA_)
                {var a_mB_=param_mA_[1];
                 return [2,
                         [254,0,l_mC_*a_mB_,l_mC_*(param_mA_[2]-a_mB_),l_mC_]];})]);}
      else
       var props__mG_=props_mF_;
      return _kW_(elt_mn_,_ar_,zip_props_mH_(props__mG_));}
    caml_update_dummy
     (render_mc_,
      /*<<20785: src/draw.ml 245 18 81>>*/function(param_mI_)
       {switch(param_mI_[0])
         {case 1:
           var
            trans_mK_=param_mI_[2],
            match_mJ_=_cO_(render_mc_,param_mI_[1]),
            elt_mL_=match_mJ_[1],
            sub_mM_=match_mJ_[2];
           return [0,
                   elt_mL_,
                   _ee_
                    (_ke_,_kW_(elt_mL_,_aR_,map_kj_(trans_mK_,_l9_)),sub_mM_)];
          case 2:
           var
            pts_mN_=param_mI_[2],
            props_mO_=param_mI_[1],
            _mP_=[0,_aP_,_iC_(_aQ_,_iw_(peek_j$_(pts_mN_),_k8_))],
            elt_mQ_=
             _kZ_
              (_aN_,
               [0,
                [0,_aO_,render_properties_l$_(_iw_(props_mO_,peek_j$_))],
                _mP_]);
           return [0,elt_mQ_,_kW_(elt_mQ_,_aM_,map_kj_(pts_mN_,_lb_))];
          case 3:
           var
            segs_mR_=param_mI_[4],
            mask_mV_=param_mI_[3],
            anchor_mU_=param_mI_[2],
            props_mT_=param_mI_[1],
            elt_mS_=_kZ_(_aL_,[0]),
            sub_m1_=
             _kW_
              (elt_mS_,
               _aK_,
               zip_with_kk_
                (anchor_mU_,
                 segs_mR_,
                 function(param_mW_,sgs_mX_)
                  {var y_mZ_=param_mW_[2],x_mY_=param_mW_[1];
                   return _lw_
                           (_h3_,_aX_,x_mY_,y_mZ_,_iC_(_ap_,_iw_(sgs_mX_,_ma_)));}));
           return [0,
                   elt_mS_,
                   _ee_
                    (_ke_,
                     sub_m1_,
                     path_mask_m0_(elt_mS_,segs_mR_,mask_mV_,props_mT_))];
          case 4:
           var
            path_strb_m2_=param_mI_[3],
            mask_m5_=param_mI_[2],
            props_m4_=param_mI_[1],
            elt_m3_=_kZ_(_aJ_,[0]),
            sub_m6_=_kW_(elt_m3_,_aI_,path_strb_m2_);
           return [0,
                   elt_m3_,
                   _ee_
                    (_ke_,
                     sub_m6_,
                     path_mask_m0_(elt_m3_,path_strb_m2_,mask_m5_,props_m4_))];
          case 5:
           var
            text_m7_=param_mI_[3],
            corner_m8_=param_mI_[2],
            ps_m__=param_mI_[1],
            elt_m9_=_kZ_(_aH_,[0]);
           _kX_(elt_m9_,peek_j$_(text_m7_));
           var
            _m$_=_cO_(_kX_,elt_m9_),
            _na_=_cO_(_ke_,iter_jz_(_kl_(text_m7_),_m$_)),
            _nc_=[0,_aG_,zip_props_mH_(ps_m__)],
            _ne_=[0,_aF_,y_beh_nb_(corner_m8_)];
           return [0,
                   elt_m9_,
                   _i$_
                    (sink_attrs_mb_
                      (elt_m9_,[0,[0,_aE_,x_beh_nd_(corner_m8_)],_ne_,_nc_]),
                     _na_)];
          case 6:
           var elts_nf_=_iw_(param_mI_[1],render_mc_),elt_ng_=_kZ_(_aD_,[0]);
           _ix_
            (elts_nf_,
             /*<<20753: src/draw.ml 306 23 52>>*/function(param_nh_)
              {return _kY_(elt_ng_,param_nh_[1]);});
           return [0,
                   elt_ng_,
                   _cO_(_kf_,_iw_(elts_nf_,function(_ni_){return _ni_[2];}))];
          case 7:
           var
            hb_nj_=param_mI_[4],
            wb_nk_=param_mI_[3],
            corner_nl_=param_mI_[2],
            ps_nn_=param_mI_[1],
            match_nm_=peek_j$_(corner_nl_),
            y_np_=match_nm_[2],
            x_no_=match_nm_[1],
            _nq_=[0,_aC_,render_properties_l$_(_iw_(ps_nn_,peek_j$_))],
            _nr_=[0,_aB_,string_of_float_i5_(peek_j$_(hb_nj_))],
            _ns_=[0,_aA_,string_of_float_i5_(peek_j$_(wb_nk_))],
            _nt_=[0,_az_,string_of_float_i5_(y_np_)],
            elt_nu_=
             _kZ_
              (_ax_,
               [0,[0,_ay_,string_of_float_i5_(x_no_)],_nt_,_ns_,_nr_,_nq_]),
            _nv_=[0,_aw_,map_kj_(hb_nj_,string_of_float_i5_)],
            _nw_=[0,_av_,map_kj_(wb_nk_,string_of_float_i5_)],
            _nx_=[0,_au_,y_beh_nb_(corner_nl_)];
           return [0,
                   elt_nu_,
                   sink_attrs_mb_
                    (elt_nu_,[0,[0,_at_,x_beh_nd_(corner_nl_)],_nx_,_nw_,_nv_])];
          case 8:
           var
            tb_ny_=param_mI_[1],
            container_nz_=_kZ_(_as_,[0]),
            last_sub_nA_=[0,_cO_(render_mc_,peek_j$_(tb_ny_))[2]],
            _nF_=
             /*<<20716: src/draw.ml 333 6 22>>*/function(t_nC_)
              {/*<<20716: src/draw.ml 333 6 22>>*/_jc_(last_sub_nA_[1]);
               /*<<20052: src/jq.ml 66 6 71>>*/for(;;)
                {if(1-(container_nz_.firstChild==null_h5_?1:0))
                  {var _nB_=container_nz_.firstChild;
                   if(_nB_!=null_h5_)
                    /*<<20007: src/jq.ml 66 44 70>>*/container_nz_.removeChild
                     (_nB_);
                   continue;}
                 var match_nD_=_cO_(render_mc_,t_nC_),sub_nE_=match_nD_[2];
                 _kY_(container_nz_,match_nD_[1]);
                 last_sub_nA_[1]=sub_nE_;
                 return 0;}},
            dyn_sub_nH_=iter_jz_(_kl_(tb_ny_),_nF_);
           return [0,
                   container_nz_,
                   _ee_
                    (_ke_,
                     dyn_sub_nH_,
                     _jn_
                      (/*<<20708: src/draw.ml 340 61 77>>*/function(param_nG_)
                        {return _jc_(last_sub_nA_[1]);}))];
          case 9:return [0,param_mI_[1],_kd_];
          default:
           var
            center_nI_=param_mI_[3],
            r_nL_=param_mI_[2],
            ps_nK_=param_mI_[1],
            elt_nJ_=_kZ_(_aW_,[0]),
            _nM_=[0,_aV_,zip_props_mH_(ps_nK_)],
            _nN_=[0,_aU_,map_kj_(r_nL_,string_of_float_i5_)],
            _nO_=[0,_aT_,y_beh_nb_(center_nI_)];
           return [0,
                   elt_nJ_,
                   sink_attrs_mb_
                    (elt_nJ_,[0,[0,_aS_,x_beh_nd_(center_nI_)],_nO_,_nN_,_nM_])];}});
    var
     _nR_=[],
     stay_forever_n5_=[1,function(x0_nP_,param_nQ_){return x0_nP_;}];
    function mk_f_n3_(dur1_nV_,f1_nT_,f2_nW_,x0_nS_)
     {var
       f1__nU_=_cO_(f1_nT_,x0_nS_),
       f2__nY_=_cO_(f2_nW_,_cO_(f1__nU_,dur1_nV_));
      /*<<23210: src/animate.ml 44 17 61>>*/return function(t_nX_)
       {return t_nX_<=dur1_nV_
                ?_cO_(f1__nU_,t_nX_)
                :_cO_(f2__nY_,t_nX_-dur1_nV_);};}
    caml_update_dummy
     (_nR_,
      /*<<23198: src/animate.ml 46 8 60>>*/function(param_nZ_)
       {var f1_n0_=param_nZ_[2],dur1_n1_=param_nZ_[1];
        /*<<23165: src/animate.ml 47 4 60>>*/return function(t2_n2_)
         {{if(0===t2_n2_[0])
            {var dur2_n4_=t2_n2_[1];
             return [0,
                     dur1_n1_+dur2_n4_,
                     _dL_(mk_f_n3_,dur1_n1_,f1_n0_,t2_n2_[2])];}
           return [1,_dL_(mk_f_n3_,dur1_n1_,f1_n0_,t2_n2_[1])];}};});
    /*<<22988: src/animate.ml 52 65 38>>*/function _oi_(param_n6_)
     {var f_oe_=param_n6_[1];
      /*<<22960: src/animate.ml 55 8 38>>*/return function(init_od_)
       {function _n__(param_n8_,t_n7_){return _i3_(t_n7_);}
        var t_n9_=create_ju_(0),_oc_=0,_ob_=30,start_n$_=_i1_(0);
        /*<<18456: src/frp.ml 187 4 5>>*/_i__
         (_ob_,
          /*<<18440: src/frp.ml 190 6 37>>*/function(param_oa_)
           {return trigger_jy_(t_n9_,_i2_(_i1_(0),start_n$_));});
        var elapsed_of_=_km_(t_n9_,_oc_,_n__);
        return map_kj_(elapsed_of_,_cO_(f_oe_,init_od_));};}
    function _pf_(init_og_,t_oh_){return _ee_(_oi_,t_oh_,init_og_);}
    function _pg_(label_o$_,container_o0_,param_pa_)
     {var
       inner_container_oj_=create_kS_(_K_),
       slider_div_ok_=create_kS_(_J_),
       _ol_=create_kS_(_I_),
       slider_val_om_=return_jW_(0),
       sliding_on_=return_jW_(0),
       rate__oq_=25/1e3;
      function _os_(p_oo_,param_op_){return 1-p_oo_;}
      var s_or_=create_ju_(0),_oy_=0;
      /*<<19808: src/jq.ml 131 2 3>>*/on_kU_
       (_ol_,
        _a6_,
        /*<<19768: src/jq.ml 133 4 59>>*/function(e_ot_)
         {var
           _ou_=e_ot_[_a7_.toString()],
           _ov_=_ou_-1|0,
           pos_ox_=[0,e_ot_[_a8_.toString()],e_ot_[_a9_.toString()]];
          if(_ov_<0||2<_ov_)
           var button_ow_=_j_(_b0_(_a3_,string_of_int_b1_(_ou_)));
          else
           switch(_ov_)
            {case 1:var button_ow_=15943541;break;
             case 2:var button_ow_=-57574468;break;
             default:var button_ow_=847852583;}
          return trigger_jy_(s_or_,[0,pos_ox_,button_ow_]);});
      var playing_oz_=_km_(s_or_,_oy_,_os_);
      function _oC_(_oA_){return 0;}
      var
       _oD_=
        map_kj_
         (playing_oz_,
          /*<<24085: src/widget.ml 13 8 75>>*/function(p_oB_)
           {return p_oB_?_D_:_C_;});
      set_attr_kV_(_ol_,_e_,peek_j$_(_oD_));
      /*<<20247: src/jq.ml 37 4 27>>*/function _oF_(value_oE_)
       {return set_attr_kV_(_ol_,_e_,value_oE_);}
      _i$_(iter_jz_(_kl_(_oD_),_oF_),_oC_);
      /*<<24073: src/widget.ml 15 46 74>>*/function _oK_(chg_oG_)
       {return _i3_(chg_oG_)*rate__oq_;}
      var _oJ_=30;
      function _oL_(t1_oH_,t2_oI_){return _i2_(t2_oI_,t1_oH_);}
      var
       incrs_oP_=map_kg_(_ki_(_kh_(_oJ_),_oL_),_oK_),
       _oR_=
        zip_with_kk_
         (playing_oz_,
          sliding_on_,
          function(p_oM_,s_oN_){var _oO_=p_oM_?1-s_oN_:p_oM_;return _oO_;}),
       s__oQ_=create_ju_(0);
      iter_jz_
       (incrs_oP_,
        /*<<17769: src/frp.ml 325 37 84>>*/function(x_oS_)
         {return _oR_[2]?trigger_jy_(s__oQ_,x_oS_):0;});
      function update_slider_val_oW_(e_oU_,ui_oT_)
       {return trigger_jZ_(slider_val_om_,ui_oT_[_L_.toString()]/100);}
      function _oZ_(_oV_){return 0;}
      _i$_
       (iter_jz_
         (s__oQ_,
          /*<<23975: src/widget.ml 21 8 78>>*/function(x_oX_)
           {var
             new_val_oY_=
              _bP_
               (slider_div_ok_.slider(_G_.toString(),_H_.toString())+x_oX_,
                100);
            /*<<23975: src/widget.ml 21 8 78>>*/trigger_jZ_
             (slider_val_om_,new_val_oY_/100);
            return slider_div_ok_.slider
                    (_E_.toString(),_F_.toString(),new_val_oY_);}),
        _oZ_);
      append_kT_(inner_container_oj_,_ol_);
      append_kT_(inner_container_oj_,slider_div_ok_);
      append_kT_(container_o0_,inner_container_oj_);
      var
       _o3_=0.01,
       _o6_=
        caml_js_wrap_callback
         (function(param_o1_,_o2_){return trigger_jZ_(sliding_on_,0);}),
       _o7_=
        caml_js_wrap_callback
         (function(param_o4_,_o5_){return trigger_jZ_(sliding_on_,1);}),
       arg_obj_o9_=
        {"slide":caml_js_wrap_callback(update_slider_val_oW_),
         "start":
         caml_js_wrap_callback
          (function(param_o4_,_o5_){return trigger_jZ_(sliding_on_,1);}),
         "stop":_o6_,
         "step":_o3_};
      function _o__(_o8_){return 0;}
      _i$_(slider_div_ok_.slider(arg_obj_o9_),_o__);
      return slider_val_om_;}
    /*<<23515: src/widget.ml 95 8 5>>*/function _po_(param_pb_)
     {var
       canvas_pd_=param_pb_[2],
       match_pc_=_cO_(render_mc_,param_pb_[3]),
       sub_pe_=match_pc_[2];
      /*<<23515: src/widget.ml 95 8 5>>*/append_kT_
       (canvas_pd_,wrap_kR_(match_pc_[1]));
      return sub_pe_;}
    /*<<25101: src/graph.ml 21 2 8>>*/function _pn_(nodes_pm_)
     {var nodes__ph_=_iS_(0);
      /*<<25101: src/graph.ml 21 2 8>>*/_iW_
       (nodes_pm_,
        function(key_pl_,data_pi_)
         {var _pk_=data_pi_[2],t__pj_=_iS_(0);
          /*<<16762: src/inttbl.ml 77 2 4>>*/_iW_(_pk_,_cO_(_iT_,t__pj_));
          return _iT_(nodes__ph_,key_pl_,[0,data_pi_[1],t__pj_]);});
      return nodes__ph_;}
    function range_pt_(start_pq_,stop_pp_)
     {if(stop_pp_<start_pq_)/*<<26775: src/rotsym.ml 4 23 47>>*/_j_(_v_);
      var n_ps_=(stop_pp_-start_pq_|0)+1|0;
      return _iy_
              (n_ps_,
               /*<<26762: src/rotsym.ml 6 28 37>>*/function(i_pr_)
                {return i_pr_+start_pq_|0;});}
    var
     svg_pu_=_kZ_(_s_,[0,_t_,_u_]),
     _pv_=6,
     _pw_=600,
     _px_=400,
     radius_py_=_bP_(_px_,_pw_)/4,
     center_pz_=[0,_px_/2,_pw_/2],
     p0_pA_=[0,_px_/2,_pw_/2-radius_py_],
     theta_pB_=360/_pv_;
    /*<<26334: src/rotsym.ml 19 8 67>>*/function _pD_(i_pC_)
     {return _lX_(center_pz_,p0_pA_,_l7_(i_pC_,of_degrees_l5_(theta_pB_)));}
    var
     _pE_=return_jW_(_iw_(range_pt_(0,_pv_-1|0),_pD_)),
     _pK_=return_jW_(_l__(0,0,_c_,2));
    function _pL_(_pF_){return map_kj_(_pF_,_l8_);}
    function _pI_(c_pG_,param_pH_)
     {return [0,c_pG_[1],c_pG_[2],c_pG_[3]+1|0,c_pG_[4]];}
    function _pM_(_pJ_){return _km_(_pJ_,_P_,_pI_);}
    var
     _pN_=[0,_i$_(_i$_(_kh_(30),_pM_),_pL_),_pK_],
     props_pO_=[0,_pN_]?_pN_:[0],
     _pQ_=[2,props_pO_,_pE_];
    function _pR_(_pP_){return map_kj_(_pP_,of_degrees_l5_);}
    var _qe_=_cO_(_pf_,0);
    function _qf_(_pT_)
     {var r_pS_=[0,stay_forever_n5_],_pU_=_pT_.length-1-1|0,_pV_=0;
      if(!(_pU_<_pV_))
       {var i_pW_=_pU_;
        for(;;)
         {r_pS_[1]=_ee_(_nR_,_pT_[i_pW_+1],r_pS_[1]);
          var _pX_=i_pW_-1|0;
          if(_pV_!==i_pW_){var i_pW_=_pX_;continue;}
          break;}}
      return r_pS_[1];}
    /*<<26265: src/rotsym.ml 33 19 84>>*/function _qg_(i_p1_)
     {var
       _p0_=500,
       _p2_=i_p1_*theta_pB_,
       _p3_=1e3,
       _qa_=[0,_p0_,function(x0_pY_,param_pZ_){return x0_pY_;}];
      /*<<23021: src/animate.ml 79 6 74>>*/function f_qd_(x0_p4_)
       {var
         h_p5_=(_p2_+x0_p4_)/2,
         _p6_=_p3_/2,
         b_p7_=(h_p5_-_p2_)/_p6_,
         c_p9_=(h_p5_-x0_p4_)/Math.pow(_p3_/2,2),
         a_p$_=b_p7_/_p6_;
        /*<<22996: src/animate.ml 82 15 74>>*/return function(t_p8_)
         {if(t_p8_<=_p3_/2)return x0_p4_+c_p9_*Math.pow(t_p8_,2);
          var _p__=t_p8_-_p3_/2;
          return h_p5_+a_p$_*Math.pow(_p__,2)-2*b_p7_*_p__;};}
      return _ee_
              (_nR_,
               _ee_
                (_nR_,
                 [0,_p3_,f_qd_],
                 [0,0,function(param_qb_,_qc_){return _p2_;}]),
               _qa_);}
    var
     angle_qh_=_i$_(_i$_(_i$_(_iw_(range_pt_(1,_pv_),_qg_),_qf_),_qe_),_pR_),
     _qm_=
      map_kj_
       (angle_qh_,
        /*<<26187: src/rotsym.ml 46 30 8>>*/function(a_qi_)
         {var
           a_qj_=_bP_(a_qi_,of_degrees_l5_(359.9999)),
           flag_qk_=
            caml_lessthan(a_qj_,of_degrees_l5_(180))?-64519044:-944265860,
           _ql_=_l6_(of_degrees_l5_(90),a_qj_);
          return [0,[2,of_degrees_l5_(90),_ql_,flag_qk_,radius_py_+40]];}),
     _qn_=return_jW_([0,p0_pA_[1],p0_pA_[2]-40]),
     _qo_=return_jW_(_l8_([0,_d_[1],_d_[2],_d_[3],0])),
     _qp_=[0,return_jW_(_l__(0,0,_d_,4)),_qo_],
     _qr_=0,
     props_qq_=[0,_qp_]?_qp_:[0],
     _qB_=[3,props_qq_,_qn_,_qr_,_qm_],
     theta_qt_=of_degrees_l5_(theta_pB_);
    /*<<26111: src/rotsym.ml 61 19 70>>*/function _qC_(i_qs_)
     {var
       _qu_=i_qs_-1|0,
       _qx_=
        map_kj_
         (angle_qh_,
          /*<<26133: src/rotsym.ml 57 8 93>>*/function(a_qv_)
           {var _qw_=_l6_(a_qv_,_l7_(_qu_,theta_qt_));
            return _lX_(center_pz_,[0,p0_pA_[1],p0_pA_[2]-20],_qw_);}),
       _qy_=0,
       _qA_=return_jW_(string_of_int_b1_(i_qs_)),
       props_qz_=_qy_?_qy_[1]:[0];
      return [5,props_qz_,_qx_,_qA_];}
    var labels_qE_=_iw_(range_pt_(1,_pv_),_qC_);
    _kY_
     (svg_pu_,
      _cO_
        (render_mc_,
         [6,
          _b8_
           (labels_qE_,
            [0,
             [1,
              _pQ_,
              map_kj_
               (angle_qh_,
                /*<<26105: src/rotsym.ml 65 61 89>>*/function(a_qD_)
                 {return [3,a_qD_,center_pz_];})],
             _qB_])])
       [1]);
    var _qF_=jq_kq_(_r_).get(0),_qG_=_qF_===undefined_h9_?0:[0,_qF_];
    if(_qG_)
     _kY_(_qG_[1],svg_pu_);
    else
     /*<<17528: src/core.ml 26 13 61>>*/console.log(_q_);
    /*<<26873: src/rotsym.ml 74 14 24>>*/_kZ_(_l_,[0,_m_,_n_,_o_,_p_]);
    var
     _qH_=0,
     _qI_=caml_make_vect(5,_c_),
     nodes__qJ_=_pn_(_iS_(0)),
     len_qK_=_qI_.length-1,
     i_qL_=0;
    /*<<24952: src/graph.ml 40 4 7>>*/for(;;)
     {if(len_qK_<=i_qL_)
       {var
         _qN_=
          _iy_
           (len_qK_,
            /*<<24989: src/graph.ml 49 32 39>>*/function(i_qM_)
             {return _qH_+i_qM_|0;});
        if(5===_qN_.length-1)
         {var
           a_qO_=_qN_[0+1],
           b_qP_=_qN_[1+1],
           c_qQ_=_qN_[2+1],
           d_qR_=_qN_[3+1],
           e_qS_=_qN_[4+1],
           nodes__qT_=_pn_(nodes__qJ_),
           _q5_=
            [0,
             [0,a_qO_,b_qP_,0],
             [0,b_qP_,c_qQ_,0],
             [0,c_qQ_,a_qO_,0],
             [0,c_qQ_,d_qR_,0],
             [0,d_qR_,e_qS_,0],
             [0,e_qS_,c_qQ_,0]];
          _ix_
           (_q5_,
            /*<<24296: src/graph.ml 139 39 9>>*/function(param_qU_)
             {switch(param_qU_[0])
               {case 1:
                 var
                  v_qV_=param_qU_[2],
                  match_qW_=_iV_(nodes__qT_,param_qU_[1]),
                  _qX_=_iV_(nodes__qT_,v_qV_);
                 if(match_qW_&&_qX_)return _iU_(match_qW_[1][2],v_qV_);
                 return _j_(_A_);
                case 2:
                 var u_qY_=param_qU_[1];
                 return _iV_(nodes__qT_,u_qY_)
                         ?(_iU_(nodes__qT_,u_qY_),
                           _iW_
                            (nodes__qT_,
                             function(key_q0_,data_qZ_){return _iU_(data_qZ_[2],u_qY_);}))
                         :_j_(_z_);
                default:
                 var
                  v_q1_=param_qU_[2],
                  e_q3_=param_qU_[3],
                  match_q2_=_iV_(nodes__qT_,param_qU_[1]),
                  _q4_=_iV_(nodes__qT_,v_q1_);
                 if(match_q2_&&_q4_)return _iT_(match_q2_[1][2],v_q1_,e_q3_);
                 return _j_(_B_);}});
          var
           container_q6_=jq_kq_(_x_),
           _q7_=_cO_(_pg_,_w_),
           _q8_=[0,_O_,string_of_int_b1_(400)],
           canvas_q9_=
            _i$_(_kZ_(_M_,[0,[0,_N_,string_of_int_b1_(400)],_q8_]),wrap_kR_);
          append_kT_(container_q6_,canvas_q9_);
          var
           _q__=_ee_(_q7_,container_q6_,canvas_q9_),
           _ra_=return_jW_(_y_),
           _rb_=
            [0,
             map_kj_
              (_q__,
               /*<<25969: src/rotsym.ml 96 44 55>>*/function(x_q$_)
                {return [0,0,Math.pow(x_q$_,2)];})],
           _rc_=return_jW_(_l__(0,0,_c_,4)),
           _rd_=[0,return_jW_(_l8_([0,_d_[1],_d_[2],_d_[3],0])),_rc_],
           props_re_=[0,_rd_]?_rd_:[0];
          _i$_([0,container_q6_,canvas_q9_,[4,props_re_,_rb_,_ra_]],_po_);
          do_at_exit_b2_(0);
          return;}
        throw [0,_bN_,_k_];}
      var _rf_=_iS_(0);
      /*<<24960: src/graph.ml 43 6 18>>*/_iT_
       (nodes__qJ_,_qH_+i_qL_|0,[0,caml_array_get(_qI_,i_qL_),_rf_]);
      var _rg_=i_qL_+1|0,i_qL_=_rg_;
      continue;}}
  ());
