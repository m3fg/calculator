import { operators, MaybeNumber } from "./operator-dict";
import { Lexer } from "./lexer";
import { MaybeToken } from "./token";

export interface Output{
  value: number,
  rpn: string
}
export const parse = (input: string): Output => {
  const operatorTokens: Set<string> = new Set([...Object.keys(operators)]);

  const assert = (predicate: any): boolean => {
    if (predicate) return true;
    throw new Error('Invalid token!');
  };

  type Out = number | string | undefined;
  const stack: string[] = [];
  const output: Out[] = [];
  const rpn: Out[] = [];

  const peek = () => {
    return stack.at(-1);
  };

  interface Output {
    token: Out,
    value: number
  }
  type MaybeOutput = Output | undefined;

  const addToOutput = (out: MaybeOutput) => {
    if (!out) {
      output.push(NaN);
      rpn.push(undefined);
      return;
    }

    output.push(out.value);
    rpn.push(out.token);
  };

  const handlePop = (): MaybeOutput => {
    const op = stack.pop();
    if (op === '(') return;
    if (op === 'u') {
      const o = output.pop()
      if (!o) return;
      return { token: -o, value: -o };
    }

    const right = output.pop();
    const left = output.pop();

    if (!operatorTokens.has(op as string)) {
      throw new Error(`Invalid operation: ${op}`);
    }

    const func = operators[op!].func
    return { token: op, value: func(left as number, right as number) };
  }

  const toDestack = (token: string): boolean => {
    const s = peek();
    if (s == undefined || s === '(') return false;

    const so = operators[s];
    const o = operators[token];
    if (so.precedence > o.precedence ||
      so.precedence === o.precedence && o.asoc_left
    ) return true;

    return false;
  }

  const handleToken = (token: string) => {
    const fToken = parseFloat(token);
    switch (true) {
      case !isNaN(fToken):
        addToOutput({ token: token, value: fToken });
        // output.push(token);
        break;

      case operatorTokens.has(token):
        if (!operators[token].matchContext(prevToken, lexer.hasNext())) {
          throw new Error(`Invalid context for token: ${token}`);
        }
        while (toDestack(token)) {
          addToOutput(handlePop());
        }
        stack.push(token);
        break;

      case token === '(':
        stack.push(token);
        break;

      case token === ')':
        let topOfStack = peek();
        while (topOfStack !== '(') {
          assert(stack.length);
          addToOutput(handlePop());
          topOfStack = peek();
        }
        assert(peek() === '(');
        handlePop();
        break;

      default:
        throw new Error(`Invalid token: ${token}`);
    }
  };

  const lexer = new Lexer(input);
  let token: MaybeToken;
  let prevToken: MaybeToken = null;

  while ((token = lexer.next())) {
    if (
      token.value === '-' &&
      (prevToken === null ||
        prevToken.value === '(' ||
        operatorTokens.has(prevToken.value))
    ) {
      handleToken('u');
    } else {
      handleToken(token.value);
    }
    prevToken = token;
  }

  while (stack.length) {
    assert(peek() !== '(');
    addToOutput(handlePop());
  }

  return {value: output[0] as number, rpn: rpn.join(' ')};
};
