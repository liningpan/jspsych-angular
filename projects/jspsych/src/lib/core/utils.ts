import * as clone from 'clone';

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
