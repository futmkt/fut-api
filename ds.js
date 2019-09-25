var myArgs = process.argv.slice(2);

console.log(generateDS(myArgs[0], myArgs[1], myArgs[2]))

function generateDS(auth_code, sku, auth_token)
{
    const utils = {};
    const NamesWin = {};

    utils.JS = {
        isNumber(number) {
            return typeof number === "number" && isFinite(number);
        },
        isFunction(func) {
            return Object.prototype.toString.call(func) === '[object Function]';
        }
    };

    utils.eval = function () {
        function _0x28bccf() {}
        var _0x2a60a3 = NamesWin;
        var hasher;
        var CryptoJS = function (_0x585513, _0x1bf18a) {
            var Encrypter = {};
            var Lib = Encrypter['lib'] = {};
            var Algo = Encrypter['algo'] = {};
            var Base = Lib['Base'] = function () {
                return {
                    extend: function (overrides) {
                        var subtype = Object.create(this);

                        if (overrides) {
                            subtype.mixIn(overrides);
                        }

                        if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
                            subtype.init = function () {
                                subtype.$super.init.apply(this, arguments);
                            };
                        }

                        subtype.init.prototype = subtype;

                        subtype.$super = this;

                        return subtype;
                    },
                    create: function () {
                        var instance = this.extend();
                        instance.init.apply(instance, arguments);
                        return instance;
                    },
                    init: function () {},
                    mixIn: function (properties) {
                        for (var propertyName in properties) {
                            if (properties.hasOwnProperty(propertyName)) {
                                this[propertyName] = properties[propertyName];
                            }
                        }

                        if (properties.hasOwnProperty('toString')) {
                            this.toString = properties.toString;
                        }
                    },
                    clone: function () {
                        return this.init.prototype.extend(this);
                    }
                };
            }();

            var Encoder = Encrypter['enc'] = {}; // Out of place in CryptoJS
            var HexEncoder = Encoder['Hex'] = {}; // Out of place in CryptoJS

            var WordArray = Lib['WordArray'] = Base.extend({
                init: function (words, sigBytes) {
                    words = this['words'] = words || [];
                    if (sigBytes !== undefined) {
                        this.sigBytes = sigBytes;
                    } else {
                        this.sigBytes = words.length * 4; // CryptoJS has plus 4 instead of times 4
                    }
                },
                toString: function (encoder) {
                    return (encoder || HexEncoder).stringify(this);
                },
                concat: function (wordArray) {

                    var thisWords = this.words;
                    var thatWords = wordArray.words;
                    var thisSigBytes = this.sigBytes;
                    var thatSigBytes = wordArray.sigBytes;

                    this.clamp();

                    if (thisSigBytes % 4) {
                        for (var i = 0; i < thatSigBytes; i++) {
                            var thatByte = thatWords[i >>> 2] >>> 24 - i % 4 * 8 & 255;
                            thisWords[thisSigBytes + i >>> 2] |= thatByte << 24 - (thisSigBytes + i) % 4 * 8;
                        }
                    } else {
                        for (i = 0; i < thatSigBytes; i += 4) {
                            thisWords[thisSigBytes + i >>> 2] = thatWords[i >>> 2];
                        }
                    }

                    this.sigBytes += thatSigBytes;

                    return this;
                },
                clamp: function () {
                    var words = this['words'];
                    var sigBytes = this['sigBytes'];
                    words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
                    words.length = Math.ceil(sigBytes / 4);
                },
                clone: function () {
                    var clone = Base.clone.call(this);
                    clone.words = this.words.slice(0);

                    return clone;
                },
                random: function (nBytes) {
                    var words = [];
                    var r = function (m_w) {
                        var m_w = m_w;
                        var m_z = 0x3ade68b1;
                        var mask = 0xffffffff;

                        return function () {
                            m_z = 0x9069 * (m_z & 0xffff) + (m_z >> 0x10) & mask;
                            m_w = 0x4650 * (m_w & 0xffff) + (m_w >> 0x10) & mask;
                            var result = (m_z << 0x10) + m_w & mask;
                            result /= 0x100000000;
                            result += 0.5;
                            return result * (Math.random() > 0.5 ? 1 : -1);
                        };
                    };

                    for (var i = 0x0, rcache; i < nBytes; i += 0x4) {
                        var _r = r((rcache || Math.random()) * 0x100000000);

                        rcache = _r() * 0x3ade67b7;
                        words.push(_r() * 0x100000000 | 0);
                    }

                    return new WordArray.init(words, nBytes);
                }
            });

            HexEncoder = Encoder.Hex = {
                stringify: function (wordArray) {
                    var words = wordArray.words;
                    var sigBytes = wordArray.sigBytes;

                    var hexChars = [];
                    for (var i = 0; i < sigBytes; i++) {
                        var bite = words[i >>> 0x2] >>> 0x18 - i % 0x4 * 0x8 & 0xff;
                        hexChars.push((bite >>> 0x4).toString(0x10));
                        hexChars.push((bite & 0xf).toString(0x10));
                    }

                    return hexChars.join('');
                }
            };

            var Latin1 = Encoder.Latin1 = {
                parse: function (latin1Str) {
                    var latin1StrLength = latin1Str.length;

                    var words = [];
                    for (var i = 0; i < latin1StrLength; i++) {
                        words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
                    }

                    return new WordArray.init(words, latin1StrLength);
                },

                init: function () {
                    this.initVector = new WordArray.init([0x8e8cf5e6, 0xc290dd43, 0x7873ec77, 0xbe5c4e17, 0x373cc267, 0xcbe95e6]);
                },

                toWord: function (_0xd7e96c, _0x4ca99c) { // Added by EA
                    for (var i = 0x0; i < _0xd7e96c.length; i++) {
                        _0xd7e96c[i] = this.initVector.words[i] + _0x4ca99c;
                    }
                }
            };

            var Utf8 = Encoder.Utf8 = {
                parse: function (utf8Str) {
                    return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
                }
            };

            var BufferedBlockAlgorithm = Lib.BufferedBlockAlgorithm = Base.extend({
                reset: function () {
                    this._data = new WordArray.init();
                    this._nDataBytes = 0;
                },
                _append: function (data) {
                    if (typeof data == 'string') {
                        data = Utf8.parse(data);
                    }
                    this._data.concat(data);
                    this._nDataBytes += data.sigBytes;
                },
                _process: function (doFlush) {
                    var processedWords;

                    var data = this._data;
                    var dataWords = data.words;
                    var dataSigBytes = data.sigBytes;
                    var blockSize = this.blockSize;
                    var blockSizeBytes = blockSize * 4;

                    var nBlocksReady = dataSigBytes / blockSizeBytes;
                    if (doFlush) {
                        nBlocksReady = Math.ceil(nBlocksReady);
                    } else {
                        nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
                    }

                    var nWordsReady = nBlocksReady * blockSize;
                    var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

                    if (nWordsReady) {

                        for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                            this._doProcessBlock(dataWords, offset);
                        }

                        processedWords = dataWords.splice(0, nWordsReady);
                        data.sigBytes -= nBytesReady;
                    }

                    return new WordArray.init(processedWords, nBytesReady);
                },
                clone: function () {
                    var clone = Base.clone.call(this);
                    clone._data = this._data.clone();

                    return clone;
                },

                _minBufferSize: 0
            });

            var Hasher = Lib.Hasher = BufferedBlockAlgorithm.extend({
                cfg: Base.extend(),
                init: function (cfg) {
                    this.cfg = this.cfg.extend(cfg);
                    this.reset();
                },
                reset: function () {
                    BufferedBlockAlgorithm.reset.call(this);
                    this._doReset();
                },
                update: function (messageUpdate) {
                    this._append(messageUpdate);
                    // hit
                    this._process();
                    return this;
                },
                finalize: function (messageUpdate) {
                    if (messageUpdate) {
                        this._append(messageUpdate);
                    }
                    var hash = this._doFinalize();
                    return hash;
                },

                blockSize: 512 / 32,

                _createHelper: function (hasher) {
                    return function (message, cfg) {
                        return new hasher.init(cfg).finalize(message);
                    };
                },
                _createSHelper: function (hasher) {
                    return function (message, key) {
                        return new Algo.HMAC.init(hasher, key).finalize(message);
                    };
                }
            });
            return Encrypter;
        }(Math);

        var _0x9ee4c0 = ['transform', 'pi', 'else', 'contract', 'Sub', 'goal', 'SHA256', '_hash', 'MD5', 'word', 'Junction', 'Forms'];

        (function i1a(_0x55a366) {
            var C = CryptoJS;
            var C_lib = C.lib;
            var WordArray = C_lib['WordArray'];
            var Hasher = C_lib['Hasher'];
            var C_algo = C.algo;

            var T = [];

            (function () {
                for (var i = 0; i < 64; i++) {
                    T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
                }
            }());

            var MD5 = C_algo['MD5'] = Hasher.extend({
                _doReset: function () {
                    this._hash = new WordArray.init([
                        0x67452301, 0xefcdab89,
                        0x98badcfe, 0x10325476
                    ]);
                },

                _init: function () {
                    this['initVector'] = new WordArray.init([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]);
                },
                _doHash: function (_0x3701dc, _0x45f247) {
                    for (var offset = 0x0; offset < _0x3701dc['length']; offset++) {
                        _0x3701dc[offset] = this['initVector']['words'][offset] + _0x45f247;
                    }
                },
                _doFinalize: function () {
                    var data = this._data;
                    var dataWords = data.words;

                    var nBitsTotal = this._nDataBytes * 8;
                    var nBitsLeft = data.sigBytes * 8;

                    dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

                    var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
                    var nBitsTotalL = nBitsTotal;

                    dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
                        (((nBitsTotalH << 8) | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
                        (((nBitsTotalH << 24) | (nBitsTotalH >>> 8)) & 0xff00ff00)
                    );
                    dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
                        (((nBitsTotalL << 8) | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
                        (((nBitsTotalL << 24) | (nBitsTotalL >>> 8)) & 0xff00ff00)
                    );

                    data.sigBytes = (dataWords.length + 1) * 4;

                    // Hash final blocks
                    this._process();

                    var hash = this._hash;
                    var H = hash.words;

                    for (var i = 0; i < 4; i++) {
                        var H_i = H[i];

                        H[i] = (((H_i << 8) | (H_i >>> 24)) & 0x00ff00ff) |
                            (((H_i << 24) | (H_i >>> 8)) & 0xff00ff00);
                    }
                    return hash;
                },
                clone: function () {
                    var clone = Hasher.clone.call(this);
                    clone._hash = this._hash.clone();
                    return clone;
                }
            });
            C['MD5'] = Hasher._createHelper(MD5);
        }(Math));

        (function i1zr() {
            var C = CryptoJS;
            var C_lib = C.lib;
            var Base = C_lib.Base;
            var C_algo = C.algo;
            var C_enc = C.enc;
            var CEncoder = C_algo.CEncoder = Base.extend({
                init: function (_0xa13148) {
                    var hash = [0x0, 0x0, 0x0, 0x0];
                    var word = [0x0, 0x0, 0x0, 0x0, 0x0, 0x0];

                    _0xa13148['rgn'] = _0xa13148['se'] * 0x41a7 % 0x7fffffff;
                    _0xa13148['se'] = _0xa13148['rgn'];
                    _0xa13148['rgn'] = _0xa13148['rgn'] * 0x3ea9 % 0xffff;

                    C_algo.MD5._init();
                    C_algo.MD5._doHash(hash, 0x6f067aa);
                    C_enc.Latin1.init();
                    C_enc.Latin1.toWord(word, 0xfc19dc6);

                    for (var _0x117498 = 0x0; _0x117498 < hash.length; _0x117498++) {
                        _0xa13148['key'] = _0xa13148['key'] + hash[_0x117498].toString(0x20);
                    }
                    for (_0x117498 = word.length; _0x117498 > 0x0; _0x117498--) {
                        _0xa13148['key'] = _0xa13148['key'] + word[_0x117498 - 0x1].toString(0x20);
                    }
                },
                final: function (message, _0x578fbe, _0x4d5d27) {
                    var _0x166b80 = [0x20880fbf, 0x348848fe, 0x8bab371f, 0xd35f73f1];

                    var _0x8634a = 0x1f << 0x16;
                    var _0x2ef355 = utils.JS.isFunction(_0x578fbe['abs']);
                    var _0x50bdc5 = (_0x578fbe['cp'] & _0x8634a) == _0x8634a;
                    for (_0x2b4eff = 0x0; _0x2b4eff < 0x4; _0x2b4eff++) {
                        _0x166b80[_0x2b4eff] = (_0x166b80[_0x2b4eff] << 0x8 | _0x166b80[_0x2b4eff] >>> 0x18) & 0xff00ff | (_0x166b80[_0x2b4eff] << 0x18 | _0x166b80[_0x2b4eff] >>> 0x8) & 0xff00ff00;
                    }
                    if (_0x50bdc5 && _0x2ef355) {
                        _0x4d5d27['result'] = _0x578fbe.abs(_0x4d5d27['key'], message, 0x96 + 0x50 + 0x1a, _0x4d5d27['rgn'].toString(0x20 / 0x2));
                        _0x578fbe['abs'] = undefined;
                        return true;
                    }
                    var _0x27a3a2 = [_0x166b80[0x0], _0x166b80[0x3] << 0x10 | _0x166b80[0x2] >>> 0x10, _0x166b80[0x1], _0x166b80[0x0] << 0x10 | _0x166b80[0x3] >>> 0x10, _0x166b80[0x2], _0x166b80[0x1] << 0x10 | _0x166b80[0x0] >>> 0x10, _0x166b80[0x3], _0x166b80[0x2] << 0x10 | _0x166b80[0x1] >>> 0x10];
                    var C = [_0x166b80[0x2] << 0x10 | _0x166b80[0x2] >>> 0x10, _0x166b80[0x0] & 0xffff0000 | _0x166b80[0x1] & 0xffff, _0x166b80[0x3] << 0x10 | _0x166b80[0x3] >>> 0x10, _0x166b80[0x1] & 0xffff0000 | _0x166b80[0x2] & 0xffff, _0x166b80[0x0] << 0x10 | _0x166b80[0x0] >>> 0x10, _0x166b80[0x2] & 0xffff0000 | _0x166b80[0x3] & 0xffff, _0x166b80[0x1] << 0x10 | _0x166b80[0x1] >>> 0x10, _0x166b80[0x3] & 0xffff0000 | _0x166b80[0x0] & 0xffff];
                    this['_b'] = 0x0;
                    _0x4d5d27['result'] = '';
                    for (_0x2b4eff = 0x0; _0x2b4eff < 0x8; _0x2b4eff++) {
                        C[_0x2b4eff] ^= _0x27a3a2[_0x2b4eff + 0x4 & 0x7];
                    }
                    return false;
                }
            });
        }());

        (function i1d() {

            var _0x865b50 = {};
            var _0x38eb58 = [];

            function _0x542152() {
                this['cp'] = 0x0;
                this['abs'] = undefined
            }

            var _0x3284b5 = new _0x542152();
            var _0x11f005 = 0x0;
            var _0x4dfe70 = function () {
                var _0x18fd24 = function (_0x38ccda) {
                    _0x3284b5['cp'] |= _0x38ccda;
                };
                return _0x18fd24;
            };
            var _0xf90c2f = function () {
                var _0x593e1c = function (_0x505dd7) {};
                return _0x593e1c;
            };
            var _0x7cd889 = function () {
                var _0x1abd56 = function (_0x45d021) {};
                return _0x1abd56;
            };
            var _0x35a1bc = function () {
                var _0x411cd3 = function (_0xd779ea) {
                    _0x3284b5['abs'] = _0xd779ea;
                };
                return _0x411cd3;
            };
            var _0xbd5363 = function () {
                var _0x36a3aa = function (message, hasher) {
                    var _0x1f82e5 = {};
                    _0x1f82e5['result'] = '';
                    _0x1f82e5['rgn'] = 0x0;
                    _0x1f82e5['key'] = '';
                    _0x1f82e5['se'] = _0x11f005;
                    CryptoJS.algo.CEncoder.init(_0x1f82e5);
                    _0x11f005 = _0x1f82e5['se'];
                    var _0x3980fd = CryptoJS.algo.CEncoder.final(message.substring(0x0, message.length - 0xf), _0x3284b5, _0x1f82e5);
                    _0x1f82e5['key'] = '';
                    if (!_0x3980fd) {
                        var _0x1d7f09 = message.substring(0x0, message.length - 0x2) + _0x1f82e5['rgn'].toString(0x20 / 0x2) + message.substring(message.length - 0x2, message.length);
                        hasher['update'](_0x1d7f09);
                        var _0x3ff40a = hasher.finalize();
                        _0x1f82e5['result'] = _0x3ff40a.toString(CryptoJS['enc']['Hex']);
                        _0x1d7f09 = '';
                    }
                    var _0x3bf06a = _0x1f82e5['result'];
                    var _0x3cbcb4 = _0x1f82e5['rgn'];
                    _0x1f82e5 = {};
                    _0x495087 = '';
                    _0x30a64a = '';
                    return [_0x3bf06a, _0x3cbcb4];
                };
                return _0x36a3aa;
            };
            var _0x50f6c0 = function () {
                var _0xe86d0f = function (_0x15e0ea, _0x1794df) {
                    _0x2a60a3[_0x9ee4c0[0x7][0x1] + _0x9ee4c0[0x7][0x2] + _0x9ee4c0[0x7][0x3] + _0x9ee4c0[0x6][0x2] + _0x9ee4c0[0x3][0x0] + _0x9ee4c0[0x3][0x0]] = _0x15e0ea;
                    var _0x2ef5e1 = Math.ceil(Math.random() * _0x1794df)
                    _0x11f005 = _0x2ef5e1 * 6466 % 2147483647;
                };
                return _0xe86d0f;
            };
            var shaFunctions = [{
                'name': 'sha1_',
                'padding': _0x7cd889
            }, {
                'name': 'sha3_',
                'padding': _0x35a1bc
            }, {
                'name': 'sha224_',
                'padding': _0x4dfe70
            }, {
                'name': 'sha256_',
                'padding': _0xbd5363
            }, {
                'name': 'sha384_',
                'padding': _0xf90c2f
            }, {
                'name': 'sha512_',
                'padding': _0x50f6c0
            }];
            for (var _0x1fd6a2 = 0; _0x1fd6a2 < shaFunctions['length']; ++_0x1fd6a2) {
                var shaFunc = shaFunctions[_0x1fd6a2];
                var shaFuncName = shaFunc['name'] + 'update';
                _0x38eb58['push'](shaFuncName);
                _0x865b50[shaFuncName] = shaFunc.padding();
            }
            for (_0x1fd6a2 = 0; _0x1fd6a2 < _0x38eb58['length']; ++_0x1fd6a2) {
                this[_0x38eb58[_0x1fd6a2]] = _0x865b50[_0x38eb58[_0x1fd6a2]];
            }
        }());

        (function i1i() {
            var C = CryptoJS;
            var C_lib = C.lib;
            var Base = C_lib.Base;
            var C_enc = C.enc;
            var Utf8 = C_enc.Utf8;
            var C_algo = C.algo;

            var HMAC = C_algo.HMAC = Base.extend({
                getString: function () {
                    return 'HMAC';
                },
                init: function (hasher, key) {
                    // Init hasher
                    hasher = this._hasher = new hasher.init();

                    // Convert string to WordArray, else assume WordArray already
                    if (typeof key == 'string') {
                        key = Utf8.parse(key);
                    }

                    var hasherBlockSize = hasher.blockSize;
                    var hasherBlockSizeBytes = hasherBlockSize * 4;

                    if (key.sigBytes > hasherBlockSizeBytes) {
                        key = hasher.finalize(key);
                    }

                    key.clamp();

                    var oKey = this._oKey = key.clone();
                    var iKey = this._iKey = key.clone();

                    var oKeyWords = oKey.words;
                    var iKeyWords = iKey.words;

                    for (var i = 0x0; i < hasherBlockSize; i++) {
                        oKeyWords[i] ^= 0x5c5c5c5c;
                        iKeyWords[i] ^= 0x36363636;
                    }

                    oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;
                    this.reset();
                },
                reset: function () {
                    var hasher = this._hasher;

                    hasher.reset();
                    hasher.update(this._iKey);
                },
                update: function (messageUpdate) {
                    this._hasher.update(messageUpdate);

                    // Chainable
                    return this;
                },
                _init: function (_0x52c0a6) {
                    if (utils.JS.isNumber(_0x52c0a6)) {
                        sha512_update(this, _0x52c0a6);
                    }
                },
                _ctr: function (_0x28b0a4) {
                    if (utils.JS.isNumber(_0x28b0a4)) {
                        sha224_update(_0x28b0a4);
                    }
                },
                _calculate: function (_0x198c94) {
                    if (utils.JS.isFunction(_0x198c94)) {
                        sha3_update(_0x198c94);
                    }
                },
                _set: function (_0x421326) {
                    if (utils.JS.isNumber(_0x421326)) {
                        sha1_update(_0x421326);
                    }
                },
                _get: function (message, hasher) {
                    if (Object.prototype.toString.call(message) === '[object String]' && hasher.constructor === Object) {
                        return sha256_update(message, hasher);
                    }
                },
                finalize: function (messageUpdate) {
                    var HMAC = this._hasher;
                    var _0x43ba4a = HMAC.finalize(messageUpdate);
                    HMAC.reset();
                    var _0x2eeea8 = HMAC.finalize(this._oKey.clone().concat(_0x43ba4a));
                    return _0x2eeea8;
                }
            });
        }());

        (function i1p(Math) {
            var C = CryptoJS;
            var C_lib = C.lib;
            var WordArray = C_lib['WordArray'];
            var Hasher = C_lib['Hasher'];
            var C_algo = C.algo;

            var words = []; // Suppose to be `var H`
            var K = [];

            (function () {
                function isPrine(n) {
                    var sqrtN = Math.sqrt(n);
                    for (var factor = 0x2; factor <= sqrtN; factor++) {
                        if (!(n % factor)) {
                            return false;
                        }
                    }
                    return true;
                }

                function getFractionalBits(n) {
                    return (n - (n | 0x0)) * 0x100000000 | 0x0;
                }
                var n = 0x2;
                var nPrime = 0x0;
                while (nPrime < 0x40) {
                    if (isPrine(n)) {
                        if (nPrime < 0x8) {
                            words[nPrime] = getFractionalBits(Math.pow(n, 0x1 / 0x2));
                        }
                        K[nPrime] = getFractionalBits(Math.pow(n, 0x1 / 0x3));
                        nPrime++;
                    }
                    n++;
                }
            }());

            var W = [];

            var SHA256 = C_algo.SHA256 = Hasher.extend({
                _doReset: function () {
                    this['_hash'] = new WordArray.init(words.slice(0));
                },
                _doProcessBlock: function (M, offset) {
                    var words = this['_hash']['words'];

                    var a = words[0];
                    var b = words[1];
                    var c = words[2];
                    var d = words[3];
                    var e = words[4];
                    var f = words[5];
                    var g = words[6];
                    var h = words[7];

                    for (var i = 0; i < 64; i++) {
                        if (i < 16) {
                            W[i] = M[offset + i] | 0;
                        } else {
                            var gamma0x = W[i - 0xf];
                            var gamma0 = (gamma0x << 0x19 | gamma0x >>> 0x7) ^ (gamma0x << 0xe | gamma0x >>> 0x12) ^ gamma0x >>> 0x3;
                            var gamma1x = W[i - 0x2];
                            var gamma1 = (gamma1x << 0xf | gamma1x >>> 0x11) ^ (gamma1x << 0xd | gamma1x >>> 0x13) ^ gamma1x >>> 0xa;
                            W[i] = gamma0 + W[i - 0x7] + gamma1 + W[i - 0x10];
                        }
                        var ch = e & f ^ ~e & g;
                        var maj = a & b ^ a & c ^ b & c;
                        var sigma0 = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22);
                        var sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);
                        var t1 = h + sigma1 + ch + K[i] + W[i];
                        var t2 = sigma0 + maj;
                        h = g;
                        g = f;
                        f = e;
                        e = d + t1 | 0;
                        d = c;
                        c = b;
                        b = a;
                        a = t1 + t2 | 0;
                    }
                    words[0x0] = words[0x0] + a | 0;
                    words[0x1] = words[0x1] + b | 0;
                    words[0x2] = words[0x2] + c | 0;
                    words[0x3] = words[0x3] + d | 0;
                    words[0x4] = words[0x4] + e | 0;
                    words[0x5] = words[0x5] + f | 0;
                    words[0x6] = words[0x6] + g | 0;
                    words[0x7] = words[0x7] + h | 0;
                },
                _doFinalize: function () {
                    var data = this._data;
                    var dataWords = data.words;

                    var nBitsTotal = this._nDataBytes * 8;
                    var nBitsLeft = data.sigBytes * 8;

                    dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
                    dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
                    dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
                    data.sigBytes = dataWords.length * 4;

                    this._process();

                    return this._hash;
                },
                clone: function () {
                    var clone = Hasher.clone.call(this);
                    clone._hash = this._hash.clone();

                    return clone;
                }
            });
            C.SHA256 = Hasher._createHelper(SHA256);
            C.HmacSHA256 = Hasher._createSHelper(SHA256);
        }(Math));

        _0x28bccf.prototype.init = function (_0x2d4631) {
            if (typeof _0x2d4631 !== "undefined" && typeof _0x2d4631 === "number") {
                hasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, _0x2d4631.toString());
                hasher._init(_0x2d4631);
            }
        };

        _0x28bccf.prototype.get = function (message, key) {
            if (typeof message !== "undefined" && typeof key !== "undefined" && typeof message === 'string' && typeof key === 'string') {
                hasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
                return hasher._get(message, hasher);
            }
            return ['0', '0'];
        };

        _0x28bccf.prototype.reset = function () {
            hasher.reset();
        };
        return new _0x28bccf();
    }();

    let authToken = auth_token
    let futSku = 'FUT20WEB'
    let payload = '{"authCode":"'+ auth_code +'"}, {"sku":"'+ sku +'"}, {"custom":""}'
    var key = "JzGpKhsbYC0GPpan9EfNYxWgTQJ9YZEZl7zd8Rv2CdiiYUKjk0c3q6k4qnUoxolW";

    payload = payload.slice(0, 13) + authToken + payload.slice(13, 25) + futSku + payload.slice(25, payload.length);

    var time = Date.now();
    utils.eval.init(time);

    var encrypted = utils.eval.get(payload, key);
    var digitalSig = encrypted[0] + '/' + encrypted[1].toString(16);
    return digitalSig;
}