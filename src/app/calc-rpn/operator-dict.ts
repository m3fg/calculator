import { Operator } from "./operator";
import { Tokens } from "./tokens";
import { Token, MaybeToken } from "./token";

const operatorTokensArray = [
  'u',
  Tokens.EXPONENTIATION,
  Tokens.MULTIPLICATION,
  Tokens.DIVISION,
  Tokens.ADDITION,
  Tokens.SUBTRACTION
];
export const operatorTokens: Set<string> = new Set(operatorTokensArray);

const validateContext = (prev: MaybeToken, hasNext: boolean): boolean => {
  if (!prev ||
    !hasNext ||
    operatorTokens.has(prev.value as Tokens)
  ) return false;
  return true;
}

export type MaybeNumber = number | undefined
export type OpDict = { [token: string]: Operator };
export const operators: OpDict = [
  [4, false, null, () => true],
  [4, false, Math.pow, validateContext],
  [3, true, (a: number, b: number) => a * b, validateContext],
  [3, true, (a: number, b: number) => a / b, validateContext],
  [2, true, (a: number, b: number) => a + b, validateContext],
  [2, true, (a: number, b: number) => a - b, validateContext]]
  .map((arr, i) => {
    return [operatorTokensArray[i], ...arr];
  })
  .reduce((a, o) => (
    {
      ...a, [o[0] as string]: {
        token: o[0],
        precedence: o[1],
        asoc_left: o[2],
        func: o[3],
        matchContext: o[4]
      } as Operator
    }),
    {} as OpDict);
