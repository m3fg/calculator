import { Tokens } from "./tokens";
import { Token, MaybeToken } from "./token";

const TokenSpec = [
  // [/^\s+/, null],
  [/^(?:\d+(?:\.\d*)?|\.\d+)/, Tokens.NUMBER],
  // [/^[a-z]+/, Tokens.IDENTIFIER],
  [/^\+/, Tokens.ADDITION],
  [/^\-/, Tokens.SUBTRACTION],
  [/^\*/, Tokens.MULTIPLICATION],
  [/^\//, Tokens.DIVISION],
  [/^\^/, Tokens.EXPONENTIATION],
  [/^\(/, Tokens.PARENTHESIS_LEFT],
  [/^\)/, Tokens.PARENTHESIS_RIGHT],
];

export class Lexer {
  private index = 0;

  constructor(private input: string) {
    this.input = input.replace(/\s+/g, '');
  }

  private match(regex: RegExp, inputSlice: string): null | string {
    const matches = regex.exec(inputSlice);
    if (matches === null) return null;

    this.index += matches[0].length;
    return matches[0];
  }

  hasNext(): boolean {
    return this.index < this.input.length;
  }

  next(): MaybeToken {
    if (!this.hasNext()) return null;

    const inputSlice = this.input.slice(this.index);

    for (let [regex, type] of TokenSpec) {
      const tokenValue = this.match(regex as RegExp, inputSlice);

      if (tokenValue === null) continue;

      if (type === null) return this.next();

      return {
        type,
        value: tokenValue,
      } as Token;
    }

    throw new SyntaxError(`Unexpected token: "${inputSlice[0]}"`);
  }
}
