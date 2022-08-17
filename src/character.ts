// sutegana
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

export const convertSutegana = (beforeText: string) =>
  suteganaList.reduce(
    (previous, sutegana) => previous.replace(sutegana.before, sutegana.after),
    beforeText
  );

// character class
export const kanjiCodes = [
  [0x4e00, 0x9fef],
  [0x3400, 0x4db5],
  [0x20000, 0x2a6d6],
  [0x2a700, 0x2b734],
  [0x2b740, 0x2b81d],
  [0x2b820, 0x2cea1],
  [0x2ceb0, 0x2ebe0],
  [0xf900, 0xfaff],
  [0x2f800, 0x2fa1f],
  [0xe0100, 0xe01ef],
  [0x2f00, 0x2fdf],
  [0x2e80, 0x2eff],
  [0x31c0, 0x31ef],
];

export const classifyCharacterClass = (character: string) => {
  const code = character.charCodeAt(0);
  if (code === undefined) {
    return null;
  }
  if (kanjiCodes.some((value) => value[0] <= code && code <= value[1])) {
    return "kanji";
  }
  if (character.match(new RegExp(`^[ぁ-んァ-ン]$`))) {
    return "kana";
  }
  if (`‘“（〔［｛〈《「『【｟〘〖«〝`.includes(character)) {
    return "openingBracket";
  }
  if (`’”）〕］｝〉》」』】｠〙〗»〟`.includes(character)) {
    return "closingBracket";
  }
  if ("・：；".includes(character)) {
    return "middleDot";
  }
  if (`。.`.includes(character)) {
    return "fullStop";
  }
  if (`、，`.includes(character)) {
    return "comma";
  }
  if ("―…‥〳〴〵".includes(character)) {
    return "inseparableCharacter";
  }
  if ("ヽヾゝゞ々〻".includes(character)) {
    return "iterationMark";
  }
  if (character === "ー") {
    return "prolongedSoundMark";
  }
  return null;
};

export const getOverhangingRubyCount = (character: string) => {
  const charClass = classifyCharacterClass(character);
  if (charClass === null) {
    return 0;
  }
  return [
    "kana",
    "openingBracket",
    "closingBracket",
    "middleDot",
    "fullStop",
    "comma",
    "inseparableCharacter",
  ].includes(charClass)
    ? 1.0
    : 0;
};
