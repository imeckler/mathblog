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
   {function _kU_(_ql_,_qm_,_qn_,_qo_,_qp_,_qq_,_qr_,_qs_)
     {return _ql_.length==7
              ?_ql_(_qm_,_qn_,_qo_,_qp_,_qq_,_qr_,_qs_)
              :caml_call_gen(_ql_,[_qm_,_qn_,_qo_,_qp_,_qq_,_qr_,_qs_]);}
    function _hL_(_qe_,_qf_,_qg_,_qh_,_qi_,_qj_,_qk_)
     {return _qe_.length==6
              ?_qe_(_qf_,_qg_,_qh_,_qi_,_qj_,_qk_)
              :caml_call_gen(_qe_,[_qf_,_qg_,_qh_,_qi_,_qj_,_qk_]);}
    function _kw_(_p__,_p$_,_qa_,_qb_,_qc_,_qd_)
     {return _p__.length==5
              ?_p__(_p$_,_qa_,_qb_,_qc_,_qd_)
              :caml_call_gen(_p__,[_p$_,_qa_,_qb_,_qc_,_qd_]);}
    function _kT_(_p5_,_p6_,_p7_,_p8_,_p9_)
     {return _p5_.length==4
              ?_p5_(_p6_,_p7_,_p8_,_p9_)
              :caml_call_gen(_p5_,[_p6_,_p7_,_p8_,_p9_]);}
    function _dx_(_p1_,_p2_,_p3_,_p4_)
     {return _p1_.length==3
              ?_p1_(_p2_,_p3_,_p4_)
              :caml_call_gen(_p1_,[_p2_,_p3_,_p4_]);}
    function _d2_(_pY_,_pZ_,_p0_)
     {return _pY_.length==2?_pY_(_pZ_,_p0_):caml_call_gen(_pY_,[_pZ_,_p0_]);}
    function _cA_(_pW_,_pX_)
     {return _pW_.length==1?_pW_(_pX_):caml_call_gen(_pW_,[_pX_]);}
    var
     _a_=[0,new MlString("Failure")],
     _b_=[0,new MlString("Invalid_argument")],
     _c_=[0,0,0,0,1],
     _d_=[0,255,0,0,1];
    caml_register_global(6,[0,new MlString("Not_found")]);
    caml_register_global(5,[0,new MlString("Division_by_zero")]);
    caml_register_global(3,_b_);
    caml_register_global(2,_a_);
    var
     _bz_=[0,new MlString("Match_failure")],
     _by_=[0,new MlString("Assert_failure")],
     _bx_=new MlString("%d"),
     _bw_=new MlString("true"),
     _bv_=new MlString("false"),
     _bu_=new MlString("Pervasives.do_at_exit"),
     _bt_=new MlString("\\b"),
     _bs_=new MlString("\\t"),
     _br_=new MlString("\\n"),
     _bq_=new MlString("\\r"),
     _bp_=new MlString("\\\\"),
     _bo_=new MlString("\\'"),
     _bn_=new MlString("String.blit"),
     _bm_=new MlString("String.sub"),
     _bl_=new MlString("Buffer.add: cannot grow buffer"),
     _bk_=new MlString(""),
     _bj_=new MlString(""),
     _bi_=new MlString("%.12g"),
     _bh_=new MlString("\""),
     _bg_=new MlString("\""),
     _bf_=new MlString("'"),
     _be_=new MlString("'"),
     _bd_=new MlString("nan"),
     _bc_=new MlString("neg_infinity"),
     _bb_=new MlString("infinity"),
     _ba_=new MlString("."),
     _a$_=new MlString("printf: bad positional specification (0)."),
     _a__=new MlString("%_"),
     _a9_=[0,new MlString("printf.ml"),143,8],
     _a8_=new MlString("'"),
     _a7_=new MlString("Printf: premature end of format string '"),
     _a6_=new MlString("'"),
     _a5_=new MlString(" in format string '"),
     _a4_=new MlString(", at char number "),
     _a3_=new MlString("Printf: bad conversion %"),
     _a2_=new MlString("Sformat.index_of_int: negative argument "),
     _a1_=
      new
       MlString
       ("(function(a,f){var len=a.length;for(var i = 0; i < len; ++i){f(a[i]);}})"),
     _a0_=new MlString(""),
     _aZ_=new MlString("iter"),
     _aY_=
      new
       MlString
       ("(function(t, x0, f){for(var k in t){if(t.hasOwnProperty(k)){x0=f(x0,parseInt(k),t[k]);}} return x0;})"),
     _aX_=
      new
       MlString
       ("(function(t, f){for(var k in t){if(t.hasOwnProperty(k)){f(parseInt(k),t[k]);}}})"),
     _aW_=new MlString("(function(x,y){return x % y;})"),
     _aV_=new MlString("pageY"),
     _aU_=new MlString("pageX"),
     _aT_=new MlString("http://www.w3.org/2000/svg"),
     _aS_=new MlString(">"),
     _aR_=new MlString("<"),
     _aQ_=new MlString("body"),
     _aP_=new MlString("mousemove"),
     _aO_=new MlString("M%f,%f %s"),
     _aN_=new MlString("circle"),
     _aM_=new MlString("style"),
     _aL_=new MlString("r"),
     _aK_=new MlString("cy"),
     _aJ_=new MlString("cx"),
     _aI_=new MlString("transform"),
     _aH_=[0,new MlString(",")],
     _aG_=new MlString("points"),
     _aF_=new MlString("style"),
     _aE_=new MlString("polygon"),
     _aD_=new MlString("points"),
     _aC_=new MlString("path"),
     _aB_=new MlString("d"),
     _aA_=new MlString("style"),
     _az_=new MlString("text"),
     _ay_=new MlString("style"),
     _ax_=new MlString("y"),
     _aw_=new MlString("x"),
     _av_=new MlString("g"),
     _au_=new MlString("style"),
     _at_=new MlString("height"),
     _as_=new MlString("width"),
     _ar_=new MlString("y"),
     _aq_=new MlString("x"),
     _ap_=new MlString("rect"),
     _ao_=new MlString("height"),
     _an_=new MlString("width"),
     _am_=new MlString("y"),
     _al_=new MlString("x"),
     _ak_=new MlString("g"),
     _aj_=[0,new MlString(";")],
     _ai_=[0,new MlString(" ")],
     _ah_=new MlString("L%f %f"),
     _ag_=new MlString("M%f %f"),
     _af_=[0,0,0],
     _ae_=new MlString("a%f,%f 0 %d,1 %f,%f"),
     _ad_=new MlString("fill:"),
     _ac_=new MlString("stroke-linejoin:"),
     _ab_=new MlString("stroke-linecap:"),
     _aa_=new MlString("stroke-width:"),
     _$_=new MlString("stroke:"),
     ___=[0,new MlString(";")],
     _Z_=[0,new MlString(" ")],
     _Y_=new MlString("stroke-dasharray:"),
     _X_=new MlString("miter"),
     _W_=new MlString("bevel"),
     _V_=new MlString("round"),
     _U_=new MlString("butt"),
     _T_=new MlString("round"),
     _S_=new MlString("square"),
     _R_=new MlString("matrix(%f,%f,%f,%f,%f,%f)"),
     _Q_=new MlString("translate(%f %f)"),
     _P_=new MlString("scale(%f %f)"),
     _O_=new MlString("rotate(%f %f %f)"),
     _N_=new MlString("skewX(%f)"),
     _M_=new MlString("skewY(%f)"),
     _L_=new MlString("rgba(%d,%d,%d,%f)"),
     _K_=[0,new MlString(" ")],
     _J_=new MlString(","),
     _I_=[0,255,255,255,1],
     _H_=new MlString("height"),
     _G_=new MlString("width"),
     _F_=new MlString("svg"),
     _E_=new MlString("value"),
     _D_=new MlString("div"),
     _C_=new MlString("Graph.Change.Add_arc: Nodes not in graph"),
     _B_=new MlString("Graph.Change.Remove_arc: Nodes not in graph"),
     _A_=new MlString("Graph.Change.Remove_node : Node not in graph"),
     _z_=[0,200,100],
     _y_=[0,100,100],
     _x_=[0,5,5],
     _w_=new MlString("#pathanim"),
     _v_=new MlString(""),
     _u_=new MlString("Invalid range"),
     _t_=[0,new MlString("height"),new MlString("600")],
     _s_=[0,new MlString("width"),new MlString("400")],
     _r_=new MlString("svg"),
     _q_=new MlString("#content"),
     _p_=new MlString("hi"),
     _o_=[0,new MlString("fill"),new MlString("none")],
     _n_=[0,new MlString("stroke-width"),new MlString("5")],
     _m_=
      [0,
       new MlString("d"),
       new
        MlString
        ("m74.072388,176.343704c0,0 -48.240629,-187.48112 77.664017,-81.201996c125.904617,106.279099 131.036606,-49.55714 131.036606,-49.55714c0,0 14.027405,-41.795149 -142.669113,-23.882954c-156.696512,17.912197 69.794968,40.60104 69.794968,40.60104c0,0 218.280304,19.106365 -31.818298,157.030354c-250.098579,137.92395 -120.088375,-207.781625 -120.088375,-207.781625")],
     _l_=[0,new MlString("stroke"),new MlString("#000000")],
     _k_=new MlString("path"),
     _j_=[0,new MlString("src/rotsym.ml"),109,9];
    /*<<990: pervasives.ml 20 17 33>>*/function _i_(s_e_){throw [0,_a_,s_e_];}
    /*<<984: pervasives.ml 21 20 45>>*/function _bA_(s_f_)
     {throw [0,_b_,s_f_];}
    function _bB_(x_h_,y_g_){return caml_lessequal(x_h_,y_g_)?x_h_:y_g_;}
    function _bM_(s1_bC_,s2_bE_)
     {var
       l1_bD_=s1_bC_.getLen(),
       l2_bF_=s2_bE_.getLen(),
       s_bG_=caml_create_string(l1_bD_+l2_bF_|0);
      caml_blit_string(s1_bC_,0,s_bG_,0,l1_bD_);
      caml_blit_string(s2_bE_,0,s_bG_,l1_bD_,l2_bF_);
      return s_bG_;}
    /*<<846: pervasives.ml 186 2 19>>*/function string_of_int_bN_(n_bH_)
     {return caml_format_int(_bx_,n_bH_);}
    /*<<220: pervasives.ml 451 20 39>>*/function do_at_exit_bO_(param_bL_)
     {var param_bI_=caml_ml_out_channels_list(0);
      /*<<720: pervasives.ml 253 17 50>>*/for(;;)
       {if(param_bI_)
         {var l_bJ_=param_bI_[2];
          try {}catch(_bK_){}
          var param_bI_=l_bJ_;
          continue;}
        return 0;}}
    caml_register_named_value(_bu_,do_at_exit_bO_);
    function _bU_(a1_bP_,a2_bR_)
     {var l1_bQ_=a1_bP_.length-1;
      if(0===l1_bQ_)
       {var
         l_bS_=a2_bR_.length-1,
         _bT_=0===l_bS_?[0]:caml_array_sub(a2_bR_,0,l_bS_);
        return _bT_;}
      return 0===a2_bR_.length-1
              ?caml_array_sub(a1_bP_,0,l1_bQ_)
              :caml_array_append(a1_bP_,a2_bR_);}
    function _b7_(n_bV_,c_bX_)
     {var s_bW_=caml_create_string(n_bV_);
      caml_fill_string(s_bW_,0,n_bV_,c_bX_);
      return s_bW_;}
    function _b8_(s_b0_,ofs_bY_,len_bZ_)
     {if(0<=ofs_bY_&&0<=len_bZ_&&!((s_b0_.getLen()-len_bZ_|0)<ofs_bY_))
       {var r_b1_=caml_create_string(len_bZ_);
        /*<<6675: string.ml 41 7 5>>*/caml_blit_string
         (s_b0_,ofs_bY_,r_b1_,0,len_bZ_);
        return r_b1_;}
      return _bA_(_bm_);}
    function _b9_(s1_b4_,ofs1_b3_,s2_b6_,ofs2_b5_,len_b2_)
     {if
       (0<=
        len_b2_&&
        0<=
        ofs1_b3_&&
        !((s1_b4_.getLen()-len_b2_|0)<ofs1_b3_)&&
        0<=
        ofs2_b5_&&
        !((s2_b6_.getLen()-len_b2_|0)<ofs2_b5_))
       return caml_blit_string(s1_b4_,ofs1_b3_,s2_b6_,ofs2_b5_,len_b2_);
      return _bA_(_bn_);}
    var
     _b__=caml_sys_const_word_size(0),
     _b$_=caml_mul(_b__/8|0,(1<<(_b__-10|0))-1|0)-1|0;
    /*<<8284: buffer.ml 23 1 59>>*/function _cr_(n_ca_)
     {var
       n_cb_=1<=n_ca_?n_ca_:1,
       n_cc_=_b$_<n_cb_?_b$_:n_cb_,
       s_cd_=caml_create_string(n_cc_);
      return [0,s_cd_,0,n_cc_,s_cd_];}
    /*<<8274: buffer.ml 28 17 49>>*/function _cs_(b_ce_)
     {return _b8_(b_ce_[1],0,b_ce_[2]);}
    function _cl_(b_cf_,more_ch_)
     {var new_len_cg_=[0,b_cf_[3]];
      for(;;)
       {if(new_len_cg_[1]<(b_cf_[2]+more_ch_|0))
         {new_len_cg_[1]=2*new_len_cg_[1]|0;continue;}
        if(_b$_<new_len_cg_[1])
         if((b_cf_[2]+more_ch_|0)<=_b$_)
          /*<<8082: buffer.ml 68 9 41>>*/new_len_cg_[1]=_b$_;
         else
          /*<<8089: buffer.ml 69 9 50>>*/_i_(_bl_);
        var new_buffer_ci_=caml_create_string(new_len_cg_[1]);
        /*<<8095: buffer.ml 69 9 50>>*/_b9_
         (b_cf_[1],0,new_buffer_ci_,0,b_cf_[2]);
        /*<<8095: buffer.ml 69 9 50>>*/b_cf_[1]=new_buffer_ci_;
        /*<<8095: buffer.ml 69 9 50>>*/b_cf_[3]=new_len_cg_[1];
        return 0;}}
    function _ct_(b_cj_,c_cm_)
     {var pos_ck_=b_cj_[2];
      if(b_cj_[3]<=pos_ck_)/*<<8019: buffer.ml 78 26 36>>*/_cl_(b_cj_,1);
      /*<<8023: buffer.ml 78 26 36>>*/b_cj_[1].safeSet(pos_ck_,c_cm_);
      /*<<8023: buffer.ml 78 26 36>>*/b_cj_[2]=pos_ck_+1|0;
      return 0;}
    function _cu_(b_cp_,s_cn_)
     {var len_co_=s_cn_.getLen(),new_position_cq_=b_cp_[2]+len_co_|0;
      if(b_cp_[3]<new_position_cq_)
       /*<<7921: buffer.ml 93 34 46>>*/_cl_(b_cp_,len_co_);
      /*<<7925: buffer.ml 93 34 46>>*/_b9_(s_cn_,0,b_cp_[1],b_cp_[2],len_co_);
      /*<<7925: buffer.ml 93 34 46>>*/b_cp_[2]=new_position_cq_;
      return 0;}
    /*<<11963: printf.ml 32 4 80>>*/function index_of_int_cy_(i_cv_)
     {return 0<=i_cv_?i_cv_:_i_(_bM_(_a2_,string_of_int_bN_(i_cv_)));}
    function add_int_index_cz_(i_cw_,idx_cx_)
     {return index_of_int_cy_(i_cw_+idx_cx_|0);}
    var _cB_=_cA_(add_int_index_cz_,1);
    /*<<11929: printf.ml 58 22 66>>*/function _cI_(fmt_cC_)
     {return _b8_(fmt_cC_,0,fmt_cC_.getLen());}
    function bad_conversion_cK_(sfmt_cD_,i_cE_,c_cG_)
     {var
       _cF_=_bM_(_a5_,_bM_(sfmt_cD_,_a6_)),
       _cH_=_bM_(_a4_,_bM_(string_of_int_bN_(i_cE_),_cF_));
      return _bA_(_bM_(_a3_,_bM_(_b7_(1,c_cG_),_cH_)));}
    function bad_conversion_format_dD_(fmt_cJ_,i_cM_,c_cL_)
     {return bad_conversion_cK_(_cI_(fmt_cJ_),i_cM_,c_cL_);}
    /*<<11842: printf.ml 75 2 34>>*/function incomplete_format_dE_(fmt_cN_)
     {return _bA_(_bM_(_a7_,_bM_(_cI_(fmt_cN_),_a8_)));}
    function extract_format_c$_(fmt_cO_,start_cW_,stop_cY_,widths_c0_)
     {/*<<11574: printf.ml 123 4 16>>*/function skip_positional_spec_cV_
       (start_cP_)
       {if
         ((fmt_cO_.safeGet(start_cP_)-48|0)<
          0||
          9<
          (fmt_cO_.safeGet(start_cP_)-48|0))
         return start_cP_;
        var i_cQ_=start_cP_+1|0;
        /*<<11545: printf.ml 126 8 20>>*/for(;;)
         {var _cR_=fmt_cO_.safeGet(i_cQ_);
          if(48<=_cR_)
           {if(!(58<=_cR_)){var _cT_=i_cQ_+1|0,i_cQ_=_cT_;continue;}
            var _cS_=0;}
          else
           if(36===_cR_){var _cU_=i_cQ_+1|0,_cS_=1;}else var _cS_=0;
          if(!_cS_)var _cU_=start_cP_;
          return _cU_;}}
      var
       start_cX_=skip_positional_spec_cV_(start_cW_+1|0),
       b_cZ_=_cr_((stop_cY_-start_cX_|0)+10|0);
      _ct_(b_cZ_,37);
      var l1_c1_=widths_c0_,l2_c2_=0;
      for(;;)
       {if(l1_c1_)
         {var
           l_c3_=l1_c1_[2],
           _c4_=[0,l1_c1_[1],l2_c2_],
           l1_c1_=l_c3_,
           l2_c2_=_c4_;
          continue;}
        var i_c5_=start_cX_,widths_c6_=l2_c2_;
        for(;;)
         {if(i_c5_<=stop_cY_)
           {var _c7_=fmt_cO_.safeGet(i_c5_);
            if(42===_c7_)
             {if(widths_c6_)
               {var t_c8_=widths_c6_[2];
                _cu_(b_cZ_,string_of_int_bN_(widths_c6_[1]));
                var
                 i_c9_=skip_positional_spec_cV_(i_c5_+1|0),
                 i_c5_=i_c9_,
                 widths_c6_=t_c8_;
                continue;}
              throw [0,_by_,_a9_];}
            _ct_(b_cZ_,_c7_);
            var _c__=i_c5_+1|0,i_c5_=_c__;
            continue;}
          return _cs_(b_cZ_);}}}
    function extract_format_int_e5_
     (conv_df_,fmt_dd_,start_dc_,stop_db_,widths_da_)
     {var sfmt_de_=extract_format_c$_(fmt_dd_,start_dc_,stop_db_,widths_da_);
      if(78!==conv_df_&&110!==conv_df_)return sfmt_de_;
      /*<<11463: printf.ml 155 4 8>>*/sfmt_de_.safeSet
       (sfmt_de_.getLen()-1|0,117);
      return sfmt_de_;}
    function sub_format_dF_
     (incomplete_format_dm_,bad_conversion_format_dw_,conv_dB_,fmt_dg_,i_dA_)
     {var len_dh_=fmt_dg_.getLen();
      function sub_fmt_dy_(c_di_,i_dv_)
       {var close_dj_=40===c_di_?41:125;
        /*<<11228: printf.ml 181 7 26>>*/function sub_du_(j_dk_)
         {var j_dl_=j_dk_;
          /*<<11228: printf.ml 181 7 26>>*/for(;;)
           {if(len_dh_<=j_dl_)return _cA_(incomplete_format_dm_,fmt_dg_);
            if(37===fmt_dg_.safeGet(j_dl_))
             {var _dn_=j_dl_+1|0;
              if(len_dh_<=_dn_)
               var _do_=_cA_(incomplete_format_dm_,fmt_dg_);
              else
               {var _dp_=fmt_dg_.safeGet(_dn_),_dq_=_dp_-40|0;
                if(_dq_<0||1<_dq_)
                 {var _dr_=_dq_-83|0;
                  if(_dr_<0||2<_dr_)
                   var _ds_=1;
                  else
                   switch(_dr_)
                    {case 1:var _ds_=1;break;
                     case 2:var _dt_=1,_ds_=0;break;
                     default:var _dt_=0,_ds_=0;}
                  if(_ds_){var _do_=sub_du_(_dn_+1|0),_dt_=2;}}
                else
                 var _dt_=0===_dq_?0:1;
                switch(_dt_)
                 {case 1:
                   var
                    _do_=
                     _dp_===close_dj_
                      ?_dn_+1|0
                      :_dx_(bad_conversion_format_dw_,fmt_dg_,i_dv_,_dp_);
                   break;
                  case 2:break;
                  default:var _do_=sub_du_(sub_fmt_dy_(_dp_,_dn_+1|0)+1|0);}}
              return _do_;}
            var _dz_=j_dl_+1|0,j_dl_=_dz_;
            continue;}}
        return sub_du_(i_dv_);}
      return sub_fmt_dy_(conv_dB_,i_dA_);}
    /*<<11222: printf.ml 199 2 57>>*/function sub_format_for_printf_d5_
     (conv_dC_)
     {return _dx_
              (sub_format_dF_,
               incomplete_format_dE_,
               bad_conversion_format_dD_,
               conv_dC_);}
    function iter_on_format_args_ej_(fmt_dG_,add_conv_dR_,add_char_d1_)
     {var lim_dH_=fmt_dG_.getLen()-1|0;
      /*<<11162: printf.ml 254 4 10>>*/function scan_fmt_d3_(i_dI_)
       {var i_dJ_=i_dI_;
        a:
        /*<<11162: printf.ml 254 4 10>>*/for(;;)
         {if(i_dJ_<lim_dH_)
           {if(37===fmt_dG_.safeGet(i_dJ_))
             {var skip_dK_=0,i_dL_=i_dJ_+1|0;
              for(;;)
               {if(lim_dH_<i_dL_)
                 var _dM_=incomplete_format_dE_(fmt_dG_);
                else
                 {var _dN_=fmt_dG_.safeGet(i_dL_);
                  if(58<=_dN_)
                   {if(95===_dN_)
                     {var _dP_=i_dL_+1|0,_dO_=1,skip_dK_=_dO_,i_dL_=_dP_;
                      continue;}}
                  else
                   if(32<=_dN_)
                    switch(_dN_-32|0)
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
                      case 13:var _dQ_=i_dL_+1|0,i_dL_=_dQ_;continue;
                      case 10:
                       var _dS_=_dx_(add_conv_dR_,skip_dK_,i_dL_,105),i_dL_=_dS_;
                       continue;
                      default:var _dT_=i_dL_+1|0,i_dL_=_dT_;continue;}
                  var i_dU_=i_dL_;
                  c:
                  for(;;)
                   {if(lim_dH_<i_dU_)
                     var _dV_=incomplete_format_dE_(fmt_dG_);
                    else
                     {var _dW_=fmt_dG_.safeGet(i_dU_);
                      if(126<=_dW_)
                       var _dX_=0;
                      else
                       switch(_dW_)
                        {case 78:
                         case 88:
                         case 100:
                         case 105:
                         case 111:
                         case 117:
                         case 120:
                          var _dV_=_dx_(add_conv_dR_,skip_dK_,i_dU_,105),_dX_=1;break;
                         case 69:
                         case 70:
                         case 71:
                         case 101:
                         case 102:
                         case 103:
                          var _dV_=_dx_(add_conv_dR_,skip_dK_,i_dU_,102),_dX_=1;break;
                         case 33:
                         case 37:
                         case 44:
                         case 64:var _dV_=i_dU_+1|0,_dX_=1;break;
                         case 83:
                         case 91:
                         case 115:
                          var _dV_=_dx_(add_conv_dR_,skip_dK_,i_dU_,115),_dX_=1;break;
                         case 97:
                         case 114:
                         case 116:
                          var _dV_=_dx_(add_conv_dR_,skip_dK_,i_dU_,_dW_),_dX_=1;
                          break;
                         case 76:
                         case 108:
                         case 110:
                          var j_dY_=i_dU_+1|0;
                          if(lim_dH_<j_dY_)
                           {var _dV_=_dx_(add_conv_dR_,skip_dK_,i_dU_,105),_dX_=1;}
                          else
                           {var _dZ_=fmt_dG_.safeGet(j_dY_)-88|0;
                            if(_dZ_<0||32<_dZ_)
                             var _d0_=1;
                            else
                             switch(_dZ_)
                              {case 0:
                               case 12:
                               case 17:
                               case 23:
                               case 29:
                               case 32:
                                var
                                 _dV_=
                                  _d2_
                                   (add_char_d1_,_dx_(add_conv_dR_,skip_dK_,i_dU_,_dW_),105),
                                 _dX_=1,
                                 _d0_=0;
                                break;
                               default:var _d0_=1;}
                            if(_d0_)
                             {var _dV_=_dx_(add_conv_dR_,skip_dK_,i_dU_,105),_dX_=1;}}
                          break;
                         case 67:
                         case 99:
                          var _dV_=_dx_(add_conv_dR_,skip_dK_,i_dU_,99),_dX_=1;break;
                         case 66:
                         case 98:
                          var _dV_=_dx_(add_conv_dR_,skip_dK_,i_dU_,66),_dX_=1;break;
                         case 41:
                         case 125:
                          var _dV_=_dx_(add_conv_dR_,skip_dK_,i_dU_,_dW_),_dX_=1;
                          break;
                         case 40:
                          var
                           _dV_=scan_fmt_d3_(_dx_(add_conv_dR_,skip_dK_,i_dU_,_dW_)),
                           _dX_=1;
                          break;
                         case 123:
                          var
                           i_d4_=_dx_(add_conv_dR_,skip_dK_,i_dU_,_dW_),
                           j_d6_=_dx_(sub_format_for_printf_d5_,_dW_,fmt_dG_,i_d4_),
                           i_d7_=i_d4_;
                          /*<<10784: printf.ml 240 8 63>>*/for(;;)
                           {if(i_d7_<(j_d6_-2|0))
                             {var
                               _d8_=_d2_(add_char_d1_,i_d7_,fmt_dG_.safeGet(i_d7_)),
                               i_d7_=_d8_;
                              continue;}
                            var _d9_=j_d6_-1|0,i_dU_=_d9_;
                            continue c;}
                         default:var _dX_=0;}
                      if(!_dX_)
                       var _dV_=bad_conversion_format_dD_(fmt_dG_,i_dU_,_dW_);}
                    var _dM_=_dV_;
                    break;}}
                var i_dJ_=_dM_;
                continue a;}}
            var _d__=i_dJ_+1|0,i_dJ_=_d__;
            continue;}
          return i_dJ_;}}
      scan_fmt_d3_(0);
      return 0;}
    /*<<10497: printf.ml 310 2 12>>*/function
     count_printing_arguments_of_format_gi_
     (fmt_ek_)
     {var ac_d$_=[0,0,0,0];
      function add_conv_ei_(skip_ee_,i_ef_,c_ea_)
       {var _eb_=41!==c_ea_?1:0,_ec_=_eb_?125!==c_ea_?1:0:_eb_;
        if(_ec_)
         {var inc_ed_=97===c_ea_?2:1;
          if(114===c_ea_)
           /*<<10553: printf.ml 295 20 48>>*/ac_d$_[3]=ac_d$_[3]+1|0;
          if(skip_ee_)
           /*<<10562: printf.ml 297 9 39>>*/ac_d$_[2]=ac_d$_[2]+inc_ed_|0;
          else
           /*<<10570: printf.ml 298 9 39>>*/ac_d$_[1]=ac_d$_[1]+inc_ed_|0;}
        return i_ef_+1|0;}
      /*<<10578: printf.ml 292 2 4>>*/iter_on_format_args_ej_
       (fmt_ek_,add_conv_ei_,function(i_eg_,param_eh_){return i_eg_+1|0;});
      return ac_d$_[1];}
    function scan_positional_spec_e1_(fmt_el_,got_spec_eo_,i_em_)
     {var _en_=fmt_el_.safeGet(i_em_);
      if((_en_-48|0)<0||9<(_en_-48|0))return _d2_(got_spec_eo_,0,i_em_);
      var accu_ep_=_en_-48|0,j_eq_=i_em_+1|0;
      for(;;)
       {var _er_=fmt_el_.safeGet(j_eq_);
        if(48<=_er_)
         {if(!(58<=_er_))
           {var
             _eu_=j_eq_+1|0,
             _et_=(10*accu_ep_|0)+(_er_-48|0)|0,
             accu_ep_=_et_,
             j_eq_=_eu_;
            continue;}
          var _es_=0;}
        else
         if(36===_er_)
          if(0===accu_ep_)
           {var _ev_=_i_(_a$_),_es_=1;}
          else
           {var
             _ev_=
              _d2_(got_spec_eo_,[0,index_of_int_cy_(accu_ep_-1|0)],j_eq_+1|0),
             _es_=1;}
         else
          var _es_=0;
        if(!_es_)var _ev_=_d2_(got_spec_eo_,0,i_em_);
        return _ev_;}}
    function next_index_eW_(spec_ew_,n_ex_)
     {return spec_ew_?n_ex_:_cA_(_cB_,n_ex_);}
    function get_index_eL_(spec_ey_,n_ez_){return spec_ey_?spec_ey_[1]:n_ez_;}
    function _hK_
     (to_s_gD_,get_out_eB_,outc_gP_,outs_eE_,flush_gn_,k_gV_,fmt_eA_)
     {var out_eC_=_cA_(get_out_eB_,fmt_eA_);
      /*<<8830: printf.ml 615 15 25>>*/function outs_gE_(s_eD_)
       {return _d2_(outs_eE_,out_eC_,s_eD_);}
      function pr_gm_(k_eJ_,n_gU_,fmt_eF_,v_eO_)
       {var len_eI_=fmt_eF_.getLen();
        function doprn_gj_(n_gM_,i_eG_)
         {var i_eH_=i_eG_;
          for(;;)
           {if(len_eI_<=i_eH_)return _cA_(k_eJ_,out_eC_);
            var _eK_=fmt_eF_.safeGet(i_eH_);
            if(37===_eK_)
             {var
               get_arg_eS_=
                function(spec_eN_,n_eM_)
                 {return caml_array_get(v_eO_,get_index_eL_(spec_eN_,n_eM_));},
               scan_flags_eY_=
                function(spec_e0_,n_eT_,widths_eV_,i_eP_)
                 {var i_eQ_=i_eP_;
                  for(;;)
                   {var _eR_=fmt_eF_.safeGet(i_eQ_)-32|0;
                    if(!(_eR_<0||25<_eR_))
                     switch(_eR_)
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
                        return scan_positional_spec_e1_
                                (fmt_eF_,
                                 function(wspec_eU_,i_eZ_)
                                  {var _eX_=[0,get_arg_eS_(wspec_eU_,n_eT_),widths_eV_];
                                   return scan_flags_eY_
                                           (spec_e0_,next_index_eW_(wspec_eU_,n_eT_),_eX_,i_eZ_);},
                                 i_eQ_+1|0);
                       default:var _e2_=i_eQ_+1|0,i_eQ_=_e2_;continue;}
                    var _e3_=fmt_eF_.safeGet(i_eQ_);
                    if(124<=_e3_)
                     var _e4_=0;
                    else
                     switch(_e3_)
                      {case 78:
                       case 88:
                       case 100:
                       case 105:
                       case 111:
                       case 117:
                       case 120:
                        var
                         x_e6_=get_arg_eS_(spec_e0_,n_eT_),
                         s_e7_=
                          caml_format_int
                           (extract_format_int_e5_(_e3_,fmt_eF_,i_eH_,i_eQ_,widths_eV_),
                            x_e6_),
                         _e9_=
                          cont_s_e8_(next_index_eW_(spec_e0_,n_eT_),s_e7_,i_eQ_+1|0),
                         _e4_=1;
                        break;
                       case 69:
                       case 71:
                       case 101:
                       case 102:
                       case 103:
                        var
                         x_e__=get_arg_eS_(spec_e0_,n_eT_),
                         s_e$_=
                          caml_format_float
                           (extract_format_c$_(fmt_eF_,i_eH_,i_eQ_,widths_eV_),x_e__),
                         _e9_=
                          cont_s_e8_(next_index_eW_(spec_e0_,n_eT_),s_e$_,i_eQ_+1|0),
                         _e4_=1;
                        break;
                       case 76:
                       case 108:
                       case 110:
                        var _fa_=fmt_eF_.safeGet(i_eQ_+1|0)-88|0;
                        if(_fa_<0||32<_fa_)
                         var _fb_=1;
                        else
                         switch(_fa_)
                          {case 0:
                           case 12:
                           case 17:
                           case 23:
                           case 29:
                           case 32:
                            var i_fc_=i_eQ_+1|0,_fd_=_e3_-108|0;
                            if(_fd_<0||2<_fd_)
                             var _fe_=0;
                            else
                             {switch(_fd_)
                               {case 1:var _fe_=0,_ff_=0;break;
                                case 2:
                                 var
                                  x_fg_=get_arg_eS_(spec_e0_,n_eT_),
                                  _fh_=
                                   caml_format_int
                                    (extract_format_c$_(fmt_eF_,i_eH_,i_fc_,widths_eV_),x_fg_),
                                  _ff_=1;
                                 break;
                                default:
                                 var
                                  x_fi_=get_arg_eS_(spec_e0_,n_eT_),
                                  _fh_=
                                   caml_format_int
                                    (extract_format_c$_(fmt_eF_,i_eH_,i_fc_,widths_eV_),x_fi_),
                                  _ff_=1;}
                              if(_ff_){var s_fj_=_fh_,_fe_=1;}}
                            if(!_fe_)
                             {var
                               x_fk_=get_arg_eS_(spec_e0_,n_eT_),
                               s_fj_=
                                caml_int64_format
                                 (extract_format_c$_(fmt_eF_,i_eH_,i_fc_,widths_eV_),x_fk_);}
                            var
                             _e9_=
                              cont_s_e8_(next_index_eW_(spec_e0_,n_eT_),s_fj_,i_fc_+1|0),
                             _e4_=1,
                             _fb_=0;
                            break;
                           default:var _fb_=1;}
                        if(_fb_)
                         {var
                           x_fl_=get_arg_eS_(spec_e0_,n_eT_),
                           s_fm_=
                            caml_format_int
                             (extract_format_int_e5_(110,fmt_eF_,i_eH_,i_eQ_,widths_eV_),
                              x_fl_),
                           _e9_=
                            cont_s_e8_(next_index_eW_(spec_e0_,n_eT_),s_fm_,i_eQ_+1|0),
                           _e4_=1;}
                        break;
                       case 37:
                       case 64:
                        var _e9_=cont_s_e8_(n_eT_,_b7_(1,_e3_),i_eQ_+1|0),_e4_=1;
                        break;
                       case 83:
                       case 115:
                        var x_fn_=get_arg_eS_(spec_e0_,n_eT_);
                        if(115===_e3_)
                         var x_fo_=x_fn_;
                        else
                         {var n_fp_=[0,0],_fq_=0,_fr_=x_fn_.getLen()-1|0;
                          if(!(_fr_<_fq_))
                           {var i_fs_=_fq_;
                            for(;;)
                             {var
                               _ft_=x_fn_.safeGet(i_fs_),
                               _fu_=
                                14<=_ft_
                                 ?34===_ft_?1:92===_ft_?1:0
                                 :11<=_ft_?13<=_ft_?1:0:8<=_ft_?1:0,
                               _fv_=_fu_?2:caml_is_printable(_ft_)?1:4;
                              n_fp_[1]=n_fp_[1]+_fv_|0;
                              var _fw_=i_fs_+1|0;
                              if(_fr_!==i_fs_){var i_fs_=_fw_;continue;}
                              break;}}
                          if(n_fp_[1]===x_fn_.getLen())
                           var _fx_=x_fn_;
                          else
                           {var s__fy_=caml_create_string(n_fp_[1]);
                            /*<<5987: string.ml 115 33 9>>*/n_fp_[1]=0;
                            var _fz_=0,_fA_=x_fn_.getLen()-1|0;
                            if(!(_fA_<_fz_))
                             {var i_fB_=_fz_;
                              for(;;)
                               {var _fC_=x_fn_.safeGet(i_fB_),_fD_=_fC_-34|0;
                                if(_fD_<0||58<_fD_)
                                 if(-20<=_fD_)
                                  var _fE_=1;
                                 else
                                  {switch(_fD_+34|0)
                                    {case 8:
                                      /*<<6079: string.ml 130 16 67>>*/s__fy_.safeSet(n_fp_[1],92);
                                      /*<<6079: string.ml 130 16 67>>*/n_fp_[1]+=1;
                                      /*<<6079: string.ml 130 16 67>>*/s__fy_.safeSet(n_fp_[1],98);
                                      var _fF_=1;
                                      break;
                                     case 9:
                                      /*<<6096: string.ml 126 16 67>>*/s__fy_.safeSet(n_fp_[1],92);
                                      /*<<6096: string.ml 126 16 67>>*/n_fp_[1]+=1;
                                      /*<<6096: string.ml 126 16 67>>*/s__fy_.safeSet
                                       (n_fp_[1],116);
                                      var _fF_=1;
                                      break;
                                     case 10:
                                      /*<<6113: string.ml 124 16 67>>*/s__fy_.safeSet(n_fp_[1],92);
                                      /*<<6113: string.ml 124 16 67>>*/n_fp_[1]+=1;
                                      /*<<6113: string.ml 124 16 67>>*/s__fy_.safeSet
                                       (n_fp_[1],110);
                                      var _fF_=1;
                                      break;
                                     case 13:
                                      /*<<6130: string.ml 128 16 67>>*/s__fy_.safeSet(n_fp_[1],92);
                                      /*<<6130: string.ml 128 16 67>>*/n_fp_[1]+=1;
                                      /*<<6130: string.ml 128 16 67>>*/s__fy_.safeSet
                                       (n_fp_[1],114);
                                      var _fF_=1;
                                      break;
                                     default:var _fE_=1,_fF_=0;}
                                   if(_fF_)var _fE_=0;}
                                else
                                 var
                                  _fE_=
                                   (_fD_-1|0)<0||56<(_fD_-1|0)
                                    ?(s__fy_.safeSet(n_fp_[1],92),
                                      n_fp_[1]+=
                                      1,
                                      s__fy_.safeSet(n_fp_[1],_fC_),
                                      0)
                                    :1;
                                if(_fE_)
                                 if(caml_is_printable(_fC_))
                                  /*<<6159: string.ml 133 18 36>>*/s__fy_.safeSet
                                   (n_fp_[1],_fC_);
                                 else
                                  {/*<<6166: string.ml 134 21 19>>*/s__fy_.safeSet
                                    (n_fp_[1],92);
                                   /*<<6166: string.ml 134 21 19>>*/n_fp_[1]+=1;
                                   /*<<6166: string.ml 134 21 19>>*/s__fy_.safeSet
                                    (n_fp_[1],48+(_fC_/100|0)|0);
                                   /*<<6166: string.ml 134 21 19>>*/n_fp_[1]+=1;
                                   /*<<6166: string.ml 134 21 19>>*/s__fy_.safeSet
                                    (n_fp_[1],48+((_fC_/10|0)%10|0)|0);
                                   /*<<6166: string.ml 134 21 19>>*/n_fp_[1]+=1;
                                   /*<<6166: string.ml 134 21 19>>*/s__fy_.safeSet
                                    (n_fp_[1],48+(_fC_%10|0)|0);}
                                n_fp_[1]+=1;
                                var _fG_=i_fB_+1|0;
                                if(_fA_!==i_fB_){var i_fB_=_fG_;continue;}
                                break;}}
                            var _fx_=s__fy_;}
                          var x_fo_=_bM_(_bg_,_bM_(_fx_,_bh_));}
                        if(i_eQ_===(i_eH_+1|0))
                         var s_fH_=x_fo_;
                        else
                         {var
                           _fI_=
                            extract_format_c$_(fmt_eF_,i_eH_,i_eQ_,widths_eV_);
                          /*<<11812: printf.ml 83 2 42>>*/try
                           {var neg_fJ_=0,i_fK_=1;
                            for(;;)
                             {if(_fI_.getLen()<=i_fK_)
                               var _fL_=[0,0,neg_fJ_];
                              else
                               {var _fM_=_fI_.safeGet(i_fK_);
                                if(49<=_fM_)
                                 if(58<=_fM_)
                                  var _fN_=0;
                                 else
                                  {var
                                    _fL_=
                                     [0,
                                      caml_int_of_string
                                       (_b8_(_fI_,i_fK_,(_fI_.getLen()-i_fK_|0)-1|0)),
                                      neg_fJ_],
                                    _fN_=1;}
                                else
                                 {if(45===_fM_)
                                   {var _fP_=i_fK_+1|0,_fO_=1,neg_fJ_=_fO_,i_fK_=_fP_;
                                    continue;}
                                  var _fN_=0;}
                                if(!_fN_){var _fQ_=i_fK_+1|0,i_fK_=_fQ_;continue;}}
                              var match_fR_=_fL_;
                              break;}}
                          catch(_fS_)
                           {if(_fS_[1]!==_a_)throw _fS_;
                            var match_fR_=bad_conversion_cK_(_fI_,0,115);}
                          var
                           p_fT_=match_fR_[1],
                           _fU_=x_fo_.getLen(),
                           _fV_=0,
                           neg_fZ_=match_fR_[2],
                           _fY_=32;
                          if(p_fT_===_fU_&&0===_fV_)
                           {var _fW_=x_fo_,_fX_=1;}
                          else
                           var _fX_=0;
                          if(!_fX_)
                           if(p_fT_<=_fU_)
                            var _fW_=_b8_(x_fo_,_fV_,_fU_);
                           else
                            {var res_f0_=_b7_(p_fT_,_fY_);
                             if(neg_fZ_)
                              /*<<11709: printf.ml 105 7 32>>*/_b9_
                               (x_fo_,_fV_,res_f0_,0,_fU_);
                             else
                              /*<<11726: printf.ml 106 7 40>>*/_b9_
                               (x_fo_,_fV_,res_f0_,p_fT_-_fU_|0,_fU_);
                             var _fW_=res_f0_;}
                          var s_fH_=_fW_;}
                        var
                         _e9_=
                          cont_s_e8_(next_index_eW_(spec_e0_,n_eT_),s_fH_,i_eQ_+1|0),
                         _e4_=1;
                        break;
                       case 67:
                       case 99:
                        var x_f1_=get_arg_eS_(spec_e0_,n_eT_);
                        if(99===_e3_)
                         var s_f2_=_b7_(1,x_f1_);
                        else
                         {if(39===x_f1_)
                           var _f3_=_bo_;
                          else
                           if(92===x_f1_)
                            var _f3_=_bp_;
                           else
                            {if(14<=x_f1_)
                              var _f4_=0;
                             else
                              switch(x_f1_)
                               {case 8:var _f3_=_bt_,_f4_=1;break;
                                case 9:var _f3_=_bs_,_f4_=1;break;
                                case 10:var _f3_=_br_,_f4_=1;break;
                                case 13:var _f3_=_bq_,_f4_=1;break;
                                default:var _f4_=0;}
                             if(!_f4_)
                              if(caml_is_printable(x_f1_))
                               {var s_f5_=caml_create_string(1);
                                /*<<5422: char.ml 37 27 7>>*/s_f5_.safeSet(0,x_f1_);
                                var _f3_=s_f5_;}
                              else
                               {var s_f6_=caml_create_string(4);
                                /*<<5432: char.ml 41 13 7>>*/s_f6_.safeSet(0,92);
                                /*<<5432: char.ml 41 13 7>>*/s_f6_.safeSet
                                 (1,48+(x_f1_/100|0)|0);
                                /*<<5432: char.ml 41 13 7>>*/s_f6_.safeSet
                                 (2,48+((x_f1_/10|0)%10|0)|0);
                                /*<<5432: char.ml 41 13 7>>*/s_f6_.safeSet
                                 (3,48+(x_f1_%10|0)|0);
                                var _f3_=s_f6_;}}
                          var s_f2_=_bM_(_be_,_bM_(_f3_,_bf_));}
                        var
                         _e9_=
                          cont_s_e8_(next_index_eW_(spec_e0_,n_eT_),s_f2_,i_eQ_+1|0),
                         _e4_=1;
                        break;
                       case 66:
                       case 98:
                        var
                         _f8_=i_eQ_+1|0,
                         _f7_=get_arg_eS_(spec_e0_,n_eT_)?_bw_:_bv_,
                         _e9_=cont_s_e8_(next_index_eW_(spec_e0_,n_eT_),_f7_,_f8_),
                         _e4_=1;
                        break;
                       case 40:
                       case 123:
                        var
                         xf_f9_=get_arg_eS_(spec_e0_,n_eT_),
                         i_f__=_dx_(sub_format_for_printf_d5_,_e3_,fmt_eF_,i_eQ_+1|0);
                        if(123===_e3_)
                         {var
                           b_f$_=_cr_(xf_f9_.getLen()),
                           add_char_gd_=
                            function(i_gb_,c_ga_){_ct_(b_f$_,c_ga_);return i_gb_+1|0;};
                          /*<<10644: printf.ml 268 2 19>>*/iter_on_format_args_ej_
                           (xf_f9_,
                            function(skip_gc_,i_gf_,c_ge_)
                             {if(skip_gc_)
                               /*<<10609: printf.ml 272 17 41>>*/_cu_(b_f$_,_a__);
                              else
                               /*<<10618: printf.ml 272 47 68>>*/_ct_(b_f$_,37);
                              return add_char_gd_(i_gf_,c_ge_);},
                            add_char_gd_);
                          var
                           _gg_=_cs_(b_f$_),
                           _e9_=cont_s_e8_(next_index_eW_(spec_e0_,n_eT_),_gg_,i_f__),
                           _e4_=1;}
                        else
                         {var
                           _gh_=next_index_eW_(spec_e0_,n_eT_),
                           m_gk_=
                            add_int_index_cz_
                             (count_printing_arguments_of_format_gi_(xf_f9_),_gh_),
                           _e9_=
                            pr_gm_
                             (/*<<8760: printf.ml 647 30 39>>*/function(param_gl_)
                               {return doprn_gj_(m_gk_,i_f__);},
                              _gh_,
                              xf_f9_,
                              v_eO_),
                           _e4_=1;}
                        break;
                       case 33:
                        _cA_(flush_gn_,out_eC_);
                        var _e9_=doprn_gj_(n_eT_,i_eQ_+1|0),_e4_=1;
                        break;
                       case 41:
                        var _e9_=cont_s_e8_(n_eT_,_bk_,i_eQ_+1|0),_e4_=1;break;
                       case 44:
                        var _e9_=cont_s_e8_(n_eT_,_bj_,i_eQ_+1|0),_e4_=1;break;
                       case 70:
                        var x_go_=get_arg_eS_(spec_e0_,n_eT_);
                        if(0===widths_eV_)
                         var _gp_=_bi_;
                        else
                         {var
                           sfmt_gq_=
                            extract_format_c$_(fmt_eF_,i_eH_,i_eQ_,widths_eV_);
                          if(70===_e3_)
                           /*<<11427: printf.ml 164 4 8>>*/sfmt_gq_.safeSet
                            (sfmt_gq_.getLen()-1|0,103);
                          var _gp_=sfmt_gq_;}
                        var _gr_=caml_classify_float(x_go_);
                        if(3===_gr_)
                         var s_gs_=x_go_<0?_bc_:_bb_;
                        else
                         if(4<=_gr_)
                          var s_gs_=_bd_;
                         else
                          {var
                            _gt_=caml_format_float(_gp_,x_go_),
                            i_gu_=0,
                            l_gv_=_gt_.getLen();
                           /*<<9936: printf.ml 448 6 37>>*/for(;;)
                            {if(l_gv_<=i_gu_)
                              var _gw_=_bM_(_gt_,_ba_);
                             else
                              {var
                                _gx_=_gt_.safeGet(i_gu_)-46|0,
                                _gy_=
                                 _gx_<0||23<_gx_
                                  ?55===_gx_?1:0
                                  :(_gx_-1|0)<0||21<(_gx_-1|0)?1:0;
                               if(!_gy_){var _gz_=i_gu_+1|0,i_gu_=_gz_;continue;}
                               var _gw_=_gt_;}
                             var s_gs_=_gw_;
                             break;}}
                        var
                         _e9_=
                          cont_s_e8_(next_index_eW_(spec_e0_,n_eT_),s_gs_,i_eQ_+1|0),
                         _e4_=1;
                        break;
                       case 91:
                        var
                         _e9_=bad_conversion_format_dD_(fmt_eF_,i_eQ_,_e3_),
                         _e4_=1;
                        break;
                       case 97:
                        var
                         printer_gA_=get_arg_eS_(spec_e0_,n_eT_),
                         n_gB_=_cA_(_cB_,get_index_eL_(spec_e0_,n_eT_)),
                         arg_gC_=get_arg_eS_(0,n_gB_),
                         _gG_=i_eQ_+1|0,
                         _gF_=next_index_eW_(spec_e0_,n_gB_);
                        if(to_s_gD_)
                         /*<<8701: printf.ml 631 8 63>>*/outs_gE_
                          (_d2_(printer_gA_,0,arg_gC_));
                        else
                         /*<<8710: printf.ml 633 8 23>>*/_d2_
                          (printer_gA_,out_eC_,arg_gC_);
                        var _e9_=doprn_gj_(_gF_,_gG_),_e4_=1;
                        break;
                       case 114:
                        var
                         _e9_=bad_conversion_format_dD_(fmt_eF_,i_eQ_,_e3_),
                         _e4_=1;
                        break;
                       case 116:
                        var
                         printer_gH_=get_arg_eS_(spec_e0_,n_eT_),
                         _gJ_=i_eQ_+1|0,
                         _gI_=next_index_eW_(spec_e0_,n_eT_);
                        if(to_s_gD_)
                         /*<<8728: printf.ml 637 8 54>>*/outs_gE_
                          (_cA_(printer_gH_,0));
                        else
                         /*<<8736: printf.ml 639 8 19>>*/_cA_(printer_gH_,out_eC_);
                        var _e9_=doprn_gj_(_gI_,_gJ_),_e4_=1;
                        break;
                       default:var _e4_=0;}
                    if(!_e4_)
                     var _e9_=bad_conversion_format_dD_(fmt_eF_,i_eQ_,_e3_);
                    return _e9_;}},
               _gO_=i_eH_+1|0,
               _gL_=0;
              return scan_positional_spec_e1_
                      (fmt_eF_,
                       function(spec_gN_,i_gK_)
                        {return scan_flags_eY_(spec_gN_,n_gM_,_gL_,i_gK_);},
                       _gO_);}
            /*<<8835: printf.ml 614 15 25>>*/_d2_(outc_gP_,out_eC_,_eK_);
            var _gQ_=i_eH_+1|0,i_eH_=_gQ_;
            continue;}}
        function cont_s_e8_(n_gT_,s_gR_,i_gS_)
         {outs_gE_(s_gR_);return doprn_gj_(n_gT_,i_gS_);}
        return doprn_gj_(n_gU_,0);}
      var
       kpr_gW_=_d2_(pr_gm_,k_gV_,index_of_int_cy_(0)),
       _gX_=count_printing_arguments_of_format_gi_(fmt_eA_);
      if(_gX_<0||6<_gX_)
       {var
         loop_g__=
          function(i_gY_,args_g4_)
           {if(_gX_<=i_gY_)
             {var
               a_gZ_=caml_make_vect(_gX_,0),
               _g2_=
                function(i_g0_,arg_g1_)
                 {return caml_array_set(a_gZ_,(_gX_-i_g0_|0)-1|0,arg_g1_);},
               i_g3_=0,
               param_g5_=args_g4_;
              for(;;)
               {if(param_g5_)
                 {var _g6_=param_g5_[2],_g7_=param_g5_[1];
                  if(_g6_)
                   {_g2_(i_g3_,_g7_);
                    var _g8_=i_g3_+1|0,i_g3_=_g8_,param_g5_=_g6_;
                    continue;}
                  /*<<10476: printf.ml 318 11 16>>*/_g2_(i_g3_,_g7_);}
                return _d2_(kpr_gW_,fmt_eA_,a_gZ_);}}
            /*<<10312: printf.ml 363 31 56>>*/return function(x_g9_)
             {return loop_g__(i_gY_+1|0,[0,x_g9_,args_g4_]);};},
         _g$_=loop_g__(0,0);}
      else
       switch(_gX_)
        {case 1:
          var
           _g$_=
            /*<<10298: printf.ml 331 6 15>>*/function(x_hb_)
             {var a_ha_=caml_make_vect(1,0);
              /*<<10298: printf.ml 331 6 15>>*/caml_array_set(a_ha_,0,x_hb_);
              return _d2_(kpr_gW_,fmt_eA_,a_ha_);};
          break;
         case 2:
          var
           _g$_=
            function(x_hd_,y_he_)
             {var a_hc_=caml_make_vect(2,0);
              caml_array_set(a_hc_,0,x_hd_);
              caml_array_set(a_hc_,1,y_he_);
              return _d2_(kpr_gW_,fmt_eA_,a_hc_);};
          break;
         case 3:
          var
           _g$_=
            function(x_hg_,y_hh_,z_hi_)
             {var a_hf_=caml_make_vect(3,0);
              caml_array_set(a_hf_,0,x_hg_);
              caml_array_set(a_hf_,1,y_hh_);
              caml_array_set(a_hf_,2,z_hi_);
              return _d2_(kpr_gW_,fmt_eA_,a_hf_);};
          break;
         case 4:
          var
           _g$_=
            function(x_hk_,y_hl_,z_hm_,t_hn_)
             {var a_hj_=caml_make_vect(4,0);
              caml_array_set(a_hj_,0,x_hk_);
              caml_array_set(a_hj_,1,y_hl_);
              caml_array_set(a_hj_,2,z_hm_);
              caml_array_set(a_hj_,3,t_hn_);
              return _d2_(kpr_gW_,fmt_eA_,a_hj_);};
          break;
         case 5:
          var
           _g$_=
            function(x_hp_,y_hq_,z_hr_,t_hs_,u_ht_)
             {var a_ho_=caml_make_vect(5,0);
              caml_array_set(a_ho_,0,x_hp_);
              caml_array_set(a_ho_,1,y_hq_);
              caml_array_set(a_ho_,2,z_hr_);
              caml_array_set(a_ho_,3,t_hs_);
              caml_array_set(a_ho_,4,u_ht_);
              return _d2_(kpr_gW_,fmt_eA_,a_ho_);};
          break;
         case 6:
          var
           _g$_=
            function(x_hv_,y_hw_,z_hx_,t_hy_,u_hz_,v_hA_)
             {var a_hu_=caml_make_vect(6,0);
              caml_array_set(a_hu_,0,x_hv_);
              caml_array_set(a_hu_,1,y_hw_);
              caml_array_set(a_hu_,2,z_hx_);
              caml_array_set(a_hu_,3,t_hy_);
              caml_array_set(a_hu_,4,u_hz_);
              caml_array_set(a_hu_,5,v_hA_);
              return _d2_(kpr_gW_,fmt_eA_,a_hu_);};
          break;
         default:var _g$_=_d2_(kpr_gW_,fmt_eA_,[0]);}
      return _g$_;}
    /*<<8494: printf.ml 678 2 19>>*/function _hJ_(fmt_hB_)
     {return _cr_(2*fmt_hB_.getLen()|0);}
    function _hG_(k_hE_,b_hC_)
     {var s_hD_=_cs_(b_hC_);
      /*<<8139: buffer.ml 56 14 29>>*/b_hC_[2]=0;
      return _cA_(k_hE_,s_hD_);}
    /*<<8453: printf.ml 691 2 78>>*/function _hO_(k_hF_)
     {var _hI_=_cA_(_hG_,k_hF_);
      return _hL_(_hK_,1,_hJ_,_ct_,_cu_,function(_hH_){return 0;},_hI_);}
    /*<<8441: printf.ml 694 18 43>>*/function _hP_(fmt_hN_)
     {return _d2_
              (_hO_,
               /*<<8438: printf.ml 694 37 38>>*/function(s_hM_){return s_hM_;},
               fmt_hN_);}
    var
     _hQ_=[0,0],
     null_hR_=null,
     undefined_hV_=undefined,
     array_constructor_hT_=Array,
     date_constr_hU_=Date;
    /*<<13052: js.ml 376 7 77>>*/function _hW_(e_hS_)
     {return e_hS_ instanceof array_constructor_hT_
              ?0
              :[0,new MlWrappedString(e_hS_.toString())];}
    /*<<12349: printexc.ml 167 2 29>>*/_hQ_[1]=[0,_hW_,_hQ_[1]];
    function _ii_(arr_hX_,f_h0_)
     {var l_hY_=arr_hX_.length-1;
      if(0===l_hY_)
       var _hZ_=[0];
      else
       {var
         r_h1_=caml_make_vect(l_hY_,_cA_(f_h0_,arr_hX_[0+1])),
         _h2_=1,
         _h3_=l_hY_-1|0;
        if(!(_h3_<_h2_))
         {var i_h4_=_h2_;
          for(;;)
           {r_h1_[i_h4_+1]=_cA_(f_h0_,arr_hX_[i_h4_+1]);
            var _h5_=i_h4_+1|0;
            if(_h3_!==i_h4_){var i_h4_=_h5_;continue;}
            break;}}
        var _hZ_=r_h1_;}
      return _hZ_;}
    function _ij_(arr_h7_,f_h__)
     {var _h6_=0,_h8_=arr_h7_.length-1-1|0;
      if(!(_h8_<_h6_))
       {var i_h9_=_h6_;
        for(;;)
         {_cA_(f_h__,arr_h7_[i_h9_+1]);
          var _h$_=i_h9_+1|0;
          if(_h8_!==i_h9_){var i_h9_=_h$_;continue;}
          break;}}
      return 0;}
    function _ik_(n_ia_,f_ic_)
     {if(0===n_ia_)
       var _ib_=[0];
      else
       {var res_id_=caml_make_vect(n_ia_,_cA_(f_ic_,0)),_ie_=1,_if_=n_ia_-1|0;
        if(!(_if_<_ie_))
         {var i_ig_=_ie_;
          for(;;)
           {res_id_[i_ig_+1]=_cA_(f_ic_,i_ig_);
            var _ih_=i_ig_+1|0;
            if(_if_!==i_ig_){var i_ig_=_ih_;continue;}
            break;}}
        var _ib_=res_id_;}
      return _ib_;}
    ({}.iter=caml_js_eval_string(_a1_));
    function _io_(_opt__il_,ts_in_)
     {var sep_im_=_opt__il_?_opt__il_[1]:_a0_;
      return new
              MlWrappedString
              (caml_js_from_array(ts_in_).join(sep_im_.toString()));}
    var
     _ip_=caml_js_eval_string(_aY_),
     _iy_={"iter":caml_js_eval_string(_aX_),"fold":_ip_};
    /*<<17160: src/inttbl.ml 18 16 34>>*/function _iE_(param_iq_){return {};}
    function _iF_(t_ir_,key_is_,data_it_){return t_ir_[key_is_]=data_it_;}
    function _iG_(t_iu_,k_iv_){return delete t_iu_[k_iv_];}
    function _iH_(t_iw_,k_ix_)
     {return t_iw_.hasOwnProperty(k_ix_)|0?[0,t_iw_[k_ix_]]:0;}
    function _iI_(t_iD_,f_iB_)
     {var js_iter_iC_=_iy_[_aZ_.toString()];
      return js_iter_iC_
              (t_iD_,
               caml_js_wrap_callback
                (function(key_iA_,data_iz_)
                  {return _d2_(f_iB_,key_iA_,data_iz_);}));}
    /*<<17364: src/time.ml 3 13 60>>*/function _iK_(param_iJ_)
     {return new date_constr_hU_().valueOf();}
    /*<<17562: src/core.ml 15 24 73>>*/function string_of_float_iM_(x_iL_)
     {return new MlWrappedString(x_iL_.toString());}
    caml_js_eval_string(_aW_);
    function _iR_(ms_iO_,f_iN_)
     {return setInterval(caml_js_wrap_callback(f_iN_),ms_iO_);}
    function _iS_(x_iP_,f_iQ_){return _cA_(f_iQ_,x_iP_);}
    /*<<19090: src/frp.ml 34 24 26>>*/function _jH_(param_iT_){return 0;}
    /*<<19086: src/frp.ml 36 17 21>>*/function _iV_(t_iU_)
     {return _cA_(t_iU_,0);}
    function _jI_(t1_iW_,t2_iX_,param_iY_){_iV_(t1_iW_);return _iV_(t2_iX_);}
    function _jJ_(ts_iZ_,param_i0_){return _ij_(ts_iZ_,_iV_);}
    /*<<19061: src/frp.ml 42 15 16>>*/function _i6_(x_i1_){return x_i1_;}
    function iter_jF_(t_i2_,f_i4_)
     {var key_i3_=t_i2_[2];
      t_i2_[2]=key_i3_+1|0;
      _iF_(t_i2_[1],key_i3_,f_i4_);
      return _i6_
              (/*<<19024: src/frp.ml 55 33 62>>*/function(param_i5_)
                {return _iG_(t_i2_[1],key_i3_);});}
    function trigger_jy_(t_i__,x_i7_)
     {function _i$_(key_i9_,data_i8_){return _cA_(data_i8_,x_i7_);}
      return _iI_(t_i__[1],_i$_);}
    /*<<18990: src/frp.ml 63 18 60>>*/function create_jw_(param_ja_)
     {return [0,_iE_(0),0];}
    /*<<18184: src/frp.ml 245 15 22>>*/function peek_jC_(t_jb_)
     {return t_jb_[2];}
    function add_listener_jp_(t_jc_,f_jd_)
     {t_jc_[1]=[0,f_jd_,t_jc_[1]];return 0;}
    function trigger_jo_(t_je_,x_jf_)
     {t_je_[2]=x_jf_;
      var param_jg_=t_je_[1];
      for(;;)
       {if(param_jg_)
         {var l_jh_=param_jg_[2];
          /*<<18154: src/frp.ml 251 27 36>>*/_cA_(param_jg_[1],t_je_[2]);
          var param_jg_=l_jh_;
          continue;}
        return 0;}}
    /*<<18127: src/frp.ml 263 20 53>>*/function return_jl_(init_ji_)
     {return [0,0,init_ji_];}
    function map_jK_(t_jj_,f_jk_)
     {var t__jm_=return_jl_(_cA_(f_jk_,t_jj_[2]));
      add_listener_jp_
       (t_jj_,
        /*<<18099: src/frp.ml 267 29 45>>*/function(x_jn_)
         {return trigger_jo_(t__jm_,_cA_(f_jk_,x_jn_));});
      return t__jm_;}
    function zip_with_jL_(t1_jr_,t2_jq_,f_js_)
     {var t__jt_=return_jl_(_d2_(f_js_,t1_jr_[2],t2_jq_[2]));
      add_listener_jp_
       (t1_jr_,
        /*<<18055: src/frp.ml 273 30 55>>*/function(x_ju_)
         {return trigger_jo_(t__jt_,_d2_(f_js_,x_ju_,t2_jq_[2]));});
      add_listener_jp_
       (t2_jq_,
        /*<<18045: src/frp.ml 274 30 55>>*/function(y_jv_)
         {return trigger_jo_(t__jt_,_d2_(f_js_,t1_jr_[2],y_jv_));});
      return t__jt_;}
    /*<<17823: src/frp.ml 308 4 5>>*/function _jM_(t_jz_)
     {var s_jx_=create_jw_(0);
      /*<<17823: src/frp.ml 308 4 5>>*/add_listener_jp_
       (t_jz_,_cA_(trigger_jy_,s_jx_));
      return s_jx_;}
    function _jN_(s_jG_,init_jA_,f_jE_)
     {var b_jB_=return_jl_(init_jA_);
      iter_jF_
       (s_jG_,
        /*<<17720: src/frp.ml 333 6 48>>*/function(x_jD_)
         {return trigger_jo_(b_jB_,_d2_(f_jE_,peek_jC_(b_jB_),x_jD_));});
      return b_jB_;}
    /*<<20416: src/jq.ml 6 13 68>>*/function jq_j__(s_jO_)
     {return jQuery(s_jO_.toString());}
    /*<<20403: src/jq.ml 9 13 58>>*/function wrap_j$_(elt_jP_)
     {return jQuery(elt_jP_);}
    function append_ka_(parent_jQ_,child_jR_)
     {return parent_jQ_.append(child_jR_);}
    function _kb_(t_jV_,name_jT_,value_jS_)
     {var _jU_=peek_jC_(value_jS_).toString();
      t_jV_.setAttribute(name_jT_.toString(),_jU_);
      var name_jX_=name_jT_.toString();
      /*<<20129: src/jq.ml 53 6 7>>*/function _jY_(value_jW_)
       {return t_jV_.setAttribute(name_jX_,value_jW_.toString());}
      return iter_jF_(_jM_(value_jS_),_jY_);}
    function _kc_(t_j0_,s_jZ_){return t_j0_.innerHTML=s_jZ_.toString();}
    function _kd_(t_j1_,c_j2_){t_j1_.appendChild(c_j2_);return 0;}
    function _ke_(tag_j5_,attrs_j9_)
     {/*<<19932: src/jq.ml 70 16 46>>*/function str_j4_(s_j3_)
       {return s_j3_.toString();}
      var
       _j6_=str_j4_(tag_j5_),
       elt_j7_=document.createElementNS(str_j4_(_aT_),_j6_);
      _ij_
       (attrs_j9_,
        /*<<19906: src/jq.ml 76 29 49>>*/function(param_j8_)
         {return elt_j7_.setAttribute
                  (param_j8_[1].toString(),param_j8_[2].toString());});
      return elt_j7_;}
    var
     body_kg_=jq_j__(_aQ_),
     mouse_pos_kf_=create_jw_(0),
     _ki_=
      caml_js_wrap_callback
       (/*<<19834: src/jq.ml 121 4 28>>*/function(e_kh_)
         {return trigger_jy_
                  (mouse_pos_kf_,
                   [0,e_kh_[_aU_.toString()],e_kh_[_aV_.toString()]]);});
    body_kg_.on(_aP_.toString(),_ki_);
    var last_kj_=[0,0],t__ko_=create_jw_(0);
    function _kp_(_kk_){return 0;}
    _iS_
     (iter_jF_
       (mouse_pos_kf_,
        /*<<18369: src/frp.ml 198 6 20>>*/function(x_kn_)
         {var _kl_=last_kj_[1];
          if(_kl_)
           {var x_km_=_kl_[1];
            trigger_jy_(t__ko_,[0,x_kn_[1]-x_km_[1]|0,x_kn_[2]-x_km_[2]|0]);}
          last_kj_[1]=[0,x_kn_];
          return 0;}),
      _kp_);
    /*<<22354: src/draw.ml 6 13 65>>*/function _kt_(param_kq_)
     {var x_kr_=param_kq_[1],_ks_=_bM_(_J_,string_of_float_iM_(param_kq_[2]));
      return _bM_(string_of_float_iM_(x_kr_),_ks_);}
    /*<<22337: src/draw.ml 8 24 78>>*/function _ky_(pts_ku_)
     {return _io_(_K_,_ii_(pts_ku_,_kt_));}
    /*<<22293: src/draw.ml 16 13 50>>*/function _kx_(param_kv_)
     {return _kw_
              (_hP_,_L_,param_kv_[1],param_kv_[2],param_kv_[3],param_kv_[4]);}
    var c_kz_=2*(4*Math.atan(1))/360;
    /*<<22284: src/draw.ml 32 58 64>>*/function to_radians_kG_(x_kA_)
     {return c_kz_*x_kA_;}
    /*<<22281: src/draw.ml 34 21 22>>*/function of_degrees_lw_(x_kB_)
     {return x_kB_;}
    function _lj_(param_kD_,_kC_,angle_kH_)
     {var
       b_kE_=param_kD_[2],
       a_kF_=param_kD_[1],
       y_kK_=_kC_[2],
       x_kJ_=_kC_[1],
       angle_kI_=to_radians_kG_(angle_kH_),
       _kL_=y_kK_-b_kE_,
       _kM_=x_kJ_-a_kF_;
      return [0,
              _kM_*Math.cos(angle_kI_)-_kL_*Math.sin(angle_kI_)+a_kF_,
              _kM_*Math.sin(angle_kI_)+_kL_*Math.cos(angle_kI_)+b_kE_];}
    function _lx_(_kN_,_kO_){return _kN_+_kO_;}
    function _ly_(_kP_,_kQ_){return _kP_*_kQ_;}
    /*<<22064: src/draw.ml 63 15 62>>*/function _lA_(param_kR_)
     {switch(param_kR_[0])
       {case 1:return _dx_(_hP_,_Q_,param_kR_[1],param_kR_[2]);
        case 2:return _dx_(_hP_,_P_,param_kR_[1],param_kR_[2]);
        case 3:
         var match_kS_=param_kR_[2];
         return _kT_(_hP_,_O_,param_kR_[1],match_kS_[1],match_kS_[2]);
        case 4:return _d2_(_hP_,_N_,param_kR_[1]);
        case 5:return _d2_(_hP_,_M_,param_kR_[1]);
        default:
         return _kU_
                 (_hP_,
                  _R_,
                  param_kR_[1],
                  param_kR_[2],
                  param_kR_[3],
                  param_kR_[4],
                  param_kR_[5],
                  param_kR_[6]);}}
    /*<<22019: src/draw.ml 112 15 21>>*/function _lz_(c_kV_)
     {return [0,c_kV_];}
    function _lB_(_opt__kW_,_kY_,color_k0_,width_k1_)
     {var
       cap_kX_=_opt__kW_?_opt__kW_[1]:737755699,
       join_kZ_=_kY_?_kY_[1]:463106021;
      return [1,[0,cap_kX_,join_kZ_,width_k1_,color_k0_]];}
    /*<<21870: src/draw.ml 120 4 70>>*/function _lr_(param_k2_)
     {switch(param_k2_[0])
       {case 1:
         var
          match_k3_=param_k2_[1],
          join_k4_=match_k3_[2],
          cap_k5_=match_k3_[1],
          color_k8_=match_k3_[4],
          width_k7_=match_k3_[3],
          _k6_=9660462===join_k4_?_V_:463106021<=join_k4_?_X_:_W_,
          _k__=_bM_(_ac_,_k6_),
          _k9_=226915517===cap_k5_?_S_:737755699<=cap_k5_?_U_:_T_,
          _k$_=_bM_(_ab_,_k9_),
          _la_=_bM_(_aa_,string_of_int_bN_(width_k7_));
         return _io_(___,[0,_bM_(_$_,_kx_(color_k8_)),_la_,_k$_,_k__]);
        case 2:
         return _bM_(_Y_,_io_(_Z_,_ii_(param_k2_[1],string_of_float_iM_)));
        default:return _bM_(_ad_,_kx_(param_k2_[1]));}}
    /*<<21865: src/draw.ml 140 18 27>>*/function _lC_(x_lb_)
     {return [0,x_lb_];}
    /*<<21746: src/draw.ml 146 15 57>>*/function _lE_(param_lc_)
     {switch(param_lc_[0])
       {case 1:
         var match_ld_=param_lc_[1];
         return _dx_(_hP_,_ag_,match_ld_[1],match_ld_[2]);
        case 2:
         var
          r_le_=param_lc_[4],
          a1_lf_=param_lc_[1],
          a2_lh_=param_lc_[2],
          flag_lg_=-64519044<=param_lc_[3]?0:1,
          _li_=Math.sin(to_radians_kG_(a1_lf_))*r_le_,
          match_lk_=
           _lj_
            ([0,-Math.cos(to_radians_kG_(a1_lf_))*r_le_,_li_],
             _af_,
             a2_lh_-a1_lf_);
         return _hL_(_hP_,_ae_,r_le_,r_le_,flag_lg_,match_lk_[1],match_lk_[2]);
        default:
         var match_ll_=param_lc_[1];
         return _dx_(_hP_,_ah_,match_ll_[1],match_ll_[2]);}}
    function path_lD_(_opt__lm_,mask_lp_,anchor_lq_,segs_lo_)
     {var props_ln_=_opt__lm_?_opt__lm_[1]:[0];
      return [3,props_ln_,anchor_lq_,mask_lp_,segs_lo_];}
    /*<<21579: src/draw.ml 206 27 89>>*/function render_properties_lF_(ps_ls_)
     {return _io_(_aj_,_ii_(ps_ls_,_lr_));}
    function sink_attrs_lG_(elt_lu_,ps_lv_)
     {return _iS_
              (_ii_
                (ps_lv_,
                 /*<<21543: src/draw.ml 209 20 70>>*/function(param_lt_)
                  {return _kb_(elt_lu_,param_lt_[1],param_lt_[2]);}),
               _jJ_);}
    var render_lH_=[];
    /*<<21535: src/draw.ml 213 39 71>>*/function _lJ_(param_lI_)
     {return string_of_float_iM_(param_lI_[1]);}
    function x_beh_mz_(_lK_){return map_jK_(_lK_,_lJ_);}
    /*<<21522: src/draw.ml 214 39 72>>*/function _lM_(param_lL_)
     {return string_of_float_iM_(param_lL_[2]);}
    function y_beh_mx_(_lN_){return map_jK_(_lN_,_lM_);}
    /*<<21509: src/draw.ml 215 23 70>>*/function zip_props_mq_(ps_b_lO_)
     {var t__lP_=return_jl_(render_properties_lF_(_ii_(ps_b_lO_,peek_jC_)));
      _ij_
       (ps_b_lO_,
        /*<<17995: src/frp.ml 281 6 69>>*/function(t_lR_)
         {return add_listener_jp_
                  (t_lR_,
                   /*<<17979: src/frp.ml 281 31 68>>*/function(param_lQ_)
                    {return trigger_jo_
                             (t__lP_,render_properties_lF_(_ii_(ps_b_lO_,peek_jC_)));});});
      return t__lP_;}
    caml_update_dummy
     (render_lH_,
      /*<<20821: src/draw.ml 216 18 81>>*/function(param_lS_)
       {switch(param_lS_[0])
         {case 1:
           var
            trans_lU_=param_lS_[2],
            match_lT_=_cA_(render_lH_,param_lS_[1]),
            elt_lV_=match_lT_[1],
            sub_lW_=match_lT_[2];
           return [0,
                   elt_lV_,
                   _d2_
                    (_jI_,_kb_(elt_lV_,_aI_,map_jK_(trans_lU_,_lA_)),sub_lW_)];
          case 2:
           var
            pts_lX_=param_lS_[2],
            props_lY_=param_lS_[1],
            _lZ_=[0,_aG_,_io_(_aH_,_ii_(peek_jC_(pts_lX_),_kt_))],
            elt_l0_=
             _ke_
              (_aE_,
               [0,
                [0,_aF_,render_properties_lF_(_ii_(props_lY_,peek_jC_))],
                _lZ_]);
           return [0,elt_l0_,_kb_(elt_l0_,_aD_,map_jK_(pts_lX_,_ky_))];
          case 3:
           var
            segs_l1_=param_lS_[4],
            mask_l2_=param_lS_[3],
            props_l3_=param_lS_[1],
            anchor_l5_=param_lS_[2],
            elt_l4_=_ke_(_aC_,[0]),
            sub_ma_=
             _kb_
              (elt_l4_,
               _aB_,
               zip_with_jL_
                (anchor_l5_,
                 segs_l1_,
                 function(param_l6_,sgs_l7_)
                  {var y_l9_=param_l6_[2],x_l8_=param_l6_[1];
                   return _kT_
                           (_hP_,_aO_,x_l8_,y_l9_,_io_(_ai_,_ii_(sgs_l7_,_lE_)));})),
            get_length_l$_=
             /*<<20791: src/draw.ml 254 34 79>>*/function(param_l__)
              {return elt_l4_.getTotalLength();},
            _me_=get_length_l$_(0),
            _md_=function(param_mc_,x_mb_){return x_mb_;},
            _mg_=function(_mf_){return _jN_(_mf_,_me_,_md_);},
            _mi_=_jM_(segs_l1_),
            t__mh_=create_jw_(0);
           iter_jF_
            (_mi_,
             /*<<18883: src/frp.ml 98 32 48>>*/function(x_mj_)
              {return trigger_jy_(t__mh_,get_length_l$_(0));});
           var path_length_mo_=_iS_(t__mh_,_mg_);
           if(mask_l2_)
            {var
              mask_mn_=mask_l2_[1],
              props__mp_=
               _bU_
                (props_l3_,
                 [0,
                  zip_with_jL_
                   (path_length_mo_,
                    mask_mn_,
                    function(l_mm_,param_mk_)
                     {var a_ml_=param_mk_[1];
                      return [2,
                              [254,0,l_mm_*a_ml_,l_mm_*(param_mk_[2]-a_ml_),l_mm_]];})]);}
           else
            var props__mp_=props_l3_;
           return [0,
                   elt_l4_,
                   _d2_
                    (_jI_,sub_ma_,_kb_(elt_l4_,_aA_,zip_props_mq_(props__mp_)))];
          case 4:
           var
            text_mr_=param_lS_[3],
            corner_ms_=param_lS_[2],
            ps_mu_=param_lS_[1],
            elt_mt_=_ke_(_az_,[0]);
           _kc_(elt_mt_,peek_jC_(text_mr_));
           var
            _mv_=_cA_(_kc_,elt_mt_),
            _mw_=_cA_(_jI_,iter_jF_(_jM_(text_mr_),_mv_)),
            _my_=[0,_ay_,zip_props_mq_(ps_mu_)],
            _mA_=[0,_ax_,y_beh_mx_(corner_ms_)];
           return [0,
                   elt_mt_,
                   _iS_
                    (sink_attrs_lG_
                      (elt_mt_,[0,[0,_aw_,x_beh_mz_(corner_ms_)],_mA_,_my_]),
                     _mw_)];
          case 5:
           var elts_mB_=_ii_(param_lS_[1],render_lH_),elt_mC_=_ke_(_av_,[0]);
           _ij_
            (elts_mB_,
             /*<<20738: src/draw.ml 287 23 52>>*/function(param_mD_)
              {return _kd_(elt_mC_,param_mD_[1]);});
           return [0,
                   elt_mC_,
                   _cA_(_jJ_,_ii_(elts_mB_,function(_mE_){return _mE_[2];}))];
          case 6:
           var
            hb_mF_=param_lS_[4],
            wb_mG_=param_lS_[3],
            corner_mH_=param_lS_[2],
            ps_mJ_=param_lS_[1],
            match_mI_=peek_jC_(corner_mH_),
            y_mL_=match_mI_[2],
            x_mK_=match_mI_[1],
            _mM_=[0,_au_,render_properties_lF_(_ii_(ps_mJ_,peek_jC_))],
            _mN_=[0,_at_,string_of_float_iM_(peek_jC_(hb_mF_))],
            _mO_=[0,_as_,string_of_float_iM_(peek_jC_(wb_mG_))],
            _mP_=[0,_ar_,string_of_float_iM_(y_mL_)],
            elt_mQ_=
             _ke_
              (_ap_,
               [0,[0,_aq_,string_of_float_iM_(x_mK_)],_mP_,_mO_,_mN_,_mM_]),
            _mR_=[0,_ao_,map_jK_(hb_mF_,string_of_float_iM_)],
            _mS_=[0,_an_,map_jK_(wb_mG_,string_of_float_iM_)],
            _mT_=[0,_am_,y_beh_mx_(corner_mH_)];
           return [0,
                   elt_mQ_,
                   sink_attrs_lG_
                    (elt_mQ_,[0,[0,_al_,x_beh_mz_(corner_mH_)],_mT_,_mS_,_mR_])];
          case 7:
           var
            tb_mU_=param_lS_[1],
            container_mV_=_ke_(_ak_,[0]),
            last_sub_mW_=[0,_cA_(render_lH_,peek_jC_(tb_mU_))[2]],
            _m1_=
             /*<<20701: src/draw.ml 313 6 22>>*/function(t_mY_)
              {/*<<20701: src/draw.ml 313 6 22>>*/_iV_(last_sub_mW_[1]);
               /*<<20037: src/jq.ml 66 6 71>>*/for(;;)
                {if(1-(container_mV_.firstChild==null_hR_?1:0))
                  {var _mX_=container_mV_.firstChild;
                   if(_mX_!=null_hR_)
                    /*<<19992: src/jq.ml 66 44 70>>*/container_mV_.removeChild
                     (_mX_);
                   continue;}
                 var match_mZ_=_cA_(render_lH_,t_mY_),sub_m0_=match_mZ_[2];
                 _kd_(container_mV_,match_mZ_[1]);
                 last_sub_mW_[1]=sub_m0_;
                 return 0;}},
            dyn_sub_m3_=iter_jF_(_jM_(tb_mU_),_m1_);
           return [0,
                   container_mV_,
                   _d2_
                    (_jI_,
                     dyn_sub_m3_,
                     _i6_
                      (/*<<20693: src/draw.ml 320 61 77>>*/function(param_m2_)
                        {return _iV_(last_sub_mW_[1]);}))];
          case 8:return [0,param_lS_[1],_jH_];
          default:
           var
            center_m4_=param_lS_[3],
            r_m7_=param_lS_[2],
            ps_m6_=param_lS_[1],
            elt_m5_=_ke_(_aN_,[0]),
            _m8_=[0,_aM_,zip_props_mq_(ps_m6_)],
            _m9_=[0,_aL_,map_jK_(r_m7_,string_of_float_iM_)],
            _m__=[0,_aK_,y_beh_mx_(center_m4_)];
           return [0,
                   elt_m5_,
                   sink_attrs_lG_
                    (elt_m5_,[0,[0,_aJ_,x_beh_mz_(center_m4_)],_m__,_m9_,_m8_])];}});
    var
     _nb_=[],
     stay_forever_np_=[1,function(x0_m$_,param_na_){return x0_m$_;}];
    function mk_f_nn_(dur1_nf_,f1_nd_,f2_ng_,x0_nc_)
     {var
       f1__ne_=_cA_(f1_nd_,x0_nc_),
       f2__ni_=_cA_(f2_ng_,_cA_(f1__ne_,dur1_nf_));
      /*<<23097: src/animate.ml 44 17 61>>*/return function(t_nh_)
       {return t_nh_<=dur1_nf_
                ?_cA_(f1__ne_,t_nh_)
                :_cA_(f2__ni_,t_nh_-dur1_nf_);};}
    caml_update_dummy
     (_nb_,
      /*<<23085: src/animate.ml 46 8 60>>*/function(param_nj_)
       {var f1_nk_=param_nj_[2],dur1_nl_=param_nj_[1];
        /*<<23052: src/animate.ml 47 4 60>>*/return function(t2_nm_)
         {{if(0===t2_nm_[0])
            {var dur2_no_=t2_nm_[1];
             return [0,
                     dur1_nl_+dur2_no_,
                     _dx_(mk_f_nn_,dur1_nl_,f1_nk_,t2_nm_[2])];}
           return [1,_dx_(mk_f_nn_,dur1_nl_,f1_nk_,t2_nm_[1])];}};});
    /*<<22875: src/animate.ml 52 65 38>>*/function _nE_(param_nq_)
     {var f_nA_=param_nq_[1];
      /*<<22847: src/animate.ml 55 8 38>>*/return function(init_nz_)
       {function _nu_(param_ns_,t_nr_){return t_nr_;}
        var t_nt_=create_jw_(0),_ny_=0,_nx_=30,start_nv_=_iK_(0);
        /*<<18442: src/frp.ml 187 4 5>>*/_iR_
         (_nx_,
          /*<<18426: src/frp.ml 190 6 37>>*/function(param_nw_)
           {return trigger_jy_(t_nt_,_iK_(0)-start_nv_);});
        var elapsed_nB_=_jN_(t_nt_,_ny_,_nu_);
        return map_jK_(elapsed_nB_,_cA_(f_nA_,init_nz_));};}
    function _nU_(init_nC_,t_nD_){return _d2_(_nE_,t_nD_,init_nC_);}
    function _nV_(label_nO_,container_nJ_,param_nP_)
     {var _nF_=jq_j__(_bM_(_aR_,_bM_(_D_,_aS_))),b_nG_=return_jl_(0);
      function update_nK_(e_nI_,ui_nH_)
       {return trigger_jo_(b_nG_,ui_nH_[_E_.toString()]/100);}
      append_ka_(container_nJ_,_nF_);
      var arg_obj_nM_={"slide":caml_js_wrap_callback(update_nK_)};
      function _nN_(_nL_){return 0;}
      _iS_(_nF_.slider(arg_obj_nM_),_nN_);
      return b_nG_;}
    /*<<23402: src/widget.ml 54 8 5>>*/function _n3_(param_nQ_)
     {var
       canvas_nS_=param_nQ_[2],
       match_nR_=_cA_(render_lH_,param_nQ_[3]),
       sub_nT_=match_nR_[2];
      /*<<23402: src/widget.ml 54 8 5>>*/append_ka_
       (canvas_nS_,wrap_j$_(match_nR_[1]));
      return sub_nT_;}
    /*<<24354: src/graph.ml 21 2 8>>*/function _n2_(nodes_n1_)
     {var nodes__nW_=_iE_(0);
      /*<<24354: src/graph.ml 21 2 8>>*/_iI_
       (nodes_n1_,
        function(key_n0_,data_nX_)
         {var _nZ_=data_nX_[2],t__nY_=_iE_(0);
          /*<<16784: src/inttbl.ml 70 2 4>>*/_iI_(_nZ_,_cA_(_iF_,t__nY_));
          return _iF_(nodes__nW_,key_n0_,[0,data_nX_[1],t__nY_]);});
      return nodes__nW_;}
    function range_n8_(start_n5_,stop_n4_)
     {if(stop_n4_<start_n5_)/*<<25349: src/rotsym.ml 4 23 47>>*/_i_(_u_);
      var n_n7_=(stop_n4_-start_n5_|0)+1|0;
      return _ik_
              (n_n7_,
               /*<<25336: src/rotsym.ml 6 28 37>>*/function(i_n6_)
                {return i_n6_+start_n5_|0;});}
    var
     svg_n9_=_ke_(_r_,[0,_s_,_t_]),
     _n__=6,
     _n$_=600,
     _oa_=400,
     radius_ob_=_bB_(_oa_,_n$_)/4,
     center_oc_=[0,_oa_/2,_n$_/2],
     p0_od_=[0,_oa_/2,_n$_/2-radius_ob_],
     theta_oe_=360/_n__;
    /*<<24909: src/rotsym.ml 19 8 67>>*/function _og_(i_of_)
     {return _lj_(center_oc_,p0_od_,_ly_(i_of_,of_degrees_lw_(theta_oe_)));}
    var
     _oh_=return_jl_(_ii_(range_n8_(0,_n__-1|0),_og_)),
     _on_=return_jl_(_lB_(0,0,_c_,2));
    function _oo_(_oi_){return map_jK_(_oi_,_lz_);}
    function _ol_(c_oj_,param_ok_)
     {return [0,c_oj_[1],c_oj_[2],c_oj_[3]+1|0,c_oj_[4]];}
    function _oq_(_om_){return _jN_(_om_,_I_,_ol_);}
    var t_op_=create_jw_(0),_os_=30;
    /*<<18475: src/frp.ml 181 4 5>>*/_iR_
     (_os_,
      /*<<18465: src/frp.ml 182 34 57>>*/function(param_or_)
       {return trigger_jy_(t_op_,_iK_(0));});
    var
     _ot_=[0,_iS_(_iS_(t_op_,_oq_),_oo_),_on_],
     props_ou_=[0,_ot_]?_ot_:[0],
     _ow_=[2,props_ou_,_oh_];
    function _ox_(_ov_){return map_jK_(_ov_,of_degrees_lw_);}
    var _oW_=_cA_(_nU_,0);
    function _oX_(_oz_)
     {var r_oy_=[0,stay_forever_np_],_oA_=_oz_.length-1-1|0,_oB_=0;
      if(!(_oA_<_oB_))
       {var i_oC_=_oA_;
        for(;;)
         {r_oy_[1]=_d2_(_nb_,_oz_[i_oC_+1],r_oy_[1]);
          var _oD_=i_oC_-1|0;
          if(_oB_!==i_oC_){var i_oC_=_oD_;continue;}
          break;}}
      return r_oy_[1];}
    /*<<24840: src/rotsym.ml 33 19 84>>*/function _oY_(i_oH_)
     {var
       _oG_=500,
       _oI_=i_oH_*theta_oe_,
       _oJ_=1e3,
       _oS_=[0,_oG_,function(x0_oE_,param_oF_){return x0_oE_;}];
      /*<<22908: src/animate.ml 79 6 74>>*/function f_oV_(x0_oK_)
       {var
         h_oL_=(_oI_+x0_oK_)/2,
         _oM_=_oJ_/2,
         b_oN_=(h_oL_-_oI_)/_oM_,
         c_oP_=(h_oL_-x0_oK_)/Math.pow(_oJ_/2,2),
         a_oR_=b_oN_/_oM_;
        /*<<22883: src/animate.ml 82 15 74>>*/return function(t_oO_)
         {if(t_oO_<=_oJ_/2)return x0_oK_+c_oP_*Math.pow(t_oO_,2);
          var _oQ_=t_oO_-_oJ_/2;
          return h_oL_+a_oR_*Math.pow(_oQ_,2)-2*b_oN_*_oQ_;};}
      return _d2_
              (_nb_,
               _d2_
                (_nb_,
                 [0,_oJ_,f_oV_],
                 [0,0,function(param_oT_,_oU_){return _oI_;}]),
               _oS_);}
    var
     angle_oZ_=_iS_(_iS_(_iS_(_ii_(range_n8_(1,_n__),_oY_),_oX_),_oW_),_ox_),
     _o4_=
      map_jK_
       (angle_oZ_,
        /*<<24762: src/rotsym.ml 45 30 8>>*/function(a_o0_)
         {var
           a_o1_=_bB_(a_o0_,of_degrees_lw_(359.9999)),
           flag_o2_=
            caml_lessthan(a_o1_,of_degrees_lw_(180))?-64519044:-944265860,
           _o3_=_lx_(of_degrees_lw_(90),a_o1_);
          return [0,[2,of_degrees_lw_(90),_o3_,flag_o2_,radius_ob_+40]];}),
     _o5_=return_jl_([0,p0_od_[1],p0_od_[2]-40]),
     _o6_=return_jl_(_lz_([0,_d_[1],_d_[2],_d_[3],0])),
     arc_o7_=path_lD_([0,[0,return_jl_(_lB_(0,0,_d_,4)),_o6_]],0,_o5_,_o4_),
     theta_o9_=of_degrees_lw_(theta_oe_);
    /*<<24687: src/rotsym.ml 60 19 70>>*/function _pf_(i_o8_)
     {var
       _o__=i_o8_-1|0,
       _pb_=
        map_jK_
         (angle_oZ_,
          /*<<24709: src/rotsym.ml 56 8 85>>*/function(a_o$_)
           {var _pa_=_lx_(a_o$_,_ly_(_o__,theta_o9_));
            return _lj_(center_oc_,[0,p0_od_[1],p0_od_[2]-20],_pa_);}),
       _pc_=0,
       _pe_=return_jl_(string_of_int_bN_(i_o8_)),
       props_pd_=_pc_?_pc_[1]:[0];
      return [4,props_pd_,_pb_,_pe_];}
    var labels_ph_=_ii_(range_n8_(1,_n__),_pf_);
    _kd_
     (svg_n9_,
      _cA_
        (render_lH_,
         [5,
          _bU_
           (labels_ph_,
            [0,
             [1,
              _ow_,
              map_jK_
               (angle_oZ_,
                /*<<24681: src/rotsym.ml 64 61 89>>*/function(a_pg_)
                 {return [3,a_pg_,center_oc_];})],
             arc_o7_])])
       [1]);
    var _pi_=jq_j__(_q_).get(0),_pj_=_pi_===undefined_hV_?0:[0,_pi_];
    if(_pj_)
     _kd_(_pj_[1],svg_n9_);
    else
     /*<<17514: src/core.ml 26 13 61>>*/console.log(_p_);
    /*<<25447: src/rotsym.ml 73 14 24>>*/_ke_(_k_,[0,_l_,_m_,_n_,_o_]);
    var
     _pk_=0,
     _pl_=caml_make_vect(5,_c_),
     nodes__pm_=_n2_(_iE_(0)),
     len_pn_=_pl_.length-1,
     i_po_=0;
    /*<<24205: src/graph.ml 40 4 7>>*/for(;;)
     {if(len_pn_<=i_po_)
       {var
         _pq_=
          _ik_
           (len_pn_,
            /*<<24242: src/graph.ml 49 32 39>>*/function(i_pp_)
             {return _pk_+i_pp_|0;});
        if(5===_pq_.length-1)
         {var
           a_pr_=_pq_[0+1],
           b_ps_=_pq_[1+1],
           c_pt_=_pq_[2+1],
           d_pu_=_pq_[3+1],
           e_pv_=_pq_[4+1],
           nodes__pw_=_n2_(nodes__pm_),
           _pI_=
            [0,
             [0,a_pr_,b_ps_,0],
             [0,b_ps_,c_pt_,0],
             [0,c_pt_,a_pr_,0],
             [0,c_pt_,d_pu_,0],
             [0,d_pu_,e_pv_,0],
             [0,e_pv_,c_pt_,0]];
          _ij_
           (_pI_,
            /*<<23815: src/graph.ml 96 39 9>>*/function(param_px_)
             {switch(param_px_[0])
               {case 1:
                 var
                  v_py_=param_px_[2],
                  match_pz_=_iH_(nodes__pw_,param_px_[1]),
                  _pA_=_iH_(nodes__pw_,v_py_);
                 if(match_pz_&&_pA_)return _iG_(match_pz_[1][2],v_py_);
                 return _i_(_B_);
                case 2:
                 var u_pB_=param_px_[1];
                 return _iH_(nodes__pw_,u_pB_)
                         ?(_iG_(nodes__pw_,u_pB_),
                           _iI_
                            (nodes__pw_,
                             function(key_pD_,data_pC_){return _iG_(data_pC_[2],u_pB_);}))
                         :_i_(_A_);
                default:
                 var
                  v_pE_=param_px_[2],
                  e_pG_=param_px_[3],
                  match_pF_=_iH_(nodes__pw_,param_px_[1]),
                  _pH_=_iH_(nodes__pw_,v_pE_);
                 if(match_pF_&&_pH_)return _iF_(match_pF_[1][2],v_pE_,e_pG_);
                 return _i_(_C_);}});
          var
           container_pJ_=jq_j__(_w_),
           _pK_=_cA_(_nV_,_v_),
           _pL_=[0,_H_,string_of_int_bN_(400)],
           canvas_pM_=
            _iS_(_ke_(_F_,[0,[0,_G_,string_of_int_bN_(400)],_pL_]),wrap_j$_);
          append_ka_(container_pJ_,canvas_pM_);
          var
           _pN_=_d2_(_pK_,container_pJ_,canvas_pM_),
           _pO_=_lC_(_z_),
           _pP_=return_jl_([0,_lC_(_y_),_pO_]),
           _pR_=return_jl_(_x_),
           _pS_=
            [0,
             map_jK_
              (_pN_,
               /*<<24521: src/rotsym.ml 96 44 55>>*/function(x_pQ_)
                {return [0,0,Math.pow(x_pQ_,2)];})],
           _pT_=return_jl_(_lB_(0,0,_c_,2));
          _iS_
           ([0,
             container_pJ_,
             canvas_pM_,
             path_lD_
              ([0,[0,return_jl_(_lz_([0,_d_[1],_d_[2],_d_[3],0])),_pT_]],
               _pS_,
               _pR_,
               _pP_)],
            _n3_);
          do_at_exit_bO_(0);
          return;}
        throw [0,_bz_,_j_];}
      var _pU_=_iE_(0);
      /*<<24213: src/graph.ml 43 6 18>>*/_iF_
       (nodes__pm_,_pk_+i_po_|0,[0,caml_array_get(_pl_,i_po_),_pU_]);
      var _pV_=i_po_+1|0,i_po_=_pV_;
      continue;}}
  ());
