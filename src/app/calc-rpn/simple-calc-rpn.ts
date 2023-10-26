import { operators } from "./operator-dict";

export const calcRpn = (query: string) => {
  const input = [...query.replace(/\s+/g, '')];
  const operatorTokens: Set<string> = new Set([...Object.keys(operators)]);

  const assert = (predicate: any): boolean => {
    if (predicate) return true;
    throw new Error('Invalid token!');
  };

  const stack: string[] = [];
  let output = '';

  const peek = () => {
    return stack.at(-1);
  };

  const addToOutput = (token: string) => {
    output += ' ' + token;
  };

  const handlePop = () => {
    return stack.pop();
  }

  const toDestack = (token: string): boolean => {
    const s = peek();
    if (s == undefined || s == '(') return false;

    const so = operators[s];
    const o = operators[token];
    if (so.precedence > o.precedence || 
      so.precedence === o.precedence && o.asoc_left
    ) return true;

    return false;
  }

  const handleToken = (token: string) => {
    switch (true) {
      case !isNaN(parseFloat(token)):
        addToOutput(token);
        break;

      case operatorTokens.has(token):
        while (toDestack(token)) {
          addToOutput(handlePop() as string);
        }
        stack.push(token);
        break;

      case token === '(':
        stack.push(token);
        break;

      case token === ')':
        let topOfStack = peek();
        while (topOfStack !== '(') {
          // assert(stack.length !== 0);
          assert(stack.length);
          addToOutput(handlePop() as string);
          topOfStack = peek();
        }
        assert(peek() === '(');
        handlePop();
        break;
      default:
        throw new Error(`Invalid token: ${token}`);
    }
  };

  for (let i of input) {
    handleToken(i);
  }

  while (stack.length) {
    assert(peek() !== '(');
    addToOutput(stack.pop() as string);
  }

  return output;
};
