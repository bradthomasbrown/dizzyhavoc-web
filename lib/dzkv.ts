type DzkvMap = { value: unknown; map: Map<unknown, DzkvMap> };

/**
 * a very rough, minimal implementation of a client-side, memory version of
 * Deno.Kv (get and set only for now)
 */
class Dzkv {
  root: DzkvMap;
  constructor() {
    this.root = { value: null, map: new Map() };
  }
  get<T>(key: unknown[]): null | T {
    let dzkvMap = this.root;
    for (let i = 0; i < key.length; i++) {
      if (!dzkvMap.map.get(key[i])) return null;
      else dzkvMap = dzkvMap.map.get(key[i])!;
    }
    return dzkvMap.value as T;
  }
  set<T>(key: unknown[], value: T) {
    let dzkvMap = this.root;
    for (let i = 0; i < key.length; i++) {
      if (!dzkvMap.map.get(key[i])) {
        dzkvMap.map.set(key[i], { value: null, map: new Map() });
      }
      dzkvMap = dzkvMap.map.get(key[i])!;
    }
    dzkvMap.value = value;
  }
  ensure<T>(key: unknown[], value: T) {
    if (this.get(key)) return false;
    else this.set(key, value);
    return true;
  }
}

export const dzkv = new Dzkv();
