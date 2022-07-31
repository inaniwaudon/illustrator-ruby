export interface RubyInfo {
  kana: string;
  alignment: string;
  font: string;
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
