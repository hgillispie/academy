// From: https://stackoverflow.com/a/47593316
// MUCH better than AI-generated options
function splitmix32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x9e3779b9) | 0;
    let t = a ^ (a >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
}

// Copied and modified from https://stackoverflow.com/a/68523152
export const seededRandomGenerator = (seed: number | string) => {
  const random = splitmix32(toNumberSeed(seed));

  const randRange = (low: number, high: number): number => {
    return random() * (high - low) + low;
  };

  const randIntRange = (low: number, high: number): number => {
    return Math.floor(randRange(low, high));
  };

  const shuffleArray = <T>(array: T[]) => {
    const result = [...array];
    for (let i = array.length - 1; i > 0; i--) {
      const j = randIntRange(i + 1, 2);
      // fancy ES6 way to swap array elements
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  return { random, randRange, randIntRange, shuffleArray };
};

const toNumberSeed = (seed: string | number) => {
  let num = 0;
  if (typeof seed === 'string') {
    for (let i = 0; i < seed.length; i++) {
      num = (num << 5) - num + seed.charCodeAt(i);
      num |= 0; // Convert to 32bit integer
    }
  } else {
    num = Number(seed);
  }
  return num;
};

// TODO: USE A CLIENT SESSION ID INSTEAD
export function generateSeed(title: string) {
  const date = new Date();
  // Daily seed per Module Title
  const dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`; // for testing: -${date.getHours()}-${date.getMinutes()}
  return `${title}-${dateString}`;
}
