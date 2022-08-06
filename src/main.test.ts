import { applyAttributesToRubyList, tokenizeText } from "./main";
import { MiddleRubyInfo, Token } from "./ruby";

const sampleBase =
  "(narrow|false)\n(align|naka)東京都[江東|こうとう|だいとう]区(size|16Q)に\n位置する " +
  "[清|きよ](sute|true)(align|base)[澄|すみ](offset|10H)[白|しら](font|ShinGo-Heavy)[河|かわ]駅";
const monoBase = "[海浜幕張|かい/ひん/まく/はり|まくはりほんごう]";
const jukugoBase = "<紫式部|むらさき/しき/ぶ>を<読破|ど/く/は>";

const sampleTokens: Token[] = [
  { type: "attribute", key: "narrow", value: "false" },
  { type: "attribute", key: "align", value: "naka" },
  {
    type: "ruby",
    ruby: "こうとう",
    starts: true,
    base: "江東",
    charIndex: 4,
    outlineIndex: 3,
  },
  {
    type: "ruby",
    ruby: "だいとう",
    starts: false,
    base: "江東",
    charIndex: 4,
    outlineIndex: 3,
  },
  { type: "attribute", key: "size", value: "16Q" },
  {
    type: "ruby",
    ruby: "きよ",
    starts: true,
    base: "清",
    charIndex: 14,
    outlineIndex: 11,
  },
  { type: "attribute", key: "sute", value: "true" },
  { type: "attribute", key: "align", value: "base" },
  {
    type: "ruby",
    ruby: "すみ",
    starts: true,
    base: "澄",
    charIndex: 15,
    outlineIndex: 12,
  },
  { type: "attribute", key: "offset", value: "10H" },
  {
    type: "ruby",
    ruby: "しら",
    starts: true,
    base: "白",
    charIndex: 16,
    outlineIndex: 13,
  },
  { type: "attribute", key: "font", value: "ShinGo-Heavy" },
  {
    type: "ruby",
    ruby: "かわ",
    starts: true,
    base: "河",
    charIndex: 17,
    outlineIndex: 14,
  },
];

const monoTokens: Token[] = [
  {
    type: "ruby",
    ruby: "かい",
    starts: true,
    base: "海",
    charIndex: 0,
    outlineIndex: 0,
  },
  {
    type: "ruby",
    ruby: "ひん",
    starts: true,
    base: "浜",
    charIndex: 1,
    outlineIndex: 1,
  },
  {
    type: "ruby",
    ruby: "まく",
    starts: true,
    base: "幕",
    charIndex: 2,
    outlineIndex: 2,
  },
  {
    type: "ruby",
    ruby: "はり",
    starts: true,
    base: "張",
    charIndex: 3,
    outlineIndex: 3,
  },
  {
    type: "ruby",
    ruby: "まくはりほんごう",
    starts: false,
    base: "海浜幕張",
    charIndex: 0,
    outlineIndex: 0,
  },
];

const jukugoTokens: Token[] = [
  {
    type: "jukugo-ruby",
    ruby: ["むらさき", "しき", "ぶ"],
    starts: true,
    base: "紫式部",
    charIndex: 0,
    outlineIndex: 0,
    beforeChar: "",
    afterChar: "を",
  },
];

test("convert a unit", () => {});

test("tokenize a text", () => {
  const result0 = tokenizeText(sampleBase);
  expect(result0).toEqual(sampleTokens);
  const result1 = tokenizeText(monoBase);
  expect(result1).toEqual(monoTokens);
  const result2 = tokenizeText(jukugoBase);
  expect(result2).toEqual(jukugoTokens);
});

/*test("apply attributes to rubys", () => {
  const result = applyAttributesToRubyList(middleRubys);
  const expected: MiddleRubyInfo[] = [
    {
      type: "ruby",
      ruby: "こうとう",
      base: "江東",
      starts: true,
      outlineIndex: 3,
      narrow: false,
      alignment: "naka",
    },
    {
      type: "ruby",
      ruby: "きよ",
      base: "清",
      starts: true,
      outlineIndex: 11,
      narrow: false,
      alignment: "naka",
      rubySize: "16Q",
    },
    {
      type: "ruby",
      ruby: "すみ",
      base: "澄",
      starts: true,
      outlineIndex: 12,
      narrow: false,
      rubySize: "16Q",
      sutegana: true,
    },
    {
      type: "ruby",
      ruby: "しら",
      base: "白",
      starts: true,
      outlineIndex: 13,
      narrow: false,
      rubySize: "16Q",
      sutegana: true,
      offset: "10H",
    },
    {
      type: "ruby",
      ruby: "かわ",
      base: "河",
      starts: true,
      outlineIndex: 14,
      narrow: false,
      rubySize: "16Q",
      sutegana: true,
      offset: "10H",
      font: "ShinGo-Heavy",
    },
  ];
  expect(result).toEqual(expected);
});
*/
