var ecrypt = (function () {
	var hash = (function () {
		var hex_chr = "0123456789abcdef";
		function rhex(num) {
			var str = "";
			for(var j = 0; j <= 3; j++)
				str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) + hex_chr.charAt((num >> (j * 8)) & 0x0F);
			return str;
		}

		function str2blks_MD5(str) {
			var nblk = ((str.length + 8) >> 6) + 1;
			var blks = new Array(nblk * 16);
			for(var i = 0; i < nblk * 16; i++) blks[i] = 0;
			for(var i = 0; i < str.length; i++)
				blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
			blks[i >> 2] |= 0x80 << ((i % 4) * 8);
			blks[nblk * 16 - 2] = str.length * 8;
			return blks;
		}

		function add(x, y) {
			var lsw = (x & 0xFFFF) + (y & 0xFFFF);
			var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
			return (msw << 16) | (lsw & 0xFFFF);
		}

		function rol(num, cnt) {
			return (num << cnt) | (num >>> (32 - cnt));
		}

		function cmn(q, a, b, x, s, t) {
			return add(rol(add(add(a, q), add(x, t)), s), b);
		}

		function ff(a, b, c, d, x, s, t) {
			return cmn((b & c) | ((~b) & d), a, b, x, s, t);
		}

		function gg(a, b, c, d, x, s, t) {
			return cmn((b & d) | (c & (~d)), a, b, x, s, t);
		}

		function hh(a, b, c, d, x, s, t) {
			return cmn(b ^ c ^ d, a, b, x, s, t);
		}

		function ii(a, b, c, d, x, s, t) {
			return cmn(c ^ (b | (~d)), a, b, x, s, t);
		}

		function calcMD5(str) {
			var x = str2blks_MD5(str);
			var a =  1732584193;
			var b = -271733879;
			var c = -1732584194;
			var d =  271733878;

			for(var i = 0; i < x.length; i += 16) {
				var olda = a;
				var oldb = b;
				var oldc = c;
				var oldd = d;

				a = ff(a, b, c, d, x[i+ 0], 7 , -680876936);
				d = ff(d, a, b, c, x[i+ 1], 12, -389564586);
				c = ff(c, d, a, b, x[i+ 2], 17,  606105819);
				b = ff(b, c, d, a, x[i+ 3], 22, -1044525330);
				a = ff(a, b, c, d, x[i+ 4], 7 , -176418897);
				d = ff(d, a, b, c, x[i+ 5], 12,  1200080426);
				c = ff(c, d, a, b, x[i+ 6], 17, -1473231341);
				b = ff(b, c, d, a, x[i+ 7], 22, -45705983);
				a = ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
				d = ff(d, a, b, c, x[i+ 9], 12, -1958414417);
				c = ff(c, d, a, b, x[i+10], 17, -42063);
				b = ff(b, c, d, a, x[i+11], 22, -1990404162);
				a = ff(a, b, c, d, x[i+12], 7 ,  1804603682);
				d = ff(d, a, b, c, x[i+13], 12, -40341101);
				c = ff(c, d, a, b, x[i+14], 17, -1502002290);
				b = ff(b, c, d, a, x[i+15], 22,  1236535329);

				a = gg(a, b, c, d, x[i+ 1], 5 , -165796510);
				d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
				c = gg(c, d, a, b, x[i+11], 14,  643717713);
				b = gg(b, c, d, a, x[i+ 0], 20, -373897302);
				a = gg(a, b, c, d, x[i+ 5], 5 , -701558691);
				d = gg(d, a, b, c, x[i+10], 9 ,  38016083);
				c = gg(c, d, a, b, x[i+15], 14, -660478335);
				b = gg(b, c, d, a, x[i+ 4], 20, -405537848);
				a = gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
				d = gg(d, a, b, c, x[i+14], 9 , -1019803690);
				c = gg(c, d, a, b, x[i+ 3], 14, -187363961);
				b = gg(b, c, d, a, x[i+ 8], 20,  1163531501);
				a = gg(a, b, c, d, x[i+13], 5 , -1444681467);
				d = gg(d, a, b, c, x[i+ 2], 9 , -51403784);
				c = gg(c, d, a, b, x[i+ 7], 14,  1735328473);
				b = gg(b, c, d, a, x[i+12], 20, -1926607734);

				a = hh(a, b, c, d, x[i+ 5], 4 , -378558);
				d = hh(d, a, b, c, x[i+ 8], 11, -2022574463);
				c = hh(c, d, a, b, x[i+11], 16,  1839030562);
				b = hh(b, c, d, a, x[i+14], 23, -35309556);
				a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
				d = hh(d, a, b, c, x[i+ 4], 11,  1272893353);
				c = hh(c, d, a, b, x[i+ 7], 16, -155497632);
				b = hh(b, c, d, a, x[i+10], 23, -1094730640);
				a = hh(a, b, c, d, x[i+13], 4 ,  681279174);
				d = hh(d, a, b, c, x[i+ 0], 11, -358537222);
				c = hh(c, d, a, b, x[i+ 3], 16, -722521979);
				b = hh(b, c, d, a, x[i+ 6], 23,  76029189);
				a = hh(a, b, c, d, x[i+ 9], 4 , -640364487);
				d = hh(d, a, b, c, x[i+12], 11, -421815835);
				c = hh(c, d, a, b, x[i+15], 16,  530742520);
				b = hh(b, c, d, a, x[i+ 2], 23, -995338651);

				a = ii(a, b, c, d, x[i+ 0], 6 , -198630844);
				d = ii(d, a, b, c, x[i+ 7], 10,  1126891415);
				c = ii(c, d, a, b, x[i+14], 15, -1416354905);
				b = ii(b, c, d, a, x[i+ 5], 21, -57434055);
				a = ii(a, b, c, d, x[i+12], 6 ,  1700485571);
				d = ii(d, a, b, c, x[i+ 3], 10, -1894986606);
				c = ii(c, d, a, b, x[i+10], 15, -1051523);
				b = ii(b, c, d, a, x[i+ 1], 21, -2054922799);
				a = ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
				d = ii(d, a, b, c, x[i+15], 10, -30611744);
				c = ii(c, d, a, b, x[i+ 6], 15, -1560198380);
				b = ii(b, c, d, a, x[i+13], 21,  1309151649);
				a = ii(a, b, c, d, x[i+ 4], 6 , -145523070);
				d = ii(d, a, b, c, x[i+11], 10, -1120210379);
				c = ii(c, d, a, b, x[i+ 2], 15,  718787259);
				b = ii(b, c, d, a, x[i+ 9], 21, -343485551);

				a = add(a, olda);
				b = add(b, oldb);
				c = add(c, oldc);
				d = add(d, oldd);
			}
			return rhex(a) + rhex(b) + rhex(c) + rhex(d);
		}

		return calcMD5;
	} ());

	var Base64 = (function() {
	    "use strict";

	    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	    var _utf8_encode = function (string) {

	        var utftext = "", c, n;

	        string = string.replace(/\r\n/g,"\n");

	        for (n = 0; n < string.length; n++) {

	            c = string.charCodeAt(n);

	            if (c < 128) {

	                utftext += String.fromCharCode(c);

	            } else if((c > 127) && (c < 2048)) {

	                utftext += String.fromCharCode((c >> 6) | 192);
	                utftext += String.fromCharCode((c & 63) | 128);

	            } else {

	                utftext += String.fromCharCode((c >> 12) | 224);
	                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
	                utftext += String.fromCharCode((c & 63) | 128);

	            }

	        }

	        return utftext;
	    };

	    var _utf8_decode = function (utftext) {
	        var string = "", i = 0, c = 0, c1 = 0, c2 = 0;

	        while ( i < utftext.length ) {

	            c = utftext.charCodeAt(i);

	            if (c < 128) {

	                string += String.fromCharCode(c);
	                i++;

	            } else if((c > 191) && (c < 224)) {

	                c1 = utftext.charCodeAt(i+1);
	                string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
	                i += 2;

	            } else {

	                c1 = utftext.charCodeAt(i+1);
	                c2 = utftext.charCodeAt(i+2);
	                string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
	                i += 3;

	            }

	        }

	        return string;
	    };

	    var _hexEncode = function(input) {
	        var output = '', i;

	        for(i = 0; i < input.length; i++) {
	            output += input.charCodeAt(i).toString(16);
	        }

	        return output;
	    };

	    var _hexDecode = function(input) {
	        var output = '', i;

	        if(input.length % 2 > 0) {
	            input = '0' + input;
	        }

	        for(i = 0; i < input.length; i = i + 2) {
	            output += String.fromCharCode(parseInt(input.charAt(i) + input.charAt(i + 1), 16));
	        }

	        return output;
	    };

	    var encode = function (input) {
	        var output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;

	        input = _utf8_encode(input);

	        while (i < input.length) {

	            chr1 = input.charCodeAt(i++);
	            chr2 = input.charCodeAt(i++);
	            chr3 = input.charCodeAt(i++);

	            enc1 = chr1 >> 2;
	            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
	            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
	            enc4 = chr3 & 63;

	            if (isNaN(chr2)) {
	                enc3 = enc4 = 64;
	            } else if (isNaN(chr3)) {
	                enc4 = 64;
	            }

	            output += _keyStr.charAt(enc1);
	            output += _keyStr.charAt(enc2);
	            output += _keyStr.charAt(enc3);
	            output += _keyStr.charAt(enc4);

	        }

	        return output;
	    };

	    var decode = function (input) {
	        var output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;

	        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

	        while (i < input.length) {

	            enc1 = _keyStr.indexOf(input.charAt(i++));
	            enc2 = _keyStr.indexOf(input.charAt(i++));
	            enc3 = _keyStr.indexOf(input.charAt(i++));
	            enc4 = _keyStr.indexOf(input.charAt(i++));

	            chr1 = (enc1 << 2) | (enc2 >> 4);
	            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
	            chr3 = ((enc3 & 3) << 6) | enc4;

	            output += String.fromCharCode(chr1);

	            if (enc3 !== 64) {
	                output += String.fromCharCode(chr2);
	            }
	            if (enc4 !== 64) {
	                output += String.fromCharCode(chr3);
	            }

	        }

	        return _utf8_decode(output);
	    };

	    var decodeToHex = function(input) {
	        return _hexEncode(decode(input));
	    };

	    var encodeFromHex = function(input) {
	        return encode(_hexDecode(input));
	    };

	    return {
	        'encode': encode,
	        'decode': decode,
	        'decodeToHex': decodeToHex,
	        'encodeFromHex': encodeFromHex
	    };
	}());

	var validPacket = function (packet) {
		if (packet.length <= 32)
			return false;

		

		// payload is in base64 format
		return 0;
	}

	var base64_encode, base64_decode;

	if (typeof btoa == 'function') {
		base64_encode = btoa;
	} else {
		base64_encode = Base64.encode;
	}

	if (typeof atob == 'function') {
		base64_decode = atob;
	} else {
		base64_decode = Base64.decode;
	}

	var encrypt = function (data) {
		var length = data.length;
		var encrypted_str = "";
		if (length > 65535)
			return false;
		data = data.split("");
		data.forEach(function (ch) {
			var c = ch.charCodeAt(0) ^ length;
			encrypted_str += String.fromCharCode(c);
		});
		var str = String.fromCharCode(length) + encrypted_str;
		str = encodeURIComponent(str);
		encrypted_str = base64_encode(str);
		return hash(encrypted_str) + encrypted_str;
	}

	var decrypt = function (packet) {
		var payload = validPacket(packet);
		if (!payload)
			return false;
		// base64 decode
		payload = base64_decode(payload);
		payload = decodeURIComponent(payload);
		// first character is the length of the actual data string
		var length = payload.charCodeAt(0);
		var encrypted_data = payload.substring(1);
		if (encrypted_data.length != length)
			return false;
		var data = "";
		encrypted_data = encrypted_data.split("");
		encrypted_data.forEach(function (ch) {
			var c = ch.charCodeAt(0) ^ length;
			data += String.fromCharCode(c);
		});
		return data;
	}

	return {
		encrypt: encrypt,
		decrypt: decrypt,
		b64encode: Base64.encode,
		b64decode: Base64.decode
	}
} ());

if (typeof module != 'undefined' && module.exports) {
	module.exports = ecrypt;
}