import { applyAttributesToRubyList, convertUnit, tokenizeText } from "./main";
import { MiddleRubyInfo, Token } from "./ruby";

test("単位を変換する", () => {
  const mmPerPt = 2.8346;

  // pt
  expect(convertUnit("12pt", 10, 0.5)).toBe(12);
  // mm
  expect(convertUnit("5mm", 10, 0.5)).toBeCloseTo(5 * mmPerPt);
  // cm
  expect(convertUnit("2cm", 10, 0.5)).toBeCloseTo(2 * mmPerPt * 10);
  // Q, H（同じ変換）
  expect(convertUnit("16Q", 10, 0.5)).toBeCloseTo(16 * mmPerPt * 0.25);
  expect(convertUnit("10H", 10, 0.5)).toBeCloseTo(10 * mmPerPt * 0.25);
  // px
  expect(convertUnit("8px", 10, 0.5)).toBe(6);
  // %
  expect(convertUnit("50%", 10, 0.5)).toBe(5);
  // 単位なし・無効値はフォールバック (baseSize * ratio)
  expect(convertUnit("abc", 10, 0.5)).toBe(5);
  expect(convertUnit("10", 10, 0.5)).toBe(5);
});

describe("テキストをトークン化できる", () => {
  it("モノルビを処理できる", () => {
    const text = "[東京|とう/きょう]";
    const result = tokenizeText(text);

    const expected: Token[] = [
      {
        type: "ruby",
        ruby: "とう",
        base: "東",
        starts: true,
        charIndex: 0,
        outlineIndex: 0,
        beforeChar: "",
        afterChar: "",
      },
      {
        type: "ruby",
        ruby: "きょう",
        base: "京",
        starts: true,
        charIndex: 1,
        outlineIndex: 1,
        beforeChar: "",
        afterChar: "",
      },
    ];
    
    expect(result).toEqual(expected);
  });

  it("グループルビを処理できる", () => {
    const text = "[東京|とうきょう]";
    const result = tokenizeText(text);

    const expected: Token[] = [
      {
        type: "ruby",
        ruby: "とうきょう",
        base: "東京",
        starts: true,
        charIndex: 0,
        outlineIndex: 0,
        beforeChar: "",
        afterChar: "",
      },
    ];

    expect(result).toEqual(expected);
  });

  it("テキストをトークン化する: 熟語ルビを処理できる", () => {
    const text = "<紫式部|むらさき/しき/ぶ>";
    const result = tokenizeText(text);

    const expected: Token[] = [
      {
        type: "jukugo-ruby",
        ruby: ["むらさき", "しき", "ぶ"],
        base: "紫式部",
        starts: true,
        charIndex: 0,
        outlineIndex: 0,
        beforeChar: "",
        afterChar: "",
      },
    ];

    expect(result).toEqual(expected);
  });

  it("テキストをトークン化する: これらを混在できる", () => {
    const text = "[東京|とうきょう][東京|とう/きょう]<紫式部|むらさき/しき/ぶ>";
    const result = tokenizeText(text);

    const expected: Token[] = [
      {
        type: "ruby",
        ruby: "とうきょう",
        base: "東京",
        starts: true,
        charIndex: 0,
        outlineIndex: 0,
        beforeChar: "",
        afterChar: "[",
      },
      {
        type: "ruby",
        ruby: "とう",
        base: "東",
        starts: true,
        charIndex: 2,
        outlineIndex: 2,
        beforeChar: "]",
        afterChar: "京",
      },
      {
        type: "ruby",
        ruby: "きょう",
        base: "京",
        starts: true,
        charIndex: 3,
        outlineIndex: 3,
        beforeChar: "東",
        afterChar: "<",
      },
      {
        type: "jukugo-ruby",
        ruby: ["むらさき", "しき", "ぶ"],
        base: "紫式部",
        starts: true,
        charIndex: 4,
        outlineIndex: 4,
        beforeChar: "]",
        afterChar: "",
      },
    ];

    expect(result).toEqual(expected);
  });

  it("テキストをトークン化する: 両側のルビを扱える", () => {
    const text = "[海浜幕張|かい/ひん/まく/はり|まくはりほんごう]";
    const result = tokenizeText(text);

    const expected: Token[] = [
      {
        type: "ruby",
        ruby: "かい",
        base: "海",
        starts: true,
        charIndex: 0,
        outlineIndex: 0,
        beforeChar: "",
        afterChar: "",
      },
      {
        type: "ruby",
        ruby: "ひん",
        base: "浜",
        starts: true,
        charIndex: 1,
        outlineIndex: 1,
        beforeChar: "",
        afterChar: "",
      },
      {
        type: "ruby",
        ruby: "まく",
        base: "幕",
        starts: true,
        charIndex: 2,
        outlineIndex: 2,
        beforeChar: "",
        afterChar: "",
      },
      {
        type: "ruby",
        ruby: "はり",
        base: "張",
        starts: true,
        charIndex: 3,
        outlineIndex: 3,
        beforeChar: "",
        afterChar: "",
      },
      {
        type: "ruby",
        ruby: "まくはりほんごう",
        base: "海浜幕張",
        starts: false,
        charIndex: 0,
        outlineIndex: 0,
        beforeChar: "",
        afterChar: "",
      },
    ];

    expect(result).toEqual(expected);
  });
});

