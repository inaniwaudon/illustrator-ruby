import { RubyInfo } from "./ruby";

// display a error message
const displayError = (e: Error) => {
  alert("Error!\n" + e.message);
  return false;
};

const unitConvert = (size: string | null, basesize: number, basex: number) => {
  if (size == null || isNaN(parseFloat(size))) {
    return basesize * basex;
  }
  const num = parseFloat(size);
  const unit = size.replace(/[0-9]*/, "").match(/pt|cm|mm|Q|H|px|%/);
  if (unit != null) {
    switch (unit[0]) {
      case "pt":
        return num;
      case "cm":
        return num * 28.346;
      case "mm":
        return num * 2.8346;
      case "Q":
        return num * 2.8346 * 0.25;
      case "H":
        return num * 2.8346 * 0.25;
      case "px":
        return num * 0.75;
      case "%":
        return (num / 100) * basesize;
    }
  }
  // TODO:
  return 0;
};

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

const noGlyphs = {
  space: unescape("%u0020"),
  zenkakuSpace: unescape("%u3000"),
  emSpace: unescape("%u2003"),
  CR: CR,
  LF: LF,
  tab: "\t",
};

const load = () => {
  // check the selected objects
  let finishObj, baseObj: any | null;
  for (const selectedObj of activeDocument.selection) {
    if (
      selectedObj.typename == "TextFrame" &&
      selectedObj.name.match(/finish/) != null
    ) {
      finishObj = selectedObj;
    }
    if (
      selectedObj.typename == "TextFrame" &&
      selectedObj.name.match(/base/) != null
    ) {
      baseObj = selectedObj;
    }
  }

  // exit if finish or base text frame does not exist
  if (finishObj == null || baseObj == null) {
    displayError(
      new Error(
        'Please, select the two object of textframe including "finish" and "base" in the name'
      )
    );
    return false;
  }

  var baseText: string = baseObj.textRange.contents;
  var rubyGroup = activeDocument.groupItems.add();
  var direction =
    finishObj.orientation == TextOrientation.VERTICAL
      ? "vertical"
      : "horizontal";

  let definedFont: string | null = null;
  let definedSize: string | null = null;
  let definedOffset: string | null = null;
  let tryAlignment = "kata";
  let trySutegana = false;
  let tryNarrow = true;

  const rubyList: RubyInfo[] = [];
  let noGlyphCount = 0;

  for (let i = 0; i < baseText.length; i++) {
    // check the glyph is not space
    const regex = new RegExp(Object.values(noGlyphs).join("|"));

    try {
      if (baseText[i].match(regex) == null) {
        // search a delimiter for ruby
        if (baseText[i] == "[" && baseText[i + 1] != "[") {
          const text = baseText.substring(i + 1, baseText.indexOf("]"));
          const ruby = {
            text,
            kanji: text.split("[")[0],
            kana: !trySutegana
              ? suteganaConvert(text.split("[")[1])
              : text.split("[")[1],
          };
          baseText =
            baseText.substring(0, i) +
            ruby.kanji +
            baseText.substr(baseText.indexOf("]") + 1);

          // 1文字目 属性取得
          const textOutline = finishObj.duplicate().createOutline();
          const obj = textOutline.compoundPathItems;
          const key: number =
            textOutline.compoundPathItems.length - noGlyphCount - 1;

          const rubyInfo: RubyInfo = {
            kana: ruby.kana,
            alignment: tryAlignment,
            font:
              definedFont ??
              finishObj.characters[i].characterAttributes.textFont,
            x: 0,
            y: 0,
            baseWidth: 0,
            baseHeight: 0,
            offset: 0,
            narrow: tryNarrow,
            size: {
              ruby: 0,
              base: 0,
            },
          };

          // set a position
          if (direction === "vertical") {
            rubyInfo.y = obj[key].top;
            for (let j = 0; j < ruby.kanji.length; j++) {
              var x = obj[key - j].left;
              rubyInfo.x =
                rubyInfo.x == null || rubyInfo.x! < x ? x : rubyInfo.x;
            }
          } else {
            rubyInfo.x = obj[key].left;
            for (let j = 0; j < ruby.kanji.length; j++) {
              const y = obj[key - j].top;
              rubyInfo.y =
                rubyInfo.y == null || rubyInfo.y! < y ? y : rubyInfo.y;
            }
          }

          // set a width and height
          rubyInfo.baseWidth =
            obj[key - ruby.kanji.length + 1].left +
            obj[key - ruby.kanji.length + 1].width -
            rubyInfo.x;
          rubyInfo.baseHeight =
            rubyInfo.y -
            obj[key - ruby.kanji.length + 1].top +
            obj[key - ruby.kanji.length + 1].height;

          rubyInfo.size.base = finishObj.characters[i].characterAttributes.size;
          rubyInfo.size.ruby = unitConvert(
            definedSize,
            rubyInfo.size.base,
            0.5
          );
          rubyInfo.offset = unitConvert(definedOffset, rubyInfo.size.base, 0);
          textOutline.remove();
          rubyList.push(rubyInfo);

          // group rubies
        } else if (baseText[i] == "[" && baseText[i + 1] == "[") {
          i++;
        }
        // process text
        else if (baseText[i] == "(" && baseText[i + 1] != "(") {
          const tmpText = baseText.substring(i + 1, baseText.indexOf(")"));
          const process = {
            text: tmpText,
            property: tmpText.split("(")[0],
            value: tmpText.split("(")[1],
          };
          baseText =
            baseText.substring(0, i) +
            baseText.substring(baseText.indexOf(")") + 1);

          switch (process.property) {
            case "align":
              tryAlignment = process.value == "naka" ? "naka" : "kata";
              break;
            case "size":
              definedSize = process.value == "base" ? null : process.value;
              break;
            case "offset":
              definedOffset = process.value == "base" ? null : process.value;
              break;
            case "sutegana":
              trySutegana = process.value == "true" ? true : false;
              break;
            case "narrow":
              tryNarrow = process.value == "false" ? false : true;
              break;
            case "font":
              const font = process.value == "base" ? null : process.value;
              try {
                definedFont = app.textFonts.getByName(font!).name;
              } catch (e) {
                definedFont = null;
              }
              break;
          }
          i--;
          noGlyphCount--;
        } else if (baseText[i] == "(" && baseText[i + 1] == "(") {
          i++;
        } else {
          noGlyphCount--;
        }
      }
    } catch (e) {
      displayError(
        new Error(
          'Please check that the own two text textframe including name "finish" and "base" was pair.'
        )
      );
      return false;
    }
    noGlyphCount++;
  }

  for (let i = 0; i < rubyList.length; i++) {
    const rubySize = rubyList[i].size.ruby;
    const align = rubyList[i].alignment;
    const kanaSize = rubySize * rubyList[i].kana.length;
    const isVertical = direction === "vertical";

    // create the textframe for a ruby
    const rubyTextFrame = rubyGroup.textFrames.add();
    rubyTextFrame.textRange.characterAttributes.size = rubySize;
    rubyTextFrame.textRange.characterAttributes.textFont = rubyList[i].font;
    rubyTextFrame.contents = rubyList[i].kana;

    // set a position
    let count = 1;
    let variable = isVertical ? rubyList[i].x : rubyList[i].y;
    rubyList.forEach((ruby, index) => {
      if (index !== i) {
        const margin = isVertical
          ? rubyList[i].x - ruby.x
          : rubyList[i].y - ruby.y;
        if (margin < rubySize * 0.5 && margin > rubySize * -0.5) {
          variable += isVertical ? ruby.x : ruby.y;
          count++;
        }
      }
    });
    variable /= count;

    rubyTextFrame.orientation = isVertical
      ? TextOrientation.VERTICAL
      : TextOrientation.HORIZONTAL;

    if (isVertical) {
      if (
        rubyList[i].baseHeight - kanaSize > rubySize * -0.3 ||
        !rubyList[i].narrow
      ) {
        rubyTextFrame.top =
          align === "kata"
            ? rubyList[i].y
            : rubyList[i].y - (rubyList[i].baseHeight - kanaSize) / 2;
      } else {
        rubyTextFrame.top = rubyList[i].y;
        rubyTextFrame.textRange.characterAttributes.horizontalScale =
          (rubyList[i].baseHeight / kanaSize) * 100;
      }
      rubyTextFrame.left =
        variable + rubyList[i].size.base + rubyList[i].offset;
    } else {
      if (
        rubyList[i].baseWidth - kanaSize > rubySize * -0.3 ||
        !rubyList[i].narrow
      ) {
        rubyTextFrame.left =
          align == "kata"
            ? rubyList[i].x
            : rubyList[i].x + (rubyList[i].baseWidth - kanaSize) / 2;
      } else {
        rubyTextFrame.left = rubyList[i].x;
        rubyTextFrame.textRange.characterAttributes.horizontalScale =
          (rubyList[i].baseWidth / kanaSize) * 100;
      }
      rubyTextFrame.top = variable + rubySize + rubyList[i].offset;
    }
  }
  alert("Finished\nThe number of wrote ruby characters : " + rubyList.length);
};

load();
