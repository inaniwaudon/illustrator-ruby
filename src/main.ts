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
  const spacesRegex = new RegExp(Object.values(noGlyphs).join("|"));
  const tokens: Token[] = [];
  let finalBaseDifference = 0;
  let spaceDifference = 0;

  for (let i = 0; i < baseText.length; i++) {
    // space
    if (baseText[i].match(spacesRegex)) {
      spaceDifference++;
      continue;
    }

    // ruby
    const startsJukugoRuby = baseText[i] === jukugoRubyDelimiters.from;
    if (
      (baseText[i] === rubyDelimiters.from &&
        baseText[i + 1] !== rubyDelimiters.from) ||
      (startsJukugoRuby && baseText[i + 1] !== jukugoRubyDelimiters.from)
    ) {
      const subsequentText = baseText.substring(i);
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
            outlineIndex: i - finalBaseDifference - spaceDifference,
            beforeChar: i > 0 ? baseText[i - 1] : "",
            afterChar:
              i + toIndex < baseText.length - 1
                ? baseText[i + toIndex + 1]
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
              outlineIndex: i - finalBaseDifference - spaceDifference + k,
            });
          }
        }
      }
      finalBaseDifference += toIndex + 1 - splited[0].length;
      i += toIndex;
    }

    // attribute
    if (
      baseText[i] === attributeDelimiters.from &&
      baseText[i + 1] !== attributeDelimiters.from
    ) {
      const subsequentText = baseText.substring(i);
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
        charIndex: token.charIndex,
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
        characters[middleRuby.charIndex].characterAttributes.size;
      // The ruby for which the parent characters are not of the same size is not processed.
      if (
        !middleRuby.ruby.every(
          (_, index) =>
            baseSize ===
            characters[middleRuby.charIndex + index].characterAttributes.size
        )
      ) {
        continue;
      }

      const maxRubyCounts = [...Array(middleRuby.ruby.length)].fill(2);
      maxRubyCounts[0] += getOverhangingRubyCount(middleRuby.beforeChar);
      maxRubyCounts[maxRubyCounts.length - 1] += getOverhangingRubyCount(
        middleRuby.afterChar
      );

      const getSplit = (split: number[]): [number, number[]] => {
        if (split.length === middleRuby.ruby.length - 1) {
          // calculate the penalty
          let penalty = 0;
          for (let i = 0; i < middleRuby.ruby.length; i++) {
            const rubyCount =
              middleRuby.ruby[i].length -
              (i > 0 ? split[i - 1] : 0) +
              (i < split.length ? split[i] : 0);
            penalty += Math.max(rubyCount - maxRubyCounts[i], 0) * 10;
            if (maxRubyCounts[i] > 2 && rubyCount > 2) {
              penalty += i === 0 ? 2 : 1;
            }
          }
          return [penalty, split];
        }
        return [
          getSplit([...split, -1]),
          getSplit([...split, 0]),
          getSplit([...split, 1]),
        ].sort((a, b) => a[0] - b[0])[0];
      };
      const [_, split] = getSplit([]);

      middleRuby.ruby.forEach((ruby, index) => {
        const rubyText =
          (index > 0 && split[index - 1] === -1
            ? middleRuby.ruby[index - 1].slice(-1)
            : "") +
          ruby.slice(
            index > 0 ? Math.max(split[index - 1], 0) : 0,
            ruby.length + (index < split.length ? Math.min(split[index], 0) : 0)
          ) +
          (index < split.length && split[index] === 1
            ? middleRuby.ruby[index + 1].slice(0, 1)
            : "");

        const newMiddleRuby: MiddleRubyInfo = {
          type: "ruby",
          ruby: rubyText,
          base: middleRuby.base[index],
          starts: middleRuby.starts,
          charIndex: middleRuby.charIndex + index,
          outlineIndex: middleRuby.outlineIndex + index,
        };
        applyAttributesToMiddleRubyInfo(newMiddleRuby, middleRuby);
        let leftCount = rubyText.length;
        if (middleRuby.ruby.length === 1) {
          // 中にするとは限らない
          newMiddleRuby.alignment = "naka";
          leftCount -= maxRubyCounts[0] - 2;
        } else {
          if (index === 0 && leftCount > 2 && maxRubyCounts[0] > 2) {
            newMiddleRuby.alignment = "shita";
            leftCount--;
          }
          if (
            index === middleRuby.ruby.length - 1 &&
            leftCount > 2 &&
            maxRubyCounts[index] > 2
          ) {
            newMiddleRuby.alignment = "kata";
            leftCount--;
          }
        }
        if (leftCount > 2) {
          const charAttributes =
            characters[middleRuby.charIndex + index].characterAttributes;
          charAttributes.akiLeft = (leftCount - 2) / 4;
          charAttributes.akiRight = (leftCount - 2) / 4;
          newMiddleRuby.alignment = "naka";
        }
        newMiddleRuby.narrow = false;
        resultMiddleRubys.push(newMiddleRuby);
      });
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
    let rubyAdjustment = (measuredBaseLength - baseLength) / 2;
    if (!isNarrow) {
      if (ruby.alignment === "shita") {
        rubyAdjustment += baseLength - rubyLength;
      } else if (
        ruby.alignment === "naka" ||
        (ruby.alignment === "jis" && rubyLength > baseLength)
      ) {
        rubyAdjustment += (baseLength - rubyLength) / 2;
      } else if (ruby.alignment === "jis") {
        rubyAdjustment += (baseLength - rubyLength) / (ruby.ruby.length * 2);
      }
    }

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
