//エラー スクリプト終了
function appError(e) {
  alert("Error!\n" + e.message);
  return false;
}

function unitConvert(size, basesize, basex) {
  var num = parseFloat(size, 10);
  if (size == null || isNaN(num)) return basesize * basex;
  else {
    var unit = size.replace(/[0-9]*/, "").match(/pt|cm|mm|Q|H|px|%/);
    if (unit != null) {
      switch (unit[0]) {
        case "pt":
          return num;
          break;
        case "cm":
          return num * 28.346;
          break;
        case "mm":
          return num * 2.8346;
          break;
        case "Q":
          return num * 2.8346 * 0.25;
          break;
        case "H":
          return num * 2.8346 * 0.25;
          break;
        case "px":
          return num * 0.75;
          break;
        case "%":
          return (num / 100) * basesize;
          break;
      }
    }
  }
}

var sutegana = [
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

function suteganaConvert(beforeText) {
  for (var key in sutegana)
    beforeText = beforeText.replace(sutegana[key].before, sutegana[key].after);
  return beforeText;
}

const CR = String.fromCharCode(13);
const LF = String.fromCharCode(10);

load();
function load() {
  //選択オブジェクトの型／名前を確認
  var selection = activeDocument.selection;
  for (var i = 0; i < selection.length; i++) {
    var selectObj = selection[i];
    var finishObj =
      selectObj.typename == "TextFrame" &&
      selectObj.name.match(/finish/) != null
        ? selectObj
        : finishObj;
    var baseObj =
      selectObj.typename == "TextFrame" && selectObj.name.match(/base/) != null
        ? selectObj
        : baseObj;
  }

  if (finishObj != null && baseObj != null) {
    var narrow = true;

    var rubyList = [];
    var rubyi = 0;
    var baseText = baseObj.textRange.contents;
    var rubyGroup = activeDocument.groupItems.add();
    var direction =
      finishObj.orientation == TextOrientation.VERTICAL
        ? "vertical"
        : "horizontal";
    var trySize,
      tryFont,
      tryOffset = null;
    var tryAlignment = "kata";
    var trySutegana = false;
    var tryNarrow = true;

    var noGlyphi = 0;
    for (var i = 0; i < baseText.length; i++) {
      //グリフ形状検査（スペースでないか）
      var noGlyph = {
        space: unescape("%u0020"),
        zenkakuSpace: unescape("%u3000"),
        emSpace: unescape("%u2003"),
        CR: CR,
        LF: LF,
        tab: "\t",
      };

      var regexText = "";
      for (var key in noGlyph) regexText += noGlyph[key] + "|";
      regexText = regexText.substr(0, regexText.length - 1);
      var regex = new RegExp(regexText);
      try {
        if (baseText[i].match(regex) == null) {
          //ルビ用区切り文字探索
          if (baseText[i] == "[" && baseText[i + 1] != "[") {
            var ruby = {
              text: baseText.substring(i + 1, baseText.indexOf("]")).toString(),
            };
            ruby.kanji = ruby.text.split("[")[0];
            ruby.kana = !trySutegana
              ? suteganaConvert(ruby.text.split("[")[1])
              : ruby.text.split("[")[1];
            baseText =
              baseText.substring(0, i) +
              ruby.kanji +
              baseText.substr(baseText.indexOf("]") + 1);

            //1文字目 属性取得
            var textOutline = finishObj.duplicate().createOutline();
            var obj = textOutline.compoundPathItems;
            var key = textOutline.compoundPathItems.length - noGlyphi - 1;
            rubyList[rubyi] = { kana: ruby.kana, x: null, y: null };

            //x・y座標取得
            if (direction == "vertical") {
              rubyList[rubyi].y = obj[key].top;
              for (var k = 0; k < ruby.kanji.length; k++) {
                var x = obj[key - k].left;
                rubyList[rubyi].x =
                  rubyList[rubyi].x < x || rubyList[rubyi].x == null
                    ? x
                    : rubyList[rubyi].x;
              }
            } else {
              rubyList[rubyi].x = obj[key].left;
              for (var k = 0; k < ruby.kanji.length; k++) {
                var y = obj[key - k].top;
                rubyList[rubyi].y =
                  rubyList[rubyi].y < y || rubyList[rubyi].y == null
                    ? y
                    : rubyList[rubyi].y;
              }
            }

            //幅・高さ取得
            rubyList[rubyi].basewidth =
              obj[key - ruby.kanji.length + 1].left +
              obj[key - ruby.kanji.length + 1].width -
              rubyList[rubyi].x;
            rubyList[rubyi].baseheight =
              rubyList[rubyi].y -
              obj[key - ruby.kanji.length + 1].top +
              obj[key - ruby.kanji.length + 1].height;
            rubyList[rubyi].alignment = tryAlignment;
            rubyList[rubyi].size = {
              base: finishObj.characters[i].characterAttributes.size,
            };
            rubyList[rubyi].size.ruby = unitConvert(
              trySize,
              rubyList[rubyi].size.base,
              0.5
            );
            rubyList[rubyi].offset = unitConvert(
              tryOffset,
              rubyList[rubyi].size.base,
              0
            );
            rubyList[rubyi].font =
              tryFont != null
                ? tryFont
                : finishObj.characters[i].characterAttributes.textFont;
            rubyList[rubyi].narrow = tryNarrow;
            textOutline.remove();
            rubyi++;

            //ルビグループ化
          } else if (baseText[i] == "[" && baseText[i + 1] == "[") i++;
          else if (baseText[i] == "(" && baseText[i + 1] != "(") {
            //テキスト処理
            var process = {
              text: baseText.substring(i + 1, baseText.indexOf(")")),
            };
            process.property = process.text.split("(")[0];
            process.value = process.text.split("(")[1];
            baseText =
              baseText.substring(0, i) +
              baseText.substr(baseText.indexOf(")") + 1);

            if (process.property == "align")
              tryAlignment = process.value == "naka" ? "naka" : "kata";
            else if (process.property == "size")
              trySize = process.value == "base" ? null : process.value;
            else if (process.property == "offset")
              tryOffset = process.value == "base" ? null : process.value;
            else if (process.property == "sutegana")
              trySutegana = process.value == "true" ? true : false;
            else if (process.property == "narrow")
              tryNarrow = process.value == "false" ? false : true;
            else if (process.property == "font") {
              var font = process.value == "base" ? null : process.value;
              try {
                tryFont = app.textFonts.getByName(font);
              } catch (e) {
                tryFont = null;
              }
            }

            i--;
            noGlyphi--;
          } else if (baseText[i] == "(" && baseText[i + 1] == "(") i++;
        } else noGlyphi--;
      } catch (e) {
        appError(
          new Error(
            'Please check that the own two text textframe  including name "finish" and "base" was pair.'
          )
        );
        return false;
      }
      noGlyphi++;
    }

    for (var i = 0; i < rubyList.length; i++) {
      var rubysize = rubyList[i].size.ruby;
      var align = rubyList[i].alignment;
      var kanasize = rubysize * rubyList[i].kana.length;

      //ルビ テキストフレーム作成
      var rubyTextFrame = rubyGroup.textFrames.add();
      rubyTextFrame.textRange.characterAttributes.size = rubysize;
      rubyTextFrame.textRange.characterAttributes.textFont = rubyList[i].font;
      rubyTextFrame.contents = rubyList[i].kana;

      //位置設定
      var count = 1;
      var variable = direction == "vertical" ? rubyList[i].x : rubyList[i].y;
      for (var key in rubyList) {
        if (key != i) {
          var margin =
            direction == "vertical"
              ? rubyList[i].x - rubyList[key].x
              : rubyList[i].y - rubyList[key].y;
          if (margin < rubysize * 0.5 && margin > rubysize * -0.5) {
            variable +=
              direction == "vertical" ? rubyList[key].x : rubyList[key].y;
            count++;
          }
        }
      }
      variable /= count;

      rubyTextFrame.orientation =
        direction == "vertical"
          ? TextOrientation.VERTICAL
          : TextOrientation.HORIZONTAL;
      if (direction == "vertical") {
        if (
          rubyList[i].baseheight - kanasize > rubysize * -0.3 ||
          !rubyList[i].narrow
        )
          rubyTextFrame.top =
            align == "kata"
              ? rubyList[i].y
              : rubyList[i].y - (rubyList[i].baseheight - kanasize) / 2;
        else {
          rubyTextFrame.top = rubyList[i].y;
          rubyTextFrame.textRange.characterAttributes.horizontalScale =
            (rubyList[i].baseheight / kanasize) * 100;
        }
        rubyTextFrame.left =
          variable + rubyList[i].size.base + rubyList[i].offset;
      } else {
        if (
          rubyList[i].basewidth - kanasize > rubysize * -0.3 ||
          !rubyList[i].narrow
        )
          rubyTextFrame.left =
            align == "kata"
              ? rubyList[i].x
              : rubyList[i].x + (rubyList[i].basewidth - kanasize) / 2;
        else {
          rubyTextFrame.left = rubyList[i].x;
          rubyTextFrame.textRange.characterAttributes.horizontalScale =
            (rubyList[i].basewidth / kanasize) * 100;
        }
        rubyTextFrame.top = variable + rubysize + rubyList[i].offset;
      }
    }
    alert("Finished\nThe number of wrote ruby characters : " + rubyList.length);
  } else {
    appError(
      new Error(
        'Please, select the two object of textframe including "finish" and "base" in the name'
      )
    );
    return false;
  }
}
