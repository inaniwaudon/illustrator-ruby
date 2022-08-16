/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 99:
/***/ (function(__unused_webpack_module, exports) {


exports.__esModule = true;
exports.getOverhangingRubyCount = exports.classifyCharacterClass = exports.kanjiCodes = exports.convertSutegana = void 0;
// sutegana
var suteganaList = [
    { before: unescape("%u3041"), after: unescape("%u3042") },
    { before: unescape("%u3043"), after: unescape("%u3044") },
    { before: unescape("%u3045"), after: unescape("%u3046") },
    { before: unescape("%u3047"), after: unescape("%u3048") },
    { before: unescape("%u3049"), after: unescape("%u304A") },
    { before: unescape("%u3063"), after: unescape("%u3064") },
    { before: unescape("%u3083"), after: unescape("%u3084") },
    { before: unescape("%u3085"), after: unescape("%u3086") },
    { before: unescape("%u3087"), after: unescape("%u3088") },
    { before: unescape("%u308E"), after: unescape("%u308F") },
    { before: unescape("%u30A1"), after: unescape("%u30A2") },
    { before: unescape("%u30A3"), after: unescape("%u30A4") },
    { before: unescape("%u30A5"), after: unescape("%u30A6") },
    { before: unescape("%u30A7"), after: unescape("%u30A8") },
    { before: unescape("%u30A9"), after: unescape("%u30AA") },
    { before: unescape("%u30F5"), after: unescape("%u30AB") },
    { before: unescape("%u31F0"), after: unescape("%u30AF") },
    { before: unescape("%u30F6"), after: unescape("%u30B1") },
    { before: unescape("%u31F1"), after: unescape("%u30B7") },
    { before: unescape("%u31F2"), after: unescape("%u30B9") },
    { before: unescape("%u30C3"), after: unescape("%u30C4") },
    { before: unescape("%u31F3"), after: unescape("%u30C8") },
    { before: unescape("%u31F4"), after: unescape("%u30CC") },
    { before: unescape("%u31F5"), after: unescape("%u30CF") },
    { before: unescape("%u31F6"), after: unescape("%u30D2") },
    { before: unescape("%u31F7"), after: unescape("%u30D5") },
    { before: unescape("%u31F8"), after: unescape("%u30D8") },
    { before: unescape("%u31F9"), after: unescape("%u30DB") },
    { before: unescape("%u31FA"), after: unescape("%u30DE") },
    { before: unescape("%u30E3"), after: unescape("%u30E4") },
    { before: unescape("%u30E5"), after: unescape("%u30E6") },
    { before: unescape("%u30E7"), after: unescape("%u30E8") },
    { before: unescape("%u31FB"), after: unescape("%u30E9") },
    { before: unescape("%u31FC"), after: unescape("%u30EA") },
    { before: unescape("%u31FD"), after: unescape("%u30EB") },
    { before: unescape("%u31FE"), after: unescape("%u30EC") },
    { before: unescape("%u31FF"), after: unescape("%u30ED") },
    { before: unescape("%u30EE"), after: unescape("%u30EF") },
    { before: unescape("%u31F7%u309A"), after: unescape("%u30D7") },
];
var convertSutegana = function (beforeText) {
    return suteganaList.reduce(function (previous, sutegana) { return previous.replace(sutegana.before, sutegana.after); }, beforeText);
};
exports.convertSutegana = convertSutegana;
// character class
exports.kanjiCodes = [
    [0x4e00, 0x9fef],
    [0x3400, 0x4db5],
    [0x20000, 0x2a6d6],
    [0x2a700, 0x2b734],
    [0x2b740, 0x2b81d],
    [0x2b820, 0x2cea1],
    [0x2ceb0, 0x2ebe0],
    [0xf900, 0xfaff],
    [0x2f800, 0x2fa1f],
    [0xe0100, 0xe01ef],
    [0x2f00, 0x2fdf],
    [0x2e80, 0x2eff],
    [0x31c0, 0x31ef],
];
var classifyCharacterClass = function (character) {
    var code = character.charCodeAt(0);
    if (code === undefined) {
        return null;
    }
    if (exports.kanjiCodes.some(function (value) { return value[0] <= code && code <= value[1]; })) {
        return "kanji";
    }
    if (character.match(new RegExp("^[\u3041-\u3093\u30A1-\u30F3]$"))) {
        return "kana";
    }
    if ("\u2018\u201C\uFF08\u3014\uFF3B\uFF5B\u3008\u300A\u300C\u300E\u3010\uFF5F\u3018\u3016\u00AB\u301D".includes(character)) {
        return "openingBracket";
    }
    if ("\u2019\u201D\uFF09\u3015\uFF3D\uFF5D\u3009\u300B\u300D\u300F\u3011\uFF60\u3019\u3017\u00BB\u301F".includes(character)) {
        return "closingBracket";
    }
    if ("\u3002.".includes(character)) {
        return "fullStop";
    }
    if ("\u3001\uFF0C".includes(character)) {
        return "comma";
    }
    return null;
};
exports.classifyCharacterClass = classifyCharacterClass;
var getOverhangingRubyCount = function (character) {
    var charClass = (0, exports.classifyCharacterClass)(character);
    if (charClass === null) {
        return 0;
    }
    return [
        "kana",
        "openingBracket",
        "closingBracket",
        "fullStop",
        "comma",
    ].includes(charClass)
        ? 1.0
        : 0;
};
exports.getOverhangingRubyCount = getOverhangingRubyCount;


/***/ }),