test("ルビに属性を適用する", () => {
  const sampleTokens: Token[] = [
    { type: "attribute", key: "narrow", value: "false" },
    { type: "attribute", key: "align", value: "naka" },
    {
      type: "ruby",
      ruby: "こう",
      starts: true,
      base: "江東",
      charIndex: 4,
      outlineIndex: 3,
      beforeChar: "都",
      afterChar: "区",
    },
    {
      type: "ruby",
      ruby: "とう",
      starts: false,
      base: "江東",
      charIndex: 4,
      outlineIndex: 3,
      beforeChar: "都",
      afterChar: "区",
    },
    { type: "attribute", key: "size", value: "16Q" },
    {
      type: "ruby",
      ruby: "きよ",
      starts: true,
      base: "清",
      charIndex: 14,
      outlineIndex: 11,
      beforeChar: " ",
      afterChar: "(",
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
      beforeChar: ")",
      afterChar: "(",
    },
    { type: "attribute", key: "offset", value: "10H" },
    {
      type: "ruby",
      ruby: "しら",
      starts: true,
      base: "白",
      charIndex: 16,
      outlineIndex: 13,
      beforeChar: ")",
      afterChar: "(",
    },
    { type: "attribute", key: "font", value: "ShinGo-Heavy" },
    {
      type: "ruby",
      ruby: "かわ",
      starts: true,
      base: "河",
      charIndex: 17,
      outlineIndex: 14,
      beforeChar: ")",
      afterChar: "駅",
    },
  ];
  const result = applyAttributesToRubyList(sampleTokens);

  const expected: MiddleRubyInfo[] = [
    {
      type: "ruby",
      ruby: "こう",
      base: "江東",
      starts: true,
      charIndex: 4,
      outlineIndex: 3,
      beforeChar: "都",
      afterChar: "区",
      yBaseOutlineIndices: [3],
      alignment: "naka",
    },
    {
      type: "ruby",
      ruby: "とう",
      base: "江東",
      starts: false,
      charIndex: 4,
      outlineIndex: 3,
      beforeChar: "都",
      afterChar: "区",
      yBaseOutlineIndices: [3],
      alignment: "naka",
    },
    {
      type: "ruby",
      ruby: "きよ",
      base: "清",
      starts: true,
      charIndex: 14,
      outlineIndex: 11,
      beforeChar: " ",
      afterChar: "(",
      yBaseOutlineIndices: [11],
      alignment: "naka",
      rubySize: "16Q",
    },
    {
      type: "ruby",
      ruby: "すみ",
      base: "澄",
      starts: true,
      charIndex: 15,
      outlineIndex: 12,
      beforeChar: ")",
      afterChar: "(",
      yBaseOutlineIndices: [12],
      rubySize: "16Q",
      sutegana: true,
    },
    {
      type: "ruby",
      ruby: "しら",
      base: "白",
      starts: true,
      charIndex: 16,
      outlineIndex: 13,
      beforeChar: ")",
      afterChar: "(",
      yBaseOutlineIndices: [13],
      rubySize: "16Q",
      sutegana: true,
      offset: "10H",
    },
    {
      type: "ruby",
      ruby: "かわ",
      base: "河",
      starts: true,
      charIndex: 17,
      outlineIndex: 14,
      beforeChar: ")",
      afterChar: "駅",
      yBaseOutlineIndices: [14],
      rubySize: "16Q",
      sutegana: true,
      offset: "10H",
      font: "ShinGo-Heavy",
    },
  ];

  expect(result).toEqual(expected);
});
