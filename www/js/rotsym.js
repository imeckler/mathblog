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
   {function _l7_(_uT_,_uU_,_uV_,_uW_,_uX_,_uY_,_uZ_,_u0_)
     {return _uT_.length==7
              ?_uT_(_uU_,_uV_,_uW_,_uX_,_uY_,_uZ_,_u0_)
              :caml_call_gen(_uT_,[_uU_,_uV_,_uW_,_uX_,_uY_,_uZ_,_u0_]);}
    function _ig_(_uM_,_uN_,_uO_,_uP_,_uQ_,_uR_,_uS_)
     {return _uM_.length==6
              ?_uM_(_uN_,_uO_,_uP_,_uQ_,_uR_,_uS_)
              :caml_call_gen(_uM_,[_uN_,_uO_,_uP_,_uQ_,_uR_,_uS_]);}
    function _lB_(_uG_,_uH_,_uI_,_uJ_,_uK_,_uL_)
     {return _uG_.length==5
              ?_uG_(_uH_,_uI_,_uJ_,_uK_,_uL_)
              :caml_call_gen(_uG_,[_uH_,_uI_,_uJ_,_uK_,_uL_]);}
    function _l6_(_uB_,_uC_,_uD_,_uE_,_uF_)
     {return _uB_.length==4
              ?_uB_(_uC_,_uD_,_uE_,_uF_)
              :caml_call_gen(_uB_,[_uC_,_uD_,_uE_,_uF_]);}
    function _d4_(_ux_,_uy_,_uz_,_uA_)
     {return _ux_.length==3
              ?_ux_(_uy_,_uz_,_uA_)
              :caml_call_gen(_ux_,[_uy_,_uz_,_uA_]);}
    function _ex_(_uu_,_uv_,_uw_)
     {return _uu_.length==2?_uu_(_uv_,_uw_):caml_call_gen(_uu_,[_uv_,_uw_]);}
    function _c7_(_us_,_ut_)
     {return _us_.length==1?_us_(_ut_):caml_call_gen(_us_,[_ut_]);}
    var
     _a_=[0,new MlString("Failure")],
     _b_=[0,new MlString("Invalid_argument")],
     _c_=[0,0,0,0,1],
     _d_=[0,255,0,0,1],
     _e_=[0,0,0,255,1],
     _f_=new MlString("class"),
     match_g_=[0,[0,100,100],[0,100,200]],
     match_h_=[0,400,400],
     _i_=[0,50,100],
     match_j_=[0,400,400],
     _k_=[0,400,400];
    caml_register_global(6,[0,new MlString("Not_found")]);
    caml_register_global(5,[0,new MlString("Division_by_zero")]);
    caml_register_global(3,_b_);
    caml_register_global(2,_a_);
    var
     _b__=[0,new MlString("Assert_failure")],
     _b9_=new MlString("%d"),
     _b8_=new MlString("true"),
     _b7_=new MlString("false"),
     _b6_=new MlString("Pervasives.do_at_exit"),
     _b5_=new MlString("\\b"),
     _b4_=new MlString("\\t"),
     _b3_=new MlString("\\n"),
     _b2_=new MlString("\\r"),
     _b1_=new MlString("\\\\"),
     _b0_=new MlString("\\'"),
     _bZ_=new MlString("String.blit"),
     _bY_=new MlString("String.sub"),
     _bX_=new MlString("Buffer.add: cannot grow buffer"),
     _bW_=new MlString(""),
     _bV_=new MlString(""),
     _bU_=new MlString("%.12g"),
     _bT_=new MlString("\""),
     _bS_=new MlString("\""),
     _bR_=new MlString("'"),
     _bQ_=new MlString("'"),
     _bP_=new MlString("nan"),
     _bO_=new MlString("neg_infinity"),
     _bN_=new MlString("infinity"),
     _bM_=new MlString("."),
     _bL_=new MlString("printf: bad positional specification (0)."),
     _bK_=new MlString("%_"),
     _bJ_=[0,new MlString("printf.ml"),143,8],
     _bI_=new MlString("'"),
     _bH_=new MlString("Printf: premature end of format string '"),
     _bG_=new MlString("'"),
     _bF_=new MlString(" in format string '"),
     _bE_=new MlString(", at char number "),
     _bD_=new MlString("Printf: bad conversion %"),
     _bC_=new MlString("Sformat.index_of_int: negative argument "),
     _bB_=new MlString("Option.value_exn: None"),
     _bA_=
      new
       MlString
       ("(function(a,f){var len=a.length;for(var i = 0; i < len; ++i){f(a[i]);}})"),
     _bz_=new MlString(""),
     _by_=new MlString("iter"),
     _bx_=
      new
       MlString
       ("(function(t, x0, f){for(var k in t){if(t.hasOwnProperty(k)){x0=f(x0,parseInt(k),t[k]);}} return x0;})"),
     _bw_=
      new
       MlString
       ("(function(t, f){for(var k in t){if(t.hasOwnProperty(k)){f(parseInt(k),t[k]);}}})"),
     _bv_=new MlString("(function(x,y){return x % y;})"),
     _bu_=new MlString("mousedown"),
     _bt_=new MlString("mouseup"),
     _bs_=new MlString("offsetY"),
     _br_=new MlString("offsetX"),
     _bq_=new MlString("which"),
     _bp_=new MlString("click"),
     _bo_=new MlString("pageY"),
     _bn_=new MlString("pageX"),
     _bm_=new MlString("Not a valid mouse code: "),
     _bl_=new MlString("http://www.w3.org/2000/svg"),
     _bk_=new MlString(">"),
     _bj_=new MlString("<"),
     _bi_=new MlString("body"),
     _bh_=new MlString("mousemove"),
     _bg_=new MlString("M%f,%f %s"),
     _bf_=new MlString("circle"),
     _be_=new MlString("style"),
     _bd_=new MlString("r"),
     _bc_=new MlString("cy"),
     _bb_=new MlString("cx"),
     _ba_=new MlString("transform"),
     _a$_=[0,new MlString(",")],
     _a__=new MlString("points"),
     _a9_=new MlString("style"),
     _a8_=new MlString("polygon"),
     _a7_=new MlString("points"),
     _a6_=new MlString("path"),
     _a5_=new MlString("d"),
     _a4_=new MlString("path"),
     _a3_=new MlString("d"),
     _a2_=new MlString("text"),
     _a1_=new MlString("style"),
     _a0_=new MlString("y"),
     _aZ_=new MlString("x"),
     _aY_=new MlString("style"),
     _aX_=new MlString("height"),
     _aW_=new MlString("width"),
     _aV_=new MlString("y"),
     _aU_=new MlString("x"),
     _aT_=new MlString("rect"),
     _aS_=new MlString("height"),
     _aR_=new MlString("width"),
     _aQ_=new MlString("y"),
     _aP_=new MlString("x"),
     _aO_=new MlString("g"),
     _aN_=new MlString("g"),
     _aM_=new MlString("style"),
     _aL_=[0,new MlString(";")],
     _aK_=[0,new MlString(" ")],
     _aJ_=new MlString("L%f %f"),
     _aI_=new MlString("M%f %f"),
     _aH_=new MlString("A%f,%f 0 %d,%d %f,%f"),
     _aG_=[0,0,0],
     _aF_=new MlString("a%f,%f 0 %d,1 %f,%f"),
     _aE_=new MlString("fill:"),
     _aD_=new MlString("stroke-linejoin:"),
     _aC_=new MlString("stroke-linecap:"),
     _aB_=new MlString("stroke-width:"),
     _aA_=new MlString("stroke:"),
     _az_=[0,new MlString(";")],
     _ay_=[0,new MlString(" ")],
     _ax_=new MlString("stroke-dasharray:"),
     _aw_=new MlString("%s:%s"),
     _av_=new MlString("miter"),
     _au_=new MlString("bevel"),
     _at_=new MlString("round"),
     _as_=new MlString("butt"),
     _ar_=new MlString("round"),
     _aq_=new MlString("square"),
     _ap_=new MlString("matrix(%f,%f,%f,%f,%f,%f)"),
     _ao_=new MlString("translate(%f %f)"),
     _an_=new MlString("scale(%f %f)"),
     _am_=new MlString("rotate(%f %f %f)"),
     _al_=new MlString("skewX(%f)"),
     _ak_=new MlString("skewY(%f)"),
     _aj_=new MlString("rgba(%d,%d,%d,%f)"),
     _ai_=[0,new MlString(" ")],
     _ah_=new MlString(","),
     _ag_=[0,new MlString("class"),new MlString("proof-canvas")],
     _af_=new MlString("height"),
     _ae_=new MlString("width"),
     _ad_=new MlString("svg"),
     _ac_=new MlString("p"),
     _ab_=new MlString("a class='btn btn-primary'"),
     _aa_=new MlString("a class='btn btn-default'"),
     _$_=new MlString("span class='glyphicon glyphicon-plus'"),
     ___=new MlString("span class='glyphicon glyphicon-minus'"),
     _Z_=new MlString("value"),
     _Y_=new MlString("div"),
     _X_=new MlString("div"),
     _W_=new MlString("div"),
     _V_=new MlString("value"),
     _U_=new MlString("option"),
     _T_=new MlString("value"),
     _S_=new MlString("option"),
     _R_=new MlString("btn cp-slider-button-playing"),
     _Q_=new MlString("btn cp-slider-button-paused"),
     _P_=new MlString("#compactness"),
     _O_=new MlString("%.3f"),
     _N_=new MlString("#angulardistance"),
     _M_=[0,0,400],
     _L_=
      new
       MlString
       ("M15.514,227.511c0,0-14.993-122.591,109.361-59.091 c124.356,63.501,157.872,22.049,125.238-49.389c-32.632-71.439-127.305-15.875-111.719,108.479 c15.586,124.355,246.658,35.278,246.658,35.278"),
     _K_=new MlString("#pathanim"),
     _J_=new MlString(""),
     _I_=new MlString("(%d, %d)"),
     _H_=[0,0,0],
     _G_=[0,0,0],
     _F_=new MlString("#point-in-plane"),
     _E_=[0,200,200],
     _D_=new MlString("Hit plus yo"),
     _C_=new MlString("#ngon"),
     _B_=[0,6],
     _A_=[0,2],
     _z_=new MlString("end"),
     _y_=new MlString("text-anchor"),
     _x_=new MlString("40pt"),
     _w_=new MlString("font-size"),
     _v_=new MlString("Invalid range"),
     _u_=[0,new MlString("fill"),new MlString("none")],
     _t_=[0,new MlString("stroke-width"),new MlString("5")],
     _s_=
      [0,
       new MlString("d"),
       new
        MlString
        ("m74.072388,176.343704c0,0 -48.240629,-187.48112 77.664017,-81.201996c125.904617,106.279099 131.036606,-49.55714 131.036606,-49.55714c0,0 14.027405,-41.795149 -142.669113,-23.882954c-156.696512,17.912197 69.794968,40.60104 69.794968,40.60104c0,0 218.280304,19.106365 -31.818298,157.030354c-250.098579,137.92395 -120.088375,-207.781625 -120.088375,-207.781625")],
     _r_=[0,new MlString("stroke"),new MlString("#000000")],
     _q_=new MlString("path");
    /*<<990: pervasives.ml 20 17 33>>*/function _p_(s_l_){throw [0,_a_,s_l_];}
    /*<<984: pervasives.ml 21 20 45>>*/function _b$_(s_m_)
     {throw [0,_b_,s_m_];}
    function _ca_(x_o_,y_n_){return caml_lessequal(x_o_,y_n_)?x_o_:y_n_;}
    var min_int_cb_=1<<31,max_int_cn_=min_int_cb_-1|0;
    function _cm_(s1_cc_,s2_ce_)
     {var
       l1_cd_=s1_cc_.getLen(),
       l2_cf_=s2_ce_.getLen(),
       s_cg_=caml_create_string(l1_cd_+l2_cf_|0);
      caml_blit_string(s1_cc_,0,s_cg_,0,l1_cd_);
      caml_blit_string(s2_ce_,0,s_cg_,l1_cd_,l2_cf_);
      return s_cg_;}
    /*<<846: pervasives.ml 186 2 19>>*/function string_of_int_co_(n_ch_)
     {return caml_format_int(_b9_,n_ch_);}
    /*<<220: pervasives.ml 451 20 39>>*/function do_at_exit_cp_(param_cl_)
     {var param_ci_=caml_ml_out_channels_list(0);
      /*<<720: pervasives.ml 253 17 50>>*/for(;;)
       {if(param_ci_)
         {var l_cj_=param_ci_[2];
          try {}catch(_ck_){}
          var param_ci_=l_cj_;
          continue;}
        return 0;}}
    caml_register_named_value(_b6_,do_at_exit_cp_);
    function _cC_(n_cq_,c_cs_)
     {var s_cr_=caml_create_string(n_cq_);
      caml_fill_string(s_cr_,0,n_cq_,c_cs_);
      return s_cr_;}
    function _cD_(s_cv_,ofs_ct_,len_cu_)
     {if(0<=ofs_ct_&&0<=len_cu_&&!((s_cv_.getLen()-len_cu_|0)<ofs_ct_))
       {var r_cw_=caml_create_string(len_cu_);
        /*<<6675: string.ml 41 7 5>>*/caml_blit_string
         (s_cv_,ofs_ct_,r_cw_,0,len_cu_);
        return r_cw_;}
      return _b$_(_bY_);}
    function _cE_(s1_cz_,ofs1_cy_,s2_cB_,ofs2_cA_,len_cx_)
     {if
       (0<=
        len_cx_&&
        0<=
        ofs1_cy_&&
        !((s1_cz_.getLen()-len_cx_|0)<ofs1_cy_)&&
        0<=
        ofs2_cA_&&
        !((s2_cB_.getLen()-len_cx_|0)<ofs2_cA_))
       return caml_blit_string(s1_cz_,ofs1_cy_,s2_cB_,ofs2_cA_,len_cx_);
      return _b$_(_bZ_);}
    var
     _cF_=caml_sys_const_word_size(0),
     _cG_=caml_mul(_cF_/8|0,(1<<(_cF_-10|0))-1|0)-1|0;
    /*<<8284: buffer.ml 23 1 59>>*/function _cY_(n_cH_)
     {var
       n_cI_=1<=n_cH_?n_cH_:1,
       n_cJ_=_cG_<n_cI_?_cG_:n_cI_,
       s_cK_=caml_create_string(n_cJ_);
      return [0,s_cK_,0,n_cJ_,s_cK_];}
    /*<<8274: buffer.ml 28 17 49>>*/function _cZ_(b_cL_)
     {return _cD_(b_cL_[1],0,b_cL_[2]);}
    function _cS_(b_cM_,more_cO_)
     {var new_len_cN_=[0,b_cM_[3]];
      for(;;)
       {if(new_len_cN_[1]<(b_cM_[2]+more_cO_|0))
         {new_len_cN_[1]=2*new_len_cN_[1]|0;continue;}
        if(_cG_<new_len_cN_[1])
         if((b_cM_[2]+more_cO_|0)<=_cG_)
          /*<<8082: buffer.ml 68 9 41>>*/new_len_cN_[1]=_cG_;
         else
          /*<<8089: buffer.ml 69 9 50>>*/_p_(_bX_);
        var new_buffer_cP_=caml_create_string(new_len_cN_[1]);
        /*<<8095: buffer.ml 69 9 50>>*/_cE_
         (b_cM_[1],0,new_buffer_cP_,0,b_cM_[2]);
        /*<<8095: buffer.ml 69 9 50>>*/b_cM_[1]=new_buffer_cP_;
        /*<<8095: buffer.ml 69 9 50>>*/b_cM_[3]=new_len_cN_[1];
        return 0;}}
    function _c0_(b_cQ_,c_cT_)
     {var pos_cR_=b_cQ_[2];
      if(b_cQ_[3]<=pos_cR_)/*<<8019: buffer.ml 78 26 36>>*/_cS_(b_cQ_,1);
      /*<<8023: buffer.ml 78 26 36>>*/b_cQ_[1].safeSet(pos_cR_,c_cT_);
      /*<<8023: buffer.ml 78 26 36>>*/b_cQ_[2]=pos_cR_+1|0;
      return 0;}
    function _c1_(b_cW_,s_cU_)
     {var len_cV_=s_cU_.getLen(),new_position_cX_=b_cW_[2]+len_cV_|0;
      if(b_cW_[3]<new_position_cX_)
       /*<<7921: buffer.ml 93 34 46>>*/_cS_(b_cW_,len_cV_);
      /*<<7925: buffer.ml 93 34 46>>*/_cE_(s_cU_,0,b_cW_[1],b_cW_[2],len_cV_);
      /*<<7925: buffer.ml 93 34 46>>*/b_cW_[2]=new_position_cX_;
      return 0;}
    /*<<11963: printf.ml 32 4 80>>*/function index_of_int_c5_(i_c2_)
     {return 0<=i_c2_?i_c2_:_p_(_cm_(_bC_,string_of_int_co_(i_c2_)));}
    function add_int_index_c6_(i_c3_,idx_c4_)
     {return index_of_int_c5_(i_c3_+idx_c4_|0);}
    var _c8_=_c7_(add_int_index_c6_,1);
    /*<<11929: printf.ml 58 22 66>>*/function _dd_(fmt_c9_)
     {return _cD_(fmt_c9_,0,fmt_c9_.getLen());}
    function bad_conversion_df_(sfmt_c__,i_c$_,c_db_)
     {var
       _da_=_cm_(_bF_,_cm_(sfmt_c__,_bG_)),
       _dc_=_cm_(_bE_,_cm_(string_of_int_co_(i_c$_),_da_));
      return _b$_(_cm_(_bD_,_cm_(_cC_(1,c_db_),_dc_)));}
    function bad_conversion_format_d__(fmt_de_,i_dh_,c_dg_)
     {return bad_conversion_df_(_dd_(fmt_de_),i_dh_,c_dg_);}
    /*<<11842: printf.ml 75 2 34>>*/function incomplete_format_d$_(fmt_di_)
     {return _b$_(_cm_(_bH_,_cm_(_dd_(fmt_di_),_bI_)));}
    function extract_format_dG_(fmt_dj_,start_dr_,stop_dt_,widths_dv_)
     {/*<<11574: printf.ml 123 4 16>>*/function skip_positional_spec_dq_
       (start_dk_)
       {if
         ((fmt_dj_.safeGet(start_dk_)-48|0)<
          0||
          9<
          (fmt_dj_.safeGet(start_dk_)-48|0))
         return start_dk_;
        var i_dl_=start_dk_+1|0;
        /*<<11545: printf.ml 126 8 20>>*/for(;;)
         {var _dm_=fmt_dj_.safeGet(i_dl_);
          if(48<=_dm_)
           {if(!(58<=_dm_)){var _do_=i_dl_+1|0,i_dl_=_do_;continue;}
            var _dn_=0;}
          else
           if(36===_dm_){var _dp_=i_dl_+1|0,_dn_=1;}else var _dn_=0;
          if(!_dn_)var _dp_=start_dk_;
          return _dp_;}}
      var
       start_ds_=skip_positional_spec_dq_(start_dr_+1|0),
       b_du_=_cY_((stop_dt_-start_ds_|0)+10|0);
      _c0_(b_du_,37);
      var l1_dw_=widths_dv_,l2_dx_=0;
      for(;;)
       {if(l1_dw_)
         {var
           l_dy_=l1_dw_[2],
           _dz_=[0,l1_dw_[1],l2_dx_],
           l1_dw_=l_dy_,
           l2_dx_=_dz_;
          continue;}
        var i_dA_=start_ds_,widths_dB_=l2_dx_;
        for(;;)
         {if(i_dA_<=stop_dt_)
           {var _dC_=fmt_dj_.safeGet(i_dA_);
            if(42===_dC_)
             {if(widths_dB_)
               {var t_dD_=widths_dB_[2];
                _c1_(b_du_,string_of_int_co_(widths_dB_[1]));
                var
                 i_dE_=skip_positional_spec_dq_(i_dA_+1|0),
                 i_dA_=i_dE_,
                 widths_dB_=t_dD_;
                continue;}
              throw [0,_b__,_bJ_];}
            _c0_(b_du_,_dC_);
            var _dF_=i_dA_+1|0,i_dA_=_dF_;
            continue;}
          return _cZ_(b_du_);}}}
    function extract_format_int_fA_
     (conv_dM_,fmt_dK_,start_dJ_,stop_dI_,widths_dH_)
     {var sfmt_dL_=extract_format_dG_(fmt_dK_,start_dJ_,stop_dI_,widths_dH_);
      if(78!==conv_dM_&&110!==conv_dM_)return sfmt_dL_;
      /*<<11463: printf.ml 155 4 8>>*/sfmt_dL_.safeSet
       (sfmt_dL_.getLen()-1|0,117);
      return sfmt_dL_;}
    function sub_format_ea_
     (incomplete_format_dT_,bad_conversion_format_d3_,conv_d8_,fmt_dN_,i_d7_)
     {var len_dO_=fmt_dN_.getLen();
      function sub_fmt_d5_(c_dP_,i_d2_)
       {var close_dQ_=40===c_dP_?41:125;
        /*<<11228: printf.ml 181 7 26>>*/function sub_d1_(j_dR_)
         {var j_dS_=j_dR_;
          /*<<11228: printf.ml 181 7 26>>*/for(;;)
           {if(len_dO_<=j_dS_)return _c7_(incomplete_format_dT_,fmt_dN_);
            if(37===fmt_dN_.safeGet(j_dS_))
             {var _dU_=j_dS_+1|0;
              if(len_dO_<=_dU_)
               var _dV_=_c7_(incomplete_format_dT_,fmt_dN_);
              else
               {var _dW_=fmt_dN_.safeGet(_dU_),_dX_=_dW_-40|0;
                if(_dX_<0||1<_dX_)
                 {var _dY_=_dX_-83|0;
                  if(_dY_<0||2<_dY_)
                   var _dZ_=1;
                  else
                   switch(_dY_)
                    {case 1:var _dZ_=1;break;
                     case 2:var _d0_=1,_dZ_=0;break;
                     default:var _d0_=0,_dZ_=0;}
                  if(_dZ_){var _dV_=sub_d1_(_dU_+1|0),_d0_=2;}}
                else
                 var _d0_=0===_dX_?0:1;
                switch(_d0_)
                 {case 1:
                   var
                    _dV_=
                     _dW_===close_dQ_
                      ?_dU_+1|0
                      :_d4_(bad_conversion_format_d3_,fmt_dN_,i_d2_,_dW_);
                   break;
                  case 2:break;
                  default:var _dV_=sub_d1_(sub_fmt_d5_(_dW_,_dU_+1|0)+1|0);}}
              return _dV_;}
            var _d6_=j_dS_+1|0,j_dS_=_d6_;
            continue;}}
        return sub_d1_(i_d2_);}
      return sub_fmt_d5_(conv_d8_,i_d7_);}
    /*<<11222: printf.ml 199 2 57>>*/function sub_format_for_printf_eA_
     (conv_d9_)
     {return _d4_
              (sub_format_ea_,
               incomplete_format_d$_,
               bad_conversion_format_d__,
               conv_d9_);}
    function iter_on_format_args_eQ_(fmt_eb_,add_conv_em_,add_char_ew_)
     {var lim_ec_=fmt_eb_.getLen()-1|0;
      /*<<11162: printf.ml 254 4 10>>*/function scan_fmt_ey_(i_ed_)
       {var i_ee_=i_ed_;
        a:
        /*<<11162: printf.ml 254 4 10>>*/for(;;)
         {if(i_ee_<lim_ec_)
           {if(37===fmt_eb_.safeGet(i_ee_))
             {var skip_ef_=0,i_eg_=i_ee_+1|0;
              for(;;)
               {if(lim_ec_<i_eg_)
                 var _eh_=incomplete_format_d$_(fmt_eb_);
                else
                 {var _ei_=fmt_eb_.safeGet(i_eg_);
                  if(58<=_ei_)
                   {if(95===_ei_)
                     {var _ek_=i_eg_+1|0,_ej_=1,skip_ef_=_ej_,i_eg_=_ek_;
                      continue;}}
                  else
                   if(32<=_ei_)
                    switch(_ei_-32|0)
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
                      case 13:var _el_=i_eg_+1|0,i_eg_=_el_;continue;
                      case 10:
                       var _en_=_d4_(add_conv_em_,skip_ef_,i_eg_,105),i_eg_=_en_;
                       continue;
                      default:var _eo_=i_eg_+1|0,i_eg_=_eo_;continue;}
                  var i_ep_=i_eg_;
                  c:
                  for(;;)
                   {if(lim_ec_<i_ep_)
                     var _eq_=incomplete_format_d$_(fmt_eb_);
                    else
                     {var _er_=fmt_eb_.safeGet(i_ep_);
                      if(126<=_er_)
                       var _es_=0;
                      else
                       switch(_er_)
                        {case 78:
                         case 88:
                         case 100:
                         case 105:
                         case 111:
                         case 117:
                         case 120:
                          var _eq_=_d4_(add_conv_em_,skip_ef_,i_ep_,105),_es_=1;break;
                         case 69:
                         case 70:
                         case 71:
                         case 101:
                         case 102:
                         case 103:
                          var _eq_=_d4_(add_conv_em_,skip_ef_,i_ep_,102),_es_=1;break;
                         case 33:
                         case 37:
                         case 44:
                         case 64:var _eq_=i_ep_+1|0,_es_=1;break;
                         case 83:
                         case 91:
                         case 115:
                          var _eq_=_d4_(add_conv_em_,skip_ef_,i_ep_,115),_es_=1;break;
                         case 97:
                         case 114:
                         case 116:
                          var _eq_=_d4_(add_conv_em_,skip_ef_,i_ep_,_er_),_es_=1;
                          break;
                         case 76:
                         case 108:
                         case 110:
                          var j_et_=i_ep_+1|0;
                          if(lim_ec_<j_et_)
                           {var _eq_=_d4_(add_conv_em_,skip_ef_,i_ep_,105),_es_=1;}
                          else
                           {var _eu_=fmt_eb_.safeGet(j_et_)-88|0;
                            if(_eu_<0||32<_eu_)
                             var _ev_=1;
                            else
                             switch(_eu_)
                              {case 0:
                               case 12:
                               case 17:
                               case 23:
                               case 29:
                               case 32:
                                var
                                 _eq_=
                                  _ex_
                                   (add_char_ew_,_d4_(add_conv_em_,skip_ef_,i_ep_,_er_),105),
                                 _es_=1,
                                 _ev_=0;
                                break;
                               default:var _ev_=1;}
                            if(_ev_)
                             {var _eq_=_d4_(add_conv_em_,skip_ef_,i_ep_,105),_es_=1;}}
                          break;
                         case 67:
                         case 99:
                          var _eq_=_d4_(add_conv_em_,skip_ef_,i_ep_,99),_es_=1;break;
                         case 66:
                         case 98:
                          var _eq_=_d4_(add_conv_em_,skip_ef_,i_ep_,66),_es_=1;break;
                         case 41:
                         case 125:
                          var _eq_=_d4_(add_conv_em_,skip_ef_,i_ep_,_er_),_es_=1;
                          break;
                         case 40:
                          var
                           _eq_=scan_fmt_ey_(_d4_(add_conv_em_,skip_ef_,i_ep_,_er_)),
                           _es_=1;
                          break;
                         case 123:
                          var
                           i_ez_=_d4_(add_conv_em_,skip_ef_,i_ep_,_er_),
                           j_eB_=_d4_(sub_format_for_printf_eA_,_er_,fmt_eb_,i_ez_),
                           i_eC_=i_ez_;
                          /*<<10784: printf.ml 240 8 63>>*/for(;;)
                           {if(i_eC_<(j_eB_-2|0))
                             {var
                               _eD_=_ex_(add_char_ew_,i_eC_,fmt_eb_.safeGet(i_eC_)),
                               i_eC_=_eD_;
                              continue;}
                            var _eE_=j_eB_-1|0,i_ep_=_eE_;
                            continue c;}
                         default:var _es_=0;}
                      if(!_es_)
                       var _eq_=bad_conversion_format_d__(fmt_eb_,i_ep_,_er_);}
                    var _eh_=_eq_;
                    break;}}
                var i_ee_=_eh_;
                continue a;}}
            var _eF_=i_ee_+1|0,i_ee_=_eF_;
            continue;}
          return i_ee_;}}
      scan_fmt_ey_(0);
      return 0;}
    /*<<10497: printf.ml 310 2 12>>*/function
     count_printing_arguments_of_format_gP_
     (fmt_eR_)
     {var ac_eG_=[0,0,0,0];
      function add_conv_eP_(skip_eL_,i_eM_,c_eH_)
       {var _eI_=41!==c_eH_?1:0,_eJ_=_eI_?125!==c_eH_?1:0:_eI_;
        if(_eJ_)
         {var inc_eK_=97===c_eH_?2:1;
          if(114===c_eH_)
           /*<<10553: printf.ml 295 20 48>>*/ac_eG_[3]=ac_eG_[3]+1|0;
          if(skip_eL_)
           /*<<10562: printf.ml 297 9 39>>*/ac_eG_[2]=ac_eG_[2]+inc_eK_|0;
          else
           /*<<10570: printf.ml 298 9 39>>*/ac_eG_[1]=ac_eG_[1]+inc_eK_|0;}
        return i_eM_+1|0;}
      /*<<10578: printf.ml 292 2 4>>*/iter_on_format_args_eQ_
       (fmt_eR_,add_conv_eP_,function(i_eN_,param_eO_){return i_eN_+1|0;});
      return ac_eG_[1];}
    function scan_positional_spec_fw_(fmt_eS_,got_spec_eV_,i_eT_)
     {var _eU_=fmt_eS_.safeGet(i_eT_);
      if((_eU_-48|0)<0||9<(_eU_-48|0))return _ex_(got_spec_eV_,0,i_eT_);
      var accu_eW_=_eU_-48|0,j_eX_=i_eT_+1|0;
      for(;;)
       {var _eY_=fmt_eS_.safeGet(j_eX_);
        if(48<=_eY_)
         {if(!(58<=_eY_))
           {var
             _e1_=j_eX_+1|0,
             _e0_=(10*accu_eW_|0)+(_eY_-48|0)|0,
             accu_eW_=_e0_,
             j_eX_=_e1_;
            continue;}
          var _eZ_=0;}
        else
         if(36===_eY_)
          if(0===accu_eW_)
           {var _e2_=_p_(_bL_),_eZ_=1;}
          else
           {var
             _e2_=
              _ex_(got_spec_eV_,[0,index_of_int_c5_(accu_eW_-1|0)],j_eX_+1|0),
             _eZ_=1;}
         else
          var _eZ_=0;
        if(!_eZ_)var _e2_=_ex_(got_spec_eV_,0,i_eT_);
        return _e2_;}}
    function next_index_fr_(spec_e3_,n_e4_)
     {return spec_e3_?n_e4_:_c7_(_c8_,n_e4_);}
    function get_index_fg_(spec_e5_,n_e6_){return spec_e5_?spec_e5_[1]:n_e6_;}
    function _if_
     (to_s_g__,get_out_e8_,outc_hk_,outs_e$_,flush_gU_,k_hq_,fmt_e7_)
     {var out_e9_=_c7_(get_out_e8_,fmt_e7_);
      /*<<8830: printf.ml 615 15 25>>*/function outs_g$_(s_e__)
       {return _ex_(outs_e$_,out_e9_,s_e__);}
      function pr_gT_(k_fe_,n_hp_,fmt_fa_,v_fj_)
       {var len_fd_=fmt_fa_.getLen();
        function doprn_gQ_(n_hh_,i_fb_)
         {var i_fc_=i_fb_;
          for(;;)
           {if(len_fd_<=i_fc_)return _c7_(k_fe_,out_e9_);
            var _ff_=fmt_fa_.safeGet(i_fc_);
            if(37===_ff_)
             {var
               get_arg_fn_=
                function(spec_fi_,n_fh_)
                 {return caml_array_get(v_fj_,get_index_fg_(spec_fi_,n_fh_));},
               scan_flags_ft_=
                function(spec_fv_,n_fo_,widths_fq_,i_fk_)
                 {var i_fl_=i_fk_;
                  for(;;)
                   {var _fm_=fmt_fa_.safeGet(i_fl_)-32|0;
                    if(!(_fm_<0||25<_fm_))
                     switch(_fm_)
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
                        return scan_positional_spec_fw_
                                (fmt_fa_,
                                 function(wspec_fp_,i_fu_)
                                  {var _fs_=[0,get_arg_fn_(wspec_fp_,n_fo_),widths_fq_];
                                   return scan_flags_ft_
                                           (spec_fv_,next_index_fr_(wspec_fp_,n_fo_),_fs_,i_fu_);},
                                 i_fl_+1|0);
                       default:var _fx_=i_fl_+1|0,i_fl_=_fx_;continue;}
                    var _fy_=fmt_fa_.safeGet(i_fl_);
                    if(124<=_fy_)
                     var _fz_=0;
                    else
                     switch(_fy_)
                      {case 78:
                       case 88:
                       case 100:
                       case 105:
                       case 111:
                       case 117:
                       case 120:
                        var
                         x_fB_=get_arg_fn_(spec_fv_,n_fo_),
                         s_fC_=
                          caml_format_int
                           (extract_format_int_fA_(_fy_,fmt_fa_,i_fc_,i_fl_,widths_fq_),
                            x_fB_),
                         _fE_=
                          cont_s_fD_(next_index_fr_(spec_fv_,n_fo_),s_fC_,i_fl_+1|0),
                         _fz_=1;
                        break;
                       case 69:
                       case 71:
                       case 101:
                       case 102:
                       case 103:
                        var
                         x_fF_=get_arg_fn_(spec_fv_,n_fo_),
                         s_fG_=
                          caml_format_float
                           (extract_format_dG_(fmt_fa_,i_fc_,i_fl_,widths_fq_),x_fF_),
                         _fE_=
                          cont_s_fD_(next_index_fr_(spec_fv_,n_fo_),s_fG_,i_fl_+1|0),
                         _fz_=1;
                        break;
                       case 76:
                       case 108:
                       case 110:
                        var _fH_=fmt_fa_.safeGet(i_fl_+1|0)-88|0;
                        if(_fH_<0||32<_fH_)
                         var _fI_=1;
                        else
                         switch(_fH_)
                          {case 0:
                           case 12:
                           case 17:
                           case 23:
                           case 29:
                           case 32:
                            var i_fJ_=i_fl_+1|0,_fK_=_fy_-108|0;
                            if(_fK_<0||2<_fK_)
                             var _fL_=0;
                            else
                             {switch(_fK_)
                               {case 1:var _fL_=0,_fM_=0;break;
                                case 2:
                                 var
                                  x_fN_=get_arg_fn_(spec_fv_,n_fo_),
                                  _fO_=
                                   caml_format_int
                                    (extract_format_dG_(fmt_fa_,i_fc_,i_fJ_,widths_fq_),x_fN_),
                                  _fM_=1;
                                 break;
                                default:
                                 var
                                  x_fP_=get_arg_fn_(spec_fv_,n_fo_),
                                  _fO_=
                                   caml_format_int
                                    (extract_format_dG_(fmt_fa_,i_fc_,i_fJ_,widths_fq_),x_fP_),
                                  _fM_=1;}
                              if(_fM_){var s_fQ_=_fO_,_fL_=1;}}
                            if(!_fL_)
                             {var
                               x_fR_=get_arg_fn_(spec_fv_,n_fo_),
                               s_fQ_=
                                caml_int64_format
                                 (extract_format_dG_(fmt_fa_,i_fc_,i_fJ_,widths_fq_),x_fR_);}
                            var
                             _fE_=
                              cont_s_fD_(next_index_fr_(spec_fv_,n_fo_),s_fQ_,i_fJ_+1|0),
                             _fz_=1,
                             _fI_=0;
                            break;
                           default:var _fI_=1;}
                        if(_fI_)
                         {var
                           x_fS_=get_arg_fn_(spec_fv_,n_fo_),
                           s_fT_=
                            caml_format_int
                             (extract_format_int_fA_(110,fmt_fa_,i_fc_,i_fl_,widths_fq_),
                              x_fS_),
                           _fE_=
                            cont_s_fD_(next_index_fr_(spec_fv_,n_fo_),s_fT_,i_fl_+1|0),
                           _fz_=1;}
                        break;
                       case 37:
                       case 64:
                        var _fE_=cont_s_fD_(n_fo_,_cC_(1,_fy_),i_fl_+1|0),_fz_=1;
                        break;
                       case 83:
                       case 115:
                        var x_fU_=get_arg_fn_(spec_fv_,n_fo_);
                        if(115===_fy_)
                         var x_fV_=x_fU_;
                        else
                         {var n_fW_=[0,0],_fX_=0,_fY_=x_fU_.getLen()-1|0;
                          if(!(_fY_<_fX_))
                           {var i_fZ_=_fX_;
                            for(;;)
                             {var
                               _f0_=x_fU_.safeGet(i_fZ_),
                               _f1_=
                                14<=_f0_
                                 ?34===_f0_?1:92===_f0_?1:0
                                 :11<=_f0_?13<=_f0_?1:0:8<=_f0_?1:0,
                               _f2_=_f1_?2:caml_is_printable(_f0_)?1:4;
                              n_fW_[1]=n_fW_[1]+_f2_|0;
                              var _f3_=i_fZ_+1|0;
                              if(_fY_!==i_fZ_){var i_fZ_=_f3_;continue;}
                              break;}}
                          if(n_fW_[1]===x_fU_.getLen())
                           var _f4_=x_fU_;
                          else
                           {var s__f5_=caml_create_string(n_fW_[1]);
                            /*<<5987: string.ml 115 33 9>>*/n_fW_[1]=0;
                            var _f6_=0,_f7_=x_fU_.getLen()-1|0;
                            if(!(_f7_<_f6_))
                             {var i_f8_=_f6_;
                              for(;;)
                               {var _f9_=x_fU_.safeGet(i_f8_),_f__=_f9_-34|0;
                                if(_f__<0||58<_f__)
                                 if(-20<=_f__)
                                  var _f$_=1;
                                 else
                                  {switch(_f__+34|0)
                                    {case 8:
                                      /*<<6079: string.ml 130 16 67>>*/s__f5_.safeSet(n_fW_[1],92);
                                      /*<<6079: string.ml 130 16 67>>*/n_fW_[1]+=1;
                                      /*<<6079: string.ml 130 16 67>>*/s__f5_.safeSet(n_fW_[1],98);
                                      var _ga_=1;
                                      break;
                                     case 9:
                                      /*<<6096: string.ml 126 16 67>>*/s__f5_.safeSet(n_fW_[1],92);
                                      /*<<6096: string.ml 126 16 67>>*/n_fW_[1]+=1;
                                      /*<<6096: string.ml 126 16 67>>*/s__f5_.safeSet
                                       (n_fW_[1],116);
                                      var _ga_=1;
                                      break;
                                     case 10:
                                      /*<<6113: string.ml 124 16 67>>*/s__f5_.safeSet(n_fW_[1],92);
                                      /*<<6113: string.ml 124 16 67>>*/n_fW_[1]+=1;
                                      /*<<6113: string.ml 124 16 67>>*/s__f5_.safeSet
                                       (n_fW_[1],110);
                                      var _ga_=1;
                                      break;
                                     case 13:
                                      /*<<6130: string.ml 128 16 67>>*/s__f5_.safeSet(n_fW_[1],92);
                                      /*<<6130: string.ml 128 16 67>>*/n_fW_[1]+=1;
                                      /*<<6130: string.ml 128 16 67>>*/s__f5_.safeSet
                                       (n_fW_[1],114);
                                      var _ga_=1;
                                      break;
                                     default:var _f$_=1,_ga_=0;}
                                   if(_ga_)var _f$_=0;}
                                else
                                 var
                                  _f$_=
                                   (_f__-1|0)<0||56<(_f__-1|0)
                                    ?(s__f5_.safeSet(n_fW_[1],92),
                                      n_fW_[1]+=
                                      1,
                                      s__f5_.safeSet(n_fW_[1],_f9_),
                                      0)
                                    :1;
                                if(_f$_)
                                 if(caml_is_printable(_f9_))
                                  /*<<6159: string.ml 133 18 36>>*/s__f5_.safeSet
                                   (n_fW_[1],_f9_);
                                 else
                                  {/*<<6166: string.ml 134 21 19>>*/s__f5_.safeSet
                                    (n_fW_[1],92);
                                   /*<<6166: string.ml 134 21 19>>*/n_fW_[1]+=1;
                                   /*<<6166: string.ml 134 21 19>>*/s__f5_.safeSet
                                    (n_fW_[1],48+(_f9_/100|0)|0);
                                   /*<<6166: string.ml 134 21 19>>*/n_fW_[1]+=1;
                                   /*<<6166: string.ml 134 21 19>>*/s__f5_.safeSet
                                    (n_fW_[1],48+((_f9_/10|0)%10|0)|0);
                                   /*<<6166: string.ml 134 21 19>>*/n_fW_[1]+=1;
                                   /*<<6166: string.ml 134 21 19>>*/s__f5_.safeSet
                                    (n_fW_[1],48+(_f9_%10|0)|0);}
                                n_fW_[1]+=1;
                                var _gb_=i_f8_+1|0;
                                if(_f7_!==i_f8_){var i_f8_=_gb_;continue;}
                                break;}}
                            var _f4_=s__f5_;}
                          var x_fV_=_cm_(_bS_,_cm_(_f4_,_bT_));}
                        if(i_fl_===(i_fc_+1|0))
                         var s_gc_=x_fV_;
                        else
                         {var
                           _gd_=
                            extract_format_dG_(fmt_fa_,i_fc_,i_fl_,widths_fq_);
                          /*<<11812: printf.ml 83 2 42>>*/try
                           {var neg_ge_=0,i_gf_=1;
                            for(;;)
                             {if(_gd_.getLen()<=i_gf_)
                               var _gg_=[0,0,neg_ge_];
                              else
                               {var _gh_=_gd_.safeGet(i_gf_);
                                if(49<=_gh_)
                                 if(58<=_gh_)
                                  var _gi_=0;
                                 else
                                  {var
                                    _gg_=
                                     [0,
                                      caml_int_of_string
                                       (_cD_(_gd_,i_gf_,(_gd_.getLen()-i_gf_|0)-1|0)),
                                      neg_ge_],
                                    _gi_=1;}
                                else
                                 {if(45===_gh_)
                                   {var _gk_=i_gf_+1|0,_gj_=1,neg_ge_=_gj_,i_gf_=_gk_;
                                    continue;}
                                  var _gi_=0;}
                                if(!_gi_){var _gl_=i_gf_+1|0,i_gf_=_gl_;continue;}}
                              var match_gm_=_gg_;
                              break;}}
                          catch(_gn_)
                           {if(_gn_[1]!==_a_)throw _gn_;
                            var match_gm_=bad_conversion_df_(_gd_,0,115);}
                          var
                           p_go_=match_gm_[1],
                           _gp_=x_fV_.getLen(),
                           _gq_=0,
                           neg_gu_=match_gm_[2],
                           _gt_=32;
                          if(p_go_===_gp_&&0===_gq_)
                           {var _gr_=x_fV_,_gs_=1;}
                          else
                           var _gs_=0;
                          if(!_gs_)
                           if(p_go_<=_gp_)
                            var _gr_=_cD_(x_fV_,_gq_,_gp_);
                           else
                            {var res_gv_=_cC_(p_go_,_gt_);
                             if(neg_gu_)
                              /*<<11709: printf.ml 105 7 32>>*/_cE_
                               (x_fV_,_gq_,res_gv_,0,_gp_);
                             else
                              /*<<11726: printf.ml 106 7 40>>*/_cE_
                               (x_fV_,_gq_,res_gv_,p_go_-_gp_|0,_gp_);
                             var _gr_=res_gv_;}
                          var s_gc_=_gr_;}
                        var
                         _fE_=
                          cont_s_fD_(next_index_fr_(spec_fv_,n_fo_),s_gc_,i_fl_+1|0),
                         _fz_=1;
                        break;
                       case 67:
                       case 99:
                        var x_gw_=get_arg_fn_(spec_fv_,n_fo_);
                        if(99===_fy_)
                         var s_gx_=_cC_(1,x_gw_);
                        else
                         {if(39===x_gw_)
                           var _gy_=_b0_;
                          else
                           if(92===x_gw_)
                            var _gy_=_b1_;
                           else
                            {if(14<=x_gw_)
                              var _gz_=0;
                             else
                              switch(x_gw_)
                               {case 8:var _gy_=_b5_,_gz_=1;break;
                                case 9:var _gy_=_b4_,_gz_=1;break;
                                case 10:var _gy_=_b3_,_gz_=1;break;
                                case 13:var _gy_=_b2_,_gz_=1;break;
                                default:var _gz_=0;}
                             if(!_gz_)
                              if(caml_is_printable(x_gw_))
                               {var s_gA_=caml_create_string(1);
                                /*<<5422: char.ml 37 27 7>>*/s_gA_.safeSet(0,x_gw_);
                                var _gy_=s_gA_;}
                              else
                               {var s_gB_=caml_create_string(4);
                                /*<<5432: char.ml 41 13 7>>*/s_gB_.safeSet(0,92);
                                /*<<5432: char.ml 41 13 7>>*/s_gB_.safeSet
                                 (1,48+(x_gw_/100|0)|0);
                                /*<<5432: char.ml 41 13 7>>*/s_gB_.safeSet
                                 (2,48+((x_gw_/10|0)%10|0)|0);
                                /*<<5432: char.ml 41 13 7>>*/s_gB_.safeSet
                                 (3,48+(x_gw_%10|0)|0);
                                var _gy_=s_gB_;}}
                          var s_gx_=_cm_(_bQ_,_cm_(_gy_,_bR_));}
                        var
                         _fE_=
                          cont_s_fD_(next_index_fr_(spec_fv_,n_fo_),s_gx_,i_fl_+1|0),
                         _fz_=1;
                        break;
                       case 66:
                       case 98:
                        var
                         _gD_=i_fl_+1|0,
                         _gC_=get_arg_fn_(spec_fv_,n_fo_)?_b8_:_b7_,
                         _fE_=cont_s_fD_(next_index_fr_(spec_fv_,n_fo_),_gC_,_gD_),
                         _fz_=1;
                        break;
                       case 40:
                       case 123:
                        var
                         xf_gE_=get_arg_fn_(spec_fv_,n_fo_),
                         i_gF_=_d4_(sub_format_for_printf_eA_,_fy_,fmt_fa_,i_fl_+1|0);
                        if(123===_fy_)
                         {var
                           b_gG_=_cY_(xf_gE_.getLen()),
                           add_char_gK_=
                            function(i_gI_,c_gH_){_c0_(b_gG_,c_gH_);return i_gI_+1|0;};
                          /*<<10644: printf.ml 268 2 19>>*/iter_on_format_args_eQ_
                           (xf_gE_,
                            function(skip_gJ_,i_gM_,c_gL_)
                             {if(skip_gJ_)
                               /*<<10609: printf.ml 272 17 41>>*/_c1_(b_gG_,_bK_);
                              else
                               /*<<10618: printf.ml 272 47 68>>*/_c0_(b_gG_,37);
                              return add_char_gK_(i_gM_,c_gL_);},
                            add_char_gK_);
                          var
                           _gN_=_cZ_(b_gG_),
                           _fE_=cont_s_fD_(next_index_fr_(spec_fv_,n_fo_),_gN_,i_gF_),
                           _fz_=1;}
                        else
                         {var
                           _gO_=next_index_fr_(spec_fv_,n_fo_),
                           m_gR_=
                            add_int_index_c6_
                             (count_printing_arguments_of_format_gP_(xf_gE_),_gO_),
                           _fE_=
                            pr_gT_
                             (/*<<8760: printf.ml 647 30 39>>*/function(param_gS_)
                               {return doprn_gQ_(m_gR_,i_gF_);},
                              _gO_,
                              xf_gE_,
                              v_fj_),
                           _fz_=1;}
                        break;
                       case 33:
                        _c7_(flush_gU_,out_e9_);
                        var _fE_=doprn_gQ_(n_fo_,i_fl_+1|0),_fz_=1;
                        break;
                       case 41:
                        var _fE_=cont_s_fD_(n_fo_,_bW_,i_fl_+1|0),_fz_=1;break;
                       case 44:
                        var _fE_=cont_s_fD_(n_fo_,_bV_,i_fl_+1|0),_fz_=1;break;
                       case 70:
                        var x_gV_=get_arg_fn_(spec_fv_,n_fo_);
                        if(0===widths_fq_)
                         var _gW_=_bU_;
                        else
                         {var
                           sfmt_gX_=
                            extract_format_dG_(fmt_fa_,i_fc_,i_fl_,widths_fq_);
                          if(70===_fy_)
                           /*<<11427: printf.ml 164 4 8>>*/sfmt_gX_.safeSet
                            (sfmt_gX_.getLen()-1|0,103);
                          var _gW_=sfmt_gX_;}
                        var _gY_=caml_classify_float(x_gV_);
                        if(3===_gY_)
                         var s_gZ_=x_gV_<0?_bO_:_bN_;
                        else
                         if(4<=_gY_)
                          var s_gZ_=_bP_;
                         else
                          {var
                            _g0_=caml_format_float(_gW_,x_gV_),
                            i_g1_=0,
                            l_g2_=_g0_.getLen();
                           /*<<9936: printf.ml 448 6 37>>*/for(;;)
                            {if(l_g2_<=i_g1_)
                              var _g3_=_cm_(_g0_,_bM_);
                             else
                              {var
                                _g4_=_g0_.safeGet(i_g1_)-46|0,
                                _g5_=
                                 _g4_<0||23<_g4_
                                  ?55===_g4_?1:0
                                  :(_g4_-1|0)<0||21<(_g4_-1|0)?1:0;
                               if(!_g5_){var _g6_=i_g1_+1|0,i_g1_=_g6_;continue;}
                               var _g3_=_g0_;}
                             var s_gZ_=_g3_;
                             break;}}
                        var
                         _fE_=
                          cont_s_fD_(next_index_fr_(spec_fv_,n_fo_),s_gZ_,i_fl_+1|0),
                         _fz_=1;
                        break;
                       case 91:
                        var
                         _fE_=bad_conversion_format_d__(fmt_fa_,i_fl_,_fy_),
                         _fz_=1;
                        break;
                       case 97:
                        var
                         printer_g7_=get_arg_fn_(spec_fv_,n_fo_),
                         n_g8_=_c7_(_c8_,get_index_fg_(spec_fv_,n_fo_)),
                         arg_g9_=get_arg_fn_(0,n_g8_),
                         _hb_=i_fl_+1|0,
                         _ha_=next_index_fr_(spec_fv_,n_g8_);
                        if(to_s_g__)
                         /*<<8701: printf.ml 631 8 63>>*/outs_g$_
                          (_ex_(printer_g7_,0,arg_g9_));
                        else
                         /*<<8710: printf.ml 633 8 23>>*/_ex_
                          (printer_g7_,out_e9_,arg_g9_);
                        var _fE_=doprn_gQ_(_ha_,_hb_),_fz_=1;
                        break;
                       case 114:
                        var
                         _fE_=bad_conversion_format_d__(fmt_fa_,i_fl_,_fy_),
                         _fz_=1;
                        break;
                       case 116:
                        var
                         printer_hc_=get_arg_fn_(spec_fv_,n_fo_),
                         _he_=i_fl_+1|0,
                         _hd_=next_index_fr_(spec_fv_,n_fo_);
                        if(to_s_g__)
                         /*<<8728: printf.ml 637 8 54>>*/outs_g$_
                          (_c7_(printer_hc_,0));
                        else
                         /*<<8736: printf.ml 639 8 19>>*/_c7_(printer_hc_,out_e9_);
                        var _fE_=doprn_gQ_(_hd_,_he_),_fz_=1;
                        break;
                       default:var _fz_=0;}
                    if(!_fz_)
                     var _fE_=bad_conversion_format_d__(fmt_fa_,i_fl_,_fy_);
                    return _fE_;}},
               _hj_=i_fc_+1|0,
               _hg_=0;
              return scan_positional_spec_fw_
                      (fmt_fa_,
                       function(spec_hi_,i_hf_)
                        {return scan_flags_ft_(spec_hi_,n_hh_,_hg_,i_hf_);},
                       _hj_);}
            /*<<8835: printf.ml 614 15 25>>*/_ex_(outc_hk_,out_e9_,_ff_);
            var _hl_=i_fc_+1|0,i_fc_=_hl_;
            continue;}}
        function cont_s_fD_(n_ho_,s_hm_,i_hn_)
         {outs_g$_(s_hm_);return doprn_gQ_(n_ho_,i_hn_);}
        return doprn_gQ_(n_hp_,0);}
      var
       kpr_hr_=_ex_(pr_gT_,k_hq_,index_of_int_c5_(0)),
       _hs_=count_printing_arguments_of_format_gP_(fmt_e7_);
      if(_hs_<0||6<_hs_)
       {var
         loop_hF_=
          function(i_ht_,args_hz_)
           {if(_hs_<=i_ht_)
             {var
               a_hu_=caml_make_vect(_hs_,0),
               _hx_=
                function(i_hv_,arg_hw_)
                 {return caml_array_set(a_hu_,(_hs_-i_hv_|0)-1|0,arg_hw_);},
               i_hy_=0,
               param_hA_=args_hz_;
              for(;;)
               {if(param_hA_)
                 {var _hB_=param_hA_[2],_hC_=param_hA_[1];
                  if(_hB_)
                   {_hx_(i_hy_,_hC_);
                    var _hD_=i_hy_+1|0,i_hy_=_hD_,param_hA_=_hB_;
                    continue;}
                  /*<<10476: printf.ml 318 11 16>>*/_hx_(i_hy_,_hC_);}
                return _ex_(kpr_hr_,fmt_e7_,a_hu_);}}
            /*<<10312: printf.ml 363 31 56>>*/return function(x_hE_)
             {return loop_hF_(i_ht_+1|0,[0,x_hE_,args_hz_]);};},
         _hG_=loop_hF_(0,0);}
      else
       switch(_hs_)
        {case 1:
          var
           _hG_=
            /*<<10298: printf.ml 331 6 15>>*/function(x_hI_)
             {var a_hH_=caml_make_vect(1,0);
              /*<<10298: printf.ml 331 6 15>>*/caml_array_set(a_hH_,0,x_hI_);
              return _ex_(kpr_hr_,fmt_e7_,a_hH_);};
          break;
         case 2:
          var
           _hG_=
            function(x_hK_,y_hL_)
             {var a_hJ_=caml_make_vect(2,0);
              caml_array_set(a_hJ_,0,x_hK_);
              caml_array_set(a_hJ_,1,y_hL_);
              return _ex_(kpr_hr_,fmt_e7_,a_hJ_);};
          break;
         case 3:
          var
           _hG_=
            function(x_hN_,y_hO_,z_hP_)
             {var a_hM_=caml_make_vect(3,0);
              caml_array_set(a_hM_,0,x_hN_);
              caml_array_set(a_hM_,1,y_hO_);
              caml_array_set(a_hM_,2,z_hP_);
              return _ex_(kpr_hr_,fmt_e7_,a_hM_);};
          break;
         case 4:
          var
           _hG_=
            function(x_hR_,y_hS_,z_hT_,t_hU_)
             {var a_hQ_=caml_make_vect(4,0);
              caml_array_set(a_hQ_,0,x_hR_);
              caml_array_set(a_hQ_,1,y_hS_);
              caml_array_set(a_hQ_,2,z_hT_);
              caml_array_set(a_hQ_,3,t_hU_);
              return _ex_(kpr_hr_,fmt_e7_,a_hQ_);};
          break;
         case 5:
          var
           _hG_=
            function(x_hW_,y_hX_,z_hY_,t_hZ_,u_h0_)
             {var a_hV_=caml_make_vect(5,0);
              caml_array_set(a_hV_,0,x_hW_);
              caml_array_set(a_hV_,1,y_hX_);
              caml_array_set(a_hV_,2,z_hY_);
              caml_array_set(a_hV_,3,t_hZ_);
              caml_array_set(a_hV_,4,u_h0_);
              return _ex_(kpr_hr_,fmt_e7_,a_hV_);};
          break;
         case 6:
          var
           _hG_=
            function(x_h2_,y_h3_,z_h4_,t_h5_,u_h6_,v_h7_)
             {var a_h1_=caml_make_vect(6,0);
              caml_array_set(a_h1_,0,x_h2_);
              caml_array_set(a_h1_,1,y_h3_);
              caml_array_set(a_h1_,2,z_h4_);
              caml_array_set(a_h1_,3,t_h5_);
              caml_array_set(a_h1_,4,u_h6_);
              caml_array_set(a_h1_,5,v_h7_);
              return _ex_(kpr_hr_,fmt_e7_,a_h1_);};
          break;
         default:var _hG_=_ex_(kpr_hr_,fmt_e7_,[0]);}
      return _hG_;}
    /*<<8494: printf.ml 678 2 19>>*/function _ie_(fmt_h8_)
     {return _cY_(2*fmt_h8_.getLen()|0);}
    function _ib_(k_h$_,b_h9_)
     {var s_h__=_cZ_(b_h9_);
      /*<<8139: buffer.ml 56 14 29>>*/b_h9_[2]=0;
      return _c7_(k_h$_,s_h__);}
    /*<<8453: printf.ml 691 2 78>>*/function _ij_(k_ia_)
     {var _id_=_c7_(_ib_,k_ia_);
      return _ig_(_if_,1,_ie_,_c0_,_c1_,function(_ic_){return 0;},_id_);}
    /*<<8441: printf.ml 694 18 43>>*/function _ik_(fmt_ii_)
     {return _ex_
              (_ij_,
               /*<<8438: printf.ml 694 37 38>>*/function(s_ih_){return s_ih_;},
               fmt_ii_);}
    var
     _il_=[0,0],
     null_im_=null,
     array_constructor_io_=Array,
     date_constr_ip_=Date;
    /*<<13052: js.ml 376 7 77>>*/function _iq_(e_in_)
     {return e_in_ instanceof array_constructor_io_
              ?0
              :[0,new MlWrappedString(e_in_.toString())];}
    /*<<12349: printexc.ml 167 2 29>>*/_il_[1]=[0,_iq_,_il_[1]];
    function _ix_(f_is_,param_ir_)
     {var x_it_=param_ir_[1],_iu_=_c7_(f_is_,param_ir_[2]);
      return [0,_c7_(f_is_,x_it_),_iu_];}
    /*<<16129: src/option.ml 23 16 15>>*/function _iw_(param_iv_)
     {return param_iv_?param_iv_[1]:_p_(_bB_);}
    function _iN_(arr_iy_,f_iB_)
     {var l_iz_=arr_iy_.length-1;
      if(0===l_iz_)
       var _iA_=[0];
      else
       {var
         r_iC_=caml_make_vect(l_iz_,_c7_(f_iB_,arr_iy_[0+1])),
         _iD_=1,
         _iE_=l_iz_-1|0;
        if(!(_iE_<_iD_))
         {var i_iF_=_iD_;
          for(;;)
           {r_iC_[i_iF_+1]=_c7_(f_iB_,arr_iy_[i_iF_+1]);
            var _iG_=i_iF_+1|0;
            if(_iE_!==i_iF_){var i_iF_=_iG_;continue;}
            break;}}
        var _iA_=r_iC_;}
      return _iA_;}
    function _iO_(arr_iI_,f_iL_)
     {var _iH_=0,_iJ_=arr_iI_.length-1-1|0;
      if(!(_iJ_<_iH_))
       {var i_iK_=_iH_;
        for(;;)
         {_c7_(f_iL_,arr_iI_[i_iK_+1]);
          var _iM_=i_iK_+1|0;
          if(_iJ_!==i_iK_){var i_iK_=_iM_;continue;}
          break;}}
      return 0;}
    ({}.iter=caml_js_eval_string(_bA_));
    function _iS_(_opt__iP_,ts_iR_)
     {var sep_iQ_=_opt__iP_?_opt__iP_[1]:_bz_;
      return new
              MlWrappedString
              (caml_js_from_array(ts_iR_).join(sep_iQ_.toString()));}
    var
     _iT_=caml_js_eval_string(_bx_),
     _iZ_={"iter":caml_js_eval_string(_bw_),"fold":_iT_};
    /*<<18523: src/time.ml 3 13 60>>*/function _iY_(param_iU_)
     {return new date_constr_ip_().valueOf();}
    function _i0_(_iV_,_iW_){return _iV_-_iW_;}
    /*<<18493: src/time.ml 14 16 17>>*/function _i1_(t_iX_){return t_iX_;}
    /*<<18721: src/core.ml 17 24 73>>*/function string_of_float_i3_(x_i2_)
     {return new MlWrappedString(x_i2_.toString());}
    caml_js_eval_string(_bv_);
    function _i8_(ms_i5_,f_i4_)
     {return setInterval(caml_js_wrap_callback(f_i4_),ms_i5_);}
    function _i9_(x_i6_,f_i7_){return _c7_(f_i7_,x_i6_);}
    /*<<20320: src/frp.ml 34 24 26>>*/function _ki_(param_i__){return 0;}
    /*<<20316: src/frp.ml 36 17 21>>*/function _ja_(t_i$_)
     {return _c7_(t_i$_,0);}
    function _kj_(t1_jb_,t2_jc_,param_jd_){_ja_(t1_jb_);return _ja_(t2_jc_);}
    function _kk_(ts_je_,param_jf_){return _iO_(ts_je_,_ja_);}
    /*<<20291: src/frp.ml 42 15 16>>*/function _jl_(x_jg_){return x_jg_;}
    function iter_jy_(t_jh_,f_jj_)
     {var key_ji_=t_jh_[2];
      t_jh_[2]=key_ji_+1|0;
      t_jh_[1][key_ji_]=f_jj_;
      return _jl_
              (/*<<20253: src/frp.ml 55 33 62>>*/function(param_jk_)
                {return delete t_jh_[1][key_ji_];});}
    function trigger_jx_(t_jm_,x_jn_)
     {var _jr_=t_jm_[1],js_iter_jq_=_iZ_[_by_.toString()];
      return js_iter_jq_
              (_jr_,
               caml_js_wrap_callback
                (function(key_jp_,data_jo_){return _c7_(data_jo_,x_jn_);}));}
    /*<<20219: src/frp.ml 63 18 60>>*/function create_jt_(param_js_)
     {return [0,{},0];}
    function map_kl_(t_jz_,f_jw_)
     {var t__ju_=create_jt_(0);
      iter_jy_
       (t_jz_,
        /*<<20112: src/frp.ml 98 32 48>>*/function(x_jv_)
         {return trigger_jx_(t__ju_,_c7_(f_jw_,x_jv_));});
      return t__ju_;}
    function _km_(t_jH_,f_jF_)
     {var t__jA_=create_jt_(0),last_jB_=[0,0];
      function _jG_(_jC_){return 0;}
      _i9_
       (iter_jy_
         (t_jH_,
          /*<<19598: src/frp.ml 198 6 20>>*/function(x_jE_)
           {var _jD_=last_jB_[1];
            if(_jD_)
             /*<<19590: src/frp.ml 198 37 55>>*/trigger_jx_
              (t__jA_,_ex_(f_jF_,_jD_[1],x_jE_));
            last_jB_[1]=[0,x_jE_];
            return 0;}),
        _jG_);
      return t__jA_;}
    /*<<19413: src/frp.ml 245 15 22>>*/function peek_ke_(t_jI_)
     {return t_jI_[2];}
    function add_listener_jW_(t_jJ_,f_jK_)
     {t_jJ_[1]=[0,f_jK_,t_jJ_[1]];return 0;}
    function trigger_jV_(t_jL_,x_jM_)
     {t_jL_[2]=x_jM_;
      var param_jN_=t_jL_[1];
      for(;;)
       {if(param_jN_)
         {var l_jO_=param_jN_[2];
          /*<<19383: src/frp.ml 251 27 36>>*/_c7_(param_jN_[1],t_jL_[2]);
          var param_jN_=l_jO_;
          continue;}
        return 0;}}
    /*<<19356: src/frp.ml 263 20 53>>*/function return_jS_(init_jP_)
     {return [0,0,init_jP_];}
    function map_kn_(t_jQ_,f_jR_)
     {var t__jT_=return_jS_(_c7_(f_jR_,t_jQ_[2]));
      add_listener_jW_
       (t_jQ_,
        /*<<19272: src/frp.ml 272 29 45>>*/function(x_jU_)
         {return trigger_jV_(t__jT_,_c7_(f_jR_,x_jU_));});
      return t__jT_;}
    function zip_with_j5_(t1_jY_,t2_jX_,f_jZ_)
     {var t__j0_=return_jS_(_ex_(f_jZ_,t1_jY_[2],t2_jX_[2]));
      add_listener_jW_
       (t1_jY_,
        /*<<19228: src/frp.ml 278 30 55>>*/function(x_j1_)
         {return trigger_jV_(t__j0_,_ex_(f_jZ_,x_j1_,t2_jX_[2]));});
      add_listener_jW_
       (t2_jX_,
        /*<<19218: src/frp.ml 279 30 55>>*/function(y_j2_)
         {return trigger_jV_(t__j0_,_ex_(f_jZ_,t1_jY_[2],y_j2_));});
      return t__j0_;}
    function ap_ko_(tf_j7_,tx_j6_)
     {return zip_with_j5_
              (tf_j7_,tx_j6_,function(f_j4_,x_j3_){return _c7_(f_j4_,x_j3_);});}
    /*<<18990: src/frp.ml 313 4 5>>*/function _kp_(t_j9_)
     {var s_j8_=create_jt_(0);
      /*<<18990: src/frp.ml 313 4 5>>*/trigger_jx_(s_j8_,t_j9_[2]);
      /*<<18990: src/frp.ml 313 4 5>>*/add_listener_jW_
       (t_j9_,_c7_(trigger_jx_,s_j8_));
      return s_j8_;}
    function _kq_(cond_j$_,s_kb_)
     {var s__j__=create_jt_(0);
      iter_jy_
       (s_kb_,
        /*<<18922: src/frp.ml 331 37 84>>*/function(x_ka_)
         {return cond_j$_[2]?trigger_jx_(s__j__,x_ka_):0;});
      return s__j__;}
    function _kr_(s_kh_,init_kc_,f_kg_)
     {var b_kd_=return_jS_(init_kc_);
      iter_jy_
       (s_kh_,
        /*<<18887: src/frp.ml 339 6 48>>*/function(x_kf_)
         {return trigger_jV_(b_kd_,_ex_(f_kg_,peek_ke_(b_kd_),x_kf_));});
      return b_kd_;}
    /*<<21693: src/jq.ml 5 29 84>>*/function unsafe_jq_kt_(s_ks_)
     {return jQuery(s_ks_.toString());}
    /*<<21666: src/jq.ml 8 2 15>>*/function jq_kY_(s_ku_)
     {var t_kv_=unsafe_jq_kt_(s_ku_);return 0===t_kv_.length?0:[0,t_kv_];}
    /*<<21647: src/jq.ml 14 13 58>>*/function wrap_kZ_(elt_kw_)
     {return jQuery(elt_kw_);}
    /*<<21631: src/jq.ml 16 17 44>>*/function create_k0_(tag_kx_)
     {return unsafe_jq_kt_(_cm_(_bj_,_cm_(tag_kx_,_bk_)));}
    function append_k1_(parent_ky_,child_kz_)
     {return parent_ky_.append(child_kz_);}
    function on_k2_(t_kC_,event_name_kB_,f_kA_)
     {return t_kC_.on(event_name_kB_.toString(),caml_js_wrap_callback(f_kA_));}
    function set_attr_k3_(t_kF_,name_kE_,value_kD_)
     {return t_kF_.attr(name_kE_.toString(),value_kD_.toString());}
    function _k4_(t_kJ_,name_kH_,value_kG_)
     {var _kI_=peek_ke_(value_kG_).toString();
      t_kJ_.setAttribute(name_kH_.toString(),_kI_);
      var name_kL_=name_kH_.toString();
      /*<<21373: src/jq.ml 58 6 7>>*/function _kM_(value_kK_)
       {return t_kJ_.setAttribute(name_kL_,value_kK_.toString());}
      return iter_jy_(_kp_(value_kG_),_kM_);}
    function _k5_(t_kO_,s_kN_){return t_kO_.innerHTML=s_kN_.toString();}
    function _k6_(t_kP_,c_kQ_){t_kP_.appendChild(c_kQ_);return 0;}
    function _k7_(tag_kT_,attrs_kX_)
     {/*<<21176: src/jq.ml 75 16 46>>*/function str_kS_(s_kR_)
       {return s_kR_.toString();}
      var
       _kU_=str_kS_(tag_kT_),
       elt_kV_=document.createElementNS(str_kS_(_bl_),_kU_);
      _iO_
       (attrs_kX_,
        /*<<21150: src/jq.ml 81 29 49>>*/function(param_kW_)
         {return elt_kV_.setAttribute
                  (param_kW_[1].toString(),param_kW_[2].toString());});
      return elt_kV_;}
    var body_k8_=unsafe_jq_kt_(_bi_),mouse_pos_k9_=create_jt_(0);
    on_k2_
     (body_k8_,
      _bh_,
      /*<<21078: src/jq.ml 126 4 28>>*/function(e_k__)
       {return trigger_jx_
                (mouse_pos_k9_,
                 [0,e_k__[_bn_.toString()],e_k__[_bo_.toString()]]);});
    var
     _lm_=
      _km_
       (mouse_pos_k9_,
        function(param_la_,_k$_)
         {return [0,_k$_[1]-param_la_[1]|0,_k$_[2]-param_la_[2]|0];});
    /*<<21037: src/jq.ml 136 2 3>>*/function _ln_(t_lh_)
     {var s_lb_=create_jt_(0);
      /*<<21037: src/jq.ml 136 2 3>>*/on_k2_
       (t_lh_,
        _bp_,
        /*<<20997: src/jq.ml 138 4 59>>*/function(e_lc_)
         {var
           _ld_=e_lc_[_bq_.toString()],
           _le_=_ld_-1|0,
           pos_lg_=[0,e_lc_[_br_.toString()],e_lc_[_bs_.toString()]];
          if(_le_<0||2<_le_)
           var button_lf_=_p_(_cm_(_bm_,string_of_int_co_(_ld_)));
          else
           switch(_le_)
            {case 1:var button_lf_=15943541;break;
             case 2:var button_lf_=-57574468;break;
             default:var button_lf_=847852583;}
          return trigger_jx_(s_lb_,[0,pos_lg_,button_lf_]);});
      return s_lb_;}
    /*<<20920: src/jq.ml 153 14 51>>*/function _lo_(t_lk_)
     {var b_li_=return_jS_(0);
      /*<<20947: src/jq.ml 148 2 3>>*/on_k2_
       (t_lk_,
        _bu_,
        /*<<20938: src/jq.ml 149 32 59>>*/function(param_lj_)
         {return trigger_jV_(b_li_,1);});
      /*<<20947: src/jq.ml 148 2 3>>*/on_k2_
       (body_k8_,
        _bt_,
        /*<<20929: src/jq.ml 150 32 60>>*/function(param_ll_)
         {return trigger_jV_(b_li_,0);});
      return _kq_(b_li_,_lm_);}
    /*<<24099: src/draw.ml 8 13 65>>*/function _ls_(param_lp_)
     {var
       x_lq_=param_lp_[1],
       _lr_=_cm_(_ah_,string_of_float_i3_(param_lp_[2]));
      return _cm_(string_of_float_i3_(x_lq_),_lr_);}
    /*<<24082: src/draw.ml 10 24 78>>*/function _lD_(pts_lt_)
     {return _iS_(_ai_,_iN_(pts_lt_,_ls_));}
    function _lC_(_opt__lu_,r_ly_,g_lx_,b_lw_,param_lz_)
     {var alpha_lv_=_opt__lu_?_opt__lu_[1]:1;
      return [0,r_ly_,g_lx_,b_lw_,alpha_lv_];}
    /*<<24038: src/draw.ml 18 13 50>>*/function _lE_(param_lA_)
     {return _lB_
              (_ik_,_aj_,param_lA_[1],param_lA_[2],param_lA_[3],param_lA_[4]);}
    var _lF_=[0,_e_[1],_e_[2],_e_[3],0],pi_lG_=4*Math.atan(1);
    /*<<24035: src/draw.ml 33 21 22>>*/function to_degrees_lI_(x_lH_)
     {return x_lH_;}
    var c_lJ_=2*pi_lG_/360;
    /*<<24029: src/draw.ml 35 58 64>>*/function to_radians_lM_(x_lK_)
     {return c_lJ_*x_lK_;}
    /*<<24026: src/draw.ml 37 21 22>>*/function of_degrees_lN_(x_lL_)
     {return x_lL_;}
    var c_l0_=360/(2*pi_lG_);
    function _mJ_(param_lP_,_lO_,angle_lS_)
     {var
       b_lQ_=param_lP_[2],
       a_lR_=param_lP_[1],
       y_lV_=_lO_[2],
       x_lU_=_lO_[1],
       angle_lT_=to_radians_lM_(angle_lS_),
       _lW_=y_lV_-b_lQ_,
       _lX_=x_lU_-a_lR_;
      return [0,
              _lX_*Math.cos(angle_lT_)-_lW_*Math.sin(angle_lT_)+a_lR_,
              _lX_*Math.sin(angle_lT_)+_lW_*Math.cos(angle_lT_)+b_lQ_];}
    function _m__(param_lZ_,_lY_)
     {var _l1_=c_l0_*Math.atan2(param_lZ_[2]-_lY_[2],_lY_[1]-param_lZ_[1]);
      return _l1_<0?360+_l1_:_l1_;}
    /*<<23905: src/draw.ml 52 14 32>>*/function _mH_(x_l2_)
     {return Math.cos(to_radians_lM_(x_l2_));}
    /*<<23898: src/draw.ml 54 14 32>>*/function _mF_(x_l3_)
     {return Math.sin(to_radians_lM_(x_l3_));}
    /*<<23769: src/draw.ml 70 15 56>>*/function _na_(param_l4_)
     {switch(param_l4_[0])
       {case 1:return _d4_(_ik_,_ao_,param_l4_[1],param_l4_[2]);
        case 2:return _d4_(_ik_,_an_,param_l4_[1],param_l4_[2]);
        case 3:
         var match_l5_=param_l4_[2];
         return _l6_(_ik_,_am_,param_l4_[1],match_l5_[1],match_l5_[2]);
        case 4:return _ex_(_ik_,_al_,param_l4_[1]);
        case 5:return _ex_(_ik_,_ak_,param_l4_[1]);
        default:
         return _l7_
                 (_ik_,
                  _ap_,
                  param_l4_[1],
                  param_l4_[2],
                  param_l4_[3],
                  param_l4_[4],
                  param_l4_[5],
                  param_l4_[6]);}}
    /*<<23724: src/draw.ml 121 15 21>>*/function _m$_(c_l8_)
     {return [0,c_l8_];}
    function _nb_(name_l__,value_l9_){return [3,name_l__,value_l9_];}
    function _nc_(_opt__l$_,_mb_,color_md_,width_me_)
     {var
       cap_ma_=_opt__l$_?_opt__l$_[1]:737755699,
       join_mc_=_mb_?_mb_[1]:463106021;
      return [1,[0,cap_ma_,join_mc_,width_me_,color_md_]];}
    /*<<23552: src/draw.ml 131 4 60>>*/function _m5_(param_mf_)
     {switch(param_mf_[0])
       {case 1:
         var
          match_mg_=param_mf_[1],
          join_mh_=match_mg_[2],
          cap_mi_=match_mg_[1],
          color_ml_=match_mg_[4],
          width_mk_=match_mg_[3],
          _mj_=9660462===join_mh_?_at_:463106021<=join_mh_?_av_:_au_,
          _mn_=_cm_(_aD_,_mj_),
          _mm_=226915517===cap_mi_?_aq_:737755699<=cap_mi_?_as_:_ar_,
          _mo_=_cm_(_aC_,_mm_),
          _mp_=_cm_(_aB_,string_of_int_co_(width_mk_));
         return _iS_(_az_,[0,_cm_(_aA_,_lE_(color_ml_)),_mp_,_mo_,_mn_]);
        case 2:
         return _cm_(_ax_,_iS_(_ay_,_iN_(param_mf_[1],string_of_float_i3_)));
        case 3:return _d4_(_ik_,_aw_,param_mf_[1],param_mf_[2]);
        default:return _cm_(_aE_,_lE_(param_mf_[1]));}}
    /*<<23547: src/draw.ml 154 18 27>>*/function _nd_(x_mq_)
     {return [0,x_mq_];}
    /*<<23542: src/draw.ml 156 18 27>>*/function _ne_(x_mr_)
     {return [1,x_mr_];}
    /*<<23508: src/draw.ml 162 27 60>>*/function _mB_(param_ms_)
     {return -64519044<=param_ms_?0:1;}
    /*<<23368: src/draw.ml 166 15 57>>*/function _ng_(param_mt_)
     {switch(param_mt_[0])
       {case 1:
         var match_mu_=param_mt_[1];
         return _d4_(_ik_,_aI_,match_mu_[1],match_mu_[2]);
        case 2:
         var
          r_mv_=param_mt_[4],
          match_mw_=param_mt_[1],
          l_mA_=param_mt_[2],
          y_mz_=match_mw_[2],
          x_my_=match_mw_[1],
          _mx_=5594516<=param_mt_[3]?0:1;
         return _l7_(_ik_,_aH_,r_mv_,r_mv_,_mB_(l_mA_),_mx_,x_my_,y_mz_);
        case 3:
         var
          r_mC_=param_mt_[4],
          a1_mD_=param_mt_[1],
          a2_mE_=param_mt_[2],
          flag_mG_=_mB_(param_mt_[3]),
          _mI_=_mF_(a1_mD_)*r_mC_,
          match_mK_=_mJ_([0,-_mH_(a1_mD_)*r_mC_,_mI_],_aG_,a2_mE_-a1_mD_);
         return _ig_(_ik_,_aF_,r_mC_,r_mC_,flag_mG_,match_mK_[1],match_mK_[2]);
        default:
         var match_mL_=param_mt_[1];
         return _d4_(_ik_,_aJ_,match_mL_[1],match_mL_[2]);}}
    /*<<23344: src/draw.ml 186 4 51>>*/function _nf_(param_mN_)
     {return [0,
              /*<<23338: src/draw.ml 186 27 49>>*/function(param_mM_)
               {return _ki_;}];}
    function circle_nh_(name_mQ_,_opt__mO_,r_mS_,center_mR_)
     {var props_mP_=_opt__mO_?_opt__mO_[1]:[0];
      return [0,[0,name_mQ_],props_mP_,r_mS_,center_mR_];}
    function path_ni_(name_mV_,_opt__mT_,mask_mX_,anchor_mY_,segs_mW_)
     {var props_mU_=_opt__mT_?_opt__mT_[1]:[0];
      return [3,[0,name_mV_],props_mU_,anchor_mY_,mask_mX_,segs_mW_];}
    function text_nj_(name_m1_,_opt__mZ_,str_m2_,corner_m3_)
     {var props_m0_=_opt__mZ_?_opt__mZ_[1]:[0];
      return [5,[0,name_m1_],props_m0_,corner_m3_,str_m2_];}
    /*<<23064: src/draw.ml 275 18 29>>*/function pictures_nk_(ts_m4_)
     {return [7,ts_m4_];}
    /*<<23040: src/draw.ml 279 27 89>>*/function render_properties_nl_(ps_m6_)
     {return _iS_(_aL_,_iN_(ps_m6_,_m5_));}
    function sink_attrs_nm_(elt_m8_,ps_m9_)
     {return _i9_
              (_iN_
                (ps_m9_,
                 /*<<23004: src/draw.ml 282 20 70>>*/function(param_m7_)
                  {return _k4_(elt_m8_,param_m7_[1],param_m7_[2]);}),
               _kk_);}
    var render_nn_=[];
    /*<<22996: src/draw.ml 286 39 66>>*/function _np_(param_no_)
     {return string_of_float_i3_(param_no_[1]);}
    function x_beh_oH_(_nq_){return map_kn_(_nq_,_np_);}
    /*<<22983: src/draw.ml 287 39 66>>*/function _ns_(param_nr_)
     {return string_of_float_i3_(param_nr_[2]);}
    function y_beh_oF_(_nt_){return map_kn_(_nt_,_ns_);}
    /*<<22970: src/draw.ml 288 23 70>>*/function zip_props_nX_(ps_b_nu_)
     {var t__nv_=return_jS_(render_properties_nl_(_iN_(ps_b_nu_,peek_ke_)));
      _iO_
       (ps_b_nu_,
        /*<<19168: src/frp.ml 286 6 69>>*/function(t_nx_)
         {return add_listener_jW_
                  (t_nx_,
                   /*<<19152: src/frp.ml 286 31 68>>*/function(param_nw_)
                    {return trigger_jV_
                             (t__nv_,render_properties_nl_(_iN_(ps_b_nu_,peek_ke_)));});});
      return t__nv_;}
    function path_mask_oj_(elt_ny_,segs_nI_,mask_nK_,props_nR_)
     {/*<<22872: src/draw.ml 291 32 77>>*/function get_length_nA_(param_nz_)
       {return elt_ny_.getTotalLength();}
      var _nE_=get_length_nA_(0);
      function _nD_(param_nC_,x_nB_){return x_nB_;}
      function _nH_(_nF_){return _kr_(_nF_,_nE_,_nD_);}
      /*<<22856: src/draw.ml 293 62 75>>*/function _nJ_(param_nG_)
       {return get_length_nA_(0);}
      var path_length_nP_=_i9_(map_kl_(_kp_(segs_nI_),_nJ_),_nH_);
      if(mask_nK_)
       {var
         mask_nO_=mask_nK_[1],
         _nQ_=
          [0,
           zip_with_j5_
            (path_length_nP_,
             mask_nO_,
             function(l_nN_,param_nL_)
              {var a_nM_=param_nL_[1];
               return [2,[254,0,l_nN_*a_nM_,l_nN_*(param_nL_[2]-a_nM_),l_nN_]];})],
         l1_nS_=props_nR_.length-1;
        if(0===l1_nS_)
         {var
           l_nT_=_nQ_.length-1,
           _nU_=0===l_nT_?[0]:caml_array_sub(_nQ_,0,l_nT_),
           _nV_=_nU_;}
        else
         var
          _nV_=
           0===_nQ_.length-1
            ?caml_array_sub(props_nR_,0,l1_nS_)
            :caml_array_append(props_nR_,_nQ_);
        var props__nW_=_nV_;}
      else
       var props__nW_=props_nR_;
      return _k4_(elt_ny_,_aM_,zip_props_nX_(props__nW_));}
    function mk_name_sub_ob_(name_opt_nY_,elt_nZ_)
     {if(name_opt_nY_)
       {var
         x_n0_=name_opt_nY_[1],
         _n1_=wrap_kZ_(elt_nZ_),
         _n2_=_c7_(x_n0_[1],_n1_);}
      else
       var _n2_=_ki_;
      return _n2_;}
    caml_update_dummy
     (render_nn_,
      /*<<22051: src/draw.ml 312 18 81>>*/function(param_n3_)
       {switch(param_n3_[0])
         {case 1:
           var
            trans_n5_=param_n3_[2],
            match_n4_=_c7_(render_nn_,param_n3_[1]),
            elt_n6_=match_n4_[1],
            sub_n7_=match_n4_[2];
           return [0,
                   elt_n6_,
                   _ex_
                    (_kj_,_k4_(elt_n6_,_ba_,map_kn_(trans_n5_,_na_)),sub_n7_)];
          case 2:
           var
            pts_n8_=param_n3_[3],
            props_n__=param_n3_[2],
            name_n9_=param_n3_[1][1],
            _n$_=[0,_a__,_iS_(_a$_,_iN_(peek_ke_(pts_n8_),_ls_))],
            elt_oa_=
             _k7_
              (_a8_,
               [0,
                [0,_a9_,render_properties_nl_(_iN_(props_n__,peek_ke_))],
                _n$_]),
            _oc_=mk_name_sub_ob_(name_n9_,elt_oa_);
           return [0,
                   elt_oa_,
                   _c7_(_kk_,[0,_k4_(elt_oa_,_a7_,map_kn_(pts_n8_,_lD_)),_oc_])];
          case 3:
           var
            segs_od_=param_n3_[5],
            mask_oi_=param_n3_[4],
            anchor_oh_=param_n3_[3],
            props_og_=param_n3_[2],
            name_of_=param_n3_[1][1],
            elt_oe_=_k7_(_a6_,[0]),
            _ok_=mk_name_sub_ob_(name_of_,elt_oe_),
            _op_=path_mask_oj_(elt_oe_,segs_od_,mask_oi_,props_og_);
           return [0,
                   elt_oe_,
                   _c7_
                    (_kk_,
                     [0,
                      _k4_
                       (elt_oe_,
                        _a5_,
                        zip_with_j5_
                         (anchor_oh_,
                          segs_od_,
                          function(param_ol_,sgs_om_)
                           {var y_oo_=param_ol_[2],x_on_=param_ol_[1];
                            return _l6_
                                    (_ik_,_bg_,x_on_,y_oo_,_iS_(_aK_,_iN_(sgs_om_,_ng_)));})),
                      _op_,
                      _ok_])];
          case 4:
           var
            path_strb_oq_=param_n3_[4],
            mask_ou_=param_n3_[3],
            props_ot_=param_n3_[2],
            name_os_=param_n3_[1][1],
            elt_or_=_k7_(_a4_,[0]),
            _ov_=mk_name_sub_ob_(name_os_,elt_or_),
            _ow_=path_mask_oj_(elt_or_,path_strb_oq_,mask_ou_,props_ot_);
           return [0,
                   elt_or_,
                   _c7_(_kk_,[0,_k4_(elt_or_,_a3_,path_strb_oq_),_ow_,_ov_])];
          case 5:
           var
            text_ox_=param_n3_[4],
            corner_oy_=param_n3_[3],
            ps_oB_=param_n3_[2],
            name_oA_=param_n3_[1][1],
            elt_oz_=_k7_(_a2_,[0]),
            name_sub_oC_=mk_name_sub_ob_(name_oA_,elt_oz_);
           _k5_(elt_oz_,peek_ke_(text_ox_));
           var
            _oD_=_c7_(_k5_,elt_oz_),
            _oE_=iter_jy_(_kp_(text_ox_),_oD_),
            _oG_=[0,_a1_,zip_props_nX_(ps_oB_)],
            _oI_=[0,_a0_,y_beh_oF_(corner_oy_)];
           return [0,
                   elt_oz_,
                   _c7_
                    (_kk_,
                     [0,
                      name_sub_oC_,
                      _oE_,
                      sink_attrs_nm_
                       (elt_oz_,[0,[0,_aZ_,x_beh_oH_(corner_oy_)],_oI_,_oG_])])];
          case 6:
           var
            hb_oJ_=param_n3_[5],
            wb_oK_=param_n3_[4],
            corner_oL_=param_n3_[3],
            ps_oN_=param_n3_[2],
            match_oM_=peek_ke_(corner_oL_),
            y_oP_=match_oM_[2],
            x_oO_=match_oM_[1],
            _oQ_=[0,_aY_,render_properties_nl_(_iN_(ps_oN_,peek_ke_))],
            _oR_=[0,_aX_,string_of_float_i3_(peek_ke_(hb_oJ_))],
            _oS_=[0,_aW_,string_of_float_i3_(peek_ke_(wb_oK_))],
            _oT_=[0,_aV_,string_of_float_i3_(y_oP_)],
            elt_oU_=
             _k7_
              (_aT_,
               [0,[0,_aU_,string_of_float_i3_(x_oO_)],_oT_,_oS_,_oR_,_oQ_]),
            _oV_=[0,_aS_,map_kn_(hb_oJ_,string_of_float_i3_)],
            _oW_=[0,_aR_,map_kn_(wb_oK_,string_of_float_i3_)],
            _oX_=[0,_aQ_,y_beh_oF_(corner_oL_)];
           return [0,
                   elt_oU_,
                   sink_attrs_nm_
                    (elt_oU_,[0,[0,_aP_,x_beh_oH_(corner_oL_)],_oX_,_oW_,_oV_])];
          case 7:
           var elts_oY_=_iN_(param_n3_[1],render_nn_),elt_oZ_=_k7_(_aO_,[0]);
           _iO_
            (elts_oY_,
             /*<<22019: src/draw.ml 407 23 52>>*/function(param_o0_)
              {return _k6_(elt_oZ_,param_o0_[1]);});
           return [0,
                   elt_oZ_,
                   _c7_(_kk_,_iN_(elts_oY_,function(_o1_){return _o1_[2];}))];
          case 8:
           var
            tb_o2_=param_n3_[1],
            container_o3_=_k7_(_aN_,[0]),
            match_o4_=_c7_(render_nn_,peek_ke_(tb_o2_)),
            sub_o5_=match_o4_[2];
           _k6_(container_o3_,match_o4_[1]);
           var
            last_sub_o6_=[0,sub_o5_],
            _o$_=
             /*<<21982: src/draw.ml 416 6 22>>*/function(t_o8_)
              {/*<<21982: src/draw.ml 416 6 22>>*/_ja_(last_sub_o6_[1]);
               /*<<21281: src/jq.ml 71 6 71>>*/for(;;)
                {if(1-(container_o3_.firstChild==null_im_?1:0))
                  {var _o7_=container_o3_.firstChild;
                   if(_o7_!=null_im_)
                    /*<<21236: src/jq.ml 71 44 70>>*/container_o3_.removeChild
                     (_o7_);
                   continue;}
                 var match_o9_=_c7_(render_nn_,t_o8_),sub_o__=match_o9_[2];
                 _k6_(container_o3_,match_o9_[1]);
                 last_sub_o6_[1]=sub_o__;
                 return 0;}},
            dyn_sub_pb_=iter_jy_(_kp_(tb_o2_),_o$_);
           return [0,
                   container_o3_,
                   _ex_
                    (_kj_,
                     dyn_sub_pb_,
                     _jl_
                      (/*<<21974: src/draw.ml 423 61 77>>*/function(param_pa_)
                        {return _ja_(last_sub_o6_[1]);}))];
          case 9:return [0,param_n3_[1],_ki_];
          default:
           var
            center_pc_=param_n3_[4],
            r_pg_=param_n3_[3],
            ps_pf_=param_n3_[2],
            name_pe_=param_n3_[1][1],
            elt_pd_=_k7_(_bf_,[0]),
            name_sub_ph_=mk_name_sub_ob_(name_pe_,elt_pd_),
            _pi_=[0,_be_,zip_props_nX_(ps_pf_)],
            _pj_=[0,_bd_,map_kn_(r_pg_,string_of_float_i3_)],
            _pk_=[0,_bc_,y_beh_oF_(center_pc_)];
           return [0,
                   elt_pd_,
                   _ex_
                    (_kj_,
                     name_sub_ph_,
                     sink_attrs_nm_
                      (elt_pd_,[0,[0,_bb_,x_beh_oH_(center_pc_)],_pk_,_pj_,_pi_]))];}});
    /*<<25080: src/animate.ml 26 21 46>>*/function stay_for_pq_(dur_pn_)
     {return [0,dur_pn_,function(x0_pl_,param_pm_){return x0_pl_;}];}
    var
     _pr_=[],
     stay_forever_pF_=[1,function(x0_po_,param_pp_){return x0_po_;}];
    function mk_f_pD_(dur1_pv_,f1_pt_,f2_pw_,x0_ps_)
     {var
       f1__pu_=_c7_(f1_pt_,x0_ps_),
       f2__py_=_c7_(f2_pw_,_c7_(f1__pu_,dur1_pv_));
      /*<<24983: src/animate.ml 44 17 61>>*/return function(t_px_)
       {return t_px_<=dur1_pv_
                ?_c7_(f1__pu_,t_px_)
                :_c7_(f2__py_,t_px_-dur1_pv_);};}
    caml_update_dummy
     (_pr_,
      /*<<24971: src/animate.ml 46 8 60>>*/function(param_pz_)
       {var f1_pA_=param_pz_[2],dur1_pB_=param_pz_[1];
        /*<<24938: src/animate.ml 47 4 60>>*/return function(t2_pC_)
         {{if(0===t2_pC_[0])
            {var dur2_pE_=t2_pC_[1];
             return [0,
                     dur1_pB_+dur2_pE_,
                     _d4_(mk_f_pD_,dur1_pB_,f1_pA_,t2_pC_[2])];}
           return [1,_d4_(mk_f_pD_,dur1_pB_,f1_pA_,t2_pC_[1])];}};});
    /*<<24761: src/animate.ml 52 65 38>>*/function _pU_(param_pG_)
     {var f_pQ_=param_pG_[1];
      /*<<24733: src/animate.ml 55 8 38>>*/return function(init_pP_)
       {function _pK_(param_pI_,t_pH_){return _i1_(t_pH_);}
        var t_pJ_=create_jt_(0),_pO_=0,_pN_=30,start_pL_=_iY_(0);
        /*<<19671: src/frp.ml 187 4 5>>*/_i8_
         (_pN_,
          /*<<19655: src/frp.ml 190 6 37>>*/function(param_pM_)
           {return trigger_jx_(t_pJ_,_i0_(_iY_(0),start_pL_));});
        var elapsed_pR_=_kr_(t_pJ_,_pO_,_pK_);
        return map_kn_(elapsed_pR_,_c7_(f_pQ_,init_pP_));};}
    function _rz_(init_pS_,t_pT_){return _ex_(_pU_,t_pT_,init_pS_);}
    function _rA_(label_qE_,container_qt_,param_qF_)
     {var
       inner_container_pV_=create_k0_(_Y_),
       slider_div_pW_=create_k0_(_X_),
       _pX_=create_k0_(_W_),
       slider_val_pY_=return_jS_(0),
       sliding_pZ_=return_jS_(0),
       rate__p2_=25/1e3;
      function _p3_(p_p0_,param_p1_){return 1-p_p0_;}
      var playing_p4_=_kr_(_ln_(_pX_),0,_p3_);
      function _p7_(_p5_){return 0;}
      var
       _p8_=
        map_kn_
         (playing_p4_,
          /*<<26136: src/widget.ml 13 8 83>>*/function(p_p6_)
           {return p_p6_?_R_:_Q_;});
      set_attr_k3_(_pX_,_f_,peek_ke_(_p8_));
      /*<<21476: src/jq.ml 42 4 27>>*/function _p__(value_p9_)
       {return set_attr_k3_(_pX_,_f_,value_p9_);}
      _i9_(iter_jy_(_kp_(_p8_),_p__),_p7_);
      /*<<26124: src/widget.ml 16 64 92>>*/function _qd_(chg_p$_)
       {return _i1_(chg_p$_)*rate__p2_;}
      var _qc_=30;
      function _qf_(t1_qa_,t2_qb_){return _i0_(t2_qb_,t1_qa_);}
      var t_qe_=create_jt_(0);
      /*<<19704: src/frp.ml 181 4 5>>*/_i8_
       (_qc_,
        /*<<19694: src/frp.ml 182 34 57>>*/function(param_qg_)
         {return trigger_jx_(t_qe_,_iY_(0));});
      var
       incrs_qk_=map_kl_(_km_(t_qe_,_qf_),_qd_),
       _qo_=
        _kq_
         (zip_with_j5_
           (playing_p4_,
            sliding_pZ_,
            function(p_qh_,s_qi_){var _qj_=p_qh_?1-s_qi_:p_qh_;return _qj_;}),
          incrs_qk_);
      function update_slider_val_qp_(e_qm_,ui_ql_)
       {return trigger_jV_(slider_val_pY_,ui_ql_[_Z_.toString()]/100);}
      function _qs_(_qn_){return 0;}
      _i9_
       (iter_jy_
         (_qo_,
          /*<<26026: src/widget.ml 22 8 78>>*/function(x_qq_)
           {var
             new_val_qr_=
              _ca_
               (slider_div_pW_.slider(_U_.toString(),_V_.toString())+x_qq_,
                100);
            /*<<26026: src/widget.ml 22 8 78>>*/trigger_jV_
             (slider_val_pY_,new_val_qr_/100);
            return slider_div_pW_.slider
                    (_S_.toString(),_T_.toString(),new_val_qr_);}),
        _qs_);
      append_k1_(inner_container_pV_,_pX_);
      append_k1_(inner_container_pV_,slider_div_pW_);
      append_k1_(container_qt_,inner_container_pV_);
      var
       _qw_=0.01,
       _qz_=
        caml_js_wrap_callback
         (function(param_qu_,_qv_){return trigger_jV_(sliding_pZ_,0);}),
       _qA_=
        caml_js_wrap_callback
         (function(param_qx_,_qy_){return trigger_jV_(sliding_pZ_,1);}),
       arg_obj_qC_=
        {"slide":caml_js_wrap_callback(update_slider_val_qp_),
         "start":
         caml_js_wrap_callback
          (function(param_qx_,_qy_){return trigger_jV_(sliding_pZ_,1);}),
         "stop":_qz_,
         "step":_qw_};
      function _qD_(_qB_){return 0;}
      _i9_(slider_div_pW_.slider(arg_obj_qC_),_qD_);
      return slider_val_pY_;}
    function incr_decr_rB_(_opt__qG_,_qI_,param_rc_,container_qP_,_rd_)
     {var
       bot_qH_=_opt__qG_?_opt__qG_[1]:min_int_cb_,
       top_qJ_=_qI_?_qI_[1]:max_int_cn_,
       buttons_p_qK_=create_k0_(_ac_),
       incr_button_qL_=create_k0_(_ab_),
       decr_button_qM_=create_k0_(_aa_),
       incr_icon_qN_=create_k0_(_$_),
       decr_icon_qO_=create_k0_(___);
      append_k1_(incr_button_qL_,incr_icon_qN_);
      append_k1_(decr_button_qM_,decr_icon_qO_);
      append_k1_(buttons_p_qK_,decr_button_qM_);
      append_k1_(buttons_p_qK_,incr_button_qL_);
      append_k1_(container_qP_,buttons_p_qK_);
      /*<<25561: src/widget.ml 95 7 35>>*/function _q4_(eta_qU_)
       {var
         _qQ_=0,
         eq_qR_=
          _qQ_?_qQ_[1]:function(_qT_,_qS_){return caml_equal(_qT_,_qS_);},
         t__qV_=return_jS_(eta_qU_[2]);
        add_listener_jW_
         (eta_qU_,
          /*<<19300: src/frp.ml 267 29 69>>*/function(x_qW_)
           {return _ex_(eq_qR_,x_qW_,t__qV_[2])?0:trigger_jV_(t__qV_,x_qW_);});
        return t__qV_;}
      function _q1_(n_qX_,i_qY_)
       {var
         _qZ_=_ca_(top_qJ_,n_qX_+i_qY_|0),
         _q0_=caml_greaterequal(bot_qH_,_qZ_)?bot_qH_:_qZ_;
        return _q0_;}
      function _q5_(_q2_){return _kr_(_q2_,bot_qH_,_q1_);}
      /*<<25534: src/widget.ml 93 24 26>>*/function _q6_(param_q3_)
       {return -1;}
      var _q8_=map_kl_(_ln_(decr_button_qM_),_q6_);
      /*<<25531: src/widget.ml 92 24 25>>*/function _q9_(param_q7_){return 1;}
      var _q$_=map_kl_(_ln_(incr_button_qL_),_q9_),t_q__=create_jt_(0);
      iter_jy_
       (_q$_,
        /*<<19826: src/frp.ml 151 33 44>>*/function(x_ra_)
         {return trigger_jx_(t_q__,x_ra_);});
      iter_jy_
       (_q8_,
        /*<<19821: src/frp.ml 152 33 44>>*/function(x_rb_)
         {return trigger_jx_(t_q__,x_rb_);});
      return _i9_(_i9_(t_q__,_q5_),_q4_);}
    function drag_point_rD_(init_ri_,param_rj_,canvas_rg_)
     {function _rh_(param_rf_,_re_)
       {return [0,param_rf_[1]+_re_[1]|0,param_rf_[2]+_re_[2]|0];}
      return _kr_(_lo_(canvas_rg_),init_ri_,_rh_);}
    function _rC_(param_rk_,w_rn_)
     {var
       canvas_rl_=param_rk_[2],
       container_rm_=param_rk_[1],
       f_ro_=param_rk_[3];
      return [0,
              container_rm_,
              canvas_rl_,
              _c7_(f_ro_,_ex_(w_rn_,container_rm_,canvas_rl_))];}
    function _rE_(width_rq_,height_rp_,container_rt_,f_ru_)
     {var
       _rr_=[0,_af_,string_of_int_co_(height_rp_)],
       canvas_rs_=
        _i9_
         (_k7_(_ad_,[0,[0,_ae_,string_of_int_co_(width_rq_)],_rr_,_ag_]),
          wrap_kZ_);
      append_k1_(container_rt_,canvas_rs_);
      return [0,container_rt_,canvas_rs_,f_ru_];}
    /*<<25288: src/widget.ml 139 8 5>>*/function _rF_(param_rv_)
     {var
       canvas_rx_=param_rv_[2],
       match_rw_=_c7_(render_nn_,param_rv_[3]),
       sub_ry_=match_rw_[2];
      /*<<25288: src/widget.ml 139 8 5>>*/append_k1_
       (canvas_rx_,wrap_kZ_(match_rw_[1]));
      return sub_ry_;}
    function range_rR_(start_rH_,stop_rG_)
     {if(stop_rG_<start_rH_)/*<<28334: src/rotsym.ml 4 23 47>>*/_p_(_v_);
      var n_rI_=(stop_rG_-start_rH_|0)+1|0;
      /*<<28321: src/rotsym.ml 6 28 37>>*/function _rK_(i_rJ_)
       {return i_rJ_+start_rH_|0;}
      if(0===n_rI_)
       var _rL_=[0];
      else
       {var res_rM_=caml_make_vect(n_rI_,_rK_(0)),_rN_=1,_rO_=n_rI_-1|0;
        if(!(_rO_<_rN_))
         {var i_rP_=_rN_;
          for(;;)
           {res_rM_[i_rP_+1]=_rK_(i_rP_);
            var _rQ_=i_rP_+1|0;
            if(_rO_!==i_rP_){var i_rP_=_rQ_;continue;}
            break;}}
        var _rL_=res_rM_;}
      return _rL_;}
    var
     nice_blue_rS_=_lC_(0,120,154,243,0),
     container_rT_=_iw_(jq_kY_(_C_)),
     _sT_=_d4_(incr_decr_rB_,_A_,_B_,0);
    /*<<27676: src/rotsym.ml 64 4 10>>*/_i9_
     (_rC_
       (_rE_
         (400,
          400,
          container_rT_,
          /*<<27661: src/rotsym.ml 67 6 8>>*/function(nb_sS_)
           {return [8,
                    map_kn_
                     (nb_sS_,
                      /*<<27625: src/rotsym.ml 68 8 36>>*/function(n_rU_)
                       {if(2===n_rU_)
                         {var _rV_=return_jS_(_E_);
                          return text_nj_(0,0,return_jS_(_D_),_rV_);}
                        var
                         _rW_=400,
                         _rX_=400,
                         radius_rY_=_ca_(_rX_,_rW_)/4,
                         center_rZ_=[0,_rX_/2,_rW_/2],
                         p0_r0_=[0,_rX_/2,_rW_/2-radius_rY_],
                         theta_r1_=360/n_rU_,
                         ngon_r__=
                          /*<<27904: src/rotsym.ml 20 6 59>>*/function(color_r4_)
                           {/*<<27880: src/rotsym.ml 22 10 69>>*/function _r3_(i_r2_)
                             {return _mJ_
                                      (center_rZ_,p0_r0_,i_r2_*of_degrees_lN_(theta_r1_));}
                            var
                             _r5_=return_jS_(_iN_(range_rR_(0,n_rU_-1|0),_r3_)),
                             _r6_=[0,return_jS_(_m$_(color_r4_))],
                             _r8_=0,
                             props_r7_=[0,_r6_]?_r6_:[0];
                            return [2,[0,_r8_],props_r7_,_r5_];},
                         _r$_=function(_r9_){return map_kn_(_r9_,of_degrees_lN_);},
                         _sw_=_c7_(_rz_,0),
                         _sx_=
                          /*<<27860: src/rotsym.ml 33 19 37>>*/function(x_sa_)
                           {return _ex_(_pr_,stay_for_pq_(500),x_sa_);},
                         _sy_=
                          function(_sc_)
                           {var
                             r_sb_=[0,stay_forever_pF_],
                             _sd_=_sc_.length-1-1|0,
                             _se_=0;
                            if(!(_sd_<_se_))
                             {var i_sf_=_sd_;
                              for(;;)
                               {r_sb_[1]=_ex_(_pr_,_sc_[i_sf_+1],r_sb_[1]);
                                var _sg_=i_sf_-1|0;
                                if(_se_!==i_sf_){var i_sf_=_sg_;continue;}
                                break;}}
                            return r_sb_[1];},
                         _sz_=
                          /*<<27826: src/rotsym.ml 31 21 86>>*/function(i_sh_)
                           {var _si_=i_sh_*theta_r1_,_sj_=1e3,_ss_=stay_for_pq_(500);
                            /*<<24794: src/animate.ml 79 6 74>>*/function f_sv_(x0_sk_)
                             {var
                               h_sl_=(_si_+x0_sk_)/2,
                               _sm_=_sj_/2,
                               b_sn_=(h_sl_-_si_)/_sm_,
                               c_sp_=(h_sl_-x0_sk_)/Math.pow(_sj_/2,2),
                               a_sr_=b_sn_/_sm_;
                              /*<<24769: src/animate.ml 82 15 74>>*/return function(t_so_)
                               {if(t_so_<=_sj_/2)return x0_sk_+c_sp_*Math.pow(t_so_,2);
                                var _sq_=t_so_-_sj_/2;
                                return h_sl_+a_sr_*Math.pow(_sq_,2)-2*b_sn_*_sq_;};}
                            return _ex_
                                    (_pr_,
                                     _ex_
                                      (_pr_,
                                       [0,_sj_,f_sv_],
                                       [0,0,function(param_st_,_su_){return _si_;}]),
                                     _ss_);},
                         angle_sA_=
                          _i9_
                           (_i9_
                             (_i9_(_i9_(_iN_(range_rR_(1,n_rU_),_sz_),_sy_),_sx_),_sw_),
                            _r$_),
                         rots_sG_=
                          map_kn_
                           (angle_sA_,
                            /*<<27812: src/rotsym.ml 38 51 93>>*/function(a_sB_)
                             {return to_degrees_lI_(a_sB_)/theta_r1_|0;}),
                         _sH_=
                          map_kn_
                           (angle_sA_,
                            /*<<27734: src/rotsym.ml 47 32 10>>*/function(a_sC_)
                             {var
                               a_sD_=_ca_(a_sC_,of_degrees_lN_(359.9999)),
                               flag_sE_=
                                caml_lessthan(a_sD_,of_degrees_lN_(180))
                                 ?-64519044
                                 :-944265860,
                               _sF_=of_degrees_lN_(90)+a_sD_;
                              return [0,
                                      [3,of_degrees_lN_(90),_sF_,flag_sE_,radius_rY_+40]];}),
                         _sI_=return_jS_([0,p0_r0_[1],p0_r0_[2]-40]),
                         _sJ_=return_jS_(_m$_(_lF_)),
                         arc_sK_=
                          path_ni_
                           (0,[0,[0,return_jS_(_nc_(0,0,_c_,4)),_sJ_]],0,_sI_,_sH_),
                         _sL_=return_jS_([0,_rX_-10,54]),
                         _sM_=map_kn_(rots_sG_,string_of_int_co_),
                         _sN_=return_jS_(_nb_(_y_,_z_)),
                         _sP_=
                          text_nj_(0,[0,[0,return_jS_(_nb_(_w_,_x_)),_sN_]],_sM_,_sL_),
                         _sQ_=
                          map_kn_
                           (angle_sA_,
                            /*<<27728: src/rotsym.ml 55 73 101>>*/function(a_sO_)
                             {return [3,a_sO_,center_rZ_];}),
                         _sR_=[1,ngon_r__(nice_blue_rS_),_sQ_];
                        return pictures_nk_
                                ([0,ngon_r__(_lC_(0,238,238,238,0)),_sR_,arc_sK_,_sP_]);})];}),
        _sT_),
      _rF_);
    var
     _sV_=_i_[2],
     _sU_=_i_[1],
     container_sX_=_iw_(jq_kY_(_F_)),
     h_sW_=match_h_[2],
     w_s7_=match_h_[1];
    /*<<27347: src/rotsym.ml 98 6 55>>*/function plane_anim_tg_(pt_s3_)
     {var
       _sY_=return_jS_(_m$_(_lF_)),
       props_sZ_=[0,return_jS_(_nc_(0,0,_lC_(0,170,170,170,0),2)),_sY_],
       _s4_=
        map_kn_
         (pt_s3_,
          /*<<27317: src/rotsym.ml 105 26 12>>*/function(param_s0_)
           {var x_s1_=param_s0_[1],_s2_=_nd_([0,x_s1_,h_sW_]);
            return [0,_ne_([0,x_s1_,0]),_s2_];}),
       x_tracker_s9_=path_ni_(0,[0,props_sZ_],0,return_jS_(_H_),_s4_),
       _s__=
        map_kn_
         (pt_s3_,
          /*<<27287: src/rotsym.ml 112 26 12>>*/function(param_s5_)
           {var y_s6_=param_s5_[2],_s8_=_nd_([0,w_s7_,y_s6_]);
            return [0,_ne_([0,0,y_s6_]),_s8_];}),
       y_tracker_ta_=path_ni_(0,[0,props_sZ_],0,return_jS_(_G_),_s__),
       _tb_=map_kn_(pt_s3_,_c7_(_ix_,function(_s$_){return _s$_;})),
       _tc_=return_jS_(5),
       circ_td_=circle_nh_(0,[0,[0,return_jS_(_m$_(_c_))]],_tc_,_tb_),
       _tf_=return_jS_([0,10,h_sW_-40]);
      return pictures_nk_
              ([0,
                x_tracker_s9_,
                y_tracker_ta_,
                text_nj_
                 (0,
                  0,
                  map_kn_
                   (pt_s3_,
                    /*<<27266: src/rotsym.ml 122 29 76>>*/function(param_te_)
                     {return _d4_(_ik_,_I_,param_te_[1],400-param_te_[2]|0);}),
                  _tf_),
                circ_td_]);}
    var _th_=_c7_(drag_point_rD_,[0,_sU_,_sV_]);
    /*<<27566: src/rotsym.ml 94 4 10>>*/_i9_
     (_rC_(_rE_(400,400,container_sX_,plane_anim_tg_),_th_),_rF_);
    _k7_(_q_,[0,_r_,_s_,_t_,_u_]);
    var
     h_ti_=match_j_[2],
     w_tj_=match_j_[1],
     center_tk_=[0,w_tj_/2,h_ti_/2],
     container_tl_=_iw_(jq_kY_(_N_)),
     cy_tn_=center_tk_[2],
     cx_tm_=center_tk_[1],
     radius_to_=_ca_(w_tj_,h_ti_)/3;
    /*<<26714: src/rotsym.ml 178 22 66>>*/function pt_angle_tE_(pt_tp_)
     {return map_kn_(pt_tp_,_c7_(_m__,center_tk_));}
    /*<<26701: src/rotsym.ml 180 6 67>>*/function clamp_to_circle_tF_
     (angle_ts_)
     {return map_kn_
              (angle_ts_,
               /*<<26673: src/rotsym.ml 181 9 65>>*/function(a_tq_)
                {var _tr_=cy_tn_-radius_to_*_mF_(a_tq_);
                 return [0,cx_tm_+radius_to_*_mH_(a_tq_),_tr_];});}
    function drag_point_tG_(init_tD_,name_tx_)
     {function _tw_(param_tu_,_tt_)
       {return [0,param_tu_[1]+_tt_[1],param_tu_[2]+_tt_[2]];}
      var s_tv_=create_jt_(0),curr_tB_=name_tx_[1];
      name_tx_[1]=
      /*<<23312: src/draw.ml 190 29 66>>*/function(e_ty_)
       {var
         _tA_=_lo_(e_ty_),
         _tC_=
          iter_jy_
           (_tA_,
            /*<<23289: src/draw.ml 193 36 48>>*/function(x_tz_)
             {return trigger_jx_(s_tv_,x_tz_);});
        return _ex_(_kj_,_c7_(curr_tB_,e_ty_),_tC_);};
      return _kr_(s_tv_,init_tD_,_tw_);}
    var
     _tH_=return_jS_(center_tk_),
     _tI_=return_jS_(radius_to_),
     _tJ_=return_jS_(_nc_(0,0,_c_,2)),
     circ_tL_=circle_nh_(0,[0,[0,return_jS_(_m$_(_lF_)),_tJ_]],_tI_,_tH_),
     _tK_=_nf_(0),
     _tM_=_nf_(0),
     pt_2_init_tN_=match_g_[2],
     pt_1_angle_tO_=pt_angle_tE_(drag_point_tG_(match_g_[1],_tM_)),
     pt_2_angle_tP_=pt_angle_tE_(drag_point_tG_(pt_2_init_tN_,_tK_)),
     pt_1_tQ_=clamp_to_circle_tF_(pt_1_angle_tO_),
     pt_2_tR_=clamp_to_circle_tF_(pt_2_angle_tP_),
     arc_t3_=
      ap_ko_
       (ap_ko_
         (ap_ko_
           (map_kn_
             (pt_1_tQ_,
              function(p1_t1_,p2_t0_,a1_tU_,a2_tS_)
               {var
                 _tT_=to_degrees_lI_(a2_tS_),
                 _tV_=to_degrees_lI_(a1_tU_),
                 _tW_=
                  _tT_<_tV_
                   ?Math.abs(_tV_-(360+_tT_))<Math.abs(_tV_-_tT_)?1:0
                   :0;
                if(_tW_)
                 var _tX_=0;
                else
                 {if(_tV_<_tT_&&Math.abs(_tV_-_tT_)<Math.abs(_tV_-(_tT_-360)))
                   {var _tX_=0,_tY_=0;}
                  else
                   var _tY_=1;
                  if(_tY_){var sweep_tZ_=5492816,_tX_=1;}}
                if(!_tX_)var sweep_tZ_=5594516;
                var _t2_=_nd_(center_tk_);
                return [0,
                        _nd_(p1_t1_),
                        [2,p2_t0_,-64519044,sweep_tZ_,radius_to_],
                        _t2_];}),
            pt_2_tR_),
          pt_1_angle_tO_),
        pt_2_angle_tP_),
     _t4_=return_jS_(10),
     pt_1_circ_t5_=
      circle_nh_([0,_tM_],[0,[0,return_jS_(_m$_(_e_))]],_t4_,pt_1_tQ_),
     pt_2_circ_t6_=circle_nh_([0,_tK_],0,return_jS_(10),pt_2_tR_),
     _t$_=return_jS_(_M_),
     label_ua_=
      text_nj_
       (0,
        0,
        zip_with_j5_
         (pt_1_angle_tO_,
          pt_2_angle_tP_,
          function(a1_t9_,a2_t7_)
           {var _t8_=to_degrees_lI_(a2_t7_),_t__=to_degrees_lI_(a1_t9_);
            return _ex_
                    (_ik_,_O_,_ca_(Math.abs(_t__-_t8_),360-Math.abs(_t__-_t8_)));}),
        _t$_),
     _ub_=return_jS_(center_tk_);
    _i9_
     (_rE_
       (400,
        400,
        container_tl_,
        pictures_nk_
         ([0,
           circ_tL_,
           label_ua_,
           path_ni_(0,[0,[0,return_jS_(_m$_(nice_blue_rS_))]],0,_ub_,arc_t3_),
           pt_1_circ_t5_,
           pt_2_circ_t6_])),
      _rF_);
    var
     _uc_=_k_[1],
     _ud_=_k_[2],
     container_ue_=_iw_(jq_kY_(_P_)),
     _uf_=return_jS_([0,_uc_/2,_ud_/2]),
     _ug_=return_jS_(_uc_/3);
    /*<<26361: src/rotsym.ml 254 4 10>>*/_i9_
     (_rE_
       (400,
        400,
        container_ue_,
        circle_nh_(0,[0,[0,return_jS_(_nc_(0,0,_c_,2))]],_ug_,_uf_)),
      _rF_);
    var container_up_=_iw_(jq_kY_(_K_));
    /*<<27133: src/rotsym.ml 149 6 206>>*/function path_anim_uq_
     (slider_val_uj_)
     {var
       _ui_=return_jS_(_L_),
       _uk_=
        [0,
         map_kn_
          (slider_val_uj_,
           /*<<27122: src/rotsym.ml 154 44 55>>*/function(x_uh_)
            {return [0,0,Math.pow(x_uh_,2)];})],
       _ul_=return_jS_(_nc_(0,0,_c_,4)),
       _um_=[0,return_jS_(_m$_([0,_d_[1],_d_[2],_d_[3],0])),_ul_],
       _uo_=0,
       props_un_=[0,_um_]?_um_:[0];
      return [4,[0,_uo_],props_un_,_uk_,_ui_];}
    var _ur_=_c7_(_rA_,_J_);
    /*<<27217: src/rotsym.ml 145 4 10>>*/_i9_
     (_rC_(_rE_(400,400,container_up_,path_anim_uq_),_ur_),_rF_);
    do_at_exit_cp_(0);
    return;}
  ());
