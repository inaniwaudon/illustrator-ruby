export interface RubyInfo {
  kana: string;
  base: string;
  alignment: alignment;
  font: TextFont;
  x: number;
  y: number;
  baseWidth: number;
  baseHeight: number;
  offset: number;
  narrow: boolean;
  size: {
    ruby: number;
    base: number;
  };
}

export interface MiddleRubyInfo {
  outlineIndex: number;
  ruby: string;
  base: string;
  narrow?: boolean;
  sutegana?: boolean;
  rubySize?: string;
  offset?: string;
  alignment?: alignment;
  font?: TextFont;
}

export interface DefinedAttribute {
  font: TextFont | null;
  size: string | null;
  offset: string | null;
  alignment: alignment | null;
  sutegana: boolean | null;
  narrow: boolean | null;
}

export type Token =
  | { type: "ruby"; ruby: string; base: string; outlineIndex: number }
  | { type: "attribute"; key: string; value: string };

// alignment
export const alignment = { kata: "kata", naka: "naka", jis: "jis" } as const;
export type alignment = typeof alignment[keyof typeof alignment];
export const isAlignment = (value: string): value is alignment =>
  value in alignment;

// default value
export const defaultAlignment = "jis";
export const defaultSutegana = true;
export const defaultNarrow = false;
