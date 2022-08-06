import {
  classifyCharacterClass,
  convertSutegana,
  getOverhangingRubyCount,
} from "./character";
import {
  defaultAlignment,
  defaultNarrow,
  defaultRubySizeRatio,
  defaultSutegana,
  isAlignment,
  DefinedAttribute,
  MiddleRubyInfo,
  RubyInfo,
  Token,
  MiddleJukugoRubyInfo,
  alignment,
} from "./ruby";

const convertUnit = (size: string, baseSize: number, ratio: number) => {
  if (isNaN(parseFloat(size))) {
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
  return baseSize * ratio;
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

// delimiter
interface Delimiters {
  from: string;
  to: string;
  split: string;
}
const rubyDelimiters: Delimiters = {
  from: "[",
  to: "]",
  split: "|",
};
const jukugoRubyDelimiters: Delimiters = {
  from: "<",
  to: ">",
  split: "|",
};
const attributeDelimiters: Delimiters = {
  from: "(",
  to: ")",
  split: "|",
};

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

export const tokenizeText = (baseText: string) => {
  /*const removedSpaceText = baseText.replace(
    new RegExp(Object.values(noGlyphs).join("|"), "g"),
    ""
  );*/
  const spacesRegex = new RegExp(Object.values(noGlyphs).join("|"));
  const tokens: Token[] = [];
  let finalBaseDifference = 0;

  for (let i = 0; i < removedSpaceText.length; i++) {
    // space
    if (baseText.match(spacesRegex)) {
      finalBaseDifference++;
      continue;
    }

    // ruby
    const startsJukugoRuby = removedSpaceText[i] === jukugoRubyDelimiters.from;
    if (
      (removedSpaceText[i] === rubyDelimiters.from &&
        removedSpaceText[i + 1] !== rubyDelimiters.from) ||
      (startsJukugoRuby &&
        removedSpaceText[i + 1] !== jukugoRubyDelimiters.from)
    ) {
      const subsequentText = removedSpaceText.substring(i);
      const delimiter = startsJukugoRuby
        ? jukugoRubyDelimiters
        : rubyDelimiters;
      const toIndex = subsequentText.indexOf(delimiter.to);
      const splited = subsequentText
        .substring(1, toIndex)
        .split(delimiter.split);
      if (splited.length < 2) {
        continue;
      }

      // `ruby1|ruby2` represents upper and lower rubys.
      for (let j = 1; j < Math.max(splited.length, 2); j++) {
        // `ruby1/ruby2` is separated into mono rubys.
        const splitedMono = splited[j].split("/");
        if (
          splitedMono.length > 1 &&
          splitedMono.length !== splited[0].length
        ) {
          continue;
        }
        if (startsJukugoRuby) {
          tokens.push({
            type: "jukugo-ruby",
            ruby: splitedMono,
            base: splited[0],
            starts: j === 1,
            charIndex: i - finalBaseDifference,
            outlineIndex: i - finalBaseDifference,
            beforeChar: i > 0 ? removedSpaceText[i - 1] : "",
            afterChar:
              toIndex < removedSpaceText.length - 1
                ? removedSpaceText[toIndex + 1]
                : "",
          });
        } else {
          for (let k = 0; k < splitedMono.length; k++) {
            tokens.push({
              type: "ruby",
              ruby: splitedMono[k],
              base: splitedMono.length === 1 ? splited[0] : splited[0][k],
              starts: j === 1,
              charIndex: i - finalBaseDifference + k,
              outlineIndex: i - finalBaseDifference + k,
            });
          }
        }
      }
      finalBaseDifference += toIndex + 1 - splited[0].length;
      i += toIndex;
    }

    // attribute
    if (
      removedSpaceText[i] === attributeDelimiters.from &&
      removedSpaceText[i + 1] !== attributeDelimiters.from
    ) {
      const subsequentText = removedSpaceText.substring(i);
      const toIndex = subsequentText.indexOf(attributeDelimiters.to);
      const splited = subsequentText
        .substring(1, toIndex)
        .split(attributeDelimiters.split);
      if (splited.length < 2) {
        continue;
      }
      tokens.push({
        type: "attribute",
        key: splited[0],
        value: splited[1],
      });
      finalBaseDifference += toIndex + 1;
      i += toIndex;
    }
  }
  return tokens;
};

const applyAttributesToMiddleRubyInfo = (
  info: { [key in string]: any },
  attribute: DefinedAttribute
) => {
  for (const key in attribute) {
    if (
      [
        "rubySize",
        "offset",
        "font",
        "alignment",
        "sutegana",
        "narrow",
      ].includes(key)
    ) {
      const value = attribute[key as keyof DefinedAttribute];
      if (value !== null) {
        info[key] = value as any;
      }
    }
  }
};

export const applyAttributesToRubyList = (tokens: Token[]) => {
  const defined: DefinedAttribute = {};
  const rubyList: (MiddleRubyInfo | MiddleJukugoRubyInfo)[] = [];

  for (const token of tokens) {
    // ruby
    if (token.type === "ruby" || token.type === "jukugo-ruby") {
      // add an information of ruby
      const ruby: { [key in string]: any } = {
        type: token.type,
        ruby: token.ruby,
        base: token.base,
        starts: token.starts,
        outlineIndex: token.outlineIndex,
      };
      if (token.type === "jukugo-ruby" && ruby.type === "jukugo-ruby") {
        ruby.beforeChar = token.beforeChar;
        ruby.afterChar = token.afterChar;
      }
      applyAttributesToMiddleRubyInfo(ruby, defined);
      rubyList.push(ruby as MiddleRubyInfo | MiddleJukugoRubyInfo);
    }
    // attribute
    else if (token.type === "attribute") {
      switch (token.key) {
        case "align":
          defined.alignment = isAlignment(token.value) ? token.value : null;
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

const convertJukugoRubys = (
  middleRubys: (MiddleRubyInfo | MiddleJukugoRubyInfo)[],
  characters: Characters
) => {
  const resultMiddleRubys: MiddleRubyInfo[] = [];

  for (const middleRuby of middleRubys) {
    // jukugo-ruby
    if (middleRuby.type === "jukugo-ruby") {
      const baseSize =
        characters[middleRuby.outlineIndex].characterAttributes.size;
      // The ruby for which the parent characters are not of the same size is not processed.
      if (
        !middleRuby.ruby.every(
          (_, index) =>
            baseSize ===
            characters[middleRuby.outlineIndex + index].characterAttributes.size
        )
      ) {
        continue;
      }
      const rubyRatio = 0.5;

      const process = (
        advances: boolean,
        overhangs: boolean
      ): [boolean, MiddleRubyInfo[], number[]] => {
        const leftBaseSpaces = [...Array(middleRuby.base.length)].fill(1.0);
        let putBeforeRuby = "";
        let tempMiddleRubys: MiddleRubyInfo[] = [];
        let akis: number[] = [];
        let overflows = false;
        let advance = advances ? 1 : -1;
        for (
          let i = advances ? 0 : middleRuby.ruby.length - 1;
          advances ? i < middleRuby.ruby.length : i >= 0;
          i += advance
        ) {
          const isNotLast = i < middleRuby.ruby.length - 1;
          const rubyPerBaseChar = middleRuby.ruby[i];
          let leftRuby = advances
            ? putBeforeRuby + rubyPerBaseChar
            : rubyPerBaseChar + putBeforeRuby;
          let leftRatio = rubyRatio * leftRuby.length;
          let alignment: alignment | null = null;
          akis.push(0);

          // mono ruby
          const monoRubyRatio = Math.min(leftBaseSpaces[i], leftRatio);
          leftBaseSpaces[i] -= monoRubyRatio;
          leftRatio -= monoRubyRatio;

          // unable to fit within the base character
          // overhang the single after character in the compound word (when moving forward)
          if (
            0 < leftRatio &&
            ((advances && isNotLast) || (!advances && 0 < i)) &&
            rubyRatio <= leftBaseSpaces[i + advance]
          ) {
            leftRatio -= rubyRatio;
          }
          // overhang the single before character in the compound word (when moving forward)
          if (
            0 < leftRatio &&
            ((advances && 0 < i) || (!advances && isNotLast)) &&
            rubyRatio <= leftBaseSpaces[i - advance]
          ) {
            leftBaseSpaces[i - advance] -= rubyRatio;
            leftRatio -= rubyRatio;
            const lastMiddleRuby = tempMiddleRubys[tempMiddleRubys.length - 1];
            lastMiddleRuby.ruby = advances
              ? lastMiddleRuby.ruby + rubyPerBaseChar[0]
              : rubyPerBaseChar[rubyPerBaseChar.length - 1] +
                lastMiddleRuby.ruby;
            leftRuby = advances ? leftRuby.slice(1) : leftRuby.slice(0, -1);
          }
          if (0 < leftRatio) {
            // overhang the single after character outside an the compound word
            if (i === middleRuby.ruby.length - 1) {
              leftRatio -= getOverhangingRubyCount(middleRuby.afterChar);
              overflows = true;
              alignment = "kata";
            }
            // overhang the single after character outside an the compound word
            else if (i === 0) {
              leftRatio -= getOverhangingRubyCount(middleRuby.beforeChar);
              overflows = true;
              // TODO:
              alignment = "kata";
            }
          }
          // insert spaces between the front and back of the compound word
          if (0 < leftRatio) {
            akis[i] = leftRatio / 2;
            alignment = "naka";
          }

          // TODO: insert spaces
          const rubyText = advances ? leftRuby.slice(0, 2) : leftRuby.slice(-2);
          const middleRubyInfo: MiddleRubyInfo = {
            type: "ruby",
            ruby: overflows ? leftRuby : rubyText,
            base: middleRuby.base[i],
            starts: middleRuby.starts,
            charIndex: middleRuby.charIndex + i,
            outlineIndex: middleRuby.outlineIndex + i,
          };
          applyAttributesToMiddleRubyInfo(middleRubyInfo, middleRuby);
          middleRubyInfo.alignment = alignment ?? middleRubyInfo.alignment;
          tempMiddleRubys.push(middleRubyInfo as MiddleRubyInfo);
          putBeforeRuby = advances ? leftRuby.slice(2) : leftRuby.slice(0, -2);
        }
        return [overflows, tempMiddleRubys, akis];
      };

      const applyAkis = (akis: number[]) => {
        for (let i = 0; i < akis.length; i++) {
          const charAttributes =
            characters[middleRuby.outlineIndex + i].characterAttributes;
          charAttributes.akiLeft = akis[i];
          charAttributes.akiRight = akis[i];
        }
      };

      const [overflowsForward, forwardMiddleRubys, forwardAkis] = process(
        true,
        false
      );
      if (!overflowsForward) {
        resultMiddleRubys.push(...forwardMiddleRubys);
        applyAkis(forwardAkis);
      } else {
        const [overflowsBackward, backwardMiddleRubys, backwardAkis] = process(
          false,
          false
        );
        if (!overflowsBackward) {
          resultMiddleRubys.push(...backwardMiddleRubys);
          applyAkis(backwardAkis);
        } else {
          resultMiddleRubys.push(...forwardMiddleRubys);
          applyAkis(forwardAkis);
        }
      }
    } else {
      resultMiddleRubys.push(middleRuby);
    }
  }
  return resultMiddleRubys;
};

const createRubyInfos = (
  middleRubys: MiddleRubyInfo[],
  finishTextFrame: any,
  isVertical: boolean
) => {
  const rubyList: RubyInfo[] = [];

  for (const middleRuby of middleRubys) {
    // get outlined paths
    const textOutline = (
      finishTextFrame.duplicate() as TextFrame
    ).createOutline();
    const basePaths = [...textOutline.compoundPathItems].slice(
      textOutline.compoundPathItems.length -
        (middleRuby.outlineIndex + middleRuby.base.length),
      textOutline.compoundPathItems.length - middleRuby.outlineIndex
    );

    // add an information of ruby
    const charAttributes =
      finishTextFrame.characters[middleRuby.charIndex].characterAttributes;
    const ruby: RubyInfo = {
      ruby: middleRuby.ruby,
      base: middleRuby.base,
      starts: middleRuby.starts,
      alignment: middleRuby.alignment ?? defaultAlignment,
      font: charAttributes.textFont,
      x: isVertical
        ? basePaths.reduce(
            (previous, path) => previous + path.left + path.width / 2,
            0
          ) / basePaths.length
        : basePaths[basePaths.length - 1].left,
      y: isVertical
        ? basePaths[basePaths.length - 1].top
        : basePaths.reduce(
            (previous, path) => previous + path.top - path.height / 2,
            0
          ) / basePaths.length,
      baseWidth: 0,
      baseHeight: 0,
      offset: 0,
      sutegana: middleRuby.sutegana ?? defaultSutegana,
      narrow: middleRuby.narrow ?? defaultNarrow,
      size: {
        base: charAttributes.size,
        ruby: charAttributes.size * defaultRubySizeRatio,
      },
    };

    if (middleRuby.font) {
      try {
        ruby.font = app.textFonts.getByName(middleRuby.font);
      } catch (e) {
        ruby.font = app.textFonts.getFontByName(middleRuby.font);
      }
    }
    ruby.baseWidth = basePaths[0].left + basePaths[0].width - ruby.x;
    ruby.baseHeight = ruby.y - basePaths[0].top + basePaths[0].height;
    if (middleRuby.rubySize !== undefined) {
      ruby.size.ruby = convertUnit(
        middleRuby.rubySize,
        ruby.size.base,
        defaultRubySizeRatio
      );
    }
    if (middleRuby.offset !== undefined) {
      ruby.offset = convertUnit(middleRuby.offset, ruby.size.base, 0);
    }
    rubyList.push(ruby);
    textOutline.remove();
  }
  return rubyList;
};

const addRubys = (rubyList: RubyInfo[], isVertical: boolean) => {
  const rubyGroup = activeDocument.groupItems.add();
  rubyGroup.name = "ruby";

  rubyList.forEach((ruby) => {
    // The width of the outlined text is smaller than the virtual body (仮想ボディ).
    // When the character class of the parent character is Kanji,
    // the parent character is assumed to be full-width,
    // and The larger of ${the parent character size x the number of characters} or
    // ${ruby.baseWidth} (or baseHeight in vertical direction) is adopted as ${baseLength}.
    const measuredBaseLength = isVertical ? ruby.baseHeight : ruby.baseWidth;
    const baseLength = Math.max(
      measuredBaseLength,
      ruby.base
        .split("")
        .every((character) => classifyCharacterClass(character) === "kanji")
        ? ruby.size.base * ruby.base.length
        : 0
    );

    // create the textframe for a ruby
    const textFrame = rubyGroup.textFrames.add();
    textFrame.textRange.characterAttributes.size = ruby.size.ruby;
    textFrame.textRange.characterAttributes.textFont = ruby.font;
    textFrame.contents = ruby.sutegana ? convertSutegana(ruby.ruby) : ruby.ruby;
    textFrame.orientation = isVertical
      ? TextOrientation.VERTICAL
      : TextOrientation.HORIZONTAL;

    const rubyLength = ruby.size.ruby * ruby.ruby.length;
    if (ruby.alignment === "jis" && baseLength > rubyLength) {
      textFrame.textRange.characterAttributes.tracking =
        ((baseLength - rubyLength) / ruby.ruby.length / ruby.size.ruby) * 1000;
    }

    // set a position
    const isNarrow = ruby.narrow && rubyLength > baseLength;
    const rubyAdjustment =
      (measuredBaseLength - baseLength) / 2 +
      (isNarrow || ruby.alignment === "kata" || baseLength - rubyLength === 0
        ? 0
        : (baseLength - rubyLength) /
          (rubyLength > baseLength || ruby.alignment === "naka"
            ? 2
            : ruby.ruby.length * 2));

    const basePosition =
      (isVertical ? ruby.x : ruby.y) +
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
    } else {
      textFrame.left = ruby.x + rubyAdjustment;
      textFrame.top = basePosition + (ruby.starts ? ruby.size.ruby : 0);
      if (isNarrow) {
        textFrame.textRange.characterAttributes.horizontalScale =
          (baseLength / rubyLength) * 100;
      }
    }
  });
};

export const main = () => {
  const selectedTextFrame = getSelectedTextFrame();
  if (selectedTextFrame.base == null || selectedTextFrame.finish == null) {
    alert(
      `レイヤー名として finish, base を含むテキストフレームを1つずつ選択してください`
    );
    return false;
  }

  const isVertical =
    selectedTextFrame.finish.orientation === TextOrientation.VERTICAL;

  const tokens = tokenizeText(selectedTextFrame.base.contents);
  const mixedMiddleRubys = applyAttributesToRubyList(tokens);
  const middleRubys = convertJukugoRubys(
    mixedMiddleRubys,
    selectedTextFrame.finish.characters
  );
  const rubyList = createRubyInfos(
    middleRubys,
    selectedTextFrame.finish,
    isVertical
  );
  addRubys(rubyList, isVertical);
  alert(`${rubyList.length} 個のルビを付与しました`);
};
