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
  overflow: overflow;
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
  overflow?: overflow;
}

export type MiddleRubyInfo = RubyToken & MiddleCommonRubyInfo;
export type MiddleJukugoRubyInfo = JukugoRubyToken & MiddleCommonRubyInfo;

export interface DefinedAttribute {
  rubySize?: string | null;
  offset?: string | null;
  font?: string | null;
  alignment?: alignment | null;
  sutegana?: boolean | null;
  overflow?: overflow | null;
}

interface CommonRubyToken {
  base: string;
  starts: boolean;
  charIndex: number;
  outlineIndex: number;
  beforeChar: string;
  afterChar: string;
}

export type RubyToken = {
  type: "ruby";
  ruby: string;
} & CommonRubyToken;

export type JukugoRubyToken = {
  type: "jukugo-ruby";
  ruby: string[];
} & CommonRubyToken;

export type Token =
  | RubyToken
  | JukugoRubyToken
  | { type: "attribute"; key: string; value: string };

// alignment
export const alignment = {
  kata: "kata",
  naka: "naka",
  jis: "jis",
  shita: "shita",
} as const;
export type alignment = typeof alignment[keyof typeof alignment];
export const isAlignment = (value: string): value is alignment =>
  value in alignment;

export type overflow = "shinyu" | "narrow" | "false";

// default value
export const defaultAlignment = "jis";
export const defaultSutegana = true;
export const defaultOverflow: overflow = "shinyu";
export const defaultRubySizeRatio = 0.5;