/***/ 519:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.main = exports.applyAttributesToRubyList = exports.tokenizeText = void 0;
var character_1 = __webpack_require__(99);
var ruby_1 = __webpack_require__(700);
var convertUnit = function (size, baseSize, ratio) {
    if (isNaN(parseFloat(size))) {
        return baseSize * ratio;
    }
    var num = parseFloat(size);
    var unit = size.replace(/[0-9]*/, "").match(/pt|cm|mm|Q|H|px|%/);
    var mmPerPt = 2.8346;
    if (unit !== null) {
        switch (unit[0]) {
            case "pt":
                return num;
            case "mm":
                return num * mmPerPt;
            case "cm":
                return num * mmPerPt * 10;
            case "Q":
            case "H":
                return num * mmPerPt * 0.25;
            case "px":
                return num * 0.75;
            case "%":
                return (num / 100) * baseSize;
        }
    }
    return baseSize * ratio;
};
var CR = String.fromCharCode(13);
var LF = String.fromCharCode(10);
var noGlyphs = {
    space: unescape("%u0020"),
    zenkakuSpace: unescape("%u3000"),
    emSpace: unescape("%u2003"),
    CR: CR,
    LF: LF,
    tab: "\t"
};
var rubyDelimiters = {
    from: "[",
    to: "]",
    split: "|"
};
var jukugoRubyDelimiters = {
    from: "<",
    to: ">",
    split: "|"
};
var attributeDelimiters = {
    from: "(",
    to: ")",
    split: "|"
};
var getSelectedTextFrame = function () {
    // check the selected objects
    var finish = null;
    var base = null;
    for (var _i = 0, _a = activeDocument.selection; _i < _a.length; _i++) {
        var selectedObj = _a[_i];
        if (selectedObj.typename === "TextFrame" &&
            selectedObj.name.match(/finish/) != null) {
            finish = selectedObj;
        }
        if (selectedObj.typename === "TextFrame" &&
            selectedObj.name.match(/base/) != null) {
            base = selectedObj;
        }
    }
    return { base: base, finish: finish };
};
var tokenizeText = function (baseText) {
    var spacesRegex = new RegExp(Object.values(noGlyphs).join("|"));
    var tokens = [];
    var finalBaseDifference = 0;
    var spaceDifference = 0;
    for (var i = 0; i < baseText.length; i++) {
        // space
        if (baseText[i].match(spacesRegex)) {
            spaceDifference++;
            continue;
        }
        // ruby
        var startsJukugoRuby = baseText[i] === jukugoRubyDelimiters.from;
        if ((baseText[i] === rubyDelimiters.from &&
            baseText[i + 1] !== rubyDelimiters.from) ||
            (startsJukugoRuby && baseText[i + 1] !== jukugoRubyDelimiters.from)) {
            var subsequentText = baseText.substring(i);
            var delimiter = startsJukugoRuby
                ? jukugoRubyDelimiters
                : rubyDelimiters;
            var toIndex = subsequentText.indexOf(delimiter.to);
            var splited = subsequentText
                .substring(1, toIndex)
                .split(delimiter.split);
            if (splited.length < 2) {
                continue;
            }
            // `ruby1|ruby2` represents upper and lower rubys.
            // if j == 1, it is a upper ruby.
            for (var j = 1; j < Math.max(splited.length, 2); j++) {
                // `ruby1/ruby2` is separated into mono rubys.
                var splitedMono = splited[j].split("/");
                if (splitedMono.length > 1 &&
                    splitedMono.length !== splited[0].length) {
                    continue;
                }
                if (startsJukugoRuby) {
                    tokens.push({
                        type: "jukugo-ruby",
                        ruby: splitedMono,
                        base: splited[0],
                        starts: j === 1,
                        charIndex: i - finalBaseDifference,
                        outlineIndex: i - finalBaseDifference - spaceDifference,
                        beforeChar: i > 0 ? baseText[i - 1] : "",
                        afterChar: i + toIndex < baseText.length - 1
                            ? baseText[i + toIndex + 1]
                            : ""
                    });
                }
                else {
                    for (var k = 0; k < splitedMono.length; k++) {
                        var _a = ["", ""], beforeChar = _a[0], afterChar = _a[1];
                        if (i > 0) {
                            beforeChar = k === 0 ? baseText[i - 1] : splited[0][k - 1];
                        }
                        if (i + toIndex < baseText.length - 1) {
                            afterChar =
                                k == splitedMono.length - 1
                                    ? baseText[i + toIndex + 1]
                                    : splited[0][k + 1];
                        }
                        tokens.push({
                            type: "ruby",
                            ruby: splitedMono[k],
                            base: splitedMono.length === 1 ? splited[0] : splited[0][k],
                            starts: j === 1,
                            charIndex: i - finalBaseDifference + k,
                            outlineIndex: i - finalBaseDifference - spaceDifference + k,
                            beforeChar: beforeChar,
                            afterChar: afterChar
                        });
                    }
                }
            }
            finalBaseDifference += toIndex + 1 - splited[0].length;
            i += toIndex;
        }
        // attribute
        if (baseText[i] === attributeDelimiters.from &&
            baseText[i + 1] !== attributeDelimiters.from) {
            var subsequentText = baseText.substring(i);
            var toIndex = subsequentText.indexOf(attributeDelimiters.to);
            var splited = subsequentText
                .substring(1, toIndex)
                .split(attributeDelimiters.split);
            if (splited.length < 2) {
                continue;
            }
            tokens.push({
                type: "attribute",
                key: splited[0],
                value: splited[1]
            });
            finalBaseDifference += toIndex + 1;
            i += toIndex;
        }
    }
    return tokens;
};
exports.tokenizeText = tokenizeText;
var applyAttributesToMiddleRubyInfo = function (info, attribute) {
    for (var key in attribute) {
        if ([
            "alignment",
            "font",
            "offset",
            "overflow",
            "rubySize",
            "sutegana",
        ].includes(key)) {
            var value = attribute[key];
            if (value !== null) {
                info[key] = value;
            }
        }
    }
};
var applyAttributesToRubyList = function (tokens) {
    var defined = {};
    var rubyList = [];
    var _loop_1 = function (token) {
        // mono, group-ruby
        if (token.type === "ruby") {
            var ruby = {
                type: token.type,
                ruby: token.ruby,
                base: token.base,
                starts: token.starts,
                charIndex: token.charIndex,
                outlineIndex: token.outlineIndex,
                beforeChar: token.beforeChar,
                afterChar: token.afterChar,
                yBaseOutlineIndices: [token.outlineIndex]
            };
            applyAttributesToMiddleRubyInfo(ruby, defined);
            rubyList.push(ruby);
        }
        // jukugo-ruby
        else if (token.type === "jukugo-ruby") {
            var ruby = {
                type: token.type,
                ruby: token.ruby,
                base: token.base,
                starts: token.starts,
                charIndex: token.charIndex,
                outlineIndex: token.outlineIndex,
                beforeChar: token.beforeChar,
                afterChar: token.afterChar,
                yBaseOutlineIndices: __spreadArray([], Array(token.base.length), true).map(function (_, index) { return token.outlineIndex + index; })
            };
            applyAttributesToMiddleRubyInfo(ruby, defined);
            rubyList.push(ruby);
        }
        // attribute
        else if (token.type === "attribute") {
            switch (token.key) {
                case "align":
                    defined.alignment = (0, ruby_1.isAlignment)(token.value) ? token.value : null;
                    break;
                case "size":
                    defined.rubySize = token.value === "base" ? null : token.value;
                    break;
                case "offset":
                    defined.offset = token.value === "base" ? null : token.value;
                    break;
                case "sute":
                    defined.sutegana =
                        token.value === "base" ? null : token.value === "true";
                    break;
                case "overflow":
                    defined.overflow = ["shinyu", "narrow", "false"].includes(token.value)
                        ? token.value
                        : "false";
                    break;
                case "font":
                    defined.font = token.value === "base" ? null : token.value;
                    break;
            }
        }
    };
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        _loop_1(token);
    }
    return rubyList;
};
exports.applyAttributesToRubyList = applyAttributesToRubyList;
var convertJukugoRubys = function (middleRubys, characters) {
    var resultMiddleRubys = [];
    var _loop_2 = function (middleRuby) {
        // jukugo-ruby
        if (middleRuby.type === "jukugo-ruby") {
            var baseSize_1 = characters[middleRuby.charIndex].characterAttributes.size;
            // The ruby for which the parent characters are not of the same size is not processed.
            if (!middleRuby.ruby.every(function (_, index) {
                return baseSize_1 ===
                    characters[middleRuby.charIndex + index].characterAttributes.size;
            })) {
                return "continue";
            }
            var maxRubyCounts_1 = __spreadArray([], Array(middleRuby.ruby.length), true).fill(2);
            maxRubyCounts_1[0] += (0, character_1.getOverhangingRubyCount)(middleRuby.beforeChar);
            maxRubyCounts_1[maxRubyCounts_1.length - 1] += (0, character_1.getOverhangingRubyCount)(middleRuby.afterChar);
            var getSplit_1 = function (split) {
                if (split.length === middleRuby.ruby.length - 1) {
                    // calculate the penalty
                    var penalty = 0;
                    for (var i = 0; i < middleRuby.ruby.length; i++) {
                        var rubyCount = middleRuby.ruby[i].length -
                            (i > 0 ? split[i - 1] : 0) +
                            (i < split.length ? split[i] : 0);
                        penalty += Math.max(rubyCount - maxRubyCounts_1[i], 0) * 10;
                        if (maxRubyCounts_1[i] > 2 && rubyCount > 2) {
                            penalty += i === 0 ? 2 : 1;
                        }
                    }
                    return [penalty, split];
                }
                return [
                    getSplit_1(__spreadArray(__spreadArray([], split, true), [-1], false)),
                    getSplit_1(__spreadArray(__spreadArray([], split, true), [0], false)),
                    getSplit_1(__spreadArray(__spreadArray([], split, true), [1], false)),
                ].sort(function (a, b) { return a[0] - b[0]; })[0];
            };
            var _a = getSplit_1([]), _ = _a[0], split_1 = _a[1];
            middleRuby.ruby.forEach(function (ruby, index) {
                var rubyText = (index > 0 && split_1[index - 1] === -1
                    ? middleRuby.ruby[index - 1].slice(-1)
                    : "") +
                    ruby.slice(index > 0 ? Math.max(split_1[index - 1], 0) : 0, ruby.length + (index < split_1.length ? Math.min(split_1[index], 0) : 0)) +
                    (index < split_1.length && split_1[index] === 1
                        ? middleRuby.ruby[index + 1].slice(0, 1)
                        : "");
                var newMiddleRuby = __assign(__assign({}, middleRuby), { type: "ruby", ruby: rubyText, base: middleRuby.base[index], charIndex: middleRuby.charIndex + index, outlineIndex: middleRuby.outlineIndex + index, beforeChar: index === 0 ? middleRuby.beforeChar : middleRuby.base[index - 1], afterChar: index === middleRuby.ruby.length - 1
                        ? middleRuby.afterChar
                        : middleRuby.base[index + 1] });
                applyAttributesToMiddleRubyInfo(newMiddleRuby, middleRuby);
                var leftCount = rubyText.length;
                if (middleRuby.ruby.length === 1) {
                    // TODO: 中にするとは限らない
                    newMiddleRuby.alignment = "naka";
                    leftCount -= maxRubyCounts_1[0] - 2;
                }
                else {
                    if (index === 0 && leftCount > 2 && maxRubyCounts_1[0] > 2) {
                        newMiddleRuby.alignment = "shita";
                        leftCount--;
                    }
                    if (index === middleRuby.ruby.length - 1 &&
                        leftCount > 2 &&
                        maxRubyCounts_1[index] > 2) {
                        newMiddleRuby.alignment = "kata";
                        leftCount--;
                    }
                }
                if (leftCount > 2) {
                    var charAttributes = characters[middleRuby.charIndex + index].characterAttributes;
                    var aki = (leftCount - 2) / 4;
                    charAttributes.akiLeft = aki;
                    charAttributes.akiRight = aki;
                    newMiddleRuby.alignment = "naka";
                }
                newMiddleRuby.overflow = "false";
                resultMiddleRubys.push(newMiddleRuby);
            });
        }
        // mono, group-ruby
        else {
            resultMiddleRubys.push(middleRuby);
        }
    };
    for (var _i = 0, middleRubys_1 = middleRubys; _i < middleRubys_1.length; _i++) {
        var middleRuby = middleRubys_1[_i];
        _loop_2(middleRuby);
    }
    return resultMiddleRubys;
};
var createRubyInfos = function (middleRubyInfos, characters) {
    var _a, _b, _c;
    var rubyInfos = [];
    for (var _i = 0, middleRubyInfos_1 = middleRubyInfos; _i < middleRubyInfos_1.length; _i++) {
        var middleRubyInfo = middleRubyInfos_1[_i];
        // add an information of ruby
        var charAttributes = characters[middleRubyInfo.charIndex].characterAttributes;
        var ruby = {
            ruby: middleRubyInfo.ruby,
            base: middleRubyInfo.base,
            starts: middleRubyInfo.starts,
            alignment: (_a = middleRubyInfo.alignment) !== null && _a !== void 0 ? _a : ruby_1.defaultAlignment,
            font: charAttributes.textFont,
            x: 0,
            y: 0,
            baseWidth: 0,
            baseHeight: 0,
            offset: { x: 0, y: 0 },
            sutegana: (_b = middleRubyInfo.sutegana) !== null && _b !== void 0 ? _b : ruby_1.defaultSutegana,
            overflow: (_c = middleRubyInfo.overflow) !== null && _c !== void 0 ? _c : ruby_1.defaultOverflow,
            size: {
                base: charAttributes.size,
                ruby: charAttributes.size * ruby_1.defaultRubySizeRatio
            }
        };
        if (middleRubyInfo.font) {
            try {
                ruby.font = app.textFonts.getByName(middleRubyInfo.font);
            }
            catch (e) {
                ruby.font = app.textFonts.getFontByName(middleRubyInfo.font);
            }
        }
        if (middleRubyInfo.rubySize !== undefined) {
            ruby.size.ruby = convertUnit(middleRubyInfo.rubySize, ruby.size.base, ruby_1.defaultRubySizeRatio);
        }
        if (middleRubyInfo.offset !== undefined) {
            ruby.offset.y = convertUnit(middleRubyInfo.offset, ruby.size.base, 0);
        }
        rubyInfos.push(ruby);
    }
    return rubyInfos;
};
var adjustAki = function (rubyInfos, middleRubyInfos, characters) {
    rubyInfos.forEach(function (rubyInfo, index) {
        var baseWidth = rubyInfo.size.base * rubyInfo.base.length;
        var rubyWidth = rubyInfo.size.ruby * rubyInfo.ruby.length;
        if (rubyInfo.overflow === "shinyu" && rubyWidth > baseWidth) {
            var middleRubyInfo = middleRubyInfos[index];
            var overhangingBefore = (0, character_1.getOverhangingRubyCount)(middleRubyInfo.beforeChar);
            var overhangingAfter = (0, character_1.getOverhangingRubyCount)(middleRubyInfo.afterChar);
            var overflowLength = (rubyWidth - baseWidth) / rubyInfo.size.ruby;
            var akiLength = Math.max(rubyWidth -
                baseWidth -
                (overhangingBefore + overhangingAfter) * rubyInfo.size.ruby, 0) / rubyInfo.size.base;
            var firstChar = characters[middleRubyInfo.charIndex];
            var nextChar = middleRubyInfo.charIndex + rubyInfo.base.length < characters.length
                ? characters[middleRubyInfo.charIndex + rubyInfo.base.length]
                : null;
            // naka, 1-2-1 (JIS)
            var isNaka = rubyInfo.alignment === "naka";
            var isJis = rubyInfo.alignment === "jis";
            if (isNaka || isJis) {
                if (overhangingBefore && !overhangingAfter) {
                    rubyInfo.offset.x -= rubyInfo.size.ruby * 0.5;
                }
                if (!overhangingBefore && overhangingAfter) {
                    rubyInfo.offset.x += rubyInfo.size.ruby * 0.5;
                }
            }
            // naka
            if (isNaka) {
                firstChar.kerning = akiLength * 500;
                if (nextChar) {
                    nextChar.kerning = akiLength * 500;
                }
            }
            // 1-2-1 (JIS)
            if (rubyInfo.alignment === "jis") {
                var aki = (akiLength * 1000) / (rubyInfo.base.length * 2);
                firstChar.kerning = aki;
                for (var i = 1; i < rubyInfo.base.length; i++) {
                    characters[middleRubyInfo.charIndex + i].kerning = aki * 2;
                }
                if (nextChar) {
                    nextChar.kerning = aki;
                }
            }
            // kata
            if (rubyInfo.alignment === "kata") {
                if (!overhangingBefore && overhangingAfter) {
                    rubyInfo.alignment = "shita";
                    rubyInfo.offset.x += rubyInfo.size.ruby;
                    firstChar.kerning = akiLength * 1000;
                }
                else {
                    if (nextChar) {
                        nextChar.kerning = akiLength * 1000;
                    }
                    if ((overhangingBefore && !overhangingAfter) ||
                        (overhangingBefore && overhangingAfter && overflowLength > 1)) {
                        rubyInfo.offset.x -= rubyInfo.size.ruby;
                    }
                }
            }
        }
    });
};
var determinePositions = function (rubyInfos, middleRubyInfos, finishTextFrame, isVertical) {
    var rubyList = [];
    rubyInfos.forEach(function (rubyInfo, index) {
        // get outlined paths
        var textOutline = finishTextFrame.duplicate().createOutline();
        var middleRuby = middleRubyInfos[index];
        var basePaths = __spreadArray([], textOutline.compoundPathItems, true).slice(textOutline.compoundPathItems.length -
            (middleRuby.outlineIndex + rubyInfo.base.length), textOutline.compoundPathItems.length - middleRuby.outlineIndex);
        var yBasePaths = __spreadArray([], textOutline.compoundPathItems, true).slice(textOutline.compoundPathItems.length -
            middleRuby.yBaseOutlineIndices[middleRuby.yBaseOutlineIndices.length - 1], textOutline.compoundPathItems.length - middleRuby.yBaseOutlineIndices[0]);
        // add an information of ruby
        rubyInfo.x = isVertical
            ? yBasePaths.reduce(function (previous, path) { return previous + path.left + path.width / 2; }, 0) / yBasePaths.length
            : basePaths[basePaths.length - 1].left;
        rubyInfo.y = isVertical
            ? basePaths[basePaths.length - 1].top
            : yBasePaths.reduce(function (previous, path) { return previous + path.top - path.height / 2; }, 0) / yBasePaths.length;
        rubyInfo.baseWidth = basePaths[0].left + basePaths[0].width - rubyInfo.x;
        rubyInfo.baseHeight = rubyInfo.y - basePaths[0].top + basePaths[0].height;
        textOutline.remove();
    });
    return rubyList;
};
var addRubys = function (rubyList, isVertical) {
    var rubyGroup = activeDocument.groupItems.add();
    rubyGroup.name = "ruby";
    rubyList.forEach(function (ruby) {
        // The width of the outlined text is smaller than the virtual body (仮想ボディ).
        // When the character class of the parent character is Kanji,
        // the parent character is assumed to be full-width,
        // and The larger of ${the parent character size x the number of characters} or
        // ${ruby.baseWidth} (or baseHeight in vertical direction) is adopted as ${baseLength}.
        var measuredBaseLength = isVertical ? ruby.baseHeight : ruby.baseWidth;
        var baseLength = Math.max(measuredBaseLength, ruby.base
            .split("")
            .every(function (character) { return (0, character_1.classifyCharacterClass)(character) === "kanji"; })
            ? ruby.size.base * ruby.base.length
            : 0);
        // create the textframe for a ruby
        var textFrame = rubyGroup.textFrames.add();
        textFrame.textRange.characterAttributes.size = ruby.size.ruby;
        textFrame.textRange.characterAttributes.textFont = ruby.font;
        textFrame.contents = ruby.sutegana ? (0, character_1.convertSutegana)(ruby.ruby) : ruby.ruby;
        textFrame.orientation = isVertical
            ? TextOrientation.VERTICAL
            : TextOrientation.HORIZONTAL;
        var rubyLength = ruby.size.ruby * ruby.ruby.length;
        if (ruby.alignment === "jis" && baseLength > rubyLength) {
            textFrame.textRange.characterAttributes.tracking =
                ((baseLength - rubyLength) / ruby.ruby.length / ruby.size.ruby) * 1000;
        }
        // set a position
        var isNarrow = ruby.overflow === "narrow" && rubyLength > baseLength;
        var rubyAdjustment = (measuredBaseLength - baseLength) / 2 + ruby.offset.x;
        if (!isNarrow) {
            if (ruby.alignment === "shita") {
                rubyAdjustment += baseLength - rubyLength;
            }
            else if (ruby.alignment === "naka" ||
                (ruby.alignment === "jis" && rubyLength > baseLength)) {
                rubyAdjustment += (baseLength - rubyLength) / 2;
            }
            else if (ruby.alignment === "jis") {
                rubyAdjustment += (baseLength - rubyLength) / (ruby.ruby.length * 2);
            }
        }
        var basePosition = (isVertical ? ruby.x : ruby.y) +
            (ruby.starts
                ? ruby.size.base / 2 + ruby.offset.y
                : -ruby.size.base / 2 - ruby.offset.y);
        if (isVertical) {
            textFrame.top = ruby.y - rubyAdjustment;
            textFrame.left = basePosition - (ruby.starts ? 0 : ruby.size.ruby);
            if (isNarrow) {
                textFrame.textRange.characterAttributes.verticalScale =
                    (baseLength / rubyLength) * 100;
            }
        }
        else {
            textFrame.left = ruby.x + rubyAdjustment;
            textFrame.top = basePosition + (ruby.starts ? ruby.size.ruby : 0);
            if (isNarrow) {
                textFrame.textRange.characterAttributes.horizontalScale =
                    (baseLength / rubyLength) * 100;
            }
        }
    });
};
var main = function () {
    var selectedTextFrame = getSelectedTextFrame();
    if (selectedTextFrame.base == null || selectedTextFrame.finish == null) {
        alert("\u30EC\u30A4\u30E4\u30FC\u540D\u3068\u3057\u3066 finish, base \u3092\u542B\u3080\u30C6\u30AD\u30B9\u30C8\u30D5\u30EC\u30FC\u30E0\u30921\u3064\u305A\u3064\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044");
        return false;
    }
    var isVertical = selectedTextFrame.finish.orientation === TextOrientation.VERTICAL;
    var tokens = (0, exports.tokenizeText)(selectedTextFrame.base.contents);
    var mixedMiddleRubys = (0, exports.applyAttributesToRubyList)(tokens);
    var middleRubyInfos = convertJukugoRubys(mixedMiddleRubys, selectedTextFrame.finish.characters);
    var rubyInfos = createRubyInfos(middleRubyInfos, selectedTextFrame.finish.characters);
    adjustAki(rubyInfos, middleRubyInfos, selectedTextFrame.finish.characters);
    determinePositions(rubyInfos, middleRubyInfos, selectedTextFrame.finish, isVertical);
    addRubys(rubyInfos, isVertical);
    alert("".concat(rubyInfos.length, " \u500B\u306E\u30EB\u30D3\u3092\u4ED8\u4E0E\u3057\u307E\u3057\u305F"));
};
exports.main = main;


