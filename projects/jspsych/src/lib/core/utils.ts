import * as clone from 'clone';
import { Key } from 'ts-key-enum';

export function flatten(arr: any[], out?: any[]) {
  out = out ?? [];
  for (let i of arr) {
    if (Array.isArray(i)) {
      flatten(i, out);
    } else {
      out.push(i);
    }
  }
  return out;
}

export function unique(arr: any[] | Set<any>): any[] {
  var out = new Set();
  for (let i of arr) {
    out.add(i)
  }
  // uniqueness is guaranteed, keep list interface for now
  return [...out];
}

export function deepCopy(obj: any){
  // disable circular reference check
  return clone(obj, false);
}

export function isValidKey(key: string){
  if(key.length == 1){
    return true;
  } else if((<any>Object).values(Key).includes(key)){
    return true;
  }
  return false;
}
