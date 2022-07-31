Object.keys = (obj: { [key in string]: any }) => {
  const result: string[] = [];
  for (const key in obj) {
    result.push(key);
  }
  return result;
};

Object.values = (obj: { [key in string]: any }) => {
  const result: string[] = [];
  for (const key in obj) {
    result.push(obj[key]);
  }
  return result;
};

Array.prototype.forEach = function <U>(
  callback: (value: U, index: number, array: U[]) => void
) {
  for (let i = 0; i < this.length; i++) {
    callback(this[i], i, this);
  }
};

Array.prototype.reduce = function <S, T>(
  callback: (previous: T, value: S, index: number, array: S[]) => T,
  initial?: any
) {
  let previous = initial ?? this[0];
  for (let i = initial == null ? 1 : 0; i < this.length; i++) {
    previous = callback(previous, this[i], i, this);
  }
  return previous;
};

Array.prototype.map = function <U>(
  callback: (value: any, index: number, array: U[]) => U
) {
  let result: any[] = [];
  for (let i = 0; i < this.length; i++) {
    result.push(callback(this[i], i, this));
  }
  return result;
};

Array.prototype.filter = function <U>(
  predicate: (value: U, index: number, array: U[]) => boolean
) {
  let result: any[] = [];
  for (let i = 0; i < this.length; i++) {
    if (predicate(this[i], i, this)) {
      result.push(this[i]);
    }
  }
  return result;
};