/***/ }),

/***/ 880:
/***/ (function() {


Object.keys = function (obj) {
    var result = [];
    for (var key in obj) {
        result.push(key);
    }
    return result;
};
Object.values = function (obj) {
    var result = [];
    for (var key in obj) {
        result.push(obj[key]);
    }
    return result;
};
Array.prototype.forEach = function (callback) {
    for (var i = 0; i < this.length; i++) {
        callback(this[i], i, this);
    }
};
Array.prototype.reduce = function (callback, initial) {
    var previous = initial !== null && initial !== void 0 ? initial : this[0];
    for (var i = initial == null ? 1 : 0; i < this.length; i++) {
        previous = callback(previous, this[i], i, this);
    }
    return previous;
};
Array.prototype.map = function (callback) {
    var result = [];
    for (var i = 0; i < this.length; i++) {
        result.push(callback(this[i], i, this));
    }
    return result;
};
Array.prototype.filter = function (predicate) {
    var result = [];
    for (var i = 0; i < this.length; i++) {
        if (predicate(this[i], i, this)) {
            result.push(this[i]);
        }
    }
    return result;
};
Array.prototype.some = function (predicate) {
    for (var i = 0; i < this.length; i++) {
        if (predicate(this[i], i, this)) {
            return true;
        }
    }
    return false;
};
Array.prototype.every = function (predicate) {
    var result = true;
    for (var i = 0; i < this.length; i++) {
        result && (result = predicate(this[i], i, this));
    }
    return result;
};
Array.prototype.fill = function (value) {
    var result = [];
    for (var i = 0; i < this.length; i++) {
        result.push(value);
    }
    return result;
};
Array.prototype.includes = function (value) {
    for (var _i = 0, _a = this; _i < _a.length; _i++) {
        var arrrayValue = _a[_i];
        if (arrrayValue === value) {
            return true;
        }
    }
    return false;
};
String.prototype.includes = function (value) {
    return this.split("").includes(value);
};


/***/ }),

/***/ 700:
/***/ (function(__unused_webpack_module, exports) {


exports.__esModule = true;
exports.defaultRubySizeRatio = exports.defaultOverflow = exports.defaultSutegana = exports.defaultAlignment = exports.isAlignment = exports.alignment = void 0;
// alignment
exports.alignment = {
    kata: "kata",
    naka: "naka",
    jis: "jis",
    shita: "shita"
};
var isAlignment = function (value) {
    return value in exports.alignment;
};
exports.isAlignment = isAlignment;
// default value
exports.defaultAlignment = "jis";
exports.defaultSutegana = true;
exports.defaultOverflow = "shinyu";
exports.defaultRubySizeRatio = 0.5;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
var exports = __webpack_exports__;
var __webpack_unused_export__;

__webpack_unused_export__ = true;
var main_1 = __webpack_require__(519);
__webpack_require__(880);
(0, main_1.main)();

}();
/******/ })()
;