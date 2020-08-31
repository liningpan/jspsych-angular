export function factorial(factors: object, repetitions: number = 1, unpack: boolean = false) {

  let factorNames = Object.keys(factors);

  let factor_combinations = [];

  for (let i = 0; i < factors[factorNames[0]].length; i++) {
    factor_combinations.push({});
    factor_combinations[i][factorNames[0]] = factors[factorNames[0]][i];
  }

  for (let i = 1; i < factorNames.length; i++) {
    let toAdd = factors[factorNames[i]];
    let n = factor_combinations.length;
    for (let j = 0; j < n; j++) {
      let base = factor_combinations[j];
      for (let k = 0; k < toAdd.length; k++) {
        let newpiece = {};
        newpiece[factorNames[i]] = toAdd[k];
        factor_combinations.push(Object.assign({}, base, newpiece));
      }
    }
    factor_combinations.splice(0, n);
  }
  return repeat(factor_combinations, repetitions, unpack);
}

export function randomID(length?: number): string {
  let result: string = "";
  length = length ?? 32;
  const chars = '0123456789abcdefghjklmnopqrstuvwxyz';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function repeat(arr: any[], _rep: number | number[], unpack: boolean = false): any[] | object {
  let rep: any[];

  if (!Array.isArray(_rep)) {
    rep = new Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
      rep[i] = _rep;
    }
  } else {
    if (arr.length != _rep.length) {
      console.warn('Unclear parameters given to randomization.repeat. Items and repetitions are unequal lengths. Behavior may not be as expected.');
      if (_rep.length < arr.length) {
        rep = new Array(arr.length);
        for (let i = 0; i < arr.length; i++) {
          rep.push(_rep[0]);
        }
      } else {
        // throw warning if too long, and then use the first N
        rep = _rep.slice(0, arr.length);
      }
    } else if (arr.length == _rep.length) {
      rep = _rep
    }
  }

  // should be clear at this point to assume that array and repetitions are arrays with == length
  let allsamples = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < rep[i]; j++) {
      if (arr[i] == null || typeof arr[i] != 'object') {
        allsamples.push(arr[i]);
      } else {
        allsamples.push(Object.assign({}, arr[i]));
      }
    }
  }

  let out = shuffle(allsamples);
  if (unpack) {
    return _unpackArray(out);
  } else {
    return out;
  }
}

export function sampleWithReplacement(arr: any[], size: number, weights?: number[]) {
  let normalized_weights = new Array(arr.length);
  if (weights) {
    if (weights.length !== arr.length) {
      console.error('The length of the weights array must equal the length of the array ' +
        'to be sampled from.');
    }
    let weight_sum = 0;
    for (let i = 0; i < weights.length; i++) {
      weight_sum += weights[i];
    }
    for (let i = 0; i < weights.length; i++) {
      normalized_weights[i] = weights[i] / weight_sum;
    }
  } else {
    for (let i = 0; i < arr.length; i++) {
      normalized_weights[i] = 1 / arr.length;
    }
  }

  let cumulative_weights = [normalized_weights[0]];
  for (let i = 1; i < normalized_weights.length; i++) {
    cumulative_weights.push(normalized_weights[i] + cumulative_weights[i - 1]);
  }

  let samp = [];
  for (let i = 0; i < size; i++) {
    let rnd = Math.random();
    let index = 0;
    while (index < normalized_weights.length - 1 && rnd > cumulative_weights[index]) { index++; }
    samp.push(arr[index]);
  }
  return samp;
}

export function sampleWithoutReplacement(arr: any[], size: number) {
  if (size > arr.length) {
    console.error("Cannot take a sample " +
      "larger than the size of the set of items to sample.");
  }
  return shuffle(arr).slice(0, size);
}


export function shuffle(arr: any[]): any[] {
  if (!Array.isArray(arr)) {
    console.error('Argument to jsPsych.randomization.shuffle() must be an array.')
  }
  return _shuffle(arr);
}

export function shuffleAlternateGroups(arr_groups : any[], random_group_order: boolean = false) {
  let n_groups = arr_groups.length;
  if (n_groups == 1) {
    console.warn('jsPsych.randomization.shuffleAlternateGroups was called with only one group. Defaulting to simple shuffle.');
    return shuffle(arr_groups[0]);
  }

  let group_order = [];
  for (let i = 0; i < n_groups; i++) {
    group_order.push(i);
  }
  if (random_group_order) {
    group_order = shuffle(group_order);
  }

  let randomized_groups = [];
  let min_length = arr_groups[0].length;
  for (let i = 0; i < n_groups; i++) {
    min_length = Math.min(min_length, arr_groups[i].length);
    randomized_groups.push(shuffle(arr_groups[i]));
  }

  let out = [];
  for (let i = 0; i < min_length; i++) {
    for (let j = 0; j < group_order.length; j++) {
      out.push(randomized_groups[group_order[j]][i])
    }
  }

  return out;
}

export function shuffleNoRepeats(arr: any[], equals?: (a: any, b: any) => boolean) {
  if (!equals) {
    equals = function (a, b): boolean {
      if (a === b) {
        return true;
      } else {
        return false;
      }
    }
  }

  let random_shuffle = shuffle(arr);
  for (let i = 0; i < random_shuffle.length - 1; i++) {
    if (equals(random_shuffle[i], random_shuffle[i + 1])) {
      // neighbors are equal, pick a new random neighbor to swap (not the first or last element, to avoid edge cases)
      let random_pick = Math.floor(Math.random() * (random_shuffle.length - 2)) + 1;
      // test to make sure the new neighbor isn't equal to the old one
      while (
        equals(random_shuffle[i + 1], random_shuffle[random_pick]) ||
        (equals(random_shuffle[i + 1], random_shuffle[random_pick + 1]) ||
          equals(random_shuffle[i + 1], random_shuffle[random_pick - 1]))
      ) {
        random_pick = Math.floor(Math.random() * (random_shuffle.length - 2)) + 1;
      }
      let new_neighbor = random_shuffle[random_pick];
      random_shuffle[random_pick] = random_shuffle[i + 1];
      random_shuffle[i + 1] = new_neighbor;
    }
  }

  return random_shuffle;
}

function _unpackArray(array: any[]): object {
  var out = {};
  for (var i = 0; i < array.length; i++) {
    var keys = Object.keys(array[i]);
    for (var k = 0; k < keys.length; k++) {
      if (typeof out[keys[k]] === 'undefined') {
        out[keys[k]] = [];
      }
      out[keys[k]].push(array[i][keys[k]]);
    }
  }
  return out;
}

function _shuffle(array: any[]) {
  var copy_array = array.slice(0);
  var m = copy_array.length;
  while (m) {
    let i = Math.floor(Math.random() * m--);
    let t = copy_array[m];
    copy_array[m] = copy_array[i];
    copy_array[i] = t;
  }
  return copy_array;
}
