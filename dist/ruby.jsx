/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 607:
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
__webpack_require__(880);
var convertUnit = function (size, baseSize, ratio) {
    if (size === null || isNaN(parseFloat(size))) {
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
    // TODO:
    return 0;
};
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
var suteganaConvert = function (beforeText) {
    return suteganaList.reduce(function (previous, sutegana) { return previous.replace(sutegana.before, sutegana.after); }, beforeText);
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
var getAttributes = function (baseText, finishTextFrame, isVertical) {
    var definedFont = null;
    var definedSize = null;
    var definedOffset = null;
    var tryAlignment = "kata";
    var trySutegana = false;
    var tryNarrow = true;
    var finalBaseDifference = 0;
    var rubyList = [];
    var regex = new RegExp(Object.values(noGlyphs).join("|"), "g");
    baseText = baseText.replace(regex, "");
    for (var i = 0; i < baseText.length; i++) {
        // ruby
        if (baseText[i] === rubyDelimiters.from &&
            baseText[i + 1] !== rubyDelimiters.from) {
            var subsequentText = baseText.substring(i + 1);
            var splited = subsequentText
                .substring(0, subsequentText.indexOf(rubyDelimiters.to))
                .split(rubyDelimiters.split);
            if (splited.length < 2) {
                continue;
            }
            var baseChars = splited[0], rubyChars = splited[1];
            var finalBaseIndex = i - finalBaseDifference;
            // get outlined paths
            var textOutline = finishTextFrame.duplicate().createOutline();
            var basePaths = __spreadArray([], textOutline.compoundPathItems, true).slice(textOutline.compoundPathItems.length -
                (finalBaseIndex + baseChars.length), textOutline.compoundPathItems.length - finalBaseIndex);
            // add an information of ruby
            var rubyInfo = {
                kana: rubyChars,
                alignment: tryAlignment,
                font: definedFont !== null && definedFont !== void 0 ? definedFont : finishTextFrame.characters[finalBaseIndex].characterAttributes
                    .textFont,
                x: isVertical
                    ? Math.max.apply(Math, basePaths.map(function (path) { return path.left; })) : basePaths[basePaths.length - 1].left,
                y: isVertical
                    ? basePaths[basePaths.length - 1].top
                    : Math.max.apply(Math, basePaths.map(function (path) { return path.top; })),
                baseWidth: 0,
                baseHeight: 0,
                offset: 0,
                narrow: tryNarrow,
                size: {
                    base: finishTextFrame.characters[i].characterAttributes.size,
                    ruby: 0
                }
            };
            rubyInfo.baseWidth = basePaths[0].left + basePaths[0].width - rubyInfo.x;
            rubyInfo.baseHeight = rubyInfo.y - basePaths[0].top + basePaths[0].height;
            rubyInfo.size.ruby = convertUnit(definedSize, rubyInfo.size.base, 0.5);
            rubyInfo.offset = convertUnit(definedOffset, rubyInfo.size.base, 0);
            rubyList.push(rubyInfo);
            textOutline.remove();
            finalBaseDifference += rubyChars.length + 3;
            i += baseChars.length + rubyChars.length + 2;
        }
        // attribute
        else if (baseText[i] === attributeDelimiters.from &&
            baseText[i + 1] !== attributeDelimiters.from) {
            var splited = baseText
                .substring(i + 1, baseText.indexOf(attributeDelimiters.to))
                .split(attributeDelimiters.split);
            if (splited.length < 2) {
                continue;
            }
            switch (splited[0]) {
                case "align":
                    tryAlignment = splited[1] === "naka" ? "naka" : "kata";
                    break;
                case "size":
                    definedSize = splited[1] === "base" ? null : splited[1];
                    break;
                case "offset":
                    definedOffset = splited[1] === "base" ? null : splited[1];
                    break;
                case "sutegana":
                    trySutegana = splited[1] === "true" ? true : false;
                    break;
                case "narrow":
                    tryNarrow = splited[1] === "false" ? false : true;
                    break;
                case "font":
                    var font = splited[1] === "base" ? null : splited[1];
                    try {
                        definedFont = app.textFonts.getByName(font);
                    }
                    catch (e) {
                        definedFont = null;
                    }
                    break;
            }
            finalBaseDifference += baseText.indexOf(attributeDelimiters.to) - i + 1;
        }
    }
    return rubyList;
};
var addRubys = function (rubyList, isVertical) {
    var rubyGroup = activeDocument.groupItems.add();
    rubyList.forEach(function (ruby, index) {
        // create the textframe for a ruby
        var rubyTextFrame = rubyGroup.textFrames.add();
        rubyTextFrame.textRange.characterAttributes.size = ruby.size.ruby;
        rubyTextFrame.textRange.characterAttributes.textFont = ruby.font;
        rubyTextFrame.contents = ruby.kana;
        // set a position
        var count = 1;
        var variable = isVertical ? ruby.x : ruby.y;
        rubyList.forEach(function (ruby2, index2) {
            if (index !== index2) {
                var margin = isVertical ? ruby.x - ruby2.x : ruby.y - ruby2.y;
                if (margin < ruby.size.ruby * 0.5 && margin > ruby.size.ruby * -0.5) {
                    variable += isVertical ? ruby2.x : ruby2.y;
                    count++;
                }
            }
        });
        variable /= count;
        rubyTextFrame.orientation = isVertical
            ? TextOrientation.VERTICAL
            : TextOrientation.HORIZONTAL;
        var kanaSize = ruby.size.ruby * ruby.kana.length;
        if (isVertical) {
            if (ruby.baseHeight - kanaSize > ruby.size.ruby * -0.3 || !ruby.narrow) {
                rubyTextFrame.top =
                    ruby.alignment === "kata"
                        ? ruby.y
                        : ruby.y - (ruby.baseHeight - kanaSize) / 2;
            }
            else {
                rubyTextFrame.top = ruby.y;
                rubyTextFrame.textRange.characterAttributes.horizontalScale =
                    (ruby.baseHeight / kanaSize) * 100;
            }
            rubyTextFrame.left = variable + ruby.size.base + ruby.offset;
        }
        else {
            if (ruby.baseWidth - kanaSize > ruby.size.ruby * -0.3 || !ruby.narrow) {
                rubyTextFrame.left =
                    ruby.alignment === "kata"
                        ? ruby.x
                        : ruby.x + (ruby.baseWidth - kanaSize) / 2;
            }
            else {
                rubyTextFrame.left = ruby.x;
                rubyTextFrame.textRange.characterAttributes.horizontalScale =
                    (ruby.baseWidth / kanaSize) * 100;
            }
            rubyTextFrame.top = variable + ruby.size.ruby + ruby.offset;
        }
    });
};
var main = function () {
    var selectedTextFrame = getSelectedTextFrame();
    if (selectedTextFrame.base == null || selectedTextFrame.finish == null) {
        alert("レイヤー名として finish, base を含むテキストフレームを1つずつ選択してください");
        return false;
    }
    var isVertical = selectedTextFrame.finish.orientation === TextOrientation.VERTICAL;
    var rubyList = getAttributes(selectedTextFrame.base.contents, selectedTextFrame.finish, isVertical);
    addRubys(rubyList, isVertical);
    alert("".concat(rubyList.length, " \u500B\u306E\u30EB\u30D3\u3092\u4ED8\u4E0E\u3057\u307E\u3057\u305F"));
};
main();


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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(607);
/******/ 	
/******/ })()
;