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
    return null;
};
exports.classifyCharacterClass = classifyCharacterClass;
var getOverhangingRubyCount = function (character) {
    var charClass = (0, exports.classifyCharacterClass)(character);
    return charClass === "kanji" ? 0 : charClass === "kana" ? 1.0 : 0;
};
exports.getOverhangingRubyCount = getOverhangingRubyCount;


/***/ }),

/***/ 519:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
                        tokens.push({
                            type: "ruby",
                            ruby: splitedMono[k],
                            base: splitedMono.length === 1 ? splited[0] : splited[0][k],
                            starts: j === 1,
                            charIndex: i - finalBaseDifference + k,
                            outlineIndex: i - finalBaseDifference - spaceDifference + k
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
            "rubySize",
            "offset",
            "font",
            "alignment",
            "sutegana",
            "narrow",
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
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        // ruby
        if (token.type === "ruby" || token.type === "jukugo-ruby") {
            // add an information of ruby
            var ruby = {
                type: token.type,
                ruby: token.ruby,
                base: token.base,
                starts: token.starts,
                charIndex: token.charIndex,
                outlineIndex: token.outlineIndex
            };
            if (token.type === "jukugo-ruby" && ruby.type === "jukugo-ruby") {
                ruby.beforeChar = token.beforeChar;
                ruby.afterChar = token.afterChar;
            }
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
                case "narrow":
                    defined.narrow =
                        token.value === "base" ? null : token.value === "true";
                    break;
                case "font":
                    defined.font = token.value === "base" ? null : token.value;
                    break;
            }
        }
    }
    return rubyList;
};
exports.applyAttributesToRubyList = applyAttributesToRubyList;
var convertJukugoRubys = function (middleRubys, characters) {
    var resultMiddleRubys = [];
    var _loop_1 = function (middleRuby) {
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
            var rubyRatio_1 = 0.5;
            var process = function (advances, overhangs) {
                var leftBaseSpaces = __spreadArray([], Array(middleRuby.base.length), true).fill(1.0);
                var putBeforeRuby = "";
                var tempMiddleRubys = [];
                var akis = [];
                var overflows = false;
                var advance = advances ? 1 : -1;
                for (var i = advances ? 0 : middleRuby.ruby.length - 1; advances ? i < middleRuby.ruby.length : i >= 0; i += advance) {
                    var isNotLast = i < middleRuby.ruby.length - 1;
                    var rubyPerBaseChar = middleRuby.ruby[i];
                    var leftRuby = advances
                        ? putBeforeRuby + rubyPerBaseChar
                        : rubyPerBaseChar + putBeforeRuby;
                    var leftRatio = rubyRatio_1 * leftRuby.length;
                    var alignment_1 = null;
                    akis.push(0);
                    // mono ruby
                    var monoRubyRatio = Math.min(leftBaseSpaces[i], leftRatio);
                    leftBaseSpaces[i] -= monoRubyRatio;
                    leftRatio -= monoRubyRatio;
                    // unable to fit within the base character
                    // overhang the single after character in the compound word (when moving forward)
                    if (0 < leftRatio &&
                        ((advances && isNotLast) || (!advances && 0 < i)) &&
                        rubyRatio_1 <= leftBaseSpaces[i + advance]) {
                        leftRatio -= rubyRatio_1;
                    }
                    // overhang the single before character in the compound word (when moving forward)
                    if (0 < leftRatio &&
                        ((advances && 0 < i) || (!advances && isNotLast)) &&
                        rubyRatio_1 <= leftBaseSpaces[i - advance]) {
                        leftBaseSpaces[i - advance] -= rubyRatio_1;
                        leftRatio -= rubyRatio_1;
                        var lastMiddleRuby = tempMiddleRubys[tempMiddleRubys.length - 1];
                        lastMiddleRuby.ruby = advances
                            ? lastMiddleRuby.ruby + rubyPerBaseChar[0]
                            : rubyPerBaseChar[rubyPerBaseChar.length - 1] +
                                lastMiddleRuby.ruby;
                        leftRuby = advances ? leftRuby.slice(1) : leftRuby.slice(0, -1);
                    }
                    if (0 < leftRatio) {
                        // overhang the single after character outside an the compound word
                        if (advances && i === middleRuby.ruby.length - 1) {
                            leftRatio -=
                                (0, character_1.getOverhangingRubyCount)(middleRuby.afterChar) * rubyRatio_1;
                            overflows = true;
                            alignment_1 = "kata";
                        }
                        // overhang the single after character outside an the compound word
                        else if (!advances && i === 0) {
                            leftRatio -=
                                (0, character_1.getOverhangingRubyCount)(middleRuby.beforeChar) * rubyRatio_1;
                            overflows = true;
                            alignment_1 = "shita";
                        }
                    }
                    // insert spaces between the front and back of the compound word
                    if (0 < leftRatio) {
                        akis[i] = leftRatio;
                        alignment_1 = "naka";
                    }
                    var rubyText = advances ? leftRuby.slice(0, 2) : leftRuby.slice(-2);
                    var middleRubyInfo = {
                        type: "ruby",
                        ruby: overflows ? leftRuby : rubyText,
                        base: middleRuby.base[i],
                        starts: middleRuby.starts,
                        charIndex: middleRuby.charIndex + i,
                        outlineIndex: middleRuby.outlineIndex + i
                    };
                    applyAttributesToMiddleRubyInfo(middleRubyInfo, middleRuby);
                    middleRubyInfo.alignment = alignment_1 !== null && alignment_1 !== void 0 ? alignment_1 : middleRubyInfo.alignment;
                    middleRubyInfo.narrow = false;
                    tempMiddleRubys.push(middleRubyInfo);
                    putBeforeRuby = advances ? leftRuby.slice(2) : leftRuby.slice(0, -2);
                }
                return [tempMiddleRubys, akis];
            };
            var applyAkis = function (akis) {
                for (var i = 0; i < akis.length; i++) {
                    var charAttributes = characters[middleRuby.charIndex + i].characterAttributes;
                    charAttributes.akiLeft = akis[i];
                    charAttributes.akiRight = akis[i];
                }
            };
            var sum_1 = function (array) {
                return array.reduce(function (previous, value) { return previous + value; });
            };
            var processedList = [
                __spreadArray(__spreadArray([], process(true, false), true), [0], false),
                //[...process(false, false), 1],
                //[...process(true, true), 2],
                //[...process(false, true), 3],
            ];
            var processed = processedList.sort(function (_a, _b) {
                var _ = _a[0], x = _a[1], xi = _a[2];
                var __ = _b[0], y = _b[1], yi = _b[2];
                return sum_1(x) - sum_1(y) === 0 ? xi - yi : sum_1(x) - sum_1(y);
            })[0];
            resultMiddleRubys.push.apply(resultMiddleRubys, processed[0]);
            applyAkis(processed[1]);
        }
        else {
            resultMiddleRubys.push(middleRuby);
        }
    };
    for (var _i = 0, middleRubys_1 = middleRubys; _i < middleRubys_1.length; _i++) {
        var middleRuby = middleRubys_1[_i];
        _loop_1(middleRuby);
    }
    return resultMiddleRubys;
};
var createRubyInfos = function (middleRubys, finishTextFrame, isVertical) {
    var _a, _b, _c;
    var rubyList = [];
    for (var _i = 0, middleRubys_2 = middleRubys; _i < middleRubys_2.length; _i++) {
        var middleRuby = middleRubys_2[_i];
        // get outlined paths
        var textOutline = finishTextFrame.duplicate().createOutline();
        var basePaths = __spreadArray([], textOutline.compoundPathItems, true).slice(textOutline.compoundPathItems.length -
            (middleRuby.outlineIndex + middleRuby.base.length), textOutline.compoundPathItems.length - middleRuby.outlineIndex);
        // add an information of ruby
        var charAttributes = finishTextFrame.characters[middleRuby.charIndex].characterAttributes;
        var ruby = {
            ruby: middleRuby.ruby,
            base: middleRuby.base,
            starts: middleRuby.starts,
            alignment: (_a = middleRuby.alignment) !== null && _a !== void 0 ? _a : ruby_1.defaultAlignment,
            font: charAttributes.textFont,
            x: isVertical
                ? basePaths.reduce(function (previous, path) { return previous + path.left + path.width / 2; }, 0) / basePaths.length
                : basePaths[basePaths.length - 1].left,
            y: isVertical
                ? basePaths[basePaths.length - 1].top
                : basePaths.reduce(function (previous, path) { return previous + path.top - path.height / 2; }, 0) / basePaths.length,
            baseWidth: 0,
            baseHeight: 0,
            offset: 0,
            sutegana: (_b = middleRuby.sutegana) !== null && _b !== void 0 ? _b : ruby_1.defaultSutegana,
            narrow: (_c = middleRuby.narrow) !== null && _c !== void 0 ? _c : ruby_1.defaultNarrow,
            size: {
                base: charAttributes.size,
                ruby: charAttributes.size * ruby_1.defaultRubySizeRatio
            }
        };
        if (middleRuby.font) {
            try {
                ruby.font = app.textFonts.getByName(middleRuby.font);
            }
            catch (e) {
                ruby.font = app.textFonts.getFontByName(middleRuby.font);
            }
        }
        ruby.baseWidth = basePaths[0].left + basePaths[0].width - ruby.x;
        ruby.baseHeight = ruby.y - basePaths[0].top + basePaths[0].height;
        if (middleRuby.rubySize !== undefined) {
            ruby.size.ruby = convertUnit(middleRuby.rubySize, ruby.size.base, ruby_1.defaultRubySizeRatio);
        }
        if (middleRuby.offset !== undefined) {
            ruby.offset = convertUnit(middleRuby.offset, ruby.size.base, 0);
        }
        rubyList.push(ruby);
        textOutline.remove();
    }
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
        var isNarrow = ruby.narrow && rubyLength > baseLength;
        var rubyAdjustment = (measuredBaseLength - baseLength) / 2;
        if (!isNarrow) {
            if (ruby.alignment === "shita") {
                rubyAdjustment += baseLength - rubyLength;
            }
            else if (ruby.alignment === "naka" ||
                (ruby.alignment === "jis" && rubyLength > baseLength)) {
                rubyAdjustment += (baseLength - rubyLength) / 2;
            }
            else if (ruby.alignment === "jis") {
                rubyAdjustment += ((baseLength - rubyLength) / ruby.ruby.length) * 2;
            }
        }
        var basePosition = (isVertical ? ruby.x : ruby.y) +
            (ruby.starts
                ? ruby.size.base / 2 + ruby.offset
                : -ruby.size.base / 2 - ruby.offset);
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
    var middleRubys = convertJukugoRubys(mixedMiddleRubys, selectedTextFrame.finish.characters);
    var rubyList = createRubyInfos(middleRubys, selectedTextFrame.finish, isVertical);
    addRubys(rubyList, isVertical);
    alert("".concat(rubyList.length, " \u500B\u306E\u30EB\u30D3\u3092\u4ED8\u4E0E\u3057\u307E\u3057\u305F"));
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


/***/ }),

/***/ 700:
/***/ (function(__unused_webpack_module, exports) {


exports.__esModule = true;
exports.defaultRubySizeRatio = exports.defaultNarrow = exports.defaultSutegana = exports.defaultAlignment = exports.isAlignment = exports.alignment = void 0;
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
exports.defaultNarrow = false;
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