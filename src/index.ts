import "./polyfill";
import { RubyInfo } from "./ruby";

const convertUnit = (size: string | null, baseSize: number, ratio: number) => {
  if (size === null || isNaN(parseFloat(size))) {
    return baseSize * ratio;
  }
  const num = parseFloat(size);
  const unit = size.replace(/[0-9]*/, "").match(/pt|cm|mm|Q|H|px|%/);
  const mmPerPt = 2.8346;
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

const suteganaList: {
  before: string;
  after: string;
}[] = [
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

const suteganaConvert = (beforeText: string) =>
  suteganaList.reduce(
    (previous, sutegana) => previous.replace(sutegana.before, sutegana.after),
    beforeText
  );

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

const rubyDelimiters = {
  from: "[",
  to: "]",
  split: "|",
} as const;
const attributeDelimiters = {
  from: "(",
  to: ")",
  split: "|",
} as const;

const getSelectedTextFrame = () => {
  // check the selected objects
  let finish: any | null = null;
  let base: TextFrame | null = null;
  for (const selectedObj of activeDocument.selection) {
    if (
      selectedObj.typename === "TextFrame" &&
      selectedObj.name.match(/finish/) != null
    ) {
      finish = selectedObj;
    }
    if (
      selectedObj.typename === "TextFrame" &&
      selectedObj.name.match(/base/) != null
    ) {
      base = selectedObj;
    }
  }
  return { base, finish };
};

const getAttributes = (
  baseText: string,
  finishTextFrame: any,
  isVertical: boolean
) => {
  let definedFont: TextFont | null = null;
  let definedSize: string | null = null;
  let definedOffset: string | null = null;
  let tryAlignment = "kata";
  let trySutegana = false;
  let tryNarrow = true;

  let finalBaseDifference = 0;
  const rubyList: RubyInfo[] = [];
  const regex = new RegExp(Object.values(noGlyphs).join("|"), "g");
  baseText = baseText.replace(regex, "");

  for (let i = 0; i < baseText.length; i++) {
    // ruby
    if (
      baseText[i] === rubyDelimiters.from &&
      baseText[i + 1] !== rubyDelimiters.from
    ) {
      const subsequentText = baseText.substring(i + 1);
      const splited = subsequentText
        .substring(0, subsequentText.indexOf(rubyDelimiters.to))
        .split(rubyDelimiters.split);
      if (splited.length < 2) {
        continue;
      }
      const [baseChars, rubyChars] = splited;
      const finalBaseIndex = i - finalBaseDifference;

      // get outlined paths
      const textOutline = (
        finishTextFrame.duplicate() as TextFrame
      ).createOutline();
      const basePaths = [...textOutline.compoundPathItems].slice(
        textOutline.compoundPathItems.length -
          (finalBaseIndex + baseChars.length),
        textOutline.compoundPathItems.length - finalBaseIndex
      );

      // add an information of ruby
      const rubyInfo: RubyInfo = {
        kana: rubyChars,
        alignment: tryAlignment,
        font:
          definedFont ??
          finishTextFrame.characters[finalBaseIndex].characterAttributes
            .textFont,
        x: isVertical
          ? Math.max(...basePaths.map((path) => path.left))
          : basePaths[basePaths.length - 1].left,
        y: isVertical
          ? basePaths[basePaths.length - 1].top
          : Math.max(...basePaths.map((path) => path.top)),
        baseWidth: 0,
        baseHeight: 0,
        offset: 0,
        narrow: tryNarrow,
        size: {
          base: finishTextFrame.characters[i].characterAttributes.size,
          ruby: 0,
        },
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
    else if (
      baseText[i] === attributeDelimiters.from &&
      baseText[i + 1] !== attributeDelimiters.from
    ) {
      const splited = baseText
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
          const font = splited[1] === "base" ? null : splited[1];
          try {
            definedFont = app.textFonts.getByName(font!);
          } catch (e) {
            definedFont = null;
          }
          break;
      }
      finalBaseDifference += baseText.indexOf(attributeDelimiters.to) - i + 1;
    }
  }
  return rubyList;
};

const addRubys = (rubyList: RubyInfo[], isVertical: boolean) => {
  const rubyGroup = activeDocument.groupItems.add();

  rubyList.forEach((ruby, index) => {
    // create the textframe for a ruby
    const rubyTextFrame = rubyGroup.textFrames.add();
    rubyTextFrame.textRange.characterAttributes.size = ruby.size.ruby;
    rubyTextFrame.textRange.characterAttributes.textFont = ruby.font;
    rubyTextFrame.contents = ruby.kana;

    // set a position
    let count = 1;
    let variable = isVertical ? ruby.x : ruby.y;
    rubyList.forEach((ruby2, index2) => {
      if (index !== index2) {
        const margin = isVertical ? ruby.x - ruby2.x : ruby.y - ruby2.y;
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
    const kanaSize = ruby.size.ruby * ruby.kana.length;

    if (isVertical) {
      if (ruby.baseHeight - kanaSize > ruby.size.ruby * -0.3 || !ruby.narrow) {
        rubyTextFrame.top =
          ruby.alignment === "kata"
            ? ruby.y
            : ruby.y - (ruby.baseHeight - kanaSize) / 2;
      } else {
        rubyTextFrame.top = ruby.y;
        rubyTextFrame.textRange.characterAttributes.horizontalScale =
          (ruby.baseHeight / kanaSize) * 100;
      }
      rubyTextFrame.left = variable + ruby.size.base + ruby.offset;
    } else {
      if (ruby.baseWidth - kanaSize > ruby.size.ruby * -0.3 || !ruby.narrow) {
        rubyTextFrame.left =
          ruby.alignment === "kata"
            ? ruby.x
            : ruby.x + (ruby.baseWidth - kanaSize) / 2;
      } else {
        rubyTextFrame.left = ruby.x;
        rubyTextFrame.textRange.characterAttributes.horizontalScale =
          (ruby.baseWidth / kanaSize) * 100;
      }
      rubyTextFrame.top = variable + ruby.size.ruby + ruby.offset;
    }
  });
};

const main = () => {
  const selectedTextFrame = getSelectedTextFrame();
  if (selectedTextFrame.base == null || selectedTextFrame.finish == null) {
    alert(
      "レイヤー名として finish, base を含むテキストフレームを1つずつ選択してください"
    );
    return false;
  }

  const isVertical =
    selectedTextFrame.finish.orientation === TextOrientation.VERTICAL;
  const rubyList = getAttributes(
    selectedTextFrame.base.contents,
    selectedTextFrame.finish,
    isVertical
  );

  addRubys(rubyList, isVertical);
  alert(`${rubyList.length} 個のルビを付与しました`);
};
main();
