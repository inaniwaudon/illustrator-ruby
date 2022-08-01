import { applyAttributesToRubys, tokenizeText } from "./main";
import { MiddleRubyInfo, Token } from "./ruby";

const sampleBase =
  "(narrow|false)(align|naka)東京都[江東|こうとう]区(size|16Q)に\n位置する [清|きよ](sute|true)(align|base)[澄|すみ](offset|10H)[白|しら](font|ShinGo-Heavy)[河|かわ]駅";

// TODO: sutegana を判別できる文字でテスト
// TODO: 上下にルビを付ける

const middleRubys: Token[] = [
  { type: "attribute", key: "narrow", value: "false" },
  { type: "attribute", key: "align", value: "naka" },
  {
    type: "ruby",
    ruby: "こうとう",
    starts: true,
    base: "江東",
    outlineIndex: 3,
  },
  { type: "attribute", key: "size", value: "16Q" },
  { type: "ruby", ruby: "きよ", starts: true, base: "清", outlineIndex: 11 },
  { type: "attribute", key: "sute", value: "true" },
  { type: "attribute", key: "align", value: "base" },
  { type: "ruby", ruby: "すみ", starts: true, base: "澄", outlineIndex: 12 },
  { type: "attribute", key: "offset", value: "10H" },
  { type: "ruby", ruby: "しら", starts: true, base: "白", outlineIndex: 13 },
  { type: "attribute", key: "font", value: "ShinGo-Heavy" },
  { type: "ruby", ruby: "かわ", starts: true, base: "河", outlineIndex: 14 },
];

test("convert a unit", () => {});

test("tokenize a text", () => {
  const result = tokenizeText(sampleBase);
  expect(result).toEqual(middleRubys);
});

test("apply attributes to rubys", () => {
  const result = applyAttributesToRubys(middleRubys);
  const expected: MiddleRubyInfo[] = [
    {
      ruby: "こうとう",
      base: "江東",
      starts: true,
      outlineIndex: 3,
      narrow: false,
      alignment: "naka",
    },
    {
      ruby: "きよ",
      base: "清",
      starts: true,
      outlineIndex: 11,
      narrow: false,
      alignment: "naka",
      rubySize: "16Q",
    },
    {
      ruby: "すみ",
      base: "澄",
      starts: true,
      outlineIndex: 12,
      narrow: false,
      rubySize: "16Q",
      sutegana: true,
    },
    {
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
