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

// alignment
export const alignment = { kata: "kata", naka: "naka", jis: "jis" } as const;
export type alignment = typeof alignment[keyof typeof alignment];
export const isAlignment = (value: string): value is alignment =>
  value in alignment;

// default value
export const defaultAlignment = "jis";
export const defaultSutegana = true;
export const defaultNarrow = false;
