import "./polyfill";
import { classifyCharacterClass, convertSutegana } from "./character";
import {
  alignment,
  defaultAlignment,
  defaultNarrow,
  defaultSutegana,
  isAlignment,
  RubyInfo,
} from "./ruby";

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

export const getAttributes = () => {};

export const createRubyInfo = (
  baseText: string,
  finishTextFrame: any,
  isVertical: boolean
) => {
  let definedFont: TextFont | null = null;
  let definedSize: string | null = null;
  let definedOffset: string | null = null;
  let tryAlignment: alignment = defaultAlignment;
  let convertsSutegana = defaultSutegana;
  let tryNarrow = defaultNarrow;

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
      const finalBaseIndex = i - finalBaseDifference;

      // get outlined paths
      const textOutline = (
        finishTextFrame.duplicate() as TextFrame
      ).createOutline();
      const basePaths = [...textOutline.compoundPathItems].slice(
        textOutline.compoundPathItems.length -
          (finalBaseIndex + splited[0].length),
        textOutline.compoundPathItems.length - finalBaseIndex
      );

      // add an information of ruby
      const ruby: RubyInfo = {
        base: splited[0],
        kana: splited[1],
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
          base: finishTextFrame.characters[finalBaseIndex].characterAttributes
            .size,
          ruby: 0,
        },
      };

      ruby.baseWidth = basePaths[0].left + basePaths[0].width - ruby.x;
      ruby.baseHeight = ruby.y - basePaths[0].top + basePaths[0].height;
      ruby.size.ruby = convertUnit(definedSize, ruby.size.base, 0.5);
      ruby.offset = convertUnit(definedOffset, ruby.size.base, 0);
      rubyList.push(ruby);

      textOutline.remove();
      finalBaseDifference += ruby.kana.length + 3;
      i += ruby.base.length + ruby.kana.length + 2;
    }

    // attribute
    else if (
      baseText[i] === attributeDelimiters.from &&
      baseText[i + 1] !== attributeDelimiters.from
    ) {
      const subsequentText = baseText.substring(i + 1);
      const splited = subsequentText
        .substring(0, subsequentText.indexOf(attributeDelimiters.to))
        .split(attributeDelimiters.split);
      if (splited.length < 2) {
        continue;
      }
      switch (splited[0]) {
        case "align":
          tryAlignment = isAlignment(splited[1])
            ? splited[1]
            : defaultAlignment;
          break;
        case "size":
          definedSize = splited[1] === "base" ? null : splited[1];
          break;
        case "offset":
          definedOffset = splited[1] === "base" ? null : splited[1];
          break;
        case "sutegana":
          convertsSutegana =
            splited[1] === "true" ? defaultSutegana : splited[1] === "true";
          break;
        case "narrow":
          tryNarrow =
            splited[1] === "base" ? defaultNarrow : splited[1] === "true";
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
      i += baseText.indexOf(attributeDelimiters.to) - i;
    }
  }
  return rubyList;
};

const addRubys = (rubyList: RubyInfo[], isVertical: boolean) => {
  const rubyGroup = activeDocument.groupItems.add();
  rubyGroup.name = "ruby";

  rubyList.forEach((ruby, index) => {
    // The width of the outlined text is smaller than the virtual body (仮想ボディ).
    // When the character class of the parent character is Kanji,
    // the parent character is assumed to be full-width,
    // and The larger of |the parent character size x the number of characters| or
    // |ruby.baseWidth| (or baseHeight in vertical direction) is adopted as |baseLength|.
    const measuredBaseLength = isVertical ? ruby.baseHeight : ruby.baseWidth;
    const baseLength = Math.max(
      measuredBaseLength,
      ruby.base
        .split("")
        .every((character) => classifyCharacterClass(character) === "kanji")
        ? ruby.size.base * ruby.base.length
        : 0
    );
    const kanaLength = ruby.size.ruby * ruby.kana.length;

    // create the textframe for a ruby
    const rubyTextFrame = rubyGroup.textFrames.add();
    rubyTextFrame.textRange.characterAttributes.size = ruby.size.ruby;
    rubyTextFrame.textRange.characterAttributes.textFont = ruby.font;
    rubyTextFrame.contents = ruby.kana;
    rubyTextFrame.orientation = isVertical
      ? TextOrientation.VERTICAL
      : TextOrientation.HORIZONTAL;

    if (ruby.alignment === "jis" && baseLength > kanaLength) {
      rubyTextFrame.textRange.characterAttributes.tracking =
        ((baseLength - kanaLength) / ruby.kana.length / ruby.size.ruby) * 1000;
    }

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

    const isNarrow = ruby.narrow && kanaLength > baseLength;
    if (isNarrow) {
      rubyTextFrame.textRange.characterAttributes.horizontalScale =
        (baseLength / kanaLength) * 100;
    }

    const rubyAdjustment =
      measuredBaseLength -
      baseLength +
      (isNarrow || ruby.alignment === "kata"
        ? 0
        : (baseLength - kanaLength) /
          (ruby.alignment === "jis"
            ? ruby.kana.length / 2
            : (baseLength - kanaLength) / 2));

    // vertical
    if (isVertical) {
      rubyTextFrame.top = ruby.y + rubyAdjustment;
      rubyTextFrame.left = variable + ruby.size.base + ruby.offset;
    }
    // horizontal
    else {
      rubyTextFrame.left = ruby.x + rubyAdjustment;
      rubyTextFrame.top = variable + ruby.size.ruby + ruby.offset;
    }
  });
};

const main = () => {
  const selectedTextFrame = getSelectedTextFrame();
  if (selectedTextFrame.base == null || selectedTextFrame.finish == null) {
    alert(
      `レイヤー名として finish, base を含むテキストフレームを1つずつ選択してください`
    );
    return false;
  }

  const isVertical =
    selectedTextFrame.finish.orientation === TextOrientation.VERTICAL;
  const rubyList = createRubyInfo(
    selectedTextFrame.base.contents,
    selectedTextFrame.finish,
    isVertical
  );

  addRubys(rubyList, isVertical);
  alert(`${rubyList.length} 個のルビを付与しました`);
};
main();
