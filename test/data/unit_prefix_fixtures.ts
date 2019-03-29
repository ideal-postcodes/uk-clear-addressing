/* tslint:disable:no-magic-numbers */

import unitPrefixes from "./unit_prefixes.json";

export { unitPrefixes };

const random = (max: number): number => Math.floor(Math.random() * max);

const generateRange = (): string => {
  const start = random(100);
  const offset = random(10);
  return `${start}-${start + offset}`;
};

const LETTERS = "ABCDEFGHIJKLMNOP";

const generateLetterPremise = (): string => {
  const c = LETTERS[random(LETTERS.length)];
  const n = random(100);
  return `${n}${c}`;
};

const generateNumber = (): string => `${random(100)}`;

export const generateBuildingNumber = (): string => {
  switch (random(3)) {
    case 0:
      return generateRange();
    case 1:
      return generateLetterPremise();
    case 2:
      return generateNumber();
    default:
      return generateNumber();
  }
};

export const generatePrefixUnit = (): string => {
  return unitPrefixes[random(unitPrefixes.length)];
};
