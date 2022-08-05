export interface RubyChars {
  start: string;
  end?: string;
}

export interface RubyInfo {
  ruby: string;
  base: string;
  starts: boolean;
  alignment: alignment;
  font: TextFont;
  x: number;
  y: number;
  baseWidth: number;
  baseHeight: number;
  offset: number;
  sutegana: boolean;
  narrow: boolean;
  size: {
    ruby: number;
    base: number;
  };
}

export interface MiddleCommonRubyInfo {
  rubySize?: string;
  offset?: string;
  font?: string;
  alignment?: alignment;
  sutegana?: boolean;
  narrow?: boolean;
}

export type MiddleRubyInfo = RubyToken & MiddleCommonRubyInfo;
export type MiddleJukugoRubyInfo = JukugoRubyToken & MiddleCommonRubyInfo;

export interface DefinedAttribute {
  rubySize?: string | null;
  offset?: string | null;
  font?: string | null;
  alignment?: alignment | null;
  sutegana?: boolean | null;
  narrow?: boolean | null;
}

export interface RubyToken {
  type: "ruby";
  ruby: string;
  base: string;
  starts: boolean;
  outlineIndex: number;
}

export interface JukugoRubyToken {
  type: "jukugo-ruby";
  ruby: string[];
  base: string;
  starts: boolean;
  outlineIndex: number;
}

export type Token =
  | RubyToken
  | JukugoRubyToken
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
export const defaultRubySizeRatio = 0.5;
