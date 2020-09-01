// We cannot use typescript enum type and keep the same key name as jsPsych
export const KeyCode = {
  'backspace': 8,
  'tab': 9,
  'enter': 13,
  'shift': 16,
  'ctrl': 17,
  'alt': 18,
  'pause': 19,
  'capslock': 20,
  'esc': 27,
  'space': 32,
  'spacebar': 32,
  ' ': 32,
  'pageup': 33,
  'pagedown': 34,
  'end': 35,
  'home': 36,
  'leftarrow': 37,
  'uparrow': 38,
  'rightarrow': 39,
  'downarrow': 40,
  'insert': 45,
  'delete': 46,
  '0': 48,
  '1': 49,
  '2': 50,
  '3': 51,
  '4': 52,
  '5': 53,
  '6': 54,
  '7': 55,
  '8': 56,
  '9': 57,
  'a': 65,
  'b': 66,
  'c': 67,
  'd': 68,
  'e': 69,
  'f': 70,
  'g': 71,
  'h': 72,
  'i': 73,
  'j': 74,
  'k': 75,
  'l': 76,
  'm': 77,
  'n': 78,
  'o': 79,
  'p': 80,
  'q': 81,
  'r': 82,
  's': 83,
  't': 84,
  'u': 85,
  'v': 86,
  'w': 87,
  'x': 88,
  'y': 89,
  'z': 90,
  '0numpad': 96,
  '1numpad': 97,
  '2numpad': 98,
  '3numpad': 99,
  '4numpad': 100,
  '5numpad': 101,
  '6numpad': 102,
  '7numpad': 103,
  '8numpad': 104,
  '9numpad': 105,
  'multiply': 106,
  'plus': 107,
  'minus': 109,
  'decimal': 110,
  'divide': 111,
  'f1': 112,
  'f2': 113,
  'f3': 114,
  'f4': 115,
  'f5': 116,
  'f6': 117,
  'f7': 118,
  'f8': 119,
  'f9': 120,
  'f10': 121,
  'f11': 122,
  'f12': 123,
  ':': 187,
  ',': 188,
  '.': 190,
  '/': 191,
  '`': 192,
  '[': 219,
  '\\': 220,
  ']': 221
}

export function convertKeyCharacterToKeyCode(character: string): number {
  let code: number | undefined = undefined;
  character = character.toLowerCase();
  if (typeof KeyCode[character] !== 'undefined') {
    code = KeyCode[character];
  }
  return code;
}

export function convertKeyCodeToKeyCharacter(code: number): string {
  for (var i in Object.keys(KeyCode)) {
    if (KeyCode[Object.keys(KeyCode)[i]] == code) {
      return Object.keys(KeyCode)[i];
    }
  }
  return undefined;
}

// TODO: define none exist key behavior
export function compareKeys(key1: string | number, key2: string | number) {
  // convert to numeric values no matter what
  if (typeof key1 == 'string') {
    key1 = convertKeyCharacterToKeyCode(key1);
  }
  if (typeof key2 == 'string') {
    key2 = convertKeyCharacterToKeyCode(key2);
  }
  return key1 == key2;
}
