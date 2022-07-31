import { applyAttributesToRubys, tokenizeText } from "./main";
import { RubyInfo, Token } from "./ruby";

const sampleBase =
  "(narrow|false)(align|naka)東京都[江東|こうとう]区に\n位置する(narrow|true)(align|kata)[清|きよ][澄|すみ][白|しら][河|かわ]駅";

const middleRubys: Token[] = [
  { type: "attribute", key: "narrow", value: "false" },
  { type: "attribute", key: "align", value: "naka" },
  { type: "ruby", ruby: "こうとう", base: "江東", outlineIndex: 3 },
  { type: "attribute", key: "narrow", value: "true" },
  { type: "attribute", key: "align", value: "kata" },
  { type: "ruby", ruby: "きよ", base: "清", outlineIndex: 11 },
  { type: "ruby", ruby: "すみ", base: "澄", outlineIndex: 12 },
  { type: "ruby", ruby: "しら", base: "白", outlineIndex: 13 },
  { type: "ruby", ruby: "かわ", base: "河", outlineIndex: 14 },
];

test("tokenize a text", () => {
  const result = tokenizeText(sampleBase);
  expect(result).toEqual(middleRubys);
});

test("apply attributes to rubys", () => {
  const result = applyAttributesToRubys(middleRubys);
  const expected: RubyInfo[] = [];
  expect(result).toEqual(expected);
});